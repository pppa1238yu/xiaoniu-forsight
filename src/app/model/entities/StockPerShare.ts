import {Stock} from "./Stock";
export class StockPerShare {
    startDate:Date;
    endDate:Date;
    stock?:Stock;
    //type?:StateType;类型,A,B,C,D暂时没用,懒得加枚举
    eps?:number;
    nav?:number;
    liability?:number;
    capitalSurplus?:number;
    surplusReserve?:number;
    undistributedProfit?:number;
    retaineDearning?:number;
    operatingNcf?:number;
    investingNcf?:number;
    financingNcf?:number;
    cashIncrease?:number;
}