import {ArrDataSource, RefDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";
import {GrowthIndicator} from "../entities/smartReport/GrowthIndicator";
import {FinancialIndicatorPeriodType} from "../entities/smartReport/FinancialIndicatorPeriodType";
import {ProfitabilityIndicator} from "../entities/smartReport/ProfitabilityIndicator";
import {StockEvaluationExpectation} from "../entities/smartReport/StockEvaluationExpectation";
import {StockEvaluationHistory} from "../entities/smartReport/StockEvaluationHistory";
import {ProfitForecast} from "../entities/smartReport/ProfitForecast";
import {IndustryStockRank} from "../entities/smartReport/IndustryStockRank";
import {CategorySummary} from "../entities/category/CategorySummary";
import {StockOperation} from "../entities/smartReport/StockOperation";
import {getEnumerableKeys} from "mobx/lib/utils/utils";
import {GetRiskOperation} from "../entities/smartReport/GetRiskOperation";
import Constants from "../../Constants";

import {ScoreableListWrapper} from "../entities/smartReport/ScoreableListWrapper";
import {ShareData, WechatShareUtil} from "../../utils/WechatShareUtil";
import {FinancingSecuritiesTendency} from "../entities/smartReport/FinancingSecuritiesTendency";
declare let wx;
export abstract class SmartReportArrDataSource<E> extends ArrDataSource<E> {
    id: any;

    stockCode: any;

    notifyResult: (err?) => {};

    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(true);
                            this.notifyResult = null;
                        } else {
                            this.fail(err)
                        }
                    });
                }
            );
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }


    public resetWithId(id?: any): void {
        this.id = id;
        this.reset();
    }


    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request() {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error) => {
                if (!succ && error && this.mount) {
                    tipManager.showTip("获取研报信息失败");
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}

export abstract class SmartReportRefDataSource<E> extends RefDataSource<E> {
    id: any;

    notifyResult: (err?) => {};


    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                if(value.score && value.score>0){
                    Constants.smartTotalScore += value.score;
                }
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(true);
                            this.notifyResult = null;
                        } else {
                            this.fail(err)
                        }
                    });
                }
            );
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }


    public resetWithId(id?: any): void {
        this.id = id;
        this.reset();
    }

    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request(callback?: (data?:E) => void) {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error,value) => {
                if (!succ && error && this.mount) {
                    tipManager.showTip("获取研报信息失败");
                }
                if (callback) {
                    callback(value);
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}
//----------------------------------------------------------------------------------------------年度成长性分析
class YearGrowthIndicatorDataSource extends SmartReportRefDataSource<GrowthIndicator> {
    protected get paramMap() {
        return {
            symbol: this.id,
            periodValue: 5,
            periodType: "year"
        };
    }

    protected get uri(): string {
        return '/intelligentReport/growthIndicator.json';
    }
}
export let yearGrowthIndicatorDataSource = new YearGrowthIndicatorDataSource({
    industryCode: "",
    industryName: "",
    descriptions: [],
    dates: [],
    totalRevenueGrowthRates: [],//营业收入增长率(同比)
    industryTotalRevenueGrowthRates: [],//行业营业收入增长率(同比)
    totalAssetsGrowthRates:[],//总资产增长率(同比)
    industryTotalAssetsGrowthRates:[]//行业总资产增长率(同比)
});

//----------------------------------------------------------------------------------------------TTM成长性分析
class TTMGrowthIndicatorDataSource extends SmartReportRefDataSource<GrowthIndicator> {
    protected get paramMap() {
        return {
            symbol: this.id,
            periodValue: 5,
            periodType: "TTM"
        };
    }

    protected get uri(): string {
        return '/intelligentReport/growthIndicator.json';
    }
}
export let ttmGrowthIndicatorDataSource = new TTMGrowthIndicatorDataSource({
    industryCode: "",
    industryName: "",
    descriptions: [],
    dates: [],
    totalRevenueGrowthRates: [],//营业收入增长率(同比)
    industryTotalRevenueGrowthRates: [],//行业营业收入增长率(同比)
    totalAssetsGrowthRates:[],//总资产增长率(同比)
    industryTotalAssetsGrowthRates:[]//行业总资产增长率(同比)
});


//----------------------------------------------------------------------------------------------年度盈利性分析
class YearProfitabilityIndicatorDataSource extends SmartReportRefDataSource<ProfitabilityIndicator> {
    protected get paramMap() {
        return {
            symbol: this.id,
            periodValue: 5,
            periodType: FinancialIndicatorPeriodType[FinancialIndicatorPeriodType.YEAR]
        };
    }

    protected get uri(): string {
        return '/intelligentReport/profitabilityIndicator.json';
    }
}
export let yearProfitabilityIndicatorDataSource = new YearProfitabilityIndicatorDataSource({
    industryCode: "",
    industryName: "",
    descriptions: [],
    dates: [],
    roes: [],//净资产收益率
    operatingMarginRatios: [],//毛利率
    operatingNetProfitToRevenues: [],//净利率
    industryRoes: [],//行业净资产收益率
    industryOperatingMarginRatios: [],//行业毛利率
    industryOperatingNetProfitToRevenues: []//行业净利率
});


//----------------------------------------------------------------------------------------------TTM盈利性分析
class TTMProfitabilityIndicatorDataSource extends SmartReportRefDataSource<ProfitabilityIndicator> {
    protected get paramMap() {
        return {
            symbol: this.id,
            periodValue: 5,
            periodType: "TTM"
        };
    }

    protected get uri(): string {
        return '/intelligentReport/profitabilityIndicator.json';
    }
}
export let ttmProfitabilityIndicatorDataSource = new TTMProfitabilityIndicatorDataSource({
    industryCode: "",
    industryName: "",
    descriptions: [],
    dates: [],
    roes: [],//净资产收益率
    operatingMarginRatios: [],//毛利率
    operatingNetProfitToRevenues: [],//净利率
    industryRoes: [],//行业净资产收益率
    industryOperatingMarginRatios: [],//行业毛利率
    industryOperatingNetProfitToRevenues: []//行业净利率
});


//----------------------------------------------------------------------------------------------预期估值分析
class StockEvaluationExpectionDataSource extends SmartReportRefDataSource<StockEvaluationExpectation> {
    protected get paramMap() {
        return {
            symbol: this.id
        };
    }

    protected get uri(): string {
        return '/intelligentReport/stockEvaluationExpectation.json';
    }
}

export let stockEvaluationExpectionDataSource = new StockEvaluationExpectionDataSource({
    symbol: "",
    name: "",
    descriptions:[],
    industryCode: "",
    industryName: "",
    industryTargetPE: 0,
    dates: [],
    industryPEs: [],
    stockPEs: [],
    currentYear:"2017"
});

//----------------------------------------------------------------------------------------------历史估值分析
class StockEvaluationHistoryDataSource extends SmartReportRefDataSource<StockEvaluationHistory> {
    protected get paramMap() {
        return {
            symbol: this.id
        };
    }

    protected get uri(): string {
        return '/intelligentReport/stockEvaluationHistory.json';
    }
}

export let stockEvaluationHistoryDataSource = new StockEvaluationHistoryDataSource({
    symbol: "", //当前股票
    name: "",
    pe: true,//市盈率
    lowRatioOfSH: 0, //和SH300比值的较低值
    highRatioOfSH: 0,//和SH300比值的较高值
    dates: [], //日期列表
    ratiosOfSH: [0], //与SH300的比值列表
    conclusion:''//结论
});

//----------------------------------------------------------------------------------------------盈利预测分析
class ProfitForecastDataSource extends SmartReportRefDataSource<ProfitForecast> {
    protected get paramMap() {
        return {
            symbol: this.id
        };
    }

    protected get uri(): string {
        return '/intelligentReport/profitForecast.json';
    }
}

export let profitForecastDataSource = new ProfitForecastDataSource({
    flag: true,
    shortName: "",
    symbol: "", //当前股票
    date: new Date, //当前日期
    borkerogeCount: 0, //研究机构数量
    upgradeCount: 0, //上调次数
    downgradeCount: 0, //下调次数
    profitPerShare: 0, //每股收益
    targetProfitPerShare: 0, //预测每股收益
    netProfit: 0, //净利润
    targetProfit: 0, //预测净利润
    income: 0, //营业收入
    targetIncome: 0, //预测营业收入
    incomeRate: 0, //营业收入增长率
    targetIncomeRate: 0, //预测营业收入增长率
    roeb: 0, //加权净资产收益率
    targetRoeb: 0 //预测加权净资产收益率
});

//----------------------------------------------------------------------------------------------申万二级数据排名
class IndustryStockRankDataSource extends SmartReportRefDataSource<IndustryStockRank> {
    protected get paramMap() {
        return {
            symbol: this.id
        };
    }

    protected get uri(): string {
        return '/intelligentReport/stockRankInIndustry.json';
    }
}

export let industryStockRankDataSource = new IndustryStockRankDataSource({
    currentItemIndex: 0, //当前股票在items中的索引0-5
    indexDelta: 0,//排名同比变化量，相对上个星期周收盘时间点
    items: [] // 长度为5或6
});

//----------------------------------------------------------------------------------------------本周涉及热门题材

class HotSubjectsDataSource extends SmartReportRefDataSource<ScoreableListWrapper<CategorySummary>> {
    constructor() {
        super({score: 0, items:[]});
    }

    protected get paramMap() {
        return {
            symbol: this.id
        };
    }

    protected get uri(): string {
        return '/intelligentReport/categorySummaries.json';
    }
}

export let hotSubjectsDataSource = new HotSubjectsDataSource();
//----------------------------------------------------------------------------------------------获取风险

class GetRisk extends SmartReportRefDataSource<GetRiskOperation> {

    protected get paramMap() {
        return {
            symbol: this.id
        };
    }

    protected get uri(): string {
        return '/intelligentReport/risks.json';
    }
}

export let getRiskDataSource = new GetRisk({
    items:[],
    score:0
});
//----------------------------------------------------------------------------------------------获取研报信息

class StockOperationData extends SmartReportRefDataSource<StockOperation> {

    protected get paramMap() {
        return {
            symbol: this.id,
        };
    }

    protected get uri(): string {
        return '/intelligentReport/stockOperationData.json';
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        //设置微信信息
        if (wx) {
            let summary = value.basicInfo.quotationSummary;
            let shortName = summary.shortName;
            let symbol = summary.symbol;

            WechatShareUtil.intializeJsApi(new ShareData(
                "小牛数据calfdata",
                `${shortName}（${symbol}）智能投研报告`,
                document.location.href,
                window.location.protocol + '//' + window.location.host + "/images/icon.ico"
            ))
        }
    }
}

export let getStockDataSource = new StockOperationData({
    basicInfo: {
        followed: false,
        incomeSummary: {
            netProfit: 0,
            netProfitChangeRatio: 0,
            revenueChangeRatio: 0,
            totalRevenue: 0
        },
        quotationSummary: {
            change: 0,
            changeRatio: 0,
            shortName: '',
            symbol: '',
            value: 0,
            time: new Date
        },
        valuationMetric: {
            peTtm: 0,
            tradingDate: new Date
        },
        perShare: {
            eps: 0,
            nav: 0,
            startDate: new Date,
            endDate: new Date
        },
        stock: {
            symbol: '',
            shortName: '',
            imageId: '',
            industry: {
                code: '',
                englishName: '',
                name: ''
            },
            company: {
                id: 0,
                mainBusiness: '',
                shortName: '',
                fullName: ''
            },
            subjects: [],
            delistedDate:""
        },
        selected: false
    },
    conclusion:[],
    industryNames: [],
    itemDate: "2017-01-01",
    items: []
});

//----------------------------------------------------------------------------------------------融资融券余额走势
class FinancingSecuritiesTendencyDataSource extends SmartReportRefDataSource<FinancingSecuritiesTendency>{
    protected get paramMap() {
        return {
            symbol: this.id
        };
    }
    protected get uri(): string {
        return '/intelligentReport/marginTradingTendency.json';
    }
}

export let financingSecuritiesTendencyDataSource=new FinancingSecuritiesTendencyDataSource({
    symbol:"",
    score:0,
    dates:[],
    marginTrades:[],//融资融券余额;
    buyRatios:[],//融资买入额(T-4到T-5均值)/T日融资融券余额;
    closePrices:[]//收盘价
});


