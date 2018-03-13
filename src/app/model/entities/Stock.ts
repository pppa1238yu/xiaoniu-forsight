import {Company} from "./Company";
import {ViewpointRating} from "./ViewpointRating";
import {Report} from "./Report";
import {Subject} from "./Subject";
import {Industry} from "./Industry";
export class Stock {
    symbol:string;
    shortName:string;
    name?:string;
    pinyinShortName?:string;
    englishShortName?:string;
    englishName?:string;
    company?:Company;
    viewpointRatings?:Array<ViewpointRating>;
    reports?:Array<Report>;
    subjects?:Array<Subject>;
    industry?:Industry;
    imageId:string;
    delistedDate?:string
}