export class AnalystRanking {
    //赵飞提供的分析师综合评级接口,用于雷达图
    constructor(public ranking: number = -999,
                public diligency_scores: number = 0,
                public performance_scores: number = 0,
                public basic_abilities_scores: number = 0,
                public professionalism_scores: number = 0,
                public forecast_accuracy_scores: number = 0,
                public institution: string = '',
                public analyst_name: string = '',
                public analyst_type: string = '') {
    }
}