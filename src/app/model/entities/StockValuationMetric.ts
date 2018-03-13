import {Stock} from "./Stock";
export class StockValuationMetric {
    tradingDate:Date;
    stock?:Stock;
    pe?:number;
    peTtm:number;
    pbv?:number;
    pcf?:number;
    ps?:number;
    psTtm?:number;
    ev?:number;
    returnValue?:number;
    restrictedMarketValue?:number;
    circulatedMarketValue?:number;
    marketValue?:number;
}