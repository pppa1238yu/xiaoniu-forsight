import * as React from "react";
import * as echarts from "echarts";
import Divider from 'material-ui/Divider';
import {yearGrowthIndicatorDataSource, ttmGrowthIndicatorDataSource,stockEvaluationHistoryDataSource} from "../../model/ajax/SmartReportService";
import {NumberFormat} from "../../utils/NumberFormat"
import Explain from "../common/Explain";
function numberHandle(data){
    return data.map((e)=>{
        if(e!==null){
            return (e*100).toFixed(2)
        }else{
            return null
        }
    })
}

function drawChart(chartDiv, title, data) {

    let option = {
        title: {
            text: title, left: "10%"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            formatter:function (params) {
                let content=params[0].name+"<br />";
                for(let i=0,len=params.length;i<len;i++){
                    content+=params[i].seriesName+":"+(params[i].value?params[i].value+"%<br />":"-<br />");
                }
                return content
            }
        },
        textStyle: {
            color: "#95989a"
        },
        color: ['#ff8080', '#ff0000', "#ffb380", "#ff6600", '#80b7ff', '#006eff'],
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
                axisLine: false,
                name:"单位(%)"
            }
        ],
        series: [
            {
                name: '行业营业总收入增长率',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }

                },
                data: numberHandle(data.industryTotalRevenueGrowthRates),
                barWidth: 25
            },
            {
                name: '营业总收入增长率',
                type: 'line',
                data: numberHandle(data.totalRevenueGrowthRates),
                showSymbol: false
            },
            {
                name: '行业总资产增长率',
                type: 'bar',
                data: numberHandle(data.industryTotalAssetsGrowthRates),
                barWidth: 25,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            {
                name: '总资产增长率',
                type: 'line',
                data: numberHandle(data.totalAssetsGrowthRates),
                showSymbol: false
            }
        ]
    };
     echarts.init(chartDiv).setOption(option);
}

interface ChartProps {
    symbol: string;
    notifyResultTTM?:(any) => void;
    notifyResultYear?: (any) => void;
    small?: boolean;
}
class YearChart extends React.Component<ChartProps, any> {
    styles = {
        chartHeight: {
            height: "300px"
        }
    };
    private yearChartDiv: HTMLDivElement;

    componentDidMount() {
        yearGrowthIndicatorDataSource.setNotifyResult(this.props.notifyResultYear);
        yearGrowthIndicatorDataSource.resetWithId(this.props.symbol);
        yearGrowthIndicatorDataSource.request(() => {
            drawChart(this.yearChartDiv, "年度", yearGrowthIndicatorDataSource.$);
        });
    }

    render() {
        return (
            <div ref={element => {
                this.yearChartDiv = element;
            }} style={this.styles.chartHeight as any}>
            </div>
        )
    }
}

class TTMChart extends React.Component<ChartProps, any> {
    styles = {
        chartHeight: {
            height: "300px"
        }
    };
    private TTMChartDiv: HTMLDivElement;
    componentDidMount() {
        ttmGrowthIndicatorDataSource.setNotifyResult(this.props.notifyResultTTM);
        ttmGrowthIndicatorDataSource.resetWithId(this.props.symbol);
        ttmGrowthIndicatorDataSource.request(() => {
            drawChart(this.TTMChartDiv, "TTM(Trailing Twelve Month)", ttmGrowthIndicatorDataSource.$);
        });
    }

    render() {
        return (
            <div ref={element => {
                this.TTMChartDiv = element
            }} style={this.styles.chartHeight as any}>
            </div>
        )
    }
}


interface BasicAnalysisProps {
    title: string;
    symbol: string;
    notifyResultYear?:(any) => void;
    notifyResultTTM?:(any) => void;
    small?:boolean;
}

export default class BasicAnalysisGrow extends React.Component<BasicAnalysisProps, any> {
    styles = {
        legendContent: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#95989a",
            paddingLeft: "100px",
            paddingRight: "100px"
        },
        legendIcon: {
            height: "20px",
            verticalAlign: "bottom",
            marginRight: "5px"
        },
        legendBox:{
            marginBottom:"20px"
        }
    };
    private explainText=[
      "比较最近三年个股营业收入和总资产的复合增长率和所在行业的中值，判断个股是优于还是低于行业水平。",
        "图表反映了个股和所在行业的营业收入增长率和总资产增长率的历史变化情况，" +
        "既可以纵向比较个股成长状态（通过增长速度判断企业的发展能力），也可以比较个股和行业水平。",
        "TTM指标：TTM（Trailing Twelve Months）即连续十二个月的滚动指标，是以最近12个月(四个季度)的数据（收入或者利润）滚动计算的指标，" +
        "更加客观的反映了上市公司的真实情况。后面用到的TTM财务指标和市盈率TTM都是采用这种方法。"
    ];
    render() {
        return (
            <div>
                <div>
                    <div className="title boldText">
                        {this.props.title} <Explain message={this.explainText}/>
                    </div>
                    <div>
                        <div className="verdict">
                            {yearGrowthIndicatorDataSource.$.descriptions.length?yearGrowthIndicatorDataSource.$.descriptions.map((e,index)=>{
                                return <p key={index} className="textMargin">{e}</p>
                            }):"暂无数据"}
                        </div>
                        {yearGrowthIndicatorDataSource.$.dates.length?<Divider/>:null}
                    </div>
                </div>
                <div className="chart-marginTop">
                    <div className={yearGrowthIndicatorDataSource.$.dates.length?"":"hidden"}>
                        <YearChart symbol={this.props.symbol} notifyResultYear={this.props.notifyResultYear}/>
                        <div style={this.styles.legendBox}>
                            <div style={this.styles.legendContent as any} className="legend-row">
                                <div>
                                    <img src="/images/legendIcon/redLine.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    营业总收入增长率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/orangeLine.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    总资产增长率
                                </span>
                                </div>
                            </div>
                            <div style={this.styles.legendContent as any} className="legend-marginTop legend-row">

                                <div>
                                    <img src="/images/legendIcon/redBar.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    行业营业总收入增长率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/orangeBar.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    行业总资产增长率
                                </span>
                                </div>
                            </div>
                        </div>
                        <TTMChart symbol={this.props.symbol} notifyResultTTM={this.props.notifyResultTTM}/>
                        <div>
                            <div style={this.styles.legendContent as any} className="legend-row">
                                <div>
                                    <img src="/images/legendIcon/redLine.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    营业总收入增长率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/redBar.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    行业营业总收入增长率
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}