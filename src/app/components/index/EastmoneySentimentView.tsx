import * as React from "react";
import * as ECharts from "echarts";
import {observable, runInAction} from "mobx";
import {http} from "../../model/ajax/Http";
import {observer} from "mobx-react";
import {Objects} from "../../model/Objects";
import {EastmoneySentimentNumPerDay} from "../../model/entities/EastmoneySentimentNumPerDay";
import {SentimentCalculator} from "../../utils/SentimentCalculator";
import {FixLoading} from "../common/Loading";
import {
    red500,
    red400,
    red200,
    green100,
    green300,
    green500,
    purple500,
    grey500,
    blue200
} from "material-ui/styles/colors";
import {homeTendencyDataSource} from "../../model/ajax/SeveralIndexes";
import * as moment from "moment";
import _date = moment.unitOfTime._date;
import {Optional} from "../../model/entities/Optional";
import Explain from "../common/Explain";

interface Props {
    dayNum: number;
    small: boolean;
}

class ChartData {

    maxViewpointCount: number;
    minPrice: number;
    maxPrice: number;

    dates: Array<string>;
    positiveCounts: Array<number>;
    negativeCounts: Array<number>;
    sentiments: Array<number>;
    prices: Array<number>; // Can contain null elements
}

@observer
export default class EastmoneySentimentView extends React.Component<Props, null> {

    private static readonly CHART_STYLES = {
        pieItem: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        sentimentLine: {
            normal: {
                color: purple500,
                width: 1
            }
        },
        sentimentItem: {
            normal: {
                color: purple500
            }
        },
        positiveItem: {
            normal: {
                color: red200
            }
        },
        negativeItem: {
            normal: {
                color: green100
            }
        },
        priceItem: {
            normal: {
                color: blue200
            }
        },
        priceLine: {
            normal: {
                color: blue200,
                width: 1
            }
        },
        pieLabel: {
            normal: {
                position: 'inner',
                formatter: '{b}'
            }
        },
        hidden: {
            normal: {
                show: false
            }
        }
    };

    @observable private loading: number = 0;
    @observable private loadedCount: number = 0;
    @observable private error: boolean = false;
    @observable private readonly daySentimentNum: EastmoneySentimentNumPerDay = new EastmoneySentimentNumPerDay();

    private chartDiv: HTMLDivElement;
    private chart: ECharts.ECharts;
    private windowResizeHandler: (e: Event) => void;

    constructor(props: Props, context?: any) {
        super(props, context);
        this.refresh();
        this.windowResizeHandler = e => this.resizeChart();
    }

    componentDidMount() {
        if (this.isLoading) {
            return;
        }
        this.drawChart();
    }

    componentDidUpdate() {
        if (this.isLoading) {
            return;
        }
        this.drawChart();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    render() {
        if (this.isLoading) {
            return (
                <div className="keep-aspect-ratio aspect-1-of-2 l-aspect-1-of-3">
                    <div className="aspect-target">
                        <FixLoading/>
                    </div>
                </div>
            );
        }

        if (this.error) {
            //TODO add clicked-reload in view
            return null;
        }

        const style = {
            backgroundColor: "white",
            paddingBottom: 30,
            paddingTop: 30
        };
        const mobileStyle = {
            backgroundColor: "white",
            paddingBottom: 30
        };
        if (this.props.small) {
            return (
                <div style={mobileStyle}>
                    <Explain message="股吧多空情绪指标：分析股吧每日情绪，统计出每日看多、看空比例，形成对比；结合市场走势，通过多空情绪的变化趋势预测市场未来的行情走势（一般上升代表情乐观情绪，下降代表悲观情绪）。" toolTipWidth="260px"/>
                    <div className="keep-aspect-ratio aspect-1">
                        <div className="aspect-target"
                             ref={element => this.chartDiv = element}/>
                    </div>
                </div>
            );
        }
        return (
            <div style={style}>
                <div className="keep-aspect-ratio aspect-1-of-3">
                    <div className="aspect-target"
                         ref={element => this.chartDiv = element}/>
                </div>
            </div>
        );
    }

    private get isLoading(): boolean {
        return (this.loading && this.loadedCount == 0) || homeTendencyDataSource.loading;
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
        http.get("/eastmoney-sentiment/last-n-days.json",
            {
                n: this.props.dayNum
            },
        ).then((daySentimentNum) => {
            runInAction(() => {
                Objects.assign(this.daySentimentNum, daySentimentNum);
                this.loading--;
                this.loadedCount++;
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

    private getSentimentIndex(): Array<number> {
        return SentimentCalculator.calBI(this.daySentimentNum.positive, this.daySentimentNum.negative)
    }

    private constructChartData(): ChartData {
        let barMap = {};
        if (homeTendencyDataSource.$.length) {
            let bars: Array<any> = homeTendencyDataSource.$[0].bars;
            if (bars && bars.length) {
                let allBarMap = {};
                bars.forEach(bar => {
                    allBarMap[bar.tradingDate] = bar;
                });
                for (let i = this.daySentimentNum.dates.length - 1; i >= 0; --i) {
                    let dateText: string = this.daySentimentNum.dates[i];
                    let bar = allBarMap[dateText];
                    if (bar) {
                        barMap[dateText] = bar;
                    }
                }
            }
        }
        let prices: Array<number> = this
            .daySentimentNum
            .dates
            .map(dateText =>
                Optional
                    .of(barMap[dateText])
                    .map(bar => bar.closePrice)
                    .orElse(null)
            );
        let sentiments = this.getSentimentIndex();
        for (let i = prices.length - 1; i >= 0; --i) {
            if (typeof prices[i] != 'number') {
                prices.splice(i, 1);
                this.daySentimentNum.dates.splice(i, 1);
                this.daySentimentNum.positive.splice(i, 1);
                this.daySentimentNum.neutral.splice(i, 1);
                this.daySentimentNum.negative.splice(i, 1);
                sentiments.splice(i, 1);
            }
        }
        return {

            maxViewpointCount: Math.max(
                Math.max(...this.daySentimentNum.positive),
                Math.max(...this.daySentimentNum.negative)
            ),
            minPrice: Math.min(...prices.filter(price => !!price)),
            maxPrice: Math.max(...prices.filter(price => !!price)),

            dates: this.daySentimentNum.dates,
            positiveCounts: this.daySentimentNum.positive,
            negativeCounts: this.daySentimentNum.negative,
            sentiments: sentiments.map(v => Math.round(v * 100) / 100),
            prices: prices
        };
    }

    private getChartOption() {

        let chartData: ChartData = this.constructChartData();
        let dataCount = chartData.dates.length;
        let newestPositiveCount = dataCount ? chartData.positiveCounts[dataCount - 1] : 1;
        let newestNegativeCount = dataCount ? chartData.negativeCounts[dataCount - 1] : 1;

        let pieCenter, pieRadius, grids;
        if (this.props.small) {
            pieCenter = ['50%', '25%'];
            pieRadius = '25%';
            grids = [
                {
                    left: '70px',
                    right: '30px',
                    top: "40%",
                    bottom: '42%'
                },
                {
                    left: '70px',
                    right: '30px',
                    top: '67%',
                    bottom: '30px'
                }
            ];
        } else {
            pieCenter = ['20%', '50%'];
            pieRadius = '60%';
            grids = [
                {
                    left: '40%',
                    right: '10%',
                    top: "30%",
                    bottom: '52%'
                },
                {
                    left: '40%',
                    right: '10%',
                    top: '57%',
                    bottom: '15%'
                }
            ];
        }

        return {
            legend: {
                data: ["舆情", "多方", "空方", "上证"]
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: grey500,
                        opacity: 0.7
                    }
                },
                formatter: function (params) {
                    let index: number = params[0].dataIndex;
                    let priceDesc = '';
                    let price = chartData.prices[index];
                    if (price) {
                        priceDesc = `<li>上证: ${price}</li>`;
                    }
                    return `
                        <ul>
                            <li>日期: ${chartData.dates[index]}</li>
                            <li>舆情: ${chartData.sentiments[index]}</li> 
                            <li>看多: ${chartData.positiveCounts[index]}</li>
                            <li>看空: ${chartData.negativeCounts[index]}</li>
                            ${priceDesc}
                        </ul>
                    `;
                }
            },
            axisPointer: {
                link: {
                    xAxisIndex: 'all'
                }
            },
            grid: grids,
            xAxis: [
                {
                    type: "category",
                    gridIndex: 1,
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    z: 3,
                    data: chartData.dates,
                    silent: false,
                    axisLine: {
                        onZero: true,
                        lineStyle: {
                            color: '#d6d6d6',
                        }
                    },
                },
                {
                    type: "category",
                    gridIndex: 0,
                    z: 3,
                    data: chartData.dates,
                    silent: false,
                    axisLine: {
                        onZero: true,
                        lineStyle: {
                            color: '#d6d6d6',
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#616161'
                        }
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                    gridIndex: 1,
                    name: "舆情",
                    nameTextStyle: {
                        color: '#616161'
                    },
                    nameLocation: 'start',
                    min: -1,
                    max: +1,
                    silent: true,
                    splitLine: {show: false},
                    splitArea: {show: false},
                    z: 3,
                    axisLabel: {
                        textStyle: {
                            color: '#616161'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d6d6d6',
                        }
                    }
                },
                {
                    show: false,
                    gridIndex: 1,
                    type: "value",
                    name: "多空",
                    min: -chartData.maxViewpointCount,
                    max: +chartData.maxViewpointCount,
                    silent: true,
                    splitLine: {show: false},
                    splitArea: {show: false},
                },
                {
                    gridIndex: 0,
                    name: "上证",
                    min: chartData.minPrice,
                    max: chartData.maxPrice,
                    nameTextStyle: {
                        color: '#616161'
                    },
                    silent: true,
                    splitLine: {show: false},
                    splitArea: {show: false},
                    z: 3,
                    axisLabel: {
                        textStyle: {
                            color: '#616161'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d6d6d6',
                        }
                    }
                },
            ],
            series: [
                {
                    name: '多空观点占比',
                    gridIndex: 0,
                    type: 'pie',
                    center: pieCenter,
                    radius: pieRadius,
                    data: [
                        {value: newestPositiveCount, name: '多方'},
                        {value: newestNegativeCount, name: '空方'},
                    ],
                    label: EastmoneySentimentView.CHART_STYLES.pieLabel,
                    labelLine: EastmoneySentimentView.CHART_STYLES.hidden,
                    itemStyle: EastmoneySentimentView.CHART_STYLES.pieItem,
                    color: [red400, green300],
                    tooltip: {
                        trigger: 'item',
                        formatter: `
                            <div>{b}
                                <div>共{c}个</div>
                                <div>占比{d}%</div>
                            </div>`
                    }
                },
                {
                    name: '舆情',
                    type: 'line',
                    smooth: true,
                    showSymbol: true,
                    symbol: 'circle',
                    symbolSize: 1,
                    lineStyle: EastmoneySentimentView.CHART_STYLES.sentimentLine,
                    itemStyle: EastmoneySentimentView.CHART_STYLES.sentimentItem,
                    data: chartData.sentiments
                },
                {
                    name: '多方',
                    yAxisIndex: 1,
                    type: 'bar',
                    stack: 'viewpoint',
                    data: chartData.positiveCounts,
                    itemStyle: EastmoneySentimentView.CHART_STYLES.positiveItem
                },
                {
                    name: '空方',
                    yAxisIndex: 1,
                    type: 'bar',
                    stack: 'viewpoint',
                    data: chartData.negativeCounts.map(value => -value),
                    itemStyle: EastmoneySentimentView.CHART_STYLES.negativeItem
                },
                {
                    name: '上证',
                    type: 'line',
                    smooth: true,
                    showSymbol: true,
                    symbol: 'circle',
                    symbolSize: 1,
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    itemStyle: EastmoneySentimentView.CHART_STYLES.priceItem,
                    lineStyle: EastmoneySentimentView.CHART_STYLES.priceLine,
                    data: chartData.prices
                }
            ]
        };
    }
}
