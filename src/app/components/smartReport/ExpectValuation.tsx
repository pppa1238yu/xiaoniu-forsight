import * as React from "react";
import * as echarts from "echarts";
import {stockEvaluationExpectionDataSource} from "../../model/ajax/SmartReportService";
import Explain from "../common/Explain";


interface ExpectValuationProps {
    symbol: string;
    notifyResult: (any) => void;
    small?:boolean;
}
export default class ExpectValuation extends React.Component<ExpectValuationProps, any> {
    styles = {
        chartHeight: {
            width: "1170px",
            height: "240px"
        },
        chartHeightSmall:{
            width: "100%",
            height: "240px"
        },
        legendContent: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#95989a",
            paddingLeft: "40px",
            paddingRight: "40px"
        },
        legendContentSmall: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#95989a",
        },
        legendIcon: {
            height: "20px",
            verticalAlign: "bottom",
            marginRight: "5px"
        }
    };
    private chartDiv: HTMLDivElement;
    numberHandle(data){
        return data.map(e=>{
            if(e!=null){
                return e.toFixed(2)
            }else{
                return null
            }
        })
    }
    drawChart(chartDiv, data) {
        let industryTargetPEs=[];
        if(data.industryTargetPE){
            data.dates.map((e)=>{
                if(e.indexOf(data.currentYear)!==-1){//行业一致性预测线从当前年份开始绘制
                    industryTargetPEs.push(data.industryTargetPE.toFixed(2));
                }else{
                    industryTargetPEs.push(null);
                }
            });
        }

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
            color: ["#ff6600", '#006eff', '#ff0000'],
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
                    axisLabel: {
                        show: true
                    },
                    splitLine: {
                        show: false
                    },
                    scale:true
                }
            ],
            series: [
                {
                    name: data.name + '(PE)',
                    type: 'line',
                    data: this.numberHandle(data.stockPEs),
                    showSymbol: false
                },
                {
                    name: data.industryName + '行业均值(PE)',
                    type: 'line',
                    data: this.numberHandle(data.industryPEs),
                    showSymbol: false
                },
                {
                    name: '行业一致预测',
                    type: 'line',
                    data: industryTargetPEs,
                    showSymbol: false
                }
            ]
        };
        echarts.init(chartDiv).setOption(option);
    }

    componentDidMount() {
        stockEvaluationExpectionDataSource.setNotifyResult(this.props.notifyResult);
        stockEvaluationExpectionDataSource.resetWithId(this.props.symbol);
        stockEvaluationExpectionDataSource.request(() => {
            this.drawChart(this.chartDiv, stockEvaluationExpectionDataSource.$);
        })
    }

    render() {
        return (
            <div role="expectValuation">
                <div>
                    <div className="title boldText">
                        预期估值分析
                        {this.props.small?
                            <Explain message="市盈率（TTM）行业一致性预期是指最近一年内，分析师给出的该行业当年的市盈率指标平均值，代表了行业总体预期。一般而言，公司当前市盈率（TTM）高于当年的行业一致性预期，则有可能当前估值处于被市场高估的状态；此外图中还给出个股和所在行业实际的市盈率（TTM）走势，以便对比。"
                                     toolTipWidth="260px"
                                     toolTipPosition="bottom-center"
                            />
                            :<Explain message="市盈率（TTM）行业一致性预期是指最近一年内，分析师给出的该行业当年的市盈率指标平均值，代表了行业总体预期。一般而言，公司当前市盈率（TTM）高于当年的行业一致性预期，则有可能当前估值处于被市场高估的状态；此外图中还给出个股和所在行业实际的市盈率（TTM）走势，以便对比。"/>}
                    </div>
                    <div>
                        <div className={this.props.small?"normalFont":"verdict small-padding"}>
                            {stockEvaluationExpectionDataSource.$.descriptions?stockEvaluationExpectionDataSource.$.descriptions.map((e,index)=>{
                                return <p key={index} className="textMargin">{e}</p>
                            }):"暂无数据"}
                        </div>
                    </div>
                </div>
                <div className={stockEvaluationExpectionDataSource.$.dates.length?"":"hidden"}>
                    <div ref={element => {
                        this.chartDiv = element;
                    }} style={this.props.small?this.styles.chartHeightSmall:this.styles.chartHeight as any}>
                    </div>
                    <div>
                        <div style={this.props.small?this.styles.legendContentSmall:this.styles.legendContent as any}>
                            <div>
                                <img src="/images/legendIcon/orangeLine.png" alt="" style={this.styles.legendIcon}/>
                                <span>
                                    {stockEvaluationExpectionDataSource.$.name}(PE)
                                </span>
                            </div>
                            <div>
                                <img src="/images/legendIcon/blueLine.png" alt="" style={this.styles.legendIcon}/>
                                <span>
                                    {this.props.small?"":stockEvaluationExpectionDataSource.$.industryName}行业均值(PE)
                                </span>
                            </div>
                            <div>
                                <img src="/images/legendIcon/red_row_line.png" alt="" style={this.styles.legendIcon}/>
                                <span>
                                    行业一致预测
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}