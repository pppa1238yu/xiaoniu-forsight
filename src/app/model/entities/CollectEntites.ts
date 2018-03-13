import {StockIncrement} from "./StockIncrement";
import {CollectResearcher} from "./CollectResearcher";
export class CollectEntites{
    assistants:Array<any>;
    followed:boolean;
    id:number;
    reportDate:string;
    researcher:CollectResearcher;
    stockIncrements:Array<StockIncrement>;
    summary:string;
    title:string;
}