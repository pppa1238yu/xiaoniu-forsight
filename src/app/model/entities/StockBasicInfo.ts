import {Stock} from "./Stock";
import {QuotationSummary} from "./QuotationSummary";
import {StockPerShare} from "./StockPerShare";
import {StockValuationMetric} from "./StockValuationMetric";
import {IncomeSummary} from "./IncomeSummary";
export class StockBasicInfo {
    stock: Stock;
    quotationSummary?: QuotationSummary;
    perShare?: StockPerShare;
    valuationMetric?: StockValuationMetric;
    incomeSummary?: IncomeSummary;
    followed: boolean = false;
    selected: boolean = false;
}