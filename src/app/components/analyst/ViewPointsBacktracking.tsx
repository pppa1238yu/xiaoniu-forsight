import * as React from "react";
import {observer} from "mobx-react";
import * as ECharts from "echarts";
import {Optional} from "../../model/entities/Optional";
import {TimeWindowUnit} from "../../model/entities/TimeWindowUnit";
import TimeWindow from "../../model/entities/TimeWindow";
import CategoryTendency from "../../model/entities/category/CategoryTendency";
import {analystBaseInfoDataSource} from "../../model/ajax/AnalystService";
import {Researcher} from "../../model/entities/Researcher";
import * as moment from "moment";
import {http} from "../../model/ajax/Http";
import {observable} from "mobx";
import {AnalystViewCard} from "./AnalystViewPointList";
import Constants from "../../Constants";
import {Report} from "../../model/entities/Report";
import {grey700} from "material-ui/styles/colors";
interface Props {
    small: boolean;
    portrait: boolean;
    fixDrawer: boolean;
}

@observer
export default class ViewPointsBacktracking extends React.Component<Props, null> {
    private preViewpintInfoIndex;
    private timeWindow: TimeWindow = new TimeWindow(1, TimeWindowUnit.Year);
    private viewpointDiv: HTMLDivElement;
    private chartDiv: HTMLDivElement;
    private chart: ECharts.ECharts;
    private windowResizeHandler: (e: Event) => void;

    constructor() {
        super();
        this.windowResizeHandler = e => this.resizeChart();
    }

    @observable update = false;

    doUpdate() {
        this.update = !this.update;
    }

    viewpointInfo;

    render() {
        if (this.update) {
            //ignore
        }

        return (
            // style={{display: analystBaseInfoDataSource.loading ? "none" : "block"}}
            <div>
                <div>
                    <div role="chartOfBackView" style={{height: "320px"}}
                         ref={element => this.chartDiv = element}/>
                    {
                        this.viewpointInfo == null ? null :
                            <AnalystViewCard
                                small={this.props.small}
                                portrait={this.props.portrait}
                                fixDrawer={this.props.fixDrawer}
                                viewPoint={this.viewpointInfo}
                                depth={0}
                            />
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.drawChart();
    }

    resizeChart() {
        if (analystBaseInfoDataSource.loading || !this.chart) {
            return;
        }
        this.chart.resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    drawChart() {
        let researcher: Optional<Researcher> = Optional.of(analystBaseInfoDataSource.$).map(r => r.target);
        if (analystBaseInfoDataSource.loading || !researcher.value) {
            console.log("分析师基本信息loading状态，继续等待");
            return;
        }

        if (!this.chart) {
            //1.生成指数和研报散点
            this.chart = ECharts.init(this.chartDiv);
            //2.绑定windows事件
            window.addEventListener('resize', this.windowResizeHandler)
        }
        this.chart.showLoading();
        let industryCode: string = researcher.map(r => r.subTitle).map(t => t.industryCode).value;
        let industryName = researcher
            .map(r => r.subTitle)
            .map(t => t.typeName+"收益率")
            .orElse("未知行业");
        if (industryCode) {
            //如果行业id存在，则设置行业指数数据源
            this.drawIndustryAndScatter(industryCode, industryName);
        } else {
            //使用指数数据源
            this.drawIdxAndScatter();
        }

    }

    drawIndustryAndScatter(industryCode: string, industryName: string) {
        http.post("/industry/tendency.json", {
            industryCode,
            timeWindowValue: this.timeWindow.value,
            timeWindowUnit: TimeWindowUnit[this.timeWindow.unit].toUpperCase()
        }).then((tendency) => {
            let dataOptional: Optional<CategoryTendency> = Optional.of(tendency);
            let catagory = dataOptional.map(d => d.dates).orElse([]).map(v => moment(v).format("YYYY-MM-DD"));
            let idxData = dataOptional.map(d => d.indexes).orElse([]).map(v => v.toFixed(4));
            http.post("/analyst/viewPointsForChart.json", {
                analystId: analystBaseInfoDataSource.analystId,
                timeWindowValue: this.timeWindow.value,
                timeWindowUnit: TimeWindowUnit[this.timeWindow.unit].toUpperCase()
            }).then((viewpoints) => {
                //通过日期比较来生成散点位置
                viewpoints = viewpoints ? viewpoints : [];
                let scatter: Array<any> = [];
                let j = 0;
                for (let i = 0; i < viewpoints.length; i++) {
                    let date: Date = new Date(viewpoints[i].reportDate);
                    let hitIndex: number;
                    if (j == catagory.length) {
                        hitIndex = catagory.length - 1;
                    } else {
                        for (; j < catagory.length; j++) {
                            hitIndex = j;
                            let hitDate = new Date(catagory[j]);
                            if (hitDate.getTime() >= date.getTime()) {
                                break;
                            }
                        }
                    }
                    scatter.push([hitIndex, idxData[hitIndex], viewpoints[i]]);
                }
                //设置最后一个viewpoint为显示信息
                if (viewpoints.length) {
                    this.showViewPointInfo(viewpoints[viewpoints.length - 1]);
                }
                let dataZoom = this.chart.getOption() && this.chart.getOption().dataZoom ? this.chart.getOption().dataZoom : [
                    {
                        type: 'inside',
                        show: false,
                        xAxisIndex: [0],
                        startValue: idxData.length >= 120 ? idxData.length - 120 : 0,
                        endValue: idxData.length
                    }
                ];
                var option = {
                    legend: {
                        data: [industryName],
                        textStyle:{
                            color:grey700,
                            fontSize:14
                        },
                        itemWidth:0,
                        itemHeight:0,
                        selectedMode:false
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter:function (params) {
                            let content=params[0].name+"<br />";
                            for(let i=0,len=params.length;i<len;i++){
                                content+=params[i].seriesName+":"+(params[i].value?(params[i].value*100).toFixed(2)+"%<br />":"-<br />");
                            }
                            return content
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: catagory
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '收益率',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    dataZoom: dataZoom,
                    series: [
                        {
                            name: industryName,
                            type: 'line',
                            showSymbol: false,
                            data: idxData,
                        },
                        {
                            name: industryName,
                            type: 'scatter',
                            symbol: "pin",
                            symbolSize: 20,
                            data: scatter,
                            itemStyle: {
                                normal: {
                                    color: "#ffa800",
                                }
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {
                                    if (this.preViewpintInfoIndex == params.dataIndex) {
                                        return;
                                    }
                                    this.preViewpintInfoIndex = params.dataIndex
                                    this.showViewPointInfo(params.data[2])
                                    return '';
                                }
                            },
                        }
                    ]
                };
                this.chart.setOption(option, true);
                this.chart.hideLoading();
            });
        });
    }

    drawIdxAndScatter() {
        http.post("/quotation/summarys.json", {
            symbols: "IDX_000001",
            timeWindowValue: this.timeWindow.value,
            timeWindowUnit: TimeWindowUnit[this.timeWindow.unit].toUpperCase()
        }).then((homeTendency) => {
            if (!homeTendency || !homeTendency.length) {
                return;
            }
            let bars: Array<any> = Optional.of(homeTendency[0]).map(t => t.bars).orElse([]);
            let catagory: Array<string> = bars.map(b => b.tradingDate).map(v => moment(v).format("YYYY-MM-DD"));
            //K线图数据格式，open，close，low，high
            let idxData: Array<Array<number>> = bars.map(b => [b.openPrice, b.closePrice, b.lowestPrice, b.highestPrice]);
            http.post("/analyst/viewPointsForChart.json", {
                analystId: analystBaseInfoDataSource.analystId,
                timeWindowValue: this.timeWindow.value,
                timeWindowUnit: TimeWindowUnit[this.timeWindow.unit].toUpperCase()
            }).then((viewpoints) => {
                //通过日期比较来生成散点位置
                viewpoints = viewpoints ? viewpoints : [];
                let scatter: Array<any> = [];
                let j = 0;
                for (let i = 0; i < viewpoints.length; i++) {
                    let date: Date = new Date(viewpoints[i].reportDate);
                    let hitIndex: number;
                    if (j == catagory.length) {
                        hitIndex = catagory.length - 1;
                    } else {
                        for (; j < catagory.length; j++) {
                            hitIndex = j;
                            let hitDate = new Date(catagory[j]);
                            if (hitDate.getTime() >= date.getTime()) {
                                break;
                            }
                        }
                    }
                    scatter.push([hitIndex, idxData[hitIndex][3], viewpoints[i]]);
                }
                //设置最后一个viewpoint为显示信息
                if (viewpoints.length) {
                    this.showViewPointInfo(viewpoints[viewpoints.length - 1]);
                }

                let dataZoom = this.chart.getOption() && this.chart.getOption().dataZoom ? this.chart.getOption().dataZoom : [
                    {
                        type: 'inside',
                        show: false,
                        xAxisIndex: [0],
                        startValue: idxData.length >= 120 ? idxData.length - 120 : 0,
                        endValue: idxData.length,
                        minspan: 10,
                        maxSpan: 100
                    }
                ];
                let legend = "上证指数";
                var option = {
                    legend: {
                        data: [legend],
                        textStyle:{
                            color:grey700,
                            fontSize:14
                        },
                        itemWidth:0,
                        itemHeight:0,
                        selectedMode:false
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: (params) => {
                            let paramIndex = params[0].dataIndex;
                            let data = idxData[paramIndex];
                            let date = catagory[paramIndex];
                            return `<div>
                        <div class="center-align">${date}</div>
                        <span>开盘价:${data[0]}</span><br/>
                        <span>收盘价:${data[1]}</span><br/>
                        <span>最低价:${data[2]}</span><br/>
                        <span>最高价:${data[3]}</span>
                    </div>`
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: catagory
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            axisLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false
                            },
                            formatter: function (value) {
                                return (+value).toFixed(2);
                            }
                        }
                    ],
                    dataZoom: dataZoom,
                    series: [
                        {
                            name: legend,
                            type: 'candlestick',
                            showSymbol: false,
                            barMaxWidth: 10,
                            data: idxData,
                            itemStyle: {
                                normal: {
                                    color: Constants.colors.red,
                                    color0: Constants.colors.green,
                                    borderColor: null,
                                    borderColor0: null
                                }
                            }
                        },
                        {
                            name: "发表观点",
                            type: 'scatter',
                            symbol: "pin",
                            symbolSize: 20,
                            data: scatter,
                            itemStyle: {
                                normal: {
                                    color: "#ffa800",
                                }
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (params) => {
                                    if (this.preViewpintInfoIndex == params.dataIndex) {
                                        return;
                                    }
                                    this.preViewpintInfoIndex = params.dataIndex
                                    this.showViewPointInfo(params.data[2])
                                    return '';
                                }
                            },
                        }
                    ]
                };
                this.chart.setOption(option, true);
                this.chart.hideLoading();
            });
        });
    }

    showViewPointInfo(viewpointInfo: Report) {
        this.viewpointInfo = viewpointInfo;

        this.viewpointInfo.reportDate = new Date(this.viewpointInfo.reportDate);
        this.doUpdate();
        /*
        let optionalViewPoint = Optional.of(viewpointInfo);
        this.viewpointDiv.innerHTML =
            `
                <div>

                </div>
            `;
            `<div>
                <div class="inline">${optionalViewPoint.map(v => v.reportDate).orElse("-")}</div>
                <div class="inline overflow-hidden" title=${optionalViewPoint.map(v => v.title).orElse("-")}>${optionalViewPoint.map(v => v.title).orElse("-")}</div>
            </div>
            <div>
                <div class="inline"></div>
                <div class="inline overflow-hidden" title=${optionalViewPoint.map(v => v.summary).orElse("-")}>${optionalViewPoint.map(v => v.summary).orElse("-")}</div>
            </div>`
            */
    }
}