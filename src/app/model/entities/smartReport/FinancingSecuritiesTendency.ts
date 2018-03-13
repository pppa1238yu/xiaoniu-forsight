export class FinancingSecuritiesTendency{
    symbol:string;
    score:number;
    dates:Array<Date>;
    marginTrades:Array<number>;//融资融券余额;
    buyRatios:Array<number>;//融资买入额(T-4到T-5均值)/T日融资融券余额;
    closePrices:Array<number>;//收盘价
}