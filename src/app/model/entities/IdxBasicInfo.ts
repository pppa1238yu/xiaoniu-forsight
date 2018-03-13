import {QuotationSummary} from "./QuotationSummary";
import {Idx} from "./Idx";
import {IdxMarketValue} from "./IdxMarketValue";
import {IdxAverageAmount} from "./IdxAverageAmount";
import {IdxSampleChangeNumber} from "./IdxSampleChangeNumber";
export class IdxBasicInfo {
    idx: Idx;
    idxMarketValue?: IdxMarketValue;
    idxAverageAmount?: IdxAverageAmount;
    idxSampleChangeNumber: IdxSampleChangeNumber;
    quotationSummary?: QuotationSummary;
    followed: boolean = false;
    selected: boolean = false;
}