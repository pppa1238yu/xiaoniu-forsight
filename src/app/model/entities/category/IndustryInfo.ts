import {CategoryInfo} from "./CategoryInfo";
export class IndustryInfo extends CategoryInfo {

    //毛利率
    grossProfitRate: number;

    // 融资余额
    financingResidualAmount: number;

    // 融资余额昨日环比
    financingResidualAmountDayIncrement: number;

    // 市盈率
    priceEarningRatio: number;

    // 本季度解禁市值
    liftingMarketValue: number;

    // 本季度解禁市值上季度环比
    liftingMarketValueQuarterIncrement: number;
}