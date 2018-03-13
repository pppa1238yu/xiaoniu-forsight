import {Stock} from "./Stock";
export class Subject {
    code:number;
    name:string;
    imageId?:string;
    stocks?:Array<Stock>;
}