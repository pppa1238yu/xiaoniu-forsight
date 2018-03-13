import {Report} from "./Report";
import {Stock} from "./Stock";
import {Brokerage} from "./Brokerage";
import {ViewpointResearcherMapping} from "./ViewpointResearcherMapping";
export class ViewpointRating {
    report:Report;
    stock?:Stock;
    brokerage?:Brokerage;
    viewpointResearcherMappings?:Array<ViewpointResearcherMapping>;
    shortName?:string;
    englishShortName?:string;
    reportDate?:Date;
    rateResult?:string;
    rateResultId?:string;
    standardRating?:string;
    englishStandardRating?:string;
    ratingChange?:string;
    englishRatingChange?:string;
    ratingChangeId?:string;
    ratingMark?:string;
    brokerageName?:string;
    englishBrokerageName?:string;
    summary?:string;
    fileStoragePath?:string;
    ratingType?:string;
}