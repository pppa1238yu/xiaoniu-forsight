import * as React from "react";
import {observer} from "mobx-react";
import * as echarts from "echarts";
import {
    CategoryTendencyRefDataSource,
    IndustryTendencyRefDataSource,
    SubjectTendencyRefDataSource
} from "../../model/ajax/CategoryService";
import TimeWindow from "../../model/entities/TimeWindow";
import CircularProgress from "material-ui/CircularProgress";
import {CategoryInfo} from "../../model/entities/category/CategoryInfo";
import {observable} from "mobx";
import {CategoryType} from "../../model/entities/category/CategoryType";
import {FixLoading} from "../common/Loading";

interface CategoryTendencyProps {
    categoryType: CategoryType;
    categoryInfo: CategoryInfo;
    timeWindow: TimeWindow;
    small?: boolean;
}

@observer
export class CategoryTendencyView extends React.Component<CategoryTendencyProps, null> {

    @observable
    private readonly categoryTendencyRefDataSource: CategoryTendencyRefDataSource;

    private chartDiv: HTMLDivElement;

    private windowResizeHandler: (e: Event) => void;

    private chart;

    constructor(props: CategoryTendencyProps) {
        super(props);
        if (this.props.categoryType == CategoryType.Subject) {
            this.categoryTendencyRefDataSource = new SubjectTendencyRefDataSource(this.props.timeWindow);
        } else {
            this.categoryTendencyRefDataSource = new IndustryTendencyRefDataSource(this.props.timeWindow);
        }
        this.categoryTendencyRefDataSource.identifier = this.props.categoryInfo.code;
        this.categoryTendencyRefDataSource.refresh();
    }

    render(): JSX.Element {
        let loadingVisibility = this.categoryTendencyRefDataSource.loading ? "visible" : "hidden";
        let chartVisibility = this.categoryTendencyRefDataSource.$.dates.length ? "visible" : "hidden";
        return (
            <div className={this.props.small ? "keep-aspect-ratio aspect-2-of-3" : "keep-aspect-ratio aspect-1-of-3"}>

                <div className="aspect-target" style={{visibility: loadingVisibility}}>
                    {
                        this.categoryTendencyRefDataSource.loading ?
                            <FixLoading/> :
                            null
                    }
                </div>
                <div ref={element => {
                    this.chartDiv = element;
                }} className="aspect-target" style={{visibility: chartVisibility, overflow: 'hidden'}}>
                </div>
            </div>
        );
    }

    componentDidMount(): void {

        if (this.chartDiv == null) {
            return;
        }

        this.chart = echarts.init(this.chartDiv);
        this.windowResizeHandler = e => this.chart.resize();
        window.addEventListener("resize", this.windowResizeHandler);
    }

    componentWillUpdate() {
        let xAxisMapper: (Date) => string;
        /*if (this.categoryTendencyRefDataSource.$.dates.length <= 365) {
         xAxisMapper = date => date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
         } else {
         xAxisMapper = date => date.getFullYear() + '-' + (date.getMonth() + 1);
         }*/
        xAxisMapper = date => date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        let startDate = this.categoryTendencyRefDataSource.$.dates[0];
        let legibleIndustryName = this.props.categoryInfo.name + "行业规模走势";
        let legibleIndustryNameLegend = {name:legibleIndustryName,icon:"image://images/legendIcon/areaIcon.png"};

        this.chart.setOption({
            color: ['#ff0000', '#ffaf34', '#99ccff'],
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
            axisPointer: {
                link: {xAxisIndex: 'all'}
            },
            grid: [
                {
                    top: 40,
                    bottom: "50%"
                },
                {
                    top: '60%',
                    bottom: 40
                }
            ],
            legend: {
                data: ['行业价格指数涨跌幅','沪深300涨跌幅',  legibleIndustryNameLegend]
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: this.categoryTendencyRefDataSource.$.dates.map(xAxisMapper),
                    axisLine: {
                        lineStyle: {
                            color: "#95989a"
                        }
                    }
                },
                {
                    type: 'category',
                    boundaryGap: false,
                    data: this.categoryTendencyRefDataSource.$.dates.map(xAxisMapper),
                    gridIndex: 1,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
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
                    min: 'dataMin',
                    max: 'dataMax',
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
                    }

                },
                {
                    type: 'value',
                    name:"单位(亿)",
                    nameLocation:"start",
                    max: 'dataMax',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true
                    },
                    splitLine: {
                        show: false
                    },
                    gridIndex: 1,

                }
            ],
            series: [
                {
                    name: '行业价格指数涨跌幅',
                    type: 'line',
                    data: this.categoryTendencyRefDataSource.$.indexes.map(value => value.toFixed(4)),
                },
                {
                    name: '沪深300涨跌幅',
                    type: 'line',
                    data: this.categoryTendencyRefDataSource.$.sh300Indexes.map(value => value.toFixed(4)),
                },
                {
                    name: legibleIndustryName,
                    type: 'line',
                    data: this.categoryTendencyRefDataSource.$.marketValues.map(value => (value/100000000).toFixed(2)),
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    areaStyle: {
                        normal: {
                            color: "#99ccff"
                        }
                    }
                }
            ]
        });
    }

    componentWillUnmount(): void {
        if (this.windowResizeHandler) {
            window.removeEventListener("resize", this.windowResizeHandler);
        }
    }
}
