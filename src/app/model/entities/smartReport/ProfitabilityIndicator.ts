export class ProfitabilityIndicator{
    industryCode:string;
    industryName:string;
    descriptions:Array<string>;
    dates:Array<Date>;
    roes:Array<any>;//净资产收益率
    operatingMarginRatios:Array<any>;//毛利率
    operatingNetProfitToRevenues:Array<any>;//净利率
    industryRoes:Array<any>;//行业净资产收益率
    industryOperatingMarginRatios:Array<any>;//行业毛利率
    industryOperatingNetProfitToRevenues:Array<any>;//行业净利率
}