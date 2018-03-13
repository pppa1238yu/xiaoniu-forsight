export class AnalystBaseInfo {
    //赵飞提供的分析师基本信息接口,欠缺follow状态,image_Id
    degree: string;
    gender: string;
    //honour: Map<String, number[]>;//如{"新财富":[2013,2014],"水晶球":[]}
    resume: string;
    //school: Map<String, String>;//如:{"武汉大学": "985"}
    analystId: string;
    //experince: Array<Map<String, String>>;//如: [{"海通证券股份有限公司": "五星级"},{"中山证券有限责任公司": "三星级"}]
    birth_year: string;
    certificate: string;
    analyst_name: string;
    professional_title: string;
    begin_security_year: number;
    last_got_date: Date;
}