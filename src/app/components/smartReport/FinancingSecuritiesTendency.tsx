import * as React from "react";
import * as echarts from "echarts";
import {financingSecuritiesTendencyDataSource} from "../../model/ajax/SmartReportService";

function drawChart(chartDiv, data) {
    let closePrices = data.closePrices.map(e => {
        return e.toFixed(2);
    });
    let buyRatios = data.buyRatios.map(e => {
        return (e * 100).toFixed(2);
    });
    let marginTrades = data.marginTrades.map(e => {
        return e.toFixed(2);
    });

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        axisPointer: {
            link: {xAxisIndex: 'all'}
        },
        grid: [
            {
                top:40,
                bottom: "40%"
            },
            {
                top: '70%',
                bottom:40
            }
        ],
        textStyle: {
            color: "#95989a"
        },
        color: ['#ff0000', '#80b7ff', '#80b7ff'],
        xAxis: [
            {
                type: 'category',
                data: data.dates.slice(),
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#95989a"
                    }
                }
            },
            {
                type: 'category',
                data: data.dates.slice(),
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#95989a"
                    }
                },
                gridIndex: 1,
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: "单位(元)",
                axisLine: false,
                scale:true,
                splitLine: {show: false}
            },
            {
                type: 'value',
                name: "单位(%)",
                axisLine: false,
                splitLine: {show: false}
            },

            {
                type: 'value',
                name: "单位(亿)",
                nameLocation: 'start',
                gridIndex: 1,
                axisLabel: {
                    formatter: function (value) {
                        return (value / 100000000).toFixed(2)
                    }
                },
                splitNumber: 2,
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            }
        ],
        series: [
            {
                name: '收盘价',
                type: 'line',
                data: closePrices,
                showSymbol: false
            },
            {
                name: '5日平均融资买入额占比',
                type: 'line',
                data: buyRatios,
                yAxisIndex: 1,
                showSymbol: false
            },
            {
                name: '融资融券余额',
                type: 'line',
                data: marginTrades,
                xAxisIndex: 1,
                yAxisIndex: 2,
                showSymbol: false,
                areaStyle: {
                    normal: {
                        color: "#80b7ff"
                    }
                }
            },
        ]
    };
    echarts.init(chartDiv).setOption(option);
}

export default class FinancingSecuritiesTendency extends React.Component<any, any> {
    styles = {
        chart: {
            width: "100%",
            height: "300px"
        },
        scanImage: {
            height: 60,
            verticalAlign: 'bottom'
        },
        title: {
            padding: '20px 0'
        },
        show: {
            height: "auto"
        },
        hidden: {
            height: 0,
            overflow: "hidden"
        },
        legendContent: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#95989a",
            paddingLeft: "100px",
            paddingRight: "100px"
        },
        legendContentSmall:{
            fontSize:14
        },
        legendIcon: {
            height: "20px",
            verticalAlign: "bottom",
            marginRight: "5px"
        },

        smallImage: {
            height: 40,
            verticalAlign: 'bottom'
        }

    };
    private chartDiv: HTMLDivElement;

    componentDidMount() {
        financingSecuritiesTendencyDataSource.setNotifyResult(this.props.notifyResult);
        financingSecuritiesTendencyDataSource.resetWithId(this.props.symbol);
        financingSecuritiesTendencyDataSource.request(() => {
            drawChart(this.chartDiv, financingSecuritiesTendencyDataSource.$);
        })
    }

    render() {
        return (
            <div className="fullItem" style={financingSecuritiesTendencyDataSource.$.dates.length?this.styles.show as any:this.styles.hidden}>
                <div style={this.props.small?{}:this.styles.title} className={this.props.small?"titleBoldSmall":""}>
                    <img src="/images/trend.png" style={this.props.small?this.styles.smallImage:this.styles.scanImage}/>
                    <span className={this.props.small?"boldText commen-pdl10":"titleBold boldText commen-pdl10"}>融资融券余额走势</span>
                </div>
                <div className="boxShadow reportHeader">
                    <div ref={(element) => {
                        this.chartDiv = element;
                    }} style={this.styles.chart as any}>
                    </div>
                    <div style={this.props.small?this.styles.legendContentSmall:this.styles.legendContent as any}>
                        <div>
                            <img src="/images/legendIcon/redLine.png" alt="" style={this.styles.legendIcon}/>
                            <span>
                                    收盘价（元）
                                </span>
                        </div>
                        <div>
                            <img src="/images/legendIcon/blueLine.png" alt="" style={this.styles.legendIcon}/>
                            <span>
                                    5日平均融资买入额占比（%）
                                </span>
                        </div>
                        <div>
                            <img src="/images/legendIcon/areaIcon.png" alt="" style={this.styles.legendIcon}/>
                            <span>
                                    融资融券余额（亿）
                                </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}