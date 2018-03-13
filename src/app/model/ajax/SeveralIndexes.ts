import {ArrDataSource, RefDataSource} from "./DataSource";
import {http} from "./Http";
import {SeveralIndexes} from "../entities/SeveralIndexes";
import {HomeTendency} from "../entities/HomeTendency";
import {ExchangeRate} from "../entities/ExchangeRate";
export class SeveralIndexesDataSource extends ArrDataSource<SeveralIndexes> {
    protected onRefresh(): void {
        let paramMap = {
            symbols:"IDX_000001,IDX_399001,IDX_399006,IDX_DJI,IDX_HSI,IDX_000016"
        };
        http.post(this.uri, paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(err => this.fail(err))
    }

    protected get uri(): string {
        return 'quotation/quotationSummarys.json';
    }
}

export class HomeTendencyDataSource extends ArrDataSource<HomeTendency> {
    notifyResult;
    protected onRefresh(): void {
        let paramMap = {
            symbols:"IDX_000001,IDX_399001,IDX_399006,IDX_DJI,IDX_HSI,IDX_000016"
        };
        http.post(this.uri, paramMap)
            .then(value => {
                this.success(value);
                if(this.notifyResult){
                    this.notifyResult(false);
                }
            })
            .catch(
                err => {
                    this.fail(err);
                    if(this.notifyResult){
                        this.notifyResult(true);
                    }
                }
            )
    }

    protected get uri(): string {
        return 'quotation/summarys.json';
    }
}

export class ExchangeRateDataSource extends RefDataSource<ExchangeRate> {

    notifyResult;

    protected onRefresh(): void {
        let paramMap = {};
        http.post(this.uri, paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(err =>
                {
                    this.fail(err);
                }
            )
    }

    protected get uri(): string {
        return 'rate/exchangeRateSummary.json';
    }
}

export let severalIndexesDataSource = new SeveralIndexesDataSource();
export let homeTendencyDataSource = new HomeTendencyDataSource();
export let exchangeRateDataSource = new ExchangeRateDataSource({bars:[],change:0,changeRatio:0,date:"",value:0});