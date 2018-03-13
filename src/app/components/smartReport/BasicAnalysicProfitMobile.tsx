import * as React from "react";
import * as echarts from "echarts";
import Divider from 'material-ui/Divider';
import {
    yearProfitabilityIndicatorDataSource,
    ttmProfitabilityIndicatorDataSource
} from "../../model/ajax/SmartReportService";
import {NumberFormat} from "../../utils/NumberFormat"
import If from "../../components/common/If";
import Explain from "../common/Explain";
import Nodata from "../common/Nodata";

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
    private yearChartDiv3: HTMLDivElement;

    componentDidMount() {
        yearProfitabilityIndicatorDataSource.setNotifyResult(this.props.notifyResultYear);
        yearProfitabilityIndicatorDataSource.resetWithId(this.props.symbol);
        yearProfitabilityIndicatorDataSource.request(() => {
            drawChart(this.yearChartDiv1, yearProfitabilityIndicatorDataSource.$.operatingMarginRatios, yearProfitabilityIndicatorDataSource.$.industryOperatingMarginRatios, yearProfitabilityIndicatorDataSource.$.dates);
            drawChart(this.yearChartDiv2, yearProfitabilityIndicatorDataSource.$.operatingNetProfitToRevenues, yearProfitabilityIndicatorDataSource.$.industryOperatingNetProfitToRevenues, yearProfitabilityIndicatorDataSource.$.dates);
            drawChart(this.yearChartDiv3, yearProfitabilityIndicatorDataSource.$.roes, yearProfitabilityIndicatorDataSource.$.industryRoes, yearProfitabilityIndicatorDataSource.$.dates);
        });
    }

    render() {
        let dataSource = yearProfitabilityIndicatorDataSource.$;

        return (
            <div className="flexBoxSmall">
                <div>
                    <p><span className="mainColor">毛利率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div
                            className={dataSource.operatingMarginRatios.length > 0 || dataSource.industryOperatingMarginRatios.length > 0 ? "" : "hidden"}>
                            <div ref={element => {
                                this.yearChartDiv1 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>
                        <If condition={dataSource.operatingMarginRatios.length == 0 && dataSource.industryOperatingMarginRatios.length == 0}
                            block>
                            <Nodata/>
                        </If>
                    </div>

                </div>

                <div>
                    <p><span className="mainColor">净利率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div
                            className={dataSource.operatingNetProfitToRevenues.length > 0 || dataSource.industryOperatingNetProfitToRevenues.length > 0 ? "" : "hidden"}>
                            <div ref={element => {
                                this.yearChartDiv2 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>
                        <If condition={dataSource.operatingMarginRatios.length == 0 && dataSource.industryOperatingNetProfitToRevenues.length == 0}
                            block>
                            <Nodata/>
                        </If>
                    </div>

                </div>

                <div>
                    <p><span className="mainColor">净资产收益率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div
                            className={dataSource.roes.length > 0 || dataSource.industryRoes.length > 0 ? "" : "hidden"}>
                            <div ref={element => {
                                this.yearChartDiv3 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>
                        <If condition={dataSource.roes.length == 0 && dataSource.industryRoes.length == 0}
                            block>
                            <Nodata/>
                        </If>
                    </div>
                </div>

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
    private TTMChartDiv2: HTMLDivElement;
    private TTMChartDiv3: HTMLDivElement;

    componentDidMount() {
        ttmProfitabilityIndicatorDataSource.setNotifyResult(this.props.notifyResultTTM);
        ttmProfitabilityIndicatorDataSource.resetWithId(this.props.symbol);
        ttmProfitabilityIndicatorDataSource.request(() => {
            drawChart(this.TTMChartDiv1, ttmProfitabilityIndicatorDataSource.$.operatingMarginRatios, ttmProfitabilityIndicatorDataSource.$.industryOperatingMarginRatios, ttmProfitabilityIndicatorDataSource.$.dates);
            drawChart(this.TTMChartDiv2, ttmProfitabilityIndicatorDataSource.$.operatingNetProfitToRevenues, ttmProfitabilityIndicatorDataSource.$.industryOperatingNetProfitToRevenues, ttmProfitabilityIndicatorDataSource.$.dates);
            drawChart(this.TTMChartDiv3, ttmProfitabilityIndicatorDataSource.$.roes, ttmProfitabilityIndicatorDataSource.$.industryRoes, ttmProfitabilityIndicatorDataSource.$.dates);
        });
    }

    render() {
        let dataSource = ttmProfitabilityIndicatorDataSource.$;
        return (
            <div className="flexBoxSmall">
                <div>
                    <p><span className="mainColor">毛利率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div
                            className={dataSource.operatingMarginRatios.length > 0 || dataSource.industryOperatingMarginRatios.length > 0 ? "" : "hidden"}>
                            <div ref={element => {
                                this.TTMChartDiv1 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>
                        <If condition={dataSource.operatingMarginRatios.length == 0 && dataSource.industryOperatingMarginRatios.length == 0}
                            block>
                            <Nodata/>
                        </If>
                    </div>

                </div>

                <div>
                    <p><span className="mainColor">净利率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div
                            className={dataSource.operatingNetProfitToRevenues.length > 0 || dataSource.industryOperatingNetProfitToRevenues.length > 0 ? "" : "hidden"}>
                            <div ref={element => {
                                this.TTMChartDiv2 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>
                        <If condition={dataSource.operatingMarginRatios.length == 0 && dataSource.industryOperatingNetProfitToRevenues.length == 0}
                            block>
                            <Nodata/>
                        </If>
                    </div>

                </div>

                <div>
                    <p><span className="mainColor">净资产收益率</span> / 行业</p>
                    <div style={this.styles.borderBox}>
                        <div
                            className={dataSource.roes.length > 0 || dataSource.industryRoes.length > 0 ? "" : "hidden"}>
                            <div ref={element => {
                                this.TTMChartDiv3 = element;
                            }} style={this.styles.chartHeight as any}>
                            </div>
                        </div>
                        <If condition={dataSource.roes.length == 0 && dataSource.industryRoes.length == 0}
                            block>
                            <Nodata/>
                        </If>
                    </div>
                </div>

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

export default class BasicAnalysicProfitMobile extends React.Component<BasicAnalysisProps, any> {
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
                        {this.props.title}
                        <Explain
                            message="图表反映了个股和所在行业的净资产收益率、毛利率、净利率的历史变化情况，既可以纵向比较个股盈利水平变动，也可以比较个股和行业中值，确定公司在行业中的竞争地位。"
                            toolTipPosition="bottom-center"
                            toolTipWidth="260px"
                        />
                    </div>
                    <div>

                        <div className="verdictSmall">
                            {yearProfitabilityIndicatorDataSource.$.descriptions.map((e, index) => {
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