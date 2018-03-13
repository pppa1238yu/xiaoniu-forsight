import * as React from "react";
import Header from "../../components/common/Header";
class CommonText  extends React.Component<null,null>  {
    styles={
        contactBox: {
            marginTop: "100px",
            marginBottom: 0
        }
    };
    render(){
        return (
            <div>
                <div>
                    <p>我们能为你提供：</p>
                    <p>
                        1、宽松工时：早9：00到晚6：00，周末出去嗨；
                    </p>
                    <p>
                        2、公司氛围；管理扁平，开放自由，悄悄告诉你，公司平均年龄都是90后哦。
                    </p>
                    <p>
                        3、学习材料：配备各种杂志、轻小说等学习材料；想看什么给你买什么。
                    </p>
                    <p>
                        4、团队建设：各种形式的腐败活动，（攀登、密室逃脱、真人cs、射箭等等等等）这些当然是公司买单咯。
                    </p>
                    <p>
                        5、健康关怀：每年一次免费的专业机构身体检查；大病小病统统不见。
                    </p>
                    <p>
                        6、五险一金；这必须是标配啦。
                    </p>
                    <p>
                        7、强身健体；每周二和每周四，公司为你提供免费的羽毛球和乒乓球场地。要是你喜欢篮球、足球、瑜伽。你只需要说，剩下的交给我们。
                    </p>
                    <p>
                        8、节日福利；逢年过节有什么？公司给你送福利。情人节的玫瑰、端午节的粽子、国庆节的红包。种种福利，让你过节玩开心。
                    </p>
                    <p>
                        9、生日惊喜；当你入职的时候就会填写生日愿望，接下来你要做的就是等待生日的惊喜。
                    </p>
                    <p>
                        10、其他福利：不定时无理由福利炸弹。想吃什么零食，想喝什么饮料，没问题，大胆的跟行政妹子说，每月都会根据你的要求变换不同种类。
                    </p>
                </div>
                <div style={this.styles.contactBox}>
                    <p>联系电话：028-84735332&nbsp;&nbsp;18008084492</p>
                    <p>
                        简历投递邮箱：luhong@calfdata.com&nbsp;&nbsp;wangxin@calfdata.com
                    </p>
                </div>
            </div>
        )
    }
}
export default class JoinUs extends React.Component<any, null> {
    static path = "/JoinUs";
    styles = {
        backImg: {
            position: 'relative',
            backgroundImage: "url('/images/joinUs.png')"
        },
        contentMarginTop: {
            marginTop: "40px"
        },
        contentBoxPadding: {
            padding: "36px 63px"
        },
        navFont: {
            textAlign: "center"
        },
        contentTitle: {
            marginBottom: "36px",
            marginTop: "36px"
        },
        nullContent: {
            textAlign: "center"
        }
    };

    render() {
        return (
            <div style={{paddingTop: "53px"}}>
                <header style={this.styles.backImg as any}>
                    <Header index="3"/>
                    <p>期待你的加入</p>
                </header>
                <div className="container" style={this.styles.contentMarginTop}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-2">
                            <ul className="nav nav-pills nav-stacked" style={this.styles.navFont}>
                                <li className="ad-nav-item active">
                                    <a href="#PM" data-toggle="tab">
                                        产品经理
                                    </a>
                                </li>
                                <li className="ad-nav-item"><a href="#marketingAssistant" data-toggle="tab">市场助理</a></li>
                                <li className="ad-nav-item"><a href="#productDirector" data-toggle="tab">产品总监</a></li>
                                <li className="ad-nav-item"><a href="#SeniorFrontend" data-toggle="tab">高级前端工程师</a></li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-sm-10 ad-content-marginTop">
                            <div className="tab-content">
                                <div className="dashBorder ad-content-padding tab-pane fade in active" id="PM">
                                    <div>
                                        <p>岗位职责：</p>
                                        <p>负责公司产品产品前端需求分析与交互设计；</p>
                                        <p>负责前端开发部门与 UI 设计部门的对接工作；</p>
                                    </div>
                                    <div>
                                        <p>要求：</p>
                                        <p>本科及以上学历，两年及以上互联网产品经理相关工作经验；</p>
                                        <p>精通 material design 等常用设计语言及相应实现效果；</p>
                                        <p>熟悉数据库、编程语言、网络相关常见概念与基本应用场景；</p>
                                        <p>具备良好的逻辑思维能力与团队协作能力；</p>
                                        <p>计算机及相关专业优先，有金融大数据从业经验优先。</p>
                                    </div>
                                    <CommonText/>
                                </div>
                                <div className="dashBorder ad-content-padding tab-pane fade" id="marketingAssistant">
                                    <div>
                                        <p>岗位职责：</p>
                                        <p>协助市场部完成营销推广相关执行工作，包括线上推广或线下活动。</p>
                                        <p>协助市场部完成会议记录、部门管理文件整理等工作。</p>
                                        <p>独立完成简单跨部门沟通。</p>
                                        <p>领导交办其他事宜。</p>
                                    </div>
                                    <div>
                                        <p>任职要求：</p>
                                        <p>市场营销、公关传播、中文等本科及以上学历。</p>
                                        <p>在学校积极参加各类活动，有良好的沟通应变。</p>
                                        <p>有一定的文案撰写能力和策划能力；能吃苦耐劳、学习能力强。</p>
                                        <p>有投资、理财意识优先。</p>
                                        <p>要求6月中旬到岗。</p>
                                    </div>
                                    <CommonText/>
                                </div>
                                <div className="dashBorder ad-content-padding tab-pane fade" id="productDirector">
                                    <div>
                                        <p>我们需要你来了以后：</p>
                                        <p>1、从战略层面深化与拓展公司产品理念与方向；</p>
                                        <p>2、主导产品的整体功能设计、升级等工作，持续完善产品功能；</p>
                                        <p>3、与技术团队协同不断提升产品用户体验；</p>
                                        <p>4、对产品市场推广、商业合作、销售策略提出建议；</p>
                                        <p>5、主导新产品方向探索和规划；</p>
                                        <p>6、负责产品团队人才管理及规划，持续优化产品团队结构。</p>
                                    </div>
                                    <div>
                                        <p>我们希望你：</p>
                                        <p>
                                            1、五年以上互联网全职产品工作经验，完整负责过互联网产品从无到有迭代的整个生命周期；
                                        </p>
                                        <p>
                                            2、具备丰富的与优秀技术团队协同的合作经验；
                                        </p>
                                        <p>
                                            3、熟悉 fintech 领域国内外政策与产品生态，有在 fintech 类型公司任高级产品职务的优先；
                                        </p>
                                        <p>
                                            4、既富有创意又注重实证，思维敏锐，逻辑严密；
                                        </p>
                                    </div>
                                    <CommonText/>
                                </div>
                                <div className="dashBorder ad-content-padding tab-pane fade" id="SeniorFrontend">
                                    <div>
                                        <p>我们希望你来了以后：</p>
                                        <p>负责界面设计，前端开发。</p>
                                        <p>改进产品易用性，提高人机交互的效率。</p>
                                        <p>配合后端Java团队完成项目集成。</p>
                                        <p>参与web前沿新技术的学习应用及交互效果的研究。</p>
                                        <p>编写相关技术文档。</p>
                                    </div>
                                    <div>
                                        <p>我们需要这样的你：</p>
                                        <p>三年以上专职前端项目经验。</p>
                                        <p>熟练掌握HTML5和CSS3，能实现带动画特效的UI；擅长页面布局，熟悉Bootstrap。</p>
                                        <p>精通JavaScript(ES5, ES6, ES7), TypeScript。</p>
                                        <p>熟悉浏览器所有底层Javascript API，对主流浏览器之间的不兼容性有丰富的经验。</p>
                                        <p>了解jQuery。</p>
                                        <p>精通React, AngularJS或Angular2框架中的至少一种，对其有运行原理有所了解，能设计可重用UI组件。</p>
                                        <p>至少熟悉一种JS的图表库。</p>
                                        <p>熟悉百度FIS3或其它项目构建工具。</p>
                                        <p>勤奋上进，时刻紧跟最新的前端技术和设计思想。</p>
                                    </div>
                                    <CommonText/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}