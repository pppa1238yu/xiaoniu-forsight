import {StockBasicInfo} from "../StockBasicInfo";
export class StockOperation {
    basicInfo:StockBasicInfo;
    conclusion:Array<string>;
    items:Array<Category>;
    itemDate: string;
    industryNames:Array<string>;
}

class Category  {
    category:number;
    cost:number;
    costProportion:number;
    earning:number;
    earningProportion:number;
    endDate:Date;
    grossMarginProportion:number;
    grossMarginRate:number;
    name:string;
}

