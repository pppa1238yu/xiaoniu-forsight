import * as React from "react";
import * as ECharts from "echarts";
import {observable, runInAction} from "mobx";
import {http} from "../../model/ajax/Http";
import {ReportStockOpinionNumPerMonth} from "../../model/entities/ReportStockOpinion";
import {StockRecentMonthClosePrices} from "../../model/entities/StockRecentMonthClosePrices";
import {observer} from "mobx-react";
import {Objects} from "../../model/Objects";
import {FixLoading} from "../common/Loading";

interface Props {
    stockCode: string;
    monthNum: number;
    small?: boolean;
}

@observer
export default class ReportStockOpinionView extends React.Component<Props, null> {
    @observable private loading: number = 0;
    @observable private loadedCount: number = 0;
    @observable private error: boolean = false;

    @observable private readonly monthReportOpinion: ReportStockOpinionNumPerMonth = new ReportStockOpinionNumPerMonth();
    @observable private readonly monthClosePrices: StockRecentMonthClosePrices = new StockRecentMonthClosePrices();

    private chartDiv: HTMLDivElement;
    private chart: ECharts.ECharts;
    private windowResizeHandler: (e: Event) => void;

    constructor(props: Props, context?: any) {
        super(props, context);
        this.refresh();
        this.windowResizeHandler = e => this.resizeChart();
    }

    componentDidMount() {
        if (this.loading && this.loadedCount == 0) {
            return;
        }
        this.drawChart();
    }

    componentDidUpdate() {
        if (this.loading && this.loadedCount == 0) {
            return;
        }
        this.drawChart();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    render() {
        if (this.loading && this.loadedCount == 0) {
            return (
                <div className="keep-aspect-ratio aspect-1-of-2 l-aspect-1-of-3 xl-aspect-1-of-4">
                    <div className="aspect-target">
                        <FixLoading/>
                    </div>
                </div>
            );
        }

        if (this.error) {
            //TODO add clicked-refresh in view
            return null;
        }

        const style = {
            backgroundColor: "white"
        };

        const titleStyle = {
            textAlign: "center",
            marginBottom: "0.5rem",
            fontSize: "2rem"
        };

        const nonDataStyle = {
            width: '100%',
            height: 160,
            paddingTop: 60,
            left: 0,
            top: 0,
            fontSize: 'none',
        };

        const nonDataSpanStyle = {
            display: "inline-block",
            verticalAlign: "middle",
        };

        return (
            <div style={style}>
                {this.allOpinionNum() == 0 ?
                    <div className="center-align" style={nonDataStyle}>
                        <span style={nonDataSpanStyle}>{this.constructNnoDataTip()}</span>
                    </div>
                    :
                    <div>
                        <div className="keep-aspect-ratio aspect-1-of-2 l-aspect-1-of-2 xl-aspect-11-of-22">
                            <div className="aspect-target"
                                 ref={element => this.chartDiv = element}/>
                        </div>
                    </div>
                }
            </div>
        );
    }

    private drawChart() {
        if (!this.chart) {
            this.chart = ECharts.init(this.chartDiv);
            this.chart.setOption(this.getChartOption(), true);

            window.addEventListener('resize', this.windowResizeHandler)
        }
    }

    private refresh() {
        this.loading++;
        http.get("/stock/report-opinion.json",
            {
                stockCode: this.props.stockCode,
                n: this.props.monthNum
            },
        ).then((monthReportOpinion) => {
            http.get("/stock/month-close-price.json",
                {
                    stockCode: this.props.stockCode,
                    n: this.props.monthNum
                }
            ).then((monthClosePrice) => {
                runInAction(() => {
                    Objects.assign(this.monthReportOpinion, monthReportOpinion);
                    Objects.assign(this.monthClosePrices, monthClosePrice);
                    this.loading--;
                    this.loadedCount++;
                });
            });

        }).catch(() => {
            runInAction(() => {
                this.error = true;
                this.loading--;
                this.loadedCount++;
            });
        });
    }

    private resizeChart() {
        this.chart.resize();
    }

    private constructNnoDataTip(): string {
        return "近 " + this.props.monthNum + " 个月暂无数据";
    }

    private static getTooltipDesc(params, ticket, callback): string {
        if (params.length < 1) {
            return "无数据";
        }

        let closePricesData: any = params[0];
        let buyData: any = params[3];
        let incData: any = params[2];
        let holdData: any = params[1];
        let neuData: any = params[4];
        let sellData: any = params[5];

        let tipDesc: string = closePricesData.seriesName + ": " + closePricesData.value.toFixed(2) + "<br />"
            + closePricesData.data.desc;
        if (closePricesData.data.sumNum > 0) {
            tipDesc = tipDesc + "<br /><br />" + "买入观点数: " + buyData.value + "<br />"
                + "增持观点数: " + incData.value + "<br />"
                + "持有观点数: " + holdData.value + "<br />"
                + "中性观点数: " + Math.abs(neuData.value) + "<br />"
                + "卖出观点数: " + Math.abs(sellData.value);
        }

        return tipDesc
    }

    private allOpinionNum(): number {
        return this.monthReportOpinion.buy.reduce((pv, cv) => pv + cv, 0) +
            this.monthReportOpinion.increase.reduce((pv, cv) => pv + cv, 0) +
            this.monthReportOpinion.hold.reduce((pv, cv) => pv + cv, 0) +
            this.monthReportOpinion.neutral.reduce((pv, cv) => pv + cv, 0) +
            this.monthReportOpinion.sell.reduce((pv, cv) => pv + cv, 0);
    }

    private getYAxisesRange(): Array<[number, number]> {
        let ranges: Array<[number, number]> = [];

        let opinionMax: number = 0;
        let opinionMin: number = 0;
        let closePriceMax: number = 0;
        let closePriceMin: number = 0;

        for (let i: number = 0; i < this.props.monthNum; i++) {
            let posOpinion: number = this.monthReportOpinion.buy[i]
                + this.monthReportOpinion.increase[i]
                + this.monthReportOpinion.hold[i];
            let negOpinion: number = -(this.monthReportOpinion.neutral[i]
            + this.monthReportOpinion.sell[i]);
            if (posOpinion > opinionMax) {
                opinionMax = posOpinion;
            }
            if (negOpinion < opinionMin) {
                opinionMin = negOpinion;
            }

            let closePrice: number = this.monthClosePrices.closePrices[i];
            if (closePrice > closePriceMax) {
                closePriceMax = closePrice;
            }
        }

        const scale: number = 1.1;
        opinionMax *= scale;
        opinionMin *= scale;
        closePriceMax *= scale;
        closePriceMin *= scale;

        if (opinionMin == 0) {
            ranges.push([opinionMin, opinionMax], [closePriceMin, closePriceMax]);
        } else if (opinionMax == 0) {
            ranges.push([opinionMin, -opinionMin], [-closePriceMax, closePriceMax]);
        } else {
            let ratio: number = Math.abs(opinionMin) / Math.abs(opinionMax);
            ranges.push([opinionMin, opinionMax], [-(closePriceMax * ratio), closePriceMax]);
        }

        return ranges;
    }

    private getChartOption() {

        const xLabelDate: Date = new Date(this.monthReportOpinion.currentYear, this.monthReportOpinion.currentMonth - 1);
        const xAxisData: Array<string> = [];
        xLabelDate.setMonth(xLabelDate.getMonth() - this.props.monthNum + 1);

        for (let i: number = 0; i < this.props.monthNum; i++) {
            xAxisData.push([xLabelDate.getMonth() + 1, "月"].join(" "));
            xLabelDate.setMonth(xLabelDate.getMonth() + 1);
        }


        const emphasis = {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
        };

        const buyItemStyle = {
            normal: {
                color: "#ee7978"
            },
            emphasis: emphasis
        };

        const incItemStyle = {
            normal: {
                color: "#df4d91"
            },
            emphasis: emphasis
        };

        const holdItemStyle = {
            normal: {
                color: "#3c85ff"
            },
            emphasis: emphasis
        };

        const neutralItemStyle = {
            normal: {
                color: "#20ccb3"
            },
            emphasis: emphasis
        };

        const sellItemStyle = {
            normal: {
                color: "#90c21"
            },
            emphasis: emphasis
        };

        const stockIndexLineStyle = {
            normal: {
                color: "#13a4ee",
                width: 3
            }
        };

        const stockIndexItemStyle = {
            normal: {
                color: "#4472C4"
            }
        };

        const yAxisesRanges: Array<[number, number]> = this.getYAxisesRange();

        return {
            legend: {
                data: ['买入', '增持', '持有', '中性', "卖出", '股价'],
                selectedMode: false,
                orient: 'horizontal',
                borderWidth: 1,
                show: !this.props.small,
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: ReportStockOpinionView.getTooltipDesc,
                confine:true
            },
            xAxis: {
                name: "时间（月）",
                axisLabel: {
                    show: true,
                    interval: 0,
                    inside: 0,
                    rotate: 45
                },
                axisTick: {
                    show: false
                },
                z: 3,
                data: xAxisData,
                silent: false,
                axisLine: {onZero: true},
                splitLine: {show: false},
                splitArea: {show: false}
            },
            yAxis: [
                {
                    show: false,
                    type: "value",
                    name: "观点数",
                    position: 'left',
                    min: yAxisesRanges[0][0],
                    max: yAxisesRanges[0][1],
                    splitLine: {show: false},
                    splitArea: {show: false},
                    z: 3
                },
                {
                    show: true,
                    type: "value",
                    name: "股价(元)",
                    position: 'left',
                    scale:true,
                    // min: yAxisesRanges[1][0],
                    // max: yAxisesRanges[1][1],
                    splitLine: {show: false},
                    splitArea: {show: false},
                    z: 3
                }
            ],
            series: [
                {
                    name: '月收盘价',
                    type: 'line',
                    xAxisIndex: 0,
                    yAxisIndex: 1,
                    showSymbol: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    z: 3,
                    lineStyle: stockIndexLineStyle,
                    itemStyle: stockIndexItemStyle,
                    data: this.constructClosePricesWithRankData()
                },
                {
                    name: '持有',
                    type: 'bar',
                    stack: 'view',
                    z: 2,
                    itemStyle: holdItemStyle,
                    data: this.monthReportOpinion.hold
                },
                {
                    name: '增持',
                    type: 'bar',
                    stack: 'view',
                    z: 2,
                    itemStyle: incItemStyle,
                    data: this.monthReportOpinion.increase
                },
                {
                    name: '买入',
                    type: 'bar',
                    stack: 'view',
                    z: 2,
                    itemStyle: buyItemStyle,
                    data: this.monthReportOpinion.buy
                },
                {
                    name: '中性',
                    type: 'bar',
                    stack: 'view',
                    z: 2,
                    itemStyle: neutralItemStyle,
                    data: this.monthReportOpinion.neutral.map(n => -n)
                },
                {
                    name: '卖出',
                    type: 'bar',
                    stack: 'view',
                    z: 2,
                    itemStyle: sellItemStyle,
                    barWidth: "45%",
                    data: this.monthReportOpinion.sell.map(n => -n)
                }
            ]
        };
    }

    private constructClosePricesWithRankData(): Array<any> {
        let rankValues: Array<[number, number]> = this.getOpinionNumAndRankValues();
        const data: Array<any> = [];
        for (let i: number = 0; i < this.props.monthNum; i++) {
            let sumNum = rankValues[i][0];
            let rankValue = rankValues[i][1];
            let rankDesc: string = ReportStockOpinionView.getRankDesc(rankValue);
            let desc: string;
            if (rankDesc === null) {
                if (i === this.props.monthNum - 1) {
                    desc = "本月暂无分析师观点<br />"
                } else {
                    desc = "当月无分析师观点<br />"
                }
            } else {
                desc = "分析师观点数: " + sumNum + "<br />"
                    + "综合评级: " + rankDesc + " (" + rankValue.toFixed(2) + ")";
            }

            data.push({
                sumNum: sumNum,
                desc: desc,
                value: this.monthClosePrices.closePrices[i]
            });
        }
        return data;
    }

    private static getRankDesc(rankValue: number): string {
        let rankDesc: string = null;

        if (rankValue !== -1) {
            if (rankValue >= 4.5) {
                rankDesc = "买入";
            } else if (rankValue >= 3.5) {
                rankDesc = "增持";
            } else if (rankValue >= 2.5) {
                rankDesc = "持有";
            } else if (rankValue >= 1.5) {
                rankDesc = "中性";
            } else {
                rankDesc = "卖出";
            }
        }

        return rankDesc;
    }

    private getOpinionNumAndRankValues(): Array<[number, number]> {
        const rankValues: Array<[number, number]> = [];

        const currentMonthViews: Array<[number, Array<number>]> = [
            [5, this.monthReportOpinion.buy],
            [4, this.monthReportOpinion.increase],
            [3, this.monthReportOpinion.hold],
            [2, this.monthReportOpinion.neutral],
            [1, this.monthReportOpinion.sell]
        ];

        for (let i: number = 0; i < this.props.monthNum; i++) {
            let sumViewNum: number = 0;
            let rankValue: number = 0;
            for (const [rank, num] of currentMonthViews) {
                sumViewNum += num[i];
                rankValue += rank * num[i];
            }
            if (sumViewNum == 0) {
                rankValue = -1;
            } else {
                rankValue /= sumViewNum;
            }
            rankValues.push([sumViewNum, rankValue]);
        }

        return rankValues;
    }

    private constructTitle(): string {
        const currentMonthViews: Array<[number, number]> = [
            [5, ReportStockOpinionView.getLastElement(this.monthReportOpinion.buy)],
            [4, ReportStockOpinionView.getLastElement(this.monthReportOpinion.increase)],
            [3, ReportStockOpinionView.getLastElement(this.monthReportOpinion.hold)],
            [2, Math.abs(ReportStockOpinionView.getLastElement(this.monthReportOpinion.neutral))],
            [1, Math.abs(ReportStockOpinionView.getLastElement(this.monthReportOpinion.sell))]
        ];

        let sumViewNum: number = 0;
        let rankValue: number = 0;
        for (const [rank, num] of currentMonthViews) {
            sumViewNum += num;
            rankValue += rank * num;
        }

        let title: string;
        if (sumViewNum === 0) {
            title = "本月暂无分析师观点";
        } else {
            title = "本月分析师观点数：" + sumViewNum;
            rankValue = rankValue / sumViewNum;
            let rankDesc: string = "";
            if (rankValue >= 4.5) {
                rankDesc = "买入";
            } else if (rankValue >= 3.5) {
                rankDesc = "增持";
            } else if (rankValue >= 2.5) {
                rankDesc = "持有";
            } else if (rankValue >= 1.5) {
                rankDesc = "中性";
            } else {
                rankDesc = "卖出";
            }
            title += "\t\t\t\t\t\t\t\t综合观点：" + rankDesc + " " + rankValue.toFixed(1);
        }
        return title;
    }

    private static getLastElement(array: Array<number>): number {
        if (array.length == 0) {
            return 0;
        }
        else {
            return array[array.length - 1];
        }
    }
}