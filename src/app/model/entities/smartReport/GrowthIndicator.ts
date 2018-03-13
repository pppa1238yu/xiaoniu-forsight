export class GrowthIndicator{
    industryCode:string;
    industryName:string;
    descriptions:Array<string>;
    dates:Array<Date>;
    totalRevenueGrowthRates:Array<any>;//营业收入增长率(同比)
    industryTotalRevenueGrowthRates:Array<any>;//行业营业收入增长率(同比)
    industryTotalAssetsGrowthRates:Array<any>;//行业总资产增长率(同比)
    totalAssetsGrowthRates:Array<any>;//总资产增长率(同比)
}