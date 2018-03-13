import {Brokerage} from "./Brokerage";
import {Report} from "./Report";
import {GtaCsrcPersonMapping} from "./GtaCsrcPersonMapping";
import {AnalystType} from "./AnalystType";
import {AnalystHonour} from "./AnalystHonour";

export class Researcher {

    gtaId: number;

    reports: Array<Report>;

    fullName: string;

    englishFullName: string;

    certificate: string;

    certificateId: string;

    nameFirstInitial: string;

    degree: string;

    degreeId: string;

    gender: string;

    brokerage: Brokerage;

    xincaifuHonourCount: number;

    shuijingqiuHonourCount: number;

    rank: number;

    viewPointCount: number;

    gtaCsrcPersonMapping: GtaCsrcPersonMapping;

    title: AnalystType;

    subTitle: AnalystType;

    imageId: String;

    birthYear: number;

    beginSecurityYear: number;

    successRate: number;

    successRank: number;

    returnRate: number;

    returnRank: number;
    analystHonors?:Array<AnalystHonour>;
}