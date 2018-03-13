import {StockIncrement} from "../StockIncrement";
export abstract class CategoryInfo {

    code: string;

    name: string;

    followed: boolean;

    // 指数
    index: number;

    // 指数上涨量
    indexIncrementValue: number;

    // 指数上涨率
    indexIncrementRate: number;

    productNames: Array<string>;

    // 已排序，涨得越凶，排得越前, 全部
    stockIncrements: Array<StockIncrement>;

    positiveStockCount: number;

    stableStockCount: number;

    negativeStockCount: number;
}