import * as React from "react";
import * as echarts from "echarts";
import Divider from 'material-ui/Divider';
import {stockEvaluationHistoryDataSource} from "../../model/ajax/SmartReportService";
import {observable, runInAction} from "mobx";
import Explain from "../common/Explain";
interface ExpectValuationProps {
    notifyResult: (any) => void;
    symbol: string;
    small?: boolean;
}
export default class HistoryValuation extends React.Component<ExpectValuationProps, any> {
    styles = {
        chartHeight: {
            width: "1170px",
            height: "240px"
        },
        chartHeightSmall: {
            width: "100%",
            height: "240px"
        },
        legendContent: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#95989a",
            paddingLeft: "50px",
            paddingRight: "50px"
        },
        legendIcon: {
            height: "20px",
            verticalAlign: "bottom",
            marginRight: "5px"
        },
        minBox: {
            minWidth: 200,
            textAlign: 'center',
            fontSize: 12,
            color: '#95989a'
        },
        noData: {
            minHeight: "200px",
            lineHeight: "200px",
            textAlign: "center",
            fontSize: 16
        }
    };
    private chartDiv: HTMLDivElement;

    drawChart(chartDiv, data) {
        let ratiosOfSHs = data.ratiosOfSH.map(e => e.toFixed(2));//市盈率或市净率数组
        let option = {
            textStyle: {
                color: "#95989a"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            grid: {
                top: 20
            },
            color: ["#ff6600"],
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
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    scale:true
                }
            ],
            series: [
                {
                    name: data.name,
                    type: 'line',
                    data: ratiosOfSHs,
                    showSymbol: false,
                    markLine: {
                        silent: true,
                        lineStyle: {
                            normal: {
                                color: "#006eff"
                            }
                        },
                        data: [{
                            yAxis: data.lowRatioOfSH.toFixed(2)
                        }, {
                            yAxis: data.highRatioOfSH.toFixed(2)
                        },]
                    }
                }
            ]
        };
        let yearChart = echarts.init(chartDiv);
        yearChart.setOption(option);
    }

    componentDidMount() {
        stockEvaluationHistoryDataSource.setNotifyResult(this.props.notifyResult);
        stockEvaluationHistoryDataSource.resetWithId(this.props.symbol);
        stockEvaluationHistoryDataSource.request(() => {
            this.drawChart(this.chartDiv, stockEvaluationHistoryDataSource.$);
        });
    }

    render() {
        let data = stockEvaluationHistoryDataSource.$;
        let currentMultiple = data.ratiosOfSH[data.ratiosOfSH.length - 1] || 0;
        let low = data.lowRatioOfSH;
        let high = data.highRatioOfSH;
        let pe = data.pe ? "市盈率" : "市净率";
        let section = "";
        switch (true) {
            case currentMultiple < data.lowRatioOfSH:
                section = "价值或被低估，预计存在上涨空间，建议关注。";
                break;
            case currentMultiple < data.lowRatioOfSH + (high - low) * 0.35:
                section = "位于主要估值区间下轨，存在低估可能，可留意后期走势。";
                break;
            case currentMultiple < data.lowRatioOfSH + (high - low) * 0.65:
                section = "位于主要估值区间中轨，估值合理。";
                break;
            case currentMultiple < data.lowRatioOfSH + (high - low):
                section = "位于主要估值区间上轨，注意控制风险。";
                break;
            case currentMultiple > data.highRatioOfSH:
                section = "有被高估的可能，建议回避。";
                break;
            default:
                section = "";
        }
        let text = `最近3年，${data.name}
        相对于沪深300的${pe}倍数集中于${low.toFixed(2)}-${high.toFixed(2)}倍。当前${data.name}
        相对于沪深300的${pe}倍数为${currentMultiple.toFixed(2)}，${section}`;
        return (
            <div role="historyValuation">
                <div>
                    <div className="title boldText">
                        历史估值分析
                        {this.props.small ? <Explain
                            message="图中给出了最近3年内公司市盈率（或市净率）与沪深300指数市盈率（或市净率）比值的走势图，并画出了这个比值的主要波动区间。通过比较当前公司相对于沪深300的市盈率（或市净率）倍数所处的区间位置，来判断当前公司股价是否合理。一般而言，上市公司的市盈率（或市净率）和沪深300指数有长期的正相关关系，这里采用的相对估值法考虑了市场总体市盈率（或市净率）走势，避免了只比较公司绝对市盈率（市净率）的缺点，也是一种动态的估值法，被较多的机构投资者采用。"
                            toolTipPosition="bottom-center"
                            toolTipWidth="260px"
                        /> :
                            <Explain
                                message="图中给出了最近3年内公司市盈率（或市净率）与沪深300指数市盈率（或市净率）比值的走势图，并画出了这个比值的主要波动区间。通过比较当前公司相对于沪深300的市盈率（或市净率）倍数所处的区间位置，来判断当前公司股价是否合理。一般而言，上市公司的市盈率（或市净率）和沪深300指数有长期的正相关关系，这里采用的相对估值法考虑了市场总体市盈率（或市净率）走势，避免了只比较公司绝对市盈率（市净率）的缺点，也是一种动态的估值法，被较多的机构投资者采用。"/>}
                    </div>
                    <div>
                        <div className={this.props.small ? "normalFont" : "verdict small-padding"}>
                            {data.conclusion ? data.conclusion.replace("5年","3年") : "暂无数据" }
                        </div>
                    </div>
                </div>
                <div className={data.dates.length?"":"hidden"}>
                    <div>
                        <div ref={element => {
                            this.chartDiv = element;
                        }} style={this.props.small ? this.styles.chartHeightSmall : this.styles.chartHeight as any}>
                        </div>
                    </div>
                    <div className="flexCenter">
                        <div style={this.styles.minBox}>
                            <div>
                                <img src="/images/legendIcon/orangeLine.png" alt="" style={this.styles.legendIcon}/>
                                <span>
                                    {data.name}(PE) / 沪深300(PE)
                            </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )

    }
}