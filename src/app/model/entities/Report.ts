import {Researcher} from "./Researcher";
export class Report {

    id: number;

    title: string;

    summary: string;

    reportDate: Date;

    researchers: Array<Researcher>;

    researcher: Researcher;

    stockIncrements: Array<any>;

    path: string;

}