export class ProfitForecast {
    flag:boolean;
    symbol:string; //当前股票
    shortName:string;
    date:Date; //当前日期
    borkerogeCount:number; //研究机构数量
    upgradeCount:number; //上调次数
    downgradeCount:number; //下调次数
    profitPerShare:number; //每股收益
    targetProfitPerShare:number; //预测每股收益
    netProfit:number; //净利润
    targetProfit?:number; //预测净利润
    income:number; //营业收入
    targetIncome:number; //预测营业收入
    incomeRate:number; //营业收入增长率
    targetIncomeRate:number; //预测营业收入增长率
    roeb:number; //加权净资产收益率
    targetRoeb?:number; //预测加权净资产收益率
}