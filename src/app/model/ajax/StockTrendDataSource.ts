import {AppendableDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {reportFollowedState, announceFollowedState} from "../state/States";
import {Report} from "../entities/Report";
import {Notice} from "../entities/recommend/Notice";
import {StockTrend} from "../entities/StockTrend";
import {NewsFlash} from "../entities/recommend/NewsFlash";
import {tipManager} from "../state/TipManager";
export abstract class StockTrendDataSource<E> extends AppendableDataSource<E> {
    id: any;

    hasMore: boolean = false;

    notifyResult: (err?) => {};

    annId: any;

    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
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
        this.hasMore = value.length != 0;
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }


    public resetWithId(id?: any): void {
        this.id = id;
        this.reset();
    }


    protected onReset(): void {
        super.onReset();
        this.hasMore = true;
    }

    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request(callBack?:() => void) {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error) => {
                if (!succ && error && this.mount) {
                    // tipManager.showTip("获取信息失败");
                }else {
                    if (callBack) {
                        callBack();
                    }
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}

//----------------------------------------------------------------------------------------------热门新闻
class StockTrendData extends StockTrendDataSource<StockTrend> {
    protected get paramMap() {
        return {
            n:10
        };
    }
    protected get uri(): string {
        return '/xueqiuEmotion/last-n-days.json';
    }

}
export let stockTrendDataSource = new StockTrendData();


