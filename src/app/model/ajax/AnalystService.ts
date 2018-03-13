import {observable, runInAction} from "mobx";
import {ObjDataSource, PageDataSource} from "./DataSource";
import {http} from "./Http";
import {Researcher} from "../entities/Researcher";
import {FilterItem} from "../entities/FilterItem";
import {Follow} from "../entities/Follow";
import {AnalystRanking} from "../entities/analyst/AnalystRanking";
import {analystFollowedState} from "../state/States";
import {tipManager} from "../state/TipManager";

interface AnalystTitle {
    pid: string;
    cid: string;
}

export class AnalystIndexDataSource extends PageDataSource<Follow<Researcher>> {

    // @observable honourYears: Array<number>;

    //@observable brokerages: Array<number>;

    //@observable titles: Array<AnalystTitle>;

    filters = {};
    filtersOrigin = {};

    //@observable timeWindow: TimeWindow = new TimeWindow(1, TimeWindowUnit.Day);

    //@observable sortFiled: AnalystSortField = AnalystSortField.STAR;

    //不需要 observable
    filterItems: Array<FilterItem>;

    filterUri = "/analyst/analystFilter.json";
    uri = "/analyst/analystList.json";

    requestPageIndex = 0;

    clearMore = false;
    isMore = false;
    more = [];
    @observable first = true;
    firstLoading = [false, false];
    firstValue = null;

    //TIME_WINDOW = 'timeWindow';

    constructor() {
        super();

        this.restore();
        //this.filters[this.TIME_WINDOW] = new TimeWindow(1, TimeWindowUnit.Day);
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

                analystFollowedState.processMulti(this.$.entities);

            }
        );
    }

    protected onReset(): void {
        super.onReset();
        //this.offset = 0;
        //this.restore();
    }

    restore() {
        this.filterItems = null;
        //this.honourYears = null;
        //this.brokerages = null;
        //this.titles = null;
        //this.sortFiled = AnalystSortField.STAR;
        this.filters = {};
        this.filtersOrigin = {};
        //this.filters[this.TIME_WINDOW] = new TimeWindow(1, TimeWindowUnit.Day);
        this.first = true;
        this.firstValue = null;
        this.firstLoading = [false, false];
        this.more = [];
        this.requestPageIndex = 0;
        this.clearMore = false;
    }

    private initFilter(filterItems) {
        for (let item of filterItems) {
            this.filters[item['queryName']] = null;
        }
    }

    public setFilter(label, values, origins) {
        this.filters[label] = values;
        this.filtersOrigin[label] = origins;
        //update page index
        this.requestPageIndex = 0;
        //this.more = [];
        this.clearMore = true;
    }

    private requestFilter(): Promise<any> {
        return http.post(this.filterUri, null);
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

    private requestAnalyst(): Promise<any> {
        const paramMap = {
            //timeWindowValue: this.filters[this.TIME_WINDOW].value,
            //timeWindowUnit: TimeWindowUnit[this.filters[this.TIME_WINDOW].unit].toUpperCase(),
            pageIndex: this.requestPageIndex,
            pageSize: 36,
            //sortField: AnalystSortField[this.sortFiled].toUpperCase(),
            //titleId: this.titles,
            //brokerageId: this.brokerages,
            //years: this.honourYears,
        };
        for (let filter in this.filters) {
            /*
            if (filter == this.TIME_WINDOW) {
                continue;
            }
            */
            if (this.filters[filter]) {
                if (filter == 'titleId') {

                    paramMap[filter] = JSON.stringify(this.filters[filter]);
                } else {
                    paramMap[filter] = this.filters[filter];
                }
            }
        }
        return http.post(this.uri, paramMap);
    }

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

    onLoad(err, index, value = null) {
        if (this.error || !this.first) {
            return;
        }

        if (err) {
            this.fail(err);
        } else {
            this.firstLoading[index] = true;
            if (index == 1) {
                this.firstValue = value;
            }
            if (this.firstLoading[0] && this.firstLoading[1]) {
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
        let result = this.requestAnalyst();

        if (this.first) {
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
                this.onLoad(false, 1, value);
            }).catch(err => this.onLoad(err, 1, null));
        } else {
            result.then(value => {
                this.success(value);
            }).catch(err => this.fail(err));
        }
    }
}

export let analystIndexDataSource: AnalystIndexDataSource = new AnalystIndexDataSource();

class AnalystBaseInfoDataSource extends ObjDataSource<Follow<Researcher>> {
    analystId: string;

    resultNotify = null;

    protected onReset(): void {
        super.onReset();
        this.resultNotify = null;
    }

    setResultNotify(resultNotify) {
        this.resultNotify = resultNotify;
    }

    protected get uri(): string {
        return '/analyst/analystInfo.json';
    }


    protected onSuccess(value): void {
        super.onSuccess(value);
        analystFollowedState.process(value);
    }

    protected onRefresh(): void {
        http.post(this.uri, {analystId: this.analystId})
            .then(value => {
                this.success(<Follow<Researcher>> value);
                if (this.resultNotify != null) {
                    this.resultNotify(false);
                    this.resultNotify = null;
                }
            })
            .catch(err => {
                this.fail(err);
                if (this.resultNotify != null) {
                    this.resultNotify(true);
                    this.resultNotify = null;
                }
            });
    }
}
export let analystBaseInfoDataSource: AnalystBaseInfoDataSource = new AnalystBaseInfoDataSource();

class AnalystRankingDataSource extends ObjDataSource<AnalystRanking> {
    analystId: string;

    resultNotify = null;

    setResultNotify(resultNotify) {
        this.resultNotify = resultNotify;
    }

    protected get uri(): string {
        return 'analyst/newest-forecast.json';
    }

    protected onRefresh(): void {
        http.post(this.uri, {analystId: this.analystId,tag:"analyst_ranking"})
            .then(value => {
                this.success(value?<AnalystRanking>value:new AnalystRanking());
                if (this.resultNotify != null) {
                    this.resultNotify(false);
                    this.resultNotify = null;
                }
            })
            .catch(err => {
                this.fail(err);
                if (this.resultNotify != null) {
                    this.resultNotify(true);
                    this.resultNotify = null;
                }
            });
    }
}
export let analystRankingDataSource: AnalystRankingDataSource = new AnalystRankingDataSource();

class ViewPointBacktrackingDataSource extends ObjDataSource<AnalystRanking> {
    analystId: string;

    protected get uri(): string {
        return 'analyst/newest-forecast.json';
    }

    protected onRefresh(): void {
        http.post(this.uri, {analystId: this.analystId,tag:"analyst_ranking"})
            .then(value => {
                this.success(value?<AnalystRanking>value:new AnalystRanking());
            })
            .catch(err => this.fail(err));
    }
}
export let viewPointBacktrackingDataSource: ViewPointBacktrackingDataSource = new ViewPointBacktrackingDataSource();

//分析师统计信息
class AnalystHistoryStatisticsDataSource extends ObjDataSource<AnalystRanking> {
    analystId: string;

    protected get uri(): string {
        return 'analyst/newest-forecast.json';
    }

    protected onRefresh(): void {
        http.post(this.uri, {analystId: this.analystId,tag:"history_yields_statistics"})
            .then(value => {
                this.success(value?<AnalystRanking>value:new AnalystRanking());
            })
            .catch(err => this.fail(err));
    }
}
export let analystHistoryStatisticsDataSource: AnalystHistoryStatisticsDataSource = new AnalystHistoryStatisticsDataSource();