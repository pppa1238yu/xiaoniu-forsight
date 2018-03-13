import {observable, runInAction} from "mobx";
import {ArrDataSource} from "./DataSource";
import {http} from "./Http";
import {Follow} from "../entities/Follow";
import {SortItem} from "../entities/SortItem";
import {tipManager} from "../state/TipManager";
import {stateManager} from "../../model/state/States";
import {EntityType} from "../entities/EntityType";
import {StockAttentionGroup} from "../entities/StockAttentionGroup";
import {stockFollowedState} from "../state/States";

export class StockAttentionDataSource extends ArrDataSource<StockAttentionGroup> {
    uri = "stockAttention/stockAttentionGroups.json";
    getTagsUri = "stockAttention/getTags.json";
    addTagsUri="stockAttention/addStockTag.json";
    deleteStockUri = "/stockAttention/unfollowStocks.json";
    deleteTagsUri="stockAttention/deleteStockTag.json";

    @observable first = true;
    firstLoading = [false];
    firstValue = null;
    @observable tags=[];
    orderType:string="STOCK_CHANGE_RATIO";
    order:string="DESC";
    constructor() {
        super();
        this.restore();
    }
    restore(){
        this.first = true;
        this.firstLoading = [false];
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

    protected onReset(): void {
        super.onReset();
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        stockFollowedState.processMulti(value);
    }

    private requestStock(orderType="STOCK_CHANGE_RATIO",order="DESC"): Promise<any> {
        const paramMap = {orderType:orderType,order:order};
        return http.post(this.uri, paramMap);
    }

    requestTags(value=""): Promise<any> {
        const paramMap = {prefix:value};
        return http.post(this.getTagsUri, paramMap).then(value => {
            // console.log(value);
            this.tags=value;
        });
    }
    addStockTag(stockCode,tagName ,func?): Promise<any>{
        const paramMap = {symbol:stockCode,tagName:tagName};
        this.loading = true;
        return http.post(this.addTagsUri, paramMap).then(() => {
            runInAction(() => {
                this.loading = false;
                this.request(func);
                // this.requestTags();
            });
        }).catch(err=>{
            this.loading = false;
            tipManager.showTip("操作失败");
        });
    }
    deleteStockTag(stockCode,tagName ,func?): Promise<any>{
        const paramMap = {symbol:stockCode,tagName:tagName};
        this.loading = true;
        return http.post(this.deleteTagsUri, paramMap).then(() => {
            runInAction(() => {
                this.loading = false;
                this.request(func);
                // this.requestTags();
            });
        }).catch(err=>{
            this.loading = false;
            tipManager.showTip("操作失败");
        });
    }

    deleteStock(stockCodes): Promise<any> {
        const paramMap = {symbols:stockCodes};
        this.loading = true;
        return http.post(this.deleteStockUri, paramMap).then(value => {
            runInAction(()=>{
                this.loading = false;
                this.request();
                for(let stockCode of stockCodes){
                    stateManager.setFollowed(stockCode, false, EntityType.STOCK);
                }
            });
        }).catch(err=>{
            this.loading = false;
            tipManager.showTip("操作失败");
        });

    }

    onLoad(err, index, value = null) {
        if (this.error || !this.first) {
            return;
        }
        if (err) {
            this.fail(err);
        } else {
            this.firstLoading[index] = true;
            if (this.firstLoading[0]) {
                try {
                    this.success(value);
                    this.first = false;
                } catch (err) {
                    this.fail(err);
                }
            }
        }
    }
    protected onRefresh(): void {
        let result = this.requestStock(this.orderType,this.order);
        if (this.first) {
            result.then(value => {
                //this.success(value);
                this.onLoad(false, 0, value);
            }).catch(err => this.onLoad(err, 0, null));
        } else {
            result.then(value => {
                this.success(value);
            }).catch(err =>{
                this.loading = false;
                tipManager.showTip("操作失败");
            });
        }
    }
}

export let stockAttentionDataSource: StockAttentionDataSource = new StockAttentionDataSource();