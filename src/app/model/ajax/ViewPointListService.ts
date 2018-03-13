import {AppendableDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {reportFollowedState} from "../state/States";
import {Report} from "../entities/Report";
import {tipManager} from "../state/TipManager";
export abstract class ViewPointListDataSource extends AppendableDataSource<Report> {

    id: any;

    offset: number = 0;

    limit: number = 10;

    hasMore: boolean = false;

    notifyResult: (err?) => {};

    suggestionDidRefresh: boolean = false;//代表推荐研报的加载状态

    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                this.proc(value);
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(false);
                            this.notifyResult = null;
                        } else {
                            this.fail(err)
                        }
                    });
                }
            );
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        reportFollowedState.processMulti(value);

        this.offset += value.length;
        this.hasMore = value.length != 0;
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }

    public resetWithId(id: any): void {
        this.id = id;
        this.reset();
    }


    protected onReset(): void {
        super.onReset();
        this.offset = 0;
        this.hasMore = true;
    }


    protected proc(viewPoints: Array<any>): void {
        for (let viewPoint of viewPoints) {
            if (viewPoint.reportDate) {
                viewPoint.reportDate = new Date(viewPoint.reportDate);
            }
        }
    }

    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request() {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error) => {
                if (!succ && error && this.mount) {
                    tipManager.showTip("获取观点流失败");
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}


//----------------------------------------------------------------------------------------------个股页面观点流
class StockPageViewPointList extends ViewPointListDataSource {
    protected get paramMap() {
        return {
            stockCode: this.id,
            offset: this.offset,
            limit: this.limit
        };
    }


    protected get uri(): string {
        return '/stock/standpoints.json';
    }
}
export let stockPageViewPointList = new StockPageViewPointList();

//----------------------------------------------------------------------------------------------题材页面观点流
class SubjectPageViewPointList extends ViewPointListDataSource {
    protected get paramMap() {
        return {
            subjectCode: this.id,
            offset: this.offset,
            limit: this.limit
        };
    }


    protected get uri(): string {
        return '/subject/standpointDetails.json';
    }
}
export let subjectPageViewPointList = new SubjectPageViewPointList();

//----------------------------------------------------------------------------------------------分析师页面观点流
class AnalystPageViewPointList extends ViewPointListDataSource {
    protected get paramMap() {
        return {
            analystId: this.id,
            offset: this.offset,
            limit: this.limit
        };
    }


    protected get uri(): string {
        return '/analyst/standpointDetails.json';
    }
}
export let analystPageViewPointList = new AnalystPageViewPointList();

class IndustryPageViewPointList extends ViewPointListDataSource {
    protected get paramMap() {
        return {
            industryCode: this.id,
            offset: this.offset,
            limit: this.limit
        };
    }


    protected get uri(): string {
        return '/industry/standpointDetails.json';
    }
}
export let industryPageViewPointList = new IndustryPageViewPointList();

class AllPageViewPointList extends ViewPointListDataSource {
    protected get paramMap() {
        return {
            offset: this.offset,
            limit: this.limit
        };
    }


    protected get uri(): string {
        return '/analyst/allStandpointDetails.json';
    }
}

export let allPageViewPointList = new AllPageViewPointList();

class SuggestionViewPointList extends ViewPointListDataSource {


    protected get paramMap() {
        return {
            offset: this.offset,
            limit: this.limit
        };
    }

    protected get uri(): string {
        return '/stockAttention/suggestionStandpointDetails.json';
    }

    request() {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error) => {
                if (!succ && error && this.mount) {
                    tipManager.showTip("获取观点流失败");
                } else {
                    this.suggestionDidRefresh = true;//推荐观点流接口成功返回状态
                }
            }
        );
    }
}

export let suggestionViewPointList = new SuggestionViewPointList();


class MyFavouriteViewPointList extends ViewPointListDataSource {
    requestIndex = 0;
    more = false;

    protected get paramMap() {
        return {
            pageIndex: this.requestIndex,
            pageSize: 10
        };
    }

    protected onReset(): void {
        super.onReset();
        this.requestIndex = 0;
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        this.requestIndex += 1;
        this.hasMore = this.more;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                this.more = value.pageIndex < value.pageCount - 1;
                value = value.entities;
                if (!value) {
                    value = [];
                }
                this.proc(value);
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(true);
                            this.notifyResult = null;
                        } else {
                            this.fail(err);
                        }
                    });
                }
            );
    }

    protected get uri(): string {
        return '/favourites/reports.json';
    }
}
export let myFavouriteViewPointList = new MyFavouriteViewPointList();
