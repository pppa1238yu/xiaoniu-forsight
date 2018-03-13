import * as React from "react";
import * as echarts from "echarts";
import Divider from 'material-ui/Divider';
import {
    yearGrowthIndicatorDataSource,
    ttmGrowthIndicatorDataSource,
    stockEvaluationHistoryDataSource
} from "../../model/ajax/SmartReportService";
import {NumberFormat} from "../../utils/NumberFormat"
import If from "../../components/common/If";
import Explain from "../common/Explain";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";

function numberHandle(data) {
    return data.map((e) => {
        if (e !== null) {
            return (e * 100).toFixed(2)
        } else {
            return null
        }
    })
}

function drawChart(chartDiv, data1, data2, dates) {
    let showIndex = [];
    dates = dates.slice().map( item => item.replace("-","/").split('-')[0]);

    let option = {
        title: {},
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}',
        },
        xAxis: {
            show: true,
            type: 'category',
            splitLine: {show: false},
            axisLine:{show:false},
            axisTick:{show:false},
            data: dates.slice()
        },
        grid: {
            left: '0%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            show: false,
            type: 'value',
        },
        series: [
            {
                name: '营业',
                type: 'line',
                lineStyle: {
                    normal: {
                        color: '#ed7d31',
                        type: 'dotted'
                    }
                },
                data: numberHandle(data1),
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        formatter: '<span className="boldText">{c}</span>'
                    }
                }
            },
            {
                name: '行业',
                type: 'line',
                lineStyle: {
                    normal: {
                        color: '#787271',
                        type: 'dotted'
                    }
                },
                data: numberHandle(data2),
            }
        ]
    };
    echarts.init(chartDiv).setOption(option);
}

interface ChartProps {
    symbol: string;
    notifyResultTTM?: (any) => void;
    notifyResultYear?: (any) => void;
    small?: boolean;
}
class YearChart extends React.Component<ChartProps, any> {
    styles = {
        chartHeight: {
            height: "120px"
        },
        borderBox: {
            border: '1px solid #ccc'
        }
    };
    private yearChartDiv1: HTMLDivElement;
    private yearChartDiv2: HTMLDivElement;
    // private yearChartDiv3: HTMLDivElement;
    @observable isNull = [true,true];

    componentDidMount() {
        yearGrowthIndicatorDataSource.setNotifyResult(this.props.notifyResultYear);
        yearGrowthIndicatorDataSource.resetWithId(this.props.symbol);
        yearGrowthIndicatorDataSource.request(() => {
            drawChart(this.yearChartDiv1, yearGrowthIndicatorDataSource.$.totalRevenueGrowthRates, yearGrowthIndicatorDataSource.$.industryTotalRevenueGrowthRates, yearGrowthIndicatorDataSource.$.dates);
            drawChart(this.yearChartDiv2, yearGrowthIndicatorDataSource.$.totalAssetsGrowthRates, yearGrowthIndicatorDataSource.$.industryTotalAssetsGrowthRates, yearGrowthIndicatorDataSource.$.dates);
        });
    }

    render() {
        let datasource = yearGrowthIndicatorDataSource.$;
        datasource.totalRevenueGrowthRates.map( item => {
           if(item != null)this.isNull[0] = false;
        });
        datasource.industryTotalRevenueGrowthRates.map( item => {
            if(item != null)this.isNull[0] = false;
        });
        datasource.totalAssetsGrowthRates.map( item => {
            if(item != null)this.isNull[1] = false;
        });
        datasource.industryTotalAssetsGrowthRates.map( item => {
            if(item != null)this.isNull[1] = false;
        });

        return (
            <div className="flexBoxSmall">
                <div>
                    <p><span className="mainColor">营业收入</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div>
                            <div ref={element => {
                                this.yearChartDiv1 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>

                    </div>

                </div>

                <div>
                    <p><span className="mainColor">总资产增长率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div ref={element => {
                            this.yearChartDiv2 = element;
                        }} style={this.styles.chartHeight as any}>
                        </div>
                    </div>

                </div>

                {/*<div>*/}
                    {/*<p><span className="mainColor">净利润</span> / 行业</p>*/}
                    {/*<div style={this.styles.borderBox}>*/}
                        {/*<div ref={element => {*/}
                            {/*this.yearChartDiv3 = element;*/}
                        {/*}} style={this.styles.chartHeight as any}>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

            </div>
        )
    }
}

class TTMChart extends React.Component<ChartProps, any> {
    styles = {
        chartHeight: {
            height: "120px"
        },
        borderBox: {
            border: '1px solid #ccc'
        },
        inPlace: {
            height: 29.6
        }
    };
    private TTMChartDiv1: HTMLDivElement;
    // private TTMChartDiv2: HTMLDivElement;
    // private TTMChartDiv3: HTMLDivElement;

    componentDidMount() {
        ttmGrowthIndicatorDataSource.setNotifyResult(this.props.notifyResultTTM);
        ttmGrowthIndicatorDataSource.resetWithId(this.props.symbol);
        ttmGrowthIndicatorDataSource.request(() => {
            drawChart(this.TTMChartDiv1, ttmGrowthIndicatorDataSource.$.totalRevenueGrowthRates, ttmGrowthIndicatorDataSource.$.industryTotalRevenueGrowthRates, ttmGrowthIndicatorDataSource.$.dates);
            // drawChart(this.TTMChartDiv2, ttmGrowthIndicatorDataSource.$.totalAssetsGrowthRates, ttmGrowthIndicatorDataSource.$.industryTotalAssetsGrowthRates, ttmGrowthIndicatorDataSource.$.dates);
        });
    }

    render() {
        return (
            <div className="flexBoxSmall">
                <div>
                    <p><span className="mainColor">营业收入</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div ref={element => {
                            this.TTMChartDiv1 = element;
                        }} style={this.styles.chartHeight as any}>
                        </div>
                    </div>

                </div>

                {/*<div>*/}
                    {/*<p><span className="mainColor">营业利润</span> / 行业</p>*/}
                    {/*<div style={this.styles.borderBox}>*/}
                        {/*<div ref={element => {*/}
                            {/*this.TTMChartDiv2 = element;*/}
                        {/*}} style={this.styles.chartHeight as any}>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                {/*</div>*/}

                {/*<div>*/}
                    {/*<p><span className="mainColor">净利润</span> / 行业</p>*/}
                    {/*<div style={this.styles.borderBox}>*/}
                        {/*<div ref={element => {*/}
                            {/*this.TTMChartDiv3 = element;*/}
                        {/*}} style={this.styles.chartHeight as any}>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

            </div>
        )
    }
}


interface BasicAnalysisProps {
    title: string;
    symbol: string;
    notifyResultYear?: (any) => void;
    notifyResultTTM?: (any) => void;
    small?: boolean;
}

export default class BasicAnalysicMobile extends React.Component<BasicAnalysisProps, any> {
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
                        {this.props.title} <Explain message={this.explainText} toolTipWidth="260px" toolTipPosition="bottom-center"/>
                    </div>
                    <div>
                        <div className="verdictSmall">
                            {yearGrowthIndicatorDataSource.$.descriptions.map((e, index) => {
                                return <p key={index} className="textMargin">{e}</p>
                            })}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="fullItem">
                        <p className="benifitCenter boldText">年度</p>
                        <YearChart symbol={this.props.symbol} notifyResultYear={this.props.notifyResultYear}/>
                    </div>
                    <div className="fullItem">
                        <p className="benifitCenter boldText">TTM(Trailing Twelve Month)</p>
                        <TTMChart symbol={this.props.symbol} notifyResultTTM={this.props.notifyResultTTM}/>
                    </div>
                </div>
            </div>
        )
    }
}