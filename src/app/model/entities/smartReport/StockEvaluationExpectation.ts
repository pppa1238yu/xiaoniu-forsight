export class StockEvaluationExpectation{
    symbol:string; //当前股票代码
    name:string; //当前股票名字
    industryCode:string; //当前3级行业编号
    industryName:string; //当前3级行业名称
    descriptions:Array<string>;
    industryTargetPE:number; //当前3级行业的预测市盈率
    dates:Array<Date>;
    industryPEs:Array<any>; //当前3级行业的实际市盈率列表
    stockPEs:Array<any>; //当前股票的实际市盈率列表
    currentYear:string;//当前年份
}