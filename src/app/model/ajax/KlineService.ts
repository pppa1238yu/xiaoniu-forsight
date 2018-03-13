import {ArrDataSource, ObjDataSource} from "./DataSource";
import {http} from "./Http";
import {Kline} from "../entities/Kline";
import {StockBasicInfo} from "../entities/StockBasicInfo";
import {RatingChangeAnalyst} from "../entities/RatingChangeAnalyst";
import {Optional} from "../entities/Optional";
import {stockFollowedState} from "../state/States";

export class KlineGraphDataSource extends ArrDataSource<Kline> {
    protected get uri(): string {
        return '/quotation/klineData.json';
    }

    protected onRefresh(): void {
        http.post(this.uri, this.params)
            .then(value => {
                let sKlines: any[][] = value;
                //line//格式:0日期,1开盘价,2收盘价,3最低价,4最高价,5成交量,6成交额,7涨跌,8涨跌幅,9换手率,10macd,11dea,12dif
                let klines: Array<Kline> = sKlines.map(line => new Kline(line[0], line[1], line[2], line[3], line[4], line[5], line[6], line[7], line[8], line[9], line[10], line[11], line[12], line[13], line[14], line[15], line[16], line[17], line[18]));
                this.success(klines);
            })
            .catch(err => this.fail(err));
    }
}
export let klineDayDataSource = new KlineGraphDataSource();
export let klineWeekDataSource = new KlineGraphDataSource();
export let klineMonthDataSource = new KlineGraphDataSource();

class StockBaseInfoDataSource extends ObjDataSource<StockBasicInfo> {
    stockCode:string;

    resultNotify = null;

    protected get uri(): string {
        return '/stock/stockBasicInfo.json';
    }

    protected onReset(): void {
        super.onReset();
        this.resultNotify = null;
    }

    setResultNotify(resultNotify) {
        this.resultNotify = resultNotify;
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        stockFollowedState.processWithDetail(value);
    }

    protected onRefresh(): void {
        let paramMap = {
            stockCode: this.stockCode,
        };
        http.post(this.uri, paramMap)
            .then(value => {
                this.success(value);
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
export let stockBaseInfoDataSource:StockBaseInfoDataSource = new StockBaseInfoDataSource();

class RatingChangeAnalystsDataSource extends ObjDataSource<RatingChangeAnalyst> {
    stockCode:string;
    protected get uri(): string {
        return '/stock/ratingChangeAnalysts.json';
    }
    protected onRefresh(): void {
        let stockCode=this.stockCode;
        let currentPage=Optional.of(this.$).map(r=>r.page).map(p=>p.pageIndex).orElse(0);
        let pageSize=Optional.of(this.$).map(r=>r.page).map(p=>p.pageSize).orElse(6)
        http.post(this.uri, {stockCode,currentPage,pageSize})
            .then(value => {
                this.success(<RatingChangeAnalyst>value);
            })
            .catch(err => this.fail(err));
    }
}
export let ratingChangeAnalystsDataSource:RatingChangeAnalystsDataSource = new RatingChangeAnalystsDataSource();
