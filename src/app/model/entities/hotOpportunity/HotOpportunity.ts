import {StockIncrement} from "../StockIncrement";
export class HotOpportunity{
    code: string;

    name: string;

    followed: boolean;

    // 指数
    index: number;

    imageId:string;

    netCashFlow:number;

    regionalIncrement:number;

    regionalIncrementValue:number;

    // 已排序，涨得越凶，排得越前, 全部
    stockIncrements: Array<StockIncrement>;

    positiveStockCount: number;

    stableStockCount: number;

    negativeStockCount: number;

    subject:boolean;
}