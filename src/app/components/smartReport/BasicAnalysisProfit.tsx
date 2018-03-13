import * as React from "react";
import * as echarts from "echarts";
import Divider from 'material-ui/Divider';
import {yearProfitabilityIndicatorDataSource,ttmProfitabilityIndicatorDataSource} from "../../model/ajax/SmartReportService";
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
                name: '行业毛利率',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }

                },
                data: numberHandle(data.industryOperatingMarginRatios),
                barWidth: 20
            },
            {
                name: '毛利率',
                type: 'line',
                data: numberHandle(data.operatingMarginRatios),
                showSymbol: false
            },
            {
                name: '行业净利率',
                type: 'bar',
                data: numberHandle(data.industryOperatingNetProfitToRevenues),
                barWidth: 20,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }

                }
            },
            {
                name: '净利率',
                type: 'line',
                data: numberHandle(data.operatingNetProfitToRevenues),
                showSymbol: false
            },
            {
                name: '行业净资产收益率',
                type: 'bar',
                data: numberHandle(data.industryRoes),
                barWidth: 20,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }

                }
            },
            {
                name: '净资产收益率',
                type: 'line',
                data: numberHandle(data.roes),
                showSymbol: false
            }
        ]
    };
    echarts.init(chartDiv).setOption(option);
}

interface ChartProps {
    symbol: string;
    notifyResultYear?: (any) => void;
    notifyResultTTM?:(any) => void;
}
class YearChart extends React.Component<ChartProps, any> {
    styles = {
        chartHeight: {
            height: "300px"
        }
    };
    private yearChartDiv: HTMLDivElement;
    componentDidMount() {
        yearProfitabilityIndicatorDataSource.setNotifyResult(this.props.notifyResultYear);
        yearProfitabilityIndicatorDataSource.resetWithId(this.props.symbol);
        yearProfitabilityIndicatorDataSource.request(() => {
            drawChart(this.yearChartDiv, "年度", yearProfitabilityIndicatorDataSource.$);
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
        ttmProfitabilityIndicatorDataSource.setNotifyResult(this.props.notifyResultTTM);
        ttmProfitabilityIndicatorDataSource.resetWithId(this.props.symbol);
        ttmProfitabilityIndicatorDataSource.request(() => {
            drawChart(this.TTMChartDiv, "TTM(Trailing Twelve Month)", ttmProfitabilityIndicatorDataSource.$);
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
    symbol:string;
    notifyResultYear?:(any) => void;
    notifyResultTTM?:(any) => void;
}

export default class BasicAnalysisProfit extends React.Component<BasicAnalysisProps, any> {
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
        }
    };

    render() {
        return (
            <div>
                <div>
                    <div className="title boldText">
                        {this.props.title} <Explain message="图表反映了个股和所在行业的净资产收益率、毛利率、净利率的历史变化情况，既可以纵向比较个股盈利水平变动，也可以比较个股和行业中值，确定公司在行业中的竞争地位。"/>
                    </div>
                    <div>
                        <div className="verdict">
                            {yearProfitabilityIndicatorDataSource.$.descriptions.length?yearProfitabilityIndicatorDataSource.$.descriptions.map((e,index)=>{
                                return <p  key={index} className="textMargin">{e}</p>
                            }):"暂无数据"}
                        </div>
                        {yearProfitabilityIndicatorDataSource.$.descriptions.length?<Divider/>:null}
                    </div>
                </div>
                <div className="chart-marginTop">
                    <div className={yearProfitabilityIndicatorDataSource.$.dates.length?"":"hidden"}>
                        <YearChart symbol={this.props.symbol} notifyResultYear={this.props.notifyResultYear}/>
                        <TTMChart symbol={this.props.symbol} notifyResultTTM={this.props.notifyResultTTM}/>
                        <div>
                            <div style={this.styles.legendContent as any} className="legend-row">
                                <div>
                                    <img src="/images/legendIcon/redLine.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    毛利率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/orangeLine.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    净利率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/blueLine.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    净资产收益率
                                </span>
                                </div>
                            </div>
                            <div style={this.styles.legendContent as any} className="legend-marginTop legend-row">

                                <div>
                                    <img src="/images/legendIcon/redBar.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    行业毛利率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/orangeBar.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    行业净利率
                                </span>
                                </div>
                                <div>
                                    <img src="/images/legendIcon/blueBar.png" alt="" style={this.styles.legendIcon}/>
                                    <span>
                                    行业净资产收益率
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