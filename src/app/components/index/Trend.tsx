import * as React from "react";
import * as echarts from "echarts";


class TrendProps {
    bars: Array<any>;
}

export default class Trend extends React.Component<TrendProps, null> {
    componentDidMount() {
        if(this.props.bars==undefined){
            return
        }
        let dates = this.props.bars.map((value) => {
            if(value)return value.tradingDate
        });
        let prices = this.props.bars.map((value) => {
            if(value)return value.closePrice || value.cnyToUsd
        });
        let chart = echarts.init(this.chartDiv);
        chart.setOption({
            color: ['#AAA'],
            grid: {
                top: 0,
                bottom: 0,
                left:0
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: dates,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    scale: true
                }
            ],
            series: [
                {
                    name: '股价',
                    type: 'line',
                    data: prices,
                    showSymbol: false
                    // showAllSymbol: true
                }
            ]
        });
        this.windowResizeHandler = e => chart.resize();
        window.addEventListener("resize", this.windowResizeHandler);
    }

    private chartDiv: HTMLDivElement;
    private windowResizeHandler: (e: Event) => void;

    componentWillUnmount(): void {
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
        }
    };

    render(): JSX.Element {
        return (
            <div className="keep-aspect-ratio aspect-1-of-4">
                <div ref={element => {
                    this.chartDiv = element;
                }} className="aspect-target"/>
                <div style={this.styles.cursor as any}/>
            </div>
        );
    }
}