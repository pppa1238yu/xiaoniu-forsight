import * as React from "react";
import {analystRankingDataSource} from "../../model/ajax/AnalystService";
import * as ECharts from "echarts";
import {Optional} from "../../model/entities/Optional";
import {AnalystRanking} from "../../model/entities/analyst/AnalystRanking";
import Explain from "../../components/common/Explain";

interface AnalystRankingProps {
    researcherId: string;
    small?:boolean;
}

export default class AnalystRankingView extends React.Component<AnalystRankingProps, null> {
    private chartDiv: HTMLDivElement;
    private chart: ECharts.ECharts;
    private windowResizeHandler: (e: Event) => void;
    private typeMapping = {
        //行业分析师维度
        value_discovery_scores: "牛股发现能力",
        performance_scores: "投资业绩",
        basic_abilities_scores: "学历资历",
        professionalism_scores: "专业水平",
        forecast_accuracy_scores: "预测准确度",
        //宏观分析师维度
        impact_scores: "市场影响力",
        seniority_scores: "资质资历",
        activity_degree_scores: "活跃度",
        team_background_scores: "团队背景",
        education_background_scores: " 教育背景"
    };
    private explain = {
        industryAnalyst: ["牛股发现能力：牛股比例、牛股平均收益率",
            "投资业绩（一年）：年化夏普率、年化相对收益率、成功率、最大回撤率",
            "学历资历：学历指标、工作年限指标",
            "专业水平：所就职券商的排名、获奖（新财富）次数、平均每家券商任职时长",
            "预测正确度：会计盈余（EPS）偏差"
        ],
        noIndustryAnalyst:[
            "市场影响力：获奖次数（新财富）",
            "资质资历：工作年限、平均每家券商任职时长",
            "活跃度：研报产量、社交媒体活跃度",
            "团队背景：所就职券商的排名",
            "教育背景：学历、本科学校（985/211/一般本科）"
        ]
    };
    private ifIndustry:boolean=false;

    styles = {
        container: {
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexFlow: 'column',
        },
        center: {
            textAlign: "center"
        }
    };

    constructor() {
        super();
        this.windowResizeHandler = e => this.resizeChart();
    }

    render() {
        let message=analystRankingDataSource.$.analyst_type==="industry_analyst"?this.explain.industryAnalyst:this.explain.noIndustryAnalyst;
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.center}>
                    <Explain message={message} toolTipPosition="bottom-center" toolTipWidth={this.props.small?"260px":"400px"}/>
                </div>
                <div
                    role="analystRankingView"
                    style={this.styles.container as any}
                    ref={element => this.chartDiv = element}>
                </div>
            </div>
        )
    }

    componentWillMount() {
    }

    componentDidUpdate() {
        this.drawAnalystRankingChart();
    }

    componentDidMount() {
        this.drawAnalystRankingChart();
    }

    resizeChart() {
        this.chart.resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    drawAnalystRankingChart() {
        if (!this.chart) {
            //1.生成K线图
            this.chart = ECharts.init(this.chartDiv);
            //2.关联k线图并绑定windows事件
            window.addEventListener('resize', this.windowResizeHandler)
        }
        let analystRatingOptional: Optional<AnalystRanking> = Optional.of(analystRankingDataSource.$);
        let indicator = [];
        let data: number[] = [];
        for (let type in this.typeMapping) {
            let v = analystRatingOptional.map(a => a[type]).orElse(null);
            if (v != null) {
                indicator.push({
                    name: this.typeMapping[type],
                    max: 10
                });
                data.push(v.toFixed(2));
            }
        }

        let option = {
            color: ["orange"],
            title: {
                text: analystRatingOptional.map(a => a.ranking).value == -999 ? "未评级" : analystRatingOptional.map(a => a.scores).orElse(0).toFixed(1),
                top: "center",
                left: 'center',
                textStyle: {
                    fontSize: 24,
                    fontWeight: 400,
                }
            },
            tooltip: { // 提示框组件
                trigger: 'item'// 触发类型 可选为：'axis' | 'item' | 'none'
            },
            radar: {
                indicator: indicator,
                radius: '60%'
            },
            series: [{
                name: '分析师综合评分',
                type: 'radar',
                symbol: 'none',
                areaStyle: {
                    normal: {
                        opacity: .4
                    }
                },
                data: [{
                    name: "分析师综合评分",
                    value: data
                }]
            }]
        };
        this.chart.setOption(option, true);
    }
}