import * as React from "react";
import * as echarts from "echarts";
import  {stockTrendDataSource} from "../../model/ajax/StockTrendDataSource";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";

@observer
export default class StockTrend extends React.Component<any, null> {
    private chartDiv: HTMLDivElement;
    private chart: echarts.ECharts;
    private windowResizeHandler: (e: Event) => void;

   @observable negative = 1;
   @observable positive = 1;

    constructor() {
        super();
        this.windowResizeHandler = e => this.resizeChart();
    }

    resizeChart() {
        this.chart.resize();
    }

    drawChart = () => {
        if (!this.chartDiv) {
            return; //原始的DOM对象不存在，或者数据不存在，画个毛
        }
        if (!this.chart) {
            //1.生成K线图
            this.chart = echarts.init(this.chartDiv);
            //2.关联k线图并绑定windows事件
            window.addEventListener('resize', this.windowResizeHandler)
        }
        this.chart.setOption({
            series: [
                {
                    name: '',
                    type: 'gauge',
                    axisLine: {
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 6
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 5,
                        length: 0,        // 属性length控制线长
                        lineStyle: {        // 属性lineStyle控制线条样式
                            color: '#e6e6e6'
                        }
                    },
                    pointer: {
                        width: 2
                    },
                    splitLine: {           // 分隔线
                        length: 6,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: '#e6e6e6'
                        }
                    },
                    detail: {
                        formatter: '{value}%',
                        textStyle:{
                            fontSize:20
                        }
                    },
                    data: [{value: (this.positive / (this.negative + this.positive) * 100).toFixed(1)}]
                }
            ]
        });
    };

    componentDidUpdate() {
        // this.drawChart();
    }

    componentDidMount() {
        stockTrendDataSource.setNotifyResult(this.props.notifyResult);
        stockTrendDataSource.request(() => {
            if (stockTrendDataSource.$.length) {
                runInAction(() => {
                    this.negative = stockTrendDataSource.$[0].negative;
                    this.positive = stockTrendDataSource.$[0].positive;
                });
            }
            this.drawChart();
        });
    }

    componentWillMount() {
        stockTrendDataSource.setMount(true);
    }

    componentWillUnmount(): void {
        stockTrendDataSource.setMount(false);
        this.chart.dispose();
        window.removeEventListener("resize", this.windowResizeHandler);
    }

    styles = {
        cursor: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 10,
            cursor: 'pointer',
        },
        titleStyle: {
            boxSizing: 'borderBox',
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '48px',
            paddingLeft: '16px',
            width: '100%',
            position: 'relative',
            margin: 0
        },
        flexBox: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        titleFont: {
            fontSize: 14,
            color: '#646464',
            paddingLeft: '0px',
            padding: 'none'
        },
        upStyle: {
            fontSize: 24,
            color: '#da1207',
            lineHeight: '40px',
            margin: 0,
            fontWeight: '600'
        },
        downStyle: {
            fontSize: 24,
            color: '#099b15',
            lineHeight: '40px',
            margin: 0,
            fontWeight: '600'
        }
    };

    render() {

        let trend = null;
        if (this.negative > this.positive) {
            trend = (<p style={this.styles.downStyle as any}>看空</p>)
        } else {
            trend = (<p style={this.styles.upStyle as any}>看涨</p>)
        }
        if (this.negative == 1 && this.positive == 1) {
            trend = (<p style={this.styles.upStyle as any}>未评级</p>)
        }
        return (
            <div style={{background: '#fff', marginBottom: 6, minHeight: 292}} data-icon="local1">
                {
                    this.props.small ? "" : <p style={this.styles.titleStyle as any}>股民舆情指数</p>
                }
                <div style={this.styles.flexBox as any} id="trendBox">
                    <div style={{minWidth: 240, width: '45%', flexGrow: 1}}>
                        <div ref={element => {
                            this.chartDiv = element;
                        }} style={{height: 240}}/>
                    </div>
                    <div style={this.props.small ? {textAlign: 'center', flexGrow: 1} : {
                        textAlign: 'center',
                        flexGrow: 1,
                        padding: '0 40px 50px 0',
                        boxSizing: 'border-box'
                    }}>
                        <div>
                            <p style={this.styles.titleFont as any}>市场舆论偏向</p>
                            {trend}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}