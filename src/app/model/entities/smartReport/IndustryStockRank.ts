export class IndustryStockRank {
    currentItemIndex:number; //当前股票在items中的索引0-5
    indexDelta:number; //排名同比变化量，相对上个星期周收盘时间点
    items:Array<StockItem>; // 长度为5或6
}
class StockItem{
    symbol:string; //股票编号
    name:string; //名称
    rank:number;
    incrementRate:number; //一周涨跌幅
    turnoverRate:number; //一周换手率
    netCashFlow:number; //一周资金净流入
}