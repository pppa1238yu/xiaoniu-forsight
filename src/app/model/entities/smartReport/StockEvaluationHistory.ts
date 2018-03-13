export class StockEvaluationHistory {
    symbol:string; //当前股票
    name:string;//当前股票名字
    pe:boolean;//true:市盈率,false:市净率
    lowRatioOfSH:number; //和SH300比值的较低值
    highRatioOfSH:number; //和SH300比值的较高值
    dates:Array<Date>; //日期列表
    ratiosOfSH:Array<any>; //与SH300的比值列表
    conclusion:string;
}