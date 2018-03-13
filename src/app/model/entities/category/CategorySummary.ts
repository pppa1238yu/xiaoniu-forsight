import {StockIncrement} from "../StockIncrement";
export class CategorySummary {

    code: string;

    name: string;

    imageId: string;

    netCashFlow: number;

    regionalIncrement: number;

    reportCount: number;

    positiveStockCount: number;

    negativeStockCount: number;

    // 已排序，涨得越凶，排得越前，仅TOP3
    stockIncrements: Array<StockIncrement>;

    followed: boolean;
}