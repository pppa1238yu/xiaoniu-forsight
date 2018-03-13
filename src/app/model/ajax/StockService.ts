import {observable, runInAction} from "mobx";
import {PageDataSource} from "./DataSource";
import {http} from "./Http";
import {TimeWindowUnit} from "../entities/TimeWindowUnit";
import TimeWindow from "../entities/TimeWindow";
import {FilterItem} from "../entities/FilterItem";
import {Follow} from "../entities/Follow";
import {SortItem} from "../entities/SortItem";
import {tipManager} from "../state/TipManager";
import {stockFollowedState} from "../state/States";

export class StockIndexDataSource extends PageDataSource<Follow<any>> {
    filters = {};
    filtersOrigin = {};

    sort;

    time;

    //@observable timeWindow: TimeWindow = new TimeWindow(1, TimeWindowUnit.Day);

    //@observable sortFiled: AnalystSortField = AnalystSortField.STAR;

    //不需要 observable
    filterItems: Array<FilterItem>;
    sortItems : Array<SortItem>;

    filterUri = "/stock/stockFilter.json";
    sortUri = "/stock/stockListSortField.json";
    uri = "stock/stockList.json";

    requestPageIndex = 0;

    clearMore = false;
    isMore = false;
    more = [];
    @observable first = true;
    firstLoading = [false, false, false];
    firstValue = null;

    request(callback:Function = null) {
        tipManager.hidden();
        this.refresh(
            (succ) => {
                if (!succ && this.mount) {
                    tipManager.showRefresh(() => {
                        this.request();
                    });
                } else if (succ && this.mount && callback) {
                    callback();
                }
            }
        );
    }

    TIME_WINDOW = 'timeWindow';

    constructor() {
        super();
        this.restore();
    }

    protected onSuccess(value): void {
        runInAction(() =>
            {
                super.onSuccess(value);

                if (this.isMore) {
                    if (this.clearMore) {
                        this.more = [];
                    }
                    for (const entity of this.$.entities) {
                        this.more.push(entity);
                    }
                }

                stockFollowedState.processMulti(this.$.entities);
            }
        );
    }

    protected onReset(): void {
        super.onReset();
    }

    restore() {
        this.filterItems = null;
        this.sortItems = null;
        //this.honourYears = null;
        //this.brokerages = null;
        //this.titles = null;
        //this.sortFiled = AnalystSortField.STAR;
        this.filters = {};
        this.sort = 'INTELLIGENT_REPORT_TOTAL_SCORE';

        this.first = true;
        this.firstLoading = [false, false, false];
        this.firstValue = null;
        this.more = [];
        this.requestPageIndex = 0;
        this.clearMore = false;
        this.time = 1;
        this.setTime(this.time);
    }

    private initFilter(filterItems) {
        for (let item of filterItems) {
            this.filters[item['queryName']] = null;
        }
    }

    private initSort(sortItems) {
         if (sortItems.length > 1) {
             this.sort = sortItems[11].value;
         }
    }

    setSort(value) {
        this.sort = value;

        this.requestPageIndex = 0;
        this.clearMore = true;
    }

    public setFilter(label, values, origin) {
        this.filters[label] = values;
        this.filtersOrigin[label] = origin;
        //update page index
        this.requestPageIndex = 0;
        //this.more = [];
        this.clearMore = true;
    }

    public setTime(value) {
        this.time = value;
        switch (this.time) {
            case 0:
                this.filters[this.TIME_WINDOW] = new TimeWindow(1, TimeWindowUnit.Week);
                break;
            case 1:
                this.filters[this.TIME_WINDOW] = new TimeWindow(1, TimeWindowUnit.Month);
                break;
            case 2:
                this.filters[this.TIME_WINDOW] = new TimeWindow(3, TimeWindowUnit.Month);
                break;
            default:
                this.filters[this.TIME_WINDOW] = new TimeWindow(6, TimeWindowUnit.Month);
                break;
        }
        this.requestPageIndex = 0;
        this.clearMore = true;
    }

    private requestFilter(): Promise<any> {
        return http.post(this.filterUri, null);
    }

    private requestSort(): Promise<any> {
        return http.post(this.sortUri, null);
    }

    setRequestPageIndex(value) {
        this.requestPageIndex = value;
        //clear
        //考虑大屏幕手机横竖切换
        this.more = [];
    }

    requestMore() {
        this.requestPageIndex = this.$.pageIndex + 1;
        this.clearMore = false;
    }

    private requestStock(): Promise<any> {
        const paramMap = {
            timeWindowValue: this.filters[this.TIME_WINDOW].value,
            timeWindowUnit: TimeWindowUnit[this.filters[this.TIME_WINDOW].unit].toUpperCase(),
            pageIndex: this.requestPageIndex,
            pageSize: 20,
            //titleId: this.titles,
            //brokerageId: this.brokerages,
            //years: this.honourYears,
        };
        for (let filter in this.filters) {
            if (filter == this.TIME_WINDOW) {
                continue;
            }
            if (this.filters[filter]) {
                paramMap[filter] = this.filters[filter];
            }
        }
        if (this.sort) {
            paramMap['sortField'] = this.sort;
        }
        return http.post(this.uri, paramMap);
    }

    onLoad(err, index, value = null) {
        if (this.error || !this.first) {
            return;
        }

        if (err) {
            this.fail(err);
        } else {
            this.firstLoading[index] = true;
            if (index == 2) {
                this.firstValue = value;
            }
            if (this.firstLoading[0] && this.firstLoading[1] && this.firstLoading[2]) {
                try {
                    this.success(this.firstValue);
                    this.first = false;
                } catch (err) {
                    this.fail(err);
                }
            }

        }
    }


    protected onRefresh(): void {
        let result = this.requestStock();

        if (this.first) {
            this.requestSort()
                .then(value => {
                    if (value) {
                        this.initSort(value);
                        this.sortItems = value;
                    } else {
                        throw new Error("common sort fail.")
                    }
                    this.onLoad(false, 1);
                }).catch(err => this.onLoad(err, 1));

            this.requestFilter()
                .then(value => {
                    if (value) {
                        this.initFilter(value);
                        this.filterItems = value;
                    } else {
                        throw new Error("common filter fail.")
                    }
                    this.onLoad(false, 0);
                }).catch(err => this.onLoad(err, 0));

            result.then(value => {
                //this.success(value);
                this.onLoad(false, 2, value);
            }).catch(err => this.onLoad(err, 2, null));
        } else {
            result.then(value => {
                this.success(value);
            }).catch(err => this.fail(err));
        }
    }
}

export let stockIndexDataSource: StockIndexDataSource = new StockIndexDataSource();
