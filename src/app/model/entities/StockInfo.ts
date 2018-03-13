import {Stock} from "./Stock";
export class StockInfo {

    imageUrl: string;//图片地址

    shortName: string;//股票简称.

    stockCode: string;//股票代码.

    currentPrice: number;//当前价

    changeRatio: number;//涨跌幅

    registerProvince: string;//注册省份

    marketValue: number;//市值

    industryName: string;//该股票所属行业

    viewPointCount: number;//分析师评论该股票的观点数

    analystCount: number;//分析师个数

    viewPoint: string;//综合观点

    targetPrice: number;//目标价

    premiumRate: number;//溢价率

    market: string;//市场

    board: string;//板块编号

    newestReportDate: Date;//最新研报日期

    fiveStarAnalystViewpoint: string;//五星分析师评级
}