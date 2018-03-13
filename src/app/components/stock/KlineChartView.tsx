/**
 * Created by shangxingyu on 17-5-12.
 */
import * as React from "react";
import {observer} from "mobx-react";
import {Tab, Tabs} from "material-ui/Tabs";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import RaisedButton from "material-ui/RaisedButton";
import {
    klineDayDataSource,
    KlineGraphDataSource,
    klineMonthDataSource,
    klineWeekDataSource
} from "../../model/ajax/KlineService";
import * as ECharts from "echarts";
import {Kline} from "../../model/entities/Kline";
import {KlineType} from "../../model/entities/KlineType";
import {FormatNum, NumberFormat} from "../../utils/NumberFormat";
import {observable} from "mobx";
import SwipeableViews from "react-swipeable-views";
import {DataSourceProps, ReloadableComponent} from "../base/ReloadableComponent";
import {FixLoading} from "../common/Loading";
import Constants from "../../Constants";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    red300,
    red500,
    yellow600
} from "material-ui/styles/colors";

enum KlineTabType {
    TIMESHARING,//分时图
    FIVEDAY_TIMESHARING,//5日分时图
    DAY_KLINE,//日K
    WEEK_KLINE,//周K
    MONTH_KLINE//月K
}


interface KlineChartViewProps {
    symbol: string;
    isIdx?: boolean;
    isHome?: boolean;
    small?: boolean;
}
@observer
export default class KlineChartView extends React.Component<KlineChartViewProps, null> {
    //K线图包含分时图和K线图
    @observable private selectedTab: KlineTabType=KlineTabType.DAY_KLINE;

    private selectKlineType: KlineType = KlineType.FOWARDADJ_DAY;
    private dayKlineView: KlineView;
    private weekKlineView: KlineView;
    private monthKlineView: KlineView;

    render() {
        const styles = {
            width: {
                display: "inline-block",
                width: 'none',
                marginRight: 10,
            },
            iconStyle: {
                marginRight: 4,
                marginTop:2,
                width: 14,
                height: 14,
            },
            labelStyle: {
                width: "80%",
                whiteSpace: "nowrap",
            },
            buttonContainer: {
                paddingTop: 20,
                paddingBottom: 20,
            },
            container: {
                position: 'relative',
            },
            inkBarStyle: {
                backgroundColor:red500
            },
            labelColor: {
                color:'#616161',
                borderBottom:'1px solid #ccc',
                height:36
            },
            buttonStyle: {
                height:36
            },

        };
        return (
            <div style={styles.container as any}>
                <Tabs
                    inkBarStyle = {styles.inkBarStyle}
                    tabItemContainerStyle={{backgroundColor:'#fff'}}
                    onChange={(value) => {
                                       this.selectedTab = value;
                                       }} value={this.selectedTab}>
                    <Tab
                        role="dayKline"
                        style={styles.labelColor}
                        buttonStyle = {styles.buttonStyle}
                        label="日K" value={KlineTabType.DAY_KLINE}/>
                    <Tab
                        role="weekKline"
                        style={styles.labelColor}
                        buttonStyle = {styles.buttonStyle}
                        label="周K" value={KlineTabType.WEEK_KLINE}/>
                    <Tab
                        role="monthKline"
                        style={styles.labelColor}
                        buttonStyle = {styles.buttonStyle}
                        label="月K" value={KlineTabType.MONTH_KLINE}/>
                </Tabs>
                <div>
                    <div className="flex-center" style={styles.buttonContainer}>
                        {this.props.isIdx || this.props.small ?
                            <div></div>
                            :
                            (
                            <div>
                                <RadioButtonGroup name="kline" defaultSelected={KlineType.FOWARDADJ_DAY}
                                                  onChange={(e, value) => {
                                                      if (this.selectKlineType != value) {
                                                          this.selectKlineType = value;
                                                          this.repaintChart();
                                                      }
                                                  }}>
                                    <RadioButton style={styles.width} iconStyle={styles.iconStyle}
                                                 labelStyle={styles.labelStyle} value={KlineType.FOWARDADJ_DAY}
                                                 label="前复权"
                                                 role="forwardButton"/>
                                    <RadioButton style={styles.width} iconStyle={styles.iconStyle}
                                                 labelStyle={styles.labelStyle} value={KlineType.DAY}
                                                 label="不复权"
                                                 role="realPriceButton"/>
                                    <RadioButton style={styles.width} iconStyle={styles.iconStyle}
                                                 labelStyle={styles.labelStyle} value={KlineType.BACKWARDADJ_DAY}
                                                 label="后复权"
                                                 role="backwardButton"/>
                                </RadioButtonGroup>
                            </div>
                            )
                        }
                        {this.props.small ? <div></div> :
                            <div className="auto-right">
                                <RaisedButton label="拉长K线" role="elongatedKLineButton"
                                              onTouchTap={e => this.zoomChart(true)}/>
                                <RaisedButton label="缩短K线" role="shortenedKLineButton"
                                              style={{marginLeft: "6px"}}
                                              onTouchTap={e => this.zoomChart(false)}/>
                            </div>
                        }
                    </div>
                    <div className="auto-right">
                        <SwipeableViews
                            index={this.selectedTab-2}
                            onChangeIndex={index => {
                                this.selectedTab = index+2;
                            }}>
                            <div>
                                <KlineView dataSource={klineDayDataSource} isIdx={this.props.isIdx}
                                           small={this.props.small}
                                           ref={element => this.dayKlineView = element}/>
                            </div>
                            <div>
                                <KlineView dataSource={klineWeekDataSource} isIdx={this.props.isIdx}
                                           small={this.props.small}
                                           ref={element => this.weekKlineView = element}/>
                            </div>
                            <div>
                                <KlineView dataSource={klineMonthDataSource} isIdx={this.props.isIdx}
                                           small={this.props.small}
                                           ref={element => this.monthKlineView = element}/>
                            </div>
                        </SwipeableViews>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        this.repaintChart();
    }

    componentDidMount() {
        this.repaintChart();
    }

    zoomChart(zoomIn: boolean) {
        this.getKlineView().zoomChart(zoomIn);
    }

    getKlineView() {
        switch (this.selectedTab) {
            case KlineTabType.DAY_KLINE:
                return this.dayKlineView;
            case KlineTabType.WEEK_KLINE:
                return this.weekKlineView;
            case KlineTabType.MONTH_KLINE:
                return this.monthKlineView;
            case KlineTabType.TIMESHARING:
                return null;
            case KlineTabType.FIVEDAY_TIMESHARING:
                return null;
        }
    }

    getKlineType() {
        if (this.props.isIdx) {
            if (this.props.isHome === null) {
                return null;
            }
            if (this.props.isHome) {
                return this.selectedTab + 7;
            } else {
                return this.selectedTab + 10;
            }
        } else {
            return (this.selectedTab - 2) * 3 + this.selectKlineType;
        }
    }

    repaintChart() {
        let klineType: KlineType = this.getKlineType();
        let chartView = this.getKlineView();
        if (chartView instanceof KlineView && klineType === null) {
            return;
        }
        chartView.reloadData({klineType: KlineType[klineType], stockCode: this.props.symbol});
    }


}

enum SubChartType {
    VOLUMN,//成交量
    MACD,
    KDJ,
    RSI
}

interface KlineViewProps extends DataSourceProps<Array<Kline>, KlineGraphDataSource> {
    isIdx: boolean;
    small?: boolean;
}
@observer
class KlineView extends ReloadableComponent<Array<Kline>, KlineGraphDataSource, KlineViewProps, null> {
    @observable private maDatas: { ma5: number | string, ma10: number | string, ma30: number | string, ma60: number | string } = {
        ma5: '-',
        ma10: '-',
        ma30: '-',
        ma60: '-'
    };
    @observable private measures: {
        subChartType: SubChartType,
        blurChart: boolean,
        macdValue: number | string, deaValue: number | string, difValue: number | string,
        kValue: number | string, dValue: number | string, jValue: number | string,
        rsi6Value, rsi12Value, rsi24Value
    } = {
        subChartType: SubChartType.VOLUMN,
        blurChart: true,
        macdValue: "-", deaValue: "-", difValue: "-",
        kValue: "-", dValue: "-", jValue: "-",
        rsi6Value: "-", rsi12Value: "-", rsi24Value: "-"
    };
    private subChartType: SubChartType = SubChartType.VOLUMN;
    private chartDiv: HTMLDivElement;
    private subChartDiv: HTMLDivElement;
    private chart: ECharts.ECharts;
    private subChart: ECharts.ECharts;
    private zoomSplit: Array<number> = [30, 60, 120, 200, 300];//分段范围
    private windowResizeHandler: (e: Event) => void;
    private colors = Constants.colors;
    private chartGroup = "klineChartGroup";
    private klineDatas: { catagory, values, ma5, ma10, ma30, ma60, volumns, macd, dea, dif, k, d, j, rsi6, rsi12, rsi24 };

    constructor() {
        super();
        this.windowResizeHandler = e => this.resizeChart();
        //2.关联k线图并绑定windows事件
        window.addEventListener('resize', this.windowResizeHandler)
    }

    styles = {
        inkBarStyle: {
            backgroundColor:red500
        },
        labelColor: {
            color:'#616161',
            borderBottom:'1px solid  #ccc',
            height:36
        },
        buttonStyle: {
            height:36
        },
    }
    render() {
        return (
            <div>
                <div
                     style={{display: this.props.dataSource.loading ? "block" : "none"}}>
                    <FixLoading/>
                </div>
                <div style={{display: this.props.dataSource.loading ? "none" : "block"}}>
                    {this.props.small ? <div/> : <MaDetailBar maDatas={this.maDatas} colors={this.colors.lines}/>}
                    <div style={{height: "250px"}}
                         ref={element => this.chartDiv = element}></div>
                    <MeasureDetailBar measures={this.measures} colors={this.colors.lines}></MeasureDetailBar>
                    <div style={{height: "130px"}}
                         ref={element => this.subChartDiv = element}></div>
                    {this.props.small ? null :
                        <Tabs
                            tabItemContainerStyle={{backgroundColor:'#fff'}}
                            inkBarStyle = {this.styles.inkBarStyle}
                            value={this.subChartType} onChange={(value) => {
                            this.subChartType = value;
                            this.drawSubChart();
                        }}>
                            <Tab
                                role="成交量"
                                style={this.styles.labelColor}
                                buttonStyle = {this.styles.buttonStyle}
                                label="成交量" value={SubChartType.VOLUMN}/>
                            <Tab
                                role="MACD"
                                style={this.styles.labelColor}
                                buttonStyle = {this.styles.buttonStyle}
                                label="MACD" value={SubChartType.MACD}/>
                            <Tab
                                role="KDJ"
                                style={this.styles.labelColor}
                                buttonStyle = {this.styles.buttonStyle}
                                label="KDJ" value={SubChartType.KDJ}/>
                            <Tab
                                role="RSI"
                                style={this.styles.labelColor}
                                buttonStyle = {this.styles.buttonStyle}
                                label="RSI" value={SubChartType.RSI}/>
                        </Tabs>
                    }
                </div>

            </div>
        )
    }

    resizeChart() {
        if (this.props.dataSource.loading) {
            return;
        }
        if (this.chart) {
            this.chart.resize();
            this.subChart.resize();
        }
    }

    componentDidUpdate() {
        if (this.props.dataSource.loading) {
            return;
        }
        this.klineDatas = this.splitData(this.props.dataSource.$);
        if (!this.chart) {
            //1.生成K线图
            this.chart = ECharts.init(this.chartDiv);
            this.chart.group = this.chartGroup;
            this.subChart = ECharts.init(this.subChartDiv);
            this.subChart.group = this.chartGroup;
            this.subChart.on("globalout",(params)=>this.onBlurMeasureStatus());
            ECharts.connect(this.chartGroup);
        }
        this.drawKlineChart();
        this.drawSubChart();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    zoomChart(zoomIn: boolean) {
        if (!this.chart || this.props.dataSource.loading) {
            return;
        }
        let option = this.chart.getOption();
        if (option) {
            let dataZoom = option.dataZoom[0];
            let catagory = option.xAxis.data||option.xAxis[0].data;
            //非放大即缩小
            let {startValue, endValue} = dataZoom;
            let nextSplit = endValue - startValue;
            let filterdSplit: number[] = this.zoomSplit.filter(s => zoomIn ? s - 10 > nextSplit : s < nextSplit);
            //放大时减10是避免出现差距只有几个时放大效果不明显
            if (filterdSplit.length > 0) {
                nextSplit = zoomIn ? filterdSplit[0] : filterdSplit[filterdSplit.length - 1];
                //以zoom end为准,往前展开
                startValue = endValue - nextSplit;
                if (startValue < 0) {
                    startValue = 0;
                    endValue = Math.min(startValue + nextSplit, catagory.length);
                }
                dataZoom.start = undefined;
                dataZoom.end = undefined;
                dataZoom.startValue = startValue;
                dataZoom.endValue = endValue;
                this.chart.setOption({dataZoom});
                this.subChart.setOption({dataZoom});
            }
        }
    }

    drawKlineChart() {
        //1.生成K线数据,均线数据等
        this.resizeChart();
        let {catagory, values, ma5, ma10, ma30, ma60, volumns, macd, dea, dif, k, d, j, rsi6, rsi12, rsi24} = this.klineDatas;
        this.setMaStatus(ma5[ma5.length - 1], ma10[ma10.length - 1], ma30[ma30.length - 1], ma60[ma60.length - 1]);
        let setMastatus = (ma5Value, ma10Value, ma20Value, ma30Value) => this.setMaStatus(ma5Value, ma10Value, ma20Value, ma30Value);
        let isIdx = this.props.isIdx;
        let klines = this.props.dataSource.$;
        const colors = this.colors;
        //2.生成option并显示数据
        let series: Array<any> = [{
            name: 'k线图',
            type: 'candlestick',
            data: values,
            barMaxWidth: 10,
            itemStyle: {
                normal: {
                    color: this.colors.red,
                    color0: this.colors.green,
                    borderColor: null,
                    borderColor0: null
                }
            }
        },

            {
                name: 'MA5',
                type: 'line',
                data: ma5,
                smooth: true,
                lineStyle: {
                    normal: {
                        color: colors.lines[0],
                        width: 1
                    }
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: ma10,
                smooth: true,
                lineStyle: {
                    normal: {
                        color: colors.lines[1],
                        width: 1
                    }
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: ma30,
                smooth: true,
                lineStyle: {
                    normal: {
                        color: colors.lines[2],
                        width: 1
                    }
                }
            }, {
                name: 'MA60',
                type: 'line',
                data: ma60,
                smooth: true,
                lineStyle: {
                    normal: {
                        color: colors.lines[3],
                        width: 1
                    }
                }
            }];

        let dataZoom = this.chart.getOption() ? this.chart.getOption().dataZoom :
            {
                type: 'inside',
                show: false,
                startValue: values.length >= this.zoomSplit[2] ? values.length - this.zoomSplit[2] : 0,
                endValue: values.length
            };
        this.chart.setOption({
            animation: true,
            legend: {
                show: false,
                bottom: 10,
                left: 'center',
                data: ['k线图', 'MA5', 'MA10', 'MA30', 'MA60']
            },
            toolbox: {
                show: false
            },
            axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                    backgroundColor: '#777'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderColor: '#ccc',
                textStyle: {
                    color: '#000'
                },
                padding: [2, 5],
                extraCssText: 'margin-top: 1px;border-radius: 0',
                position: function (pos, params, el, elRect, size) {
                    var obj = {top: 10};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                },
                formatter: function (params) {
                    function getSpanElement(lableName: string, value: number | string, ifRedColor: boolean | null = null) {
                        let color = ({
                            'true': colors.green,
                            'false': colors.red,
                            'null': '#333'
                        })["" + ifRedColor];
                        return `
                            ${lableName}<span style="display: inline-block;width: 5em;color: ${color};text-align: right">${value}</span><br/>
                        `;
                    }

                    //格式:0开盘价,1收盘价,2最低价,3最高价,4成交量,5成交额,6涨跌,7涨跌幅,8换手率
                    let dataIndex = params[0].dataIndex;
                    setMastatus(ma5[dataIndex], ma10[dataIndex], ma30[dataIndex], ma60[dataIndex]);
                    //由于是联动,指向图上部分时和指向图下部分时返回的数据顺序不一样
                    let kline = klines[dataIndex];
                    let yesterdayClose = dataIndex > 0 ? klines[dataIndex - 1].close : 0
                    let tradeVolume = new FormatNum(kline.volume);
                    let tradeAmount = new FormatNum(kline.amount);
                    let trunRateTemplate = isIdx ? `` : `${getSpanElement('换手率', NumberFormat.getPercentageStyle(kline.trunRate))}`;
                    return `
                        <div style="font-size: small">
                        <div class="center-align" style={{fontSize: 8}}>${kline.date + '&nbsp;' + ['日', '一', '二', '三', '四', '五', '六'][new Date(kline.date).getDay()]}</div>
                        <hr size=1 style="margin: 2px 0"/>
                        ${getSpanElement('开盘价', kline.open.toFixed(2), kline.open - yesterdayClose < 0)}
                        ${getSpanElement('最高价', kline.high.toFixed(2), kline.high - yesterdayClose < 0)}
                        ${getSpanElement('最低价', kline.low.toFixed(2), kline.low - yesterdayClose < 0)}
                        ${getSpanElement('收盘价', kline.close.toFixed(2), kline.close - yesterdayClose < 0)}
                        ${getSpanElement('成交量', tradeVolume.value.toFixed(2) + tradeVolume.unit)}
                        ${getSpanElement('成交额', tradeAmount.value.toFixed(2) + tradeAmount.unit)}
                        ${getSpanElement('涨跌幅', NumberFormat.getPercentageStyle(kline.changeRatio), kline.changeRatio < 0)}
                        ${trunRateTemplate}
                        </div>
                    `;
                }
            },
            grid: {
                left: 60,
                right: 20,
                top: 10,
                bottom: 20
            },
            xAxis: {
                type: 'category',
                data: catagory,
                scale: true,
                boundaryGap: false,
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20
            },
            yAxis: {
                scale: true,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                splitNumber: 3,
                axisLabel: {
                    formatter: function (value) {
                        return (+value).toFixed(2);
                    }
                }
            },
            dataZoom,
            series
        }, true);
    }

    drawSubChart() {
        let {catagory, values, ma5, ma10, ma30, ma60, volumns, macd, dea, dif, k, d, j, rsi6, rsi12, rsi24} = this.klineDatas;
        //初始化子图
        let dataZoom = this.chart.getOption() ? this.chart.getOption().dataZoom :
            {
                type: 'inside',
                show: false,
                startValue: values.length >= this.zoomSplit[2] ? values.length - this.zoomSplit[2] : 0,
                endValue: values.length
            };
        let grid = this.chart.getOption() ? this.chart.getOption().grid : {
            left: 60,
            right: 20,
            top: 10,
            bottom: 20
        };
        let subChartSeries = [];
        switch (this.subChartType) {
            case SubChartType.VOLUMN:
                subChartSeries.push(
                    {
                        name: 'volumn',
                        type: 'bar',
                        barMaxWidth: 10,
                        data: volumns
                    });
                break;
            case SubChartType.MACD:
                subChartSeries.push(
                    {
                        name: 'dif',
                        type: 'line',
                        data: dif,
                        smooth: true,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[0],
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'dea',
                        type: 'line',
                        data: dea,
                        smooth: true,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[1],
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'macd',
                        type: 'bar',
                        data: macd,
                        smooth: true,
                        barMaxWidth: 10,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[2],
                                width: 1
                            }
                        }
                    }
                );
                break;
            case SubChartType.KDJ:
                subChartSeries.push(
                    {
                        name: 'k',
                        type: 'line',
                        data: k,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[0],
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'd',
                        type: 'line',
                        data: d,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[1],
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'j',
                        type: 'line',
                        data: j,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[2],
                                width: 1
                            }
                        }
                    }
                );
                break;
            case SubChartType.RSI:
                subChartSeries.push(
                    {
                        name: 'rsi6',
                        type: 'line',
                        data: rsi6,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[0],
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'rsi12',
                        type: 'line',
                        data: rsi12,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[1],
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'rsi24',
                        type: 'line',
                        data: rsi24,
                        lineStyle: {
                            normal: {
                                color: this.colors.lines[2],
                                width: 1
                            }
                        }
                    }
                );
                break;
        }
        this.subChart.setOption({
            animation: true,
            legend: {
                show: false,
            },
            toolbox: {
                show: false
            },
            axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                    backgroundColor: '#777'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => this.setMeasureStatus(params)
            },
            grid,
            xAxis: {
                scale: true,
                show: false,
                type: 'category',
                data: catagory,
                boundaryGap: false,
                splitLine: {show: false},
                splitNumber: 20
            },
            yAxis: {
                scale: true,
                splitNumber: 2,
                axisLabel: {
                    formatter: function (value) {
                        let v: FormatNum = new FormatNum(value,['1e10','1e8', '1e6', '1e4','1']);
                        return (+v.value).toFixed(2) + v.unit;
                    }
                },
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            },
            dataZoom: dataZoom,
            series: subChartSeries
        }, true);
        this.onBlurMeasureStatus();
    }

    setMaStatus(ma5Value: number | string, ma10Value: number | string, ma30Value: number | string, ma60Value: number | string) {
        this.maDatas.ma5 = ma5Value;
        this.maDatas.ma10 = ma10Value;
        this.maDatas.ma30 = ma30Value;
        this.maDatas.ma60 = ma60Value;
    }
    onBlurMeasureStatus(){
        this.measures.subChartType = this.subChartType;
        this.measures.blurChart = true;
    }
    setMeasureStatus(params) {
        let dataIndex = params[0].dataIndex;
        let kline = this.props.dataSource.$[dataIndex];
        this.measures.subChartType = this.subChartType;
        this.measures.blurChart = false;
        this.measures.macdValue = kline.macd;
        this.measures.deaValue = kline.dea;
        this.measures.difValue = kline.dif;
        this.measures.kValue = kline.k;
        this.measures.dValue = kline.d;
        this.measures.jValue = kline.j;
        this.measures.rsi6Value = kline.rsi6;
        this.measures.rsi12Value = kline.rsi12;
        this.measures.rsi24Value = kline.rsi24;
    }

    splitData(datas: Array<Kline>) {
        let catagory: Array<Date> = [];
        let ma5: Array<string> = [];
        let ma10: Array<string> = [];
        let ma30: Array<string> = [];
        let ma60: Array<string> = [];
        let volumns: Array<any> = [];
        let values: number[][] = [];
        let macd: Array<any> = [];
        let dea: Array<number> = [];
        let dif: Array<number> = [];
        let k: Array<number> = [];
        let d: Array<number> = [];
        let j: Array<number> = [];
        let rsi6: Array<number> = [];
        let rsi12: Array<number> = [];
        let rsi24: Array<number> = [];
        datas.forEach((kline, i) => {
            catagory.push(kline.date);
            volumns.push({
                value: kline.volume,
                itemStyle: {
                    normal: {
                        color:  kline.close >kline.open||(kline.close==kline.open&&(i==0||kline.open>datas[i-1].close)) ? this.colors.red : this.colors.green
                    }
                }
            });
            //格式:0开盘价,1收盘价,2最低价,3最高价,4成交量,5成交额,6涨跌,7涨跌幅,8换手率
            if(kline.close==kline.open&&(i==0||kline.open>datas[i-1].close)){
                //加小数点为了将跳空涨停的K线变为红色
                values.push([kline.open, kline.close+0.00001, kline.low, kline.high]);
            }else{
                values.push([kline.open, kline.close, kline.low, kline.high]);
            }
            macd.push({
                value: kline.macd,
                itemStyle: {
                    normal: {
                        color: kline.macd < 0 ? this.colors.green : this.colors.red
                    }
                }
            });
            dea.push(kline.dea);
            dif.push(kline.dif);
            k.push(kline.k);
            d.push(kline.d);
            j.push(kline.j);
            rsi6.push(kline.rsi6);
            rsi12.push(kline.rsi12);
            rsi24.push(kline.rsi24);
            //5日均线
            if (i < 5) {
                ma5.push('-');
            } else {
                ma5.push((datas.slice(i - 5, i).map((k) => k.open).reduce((pre, cur) => {
                    return pre + cur;
                }) / 5).toFixed(3))
            }
            //10日均线
            if (i < 10) {
                ma10.push('-');
            } else {
                ma10.push(((parseFloat(ma5[i]) + parseFloat(ma5[i - 5])) / 2).toFixed(3));
            }
            //30日均线
            if (i < 30) {
                ma30.push('-');
            } else {
                ma30.push(((parseFloat(ma10[i]) + parseFloat(ma10[i - 10]) + parseFloat(ma10[i - 20])) / 3).toFixed(3));
            }
            //60日均线
            if (i < 60) {
                ma60.push('-');
            } else {
                ma60.push(((parseFloat(ma30[i]) + parseFloat(ma30[i - 30])) / 2).toFixed(3));
            }
        });
        return {catagory, values, ma5, ma10, ma30, ma60, volumns, macd, dea, dif, k, d, j, rsi6, rsi12, rsi24};
    }
}
interface TradeDetailBarProps {
    maDatas: { ma5: number | string, ma10: number | string, ma30: number | string, ma60: number | string };
    colors: Array<string>;
}
@observer
class MaDetailBar extends React.Component<TradeDetailBarProps, null> {
    render() {
        return (
            <div style={{fontSize: 'small',marginLeft:"3em"}}>
                <span style={{color: this.props.colors[0]}}>MA5:{this.props.maDatas.ma5}&nbsp;</span>
                <span style={{color: this.props.colors[1]}}>MA10:{this.props.maDatas.ma10}&nbsp;</span>
                <span style={{color: this.props.colors[2]}}>MA30:{this.props.maDatas.ma30}&nbsp;</span>
                <span style={{color: this.props.colors[3]}}>MA60:{this.props.maDatas.ma60}</span>
            </div>
        )
    }
}
interface MeasureDetailBarProps {
    measures: {
        subChartType: SubChartType,
        blurChart: boolean,
        macdValue: number | string, deaValue: number | string, difValue: number | string,
        kValue: number | string, dValue: number | string, jValue: number | string,
        rsi6Value, rsi12Value, rsi24Value
    };
    colors: Array<string>;
}
@observer
class MeasureDetailBar extends React.Component<MeasureDetailBarProps, null> {
    render() {
        let result = null;
        if (this.props.measures.blurChart) {
            switch (this.props.measures.subChartType) {
                case SubChartType.VOLUMN:
                    result = <div><span>&nbsp;</span></div>
                    break;
                case SubChartType.MACD:
                    result = <span>MACD(12,26,9)</span>
                    break;
                case SubChartType.KDJ:
                    result = <span>KDJ(9,3,3)</span>
                    break;
                case SubChartType.RSI:
                    result = <span>RSI(6,12,24)</span>
                    break;
            }
        } else {
            switch (this.props.measures.subChartType) {
                case SubChartType.VOLUMN:
                    result = <div><span>&nbsp;</span></div>
                    break;
                case SubChartType.MACD:
                    result = <div>
                        <span style={{color: this.props.colors[0]}}>DIF:{this.props.measures.difValue}&nbsp;</span>
                        <span style={{color: this.props.colors[1]}}>DEA:{this.props.measures.deaValue}&nbsp;</span>
                        <span style={{color: this.props.colors[2]}}>MACD:{this.props.measures.macdValue}</span>
                    </div>
                    break;
                case SubChartType.KDJ:
                    result = <div>
                        <span style={{color: this.props.colors[0]}}>K:{this.props.measures.kValue}&nbsp;</span>
                        <span style={{color: this.props.colors[1]}}>D:{this.props.measures.dValue}&nbsp;</span>
                        <span style={{color: this.props.colors[2]}}>J:{this.props.measures.jValue}</span>
                    </div>
                    break;
                case SubChartType.RSI:
                    result = <div>
                        <span style={{color: this.props.colors[0]}}>RSI6:{this.props.measures.rsi6Value}&nbsp;</span>
                        <span style={{color: this.props.colors[1]}}>RSI12:{this.props.measures.rsi12Value}&nbsp;</span>
                        <span style={{color: this.props.colors[2]}}>RSI24:{this.props.measures.rsi24Value}</span>
                    </div>
                    break;
            }
        }
        return (
            <div style={{fontSize: 'small',marginLeft:"3em"}}>
                {result}
            </div>
        )
    }
}