import * as React from "react";
import Header from "../../components/common/Header";

export default class Helps extends React.Component<any, null> {
    static path = "/helps";
    styles = {
        backImg: {
            position: 'relative',
            backgroundImage: "url('/images/helps-banner.png')"
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
            textAlign: "center",
            marginBottom: "36px",
            marginTop:"36px"
        },
        nullContent:{
            textAlign: "center"
        }
    };

    render() {
        return (
            <div style={{paddingTop: "53px"}}>
                <header style={this.styles.backImg as any}>
                    <Header index="4"/>
                    <p>帮助中心</p>
                </header>
                <div className="container" style={this.styles.contentMarginTop}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-2">
                            <ul className="nav nav-pills nav-stacked" style={this.styles.navFont}>
                                {/*<li className="nav-item">
                                    <a href="#guide" data-toggle="tab">
                                        新手指引
                                    </a>
                                </li>
                                <li className="nav-item"><a href="#FAQ" data-toggle="tab">常见问题</a></li>*/}
                                <li className="nav-item active"><a href="#law" data-toggle="tab">法律声明</a></li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-sm-10">
                            <div className="tab-content">
                                {/*<div className="dashBorder content-box-padding tab-pane fade" id="guide">
                                    <p style={this.styles.nullContent} className="null-content">暂无内容</p>
                                </div>

                                <div className="dashBorder content-box-padding tab-pane fade" id="FAQ">
                                    <p style={this.styles.nullContent} className="null-content">暂无内容</p>
                                </div>*/}
                                <div className="dashBorder content-box-padding tab-pane fade in active" id="law">
                                    <p style={this.styles.contentTitle}>免责声明</p>
                                    <p>
                                        鉴于小牛数据以非人工检索方式、根据您键入的关键字自动生成到第三方网页的链接，除小牛数据注明之服务条款外，
                                        其他一切因使用小牛数据而可能遭致的意外、疏忽、侵权及其造成的损失（包括因下载被搜索链接到的第三方网站内容而感染电脑病毒），
                                        小牛数据对其概不负责，亦不承担任何法律责任。
                                    </p>
                                    <p>
                                        任何通过使用小牛数据而搜索链接到的第三方网页均系他人制作或提供，您可能从该第三方网页上获得资讯及享用服务，小牛数据对其合法性概不负责，亦不承担任何法律责任。
                                    </p>
                                    <p>
                                        您应该对使用搜索引擎的结果自行承担风险。小牛数据不做任何形式的保证：不保证搜索结果满足您的要求，不保证搜索服务不中断，
                                        不保证搜索结果的安全性、正确性、及时性、合法性。因网络状况、通讯线路、第三方网站等任何原因而导致您不能正常使用小牛数据，
                                        小牛数据不承担任何法律责任。
                                    </p>
                                    <p style={this.styles.contentTitle}>使用条款</p>
                                    <p>
                                        任何用户在使用小牛数据提供的服务之前，均应仔细阅读本声明，用户可选择不使用小牛数据的服务，一旦使用，即被视为对本声明全部内容的认可和接受。
                                    </p>
                                    <p>
                                        任何通过小牛数据搜索引擎技术和服务所得的搜索结果链接的网页，以及网页中之所有内容，均系该网页所属第三方网站的所有者制作和提供（以下简称"第三方网页"）。
                                        该等搜索结果和第三方网页均系搜索引擎技术自动搜录所得，并不是也不反映小牛数据之任何意见和主张，也不表示小牛数据同意或支持该等第三方网页上的任何内容、主张或立场。
                                        小牛数据对第三方网页中内容之合法性、准确性、真实性、适用性、安全性等概不负责，也无法负责。
                                    </p>
                                    <p>
                                        任何单位或个人如需要第三方网页中内容（包括资讯、资料、消息、产品或服务介绍、报价等），并欲据此进行交易或其他行为前，
                                        应慎重辨别这些内容的合法性、准确性、真实性、实用性和安全性（包括下载第三方网页中内容是否会感染电脑病毒），
                                        并采取谨慎的预防措施。如您不确定这些内容是否合法、准确、真实、实用和安全，小牛数据建议您先咨询专业人士。
                                    </p>
                                    <p style={this.styles.contentTitle}>隐私权声明</p>
                                    <p>
                                        cookie主要的功能是便于您使用网站产品和/或服务，以及帮助网站统计独立访客数量等。运用cookie技术，
                                        小牛数据能够为您提供更加周到的个性化服务，并允许您设定您特定的服务选项。
                                    </p>
                                    <p>
                                        当您使用小牛数据产品或服务时，会向您的设备发送cookie。
                                    </p>
                                    <p>
                                        您可以选择拒绝 cookie。您可以通过修改浏览器设置的方式拒绝cookie。如果您选择拒绝cookie，则您可能无法登录或使用依赖于cookie 的小牛数据服务或功能。
                                    </p>
                                    <p>
                                        以上数据信息都采用匿名的方式。同时，我们也会对信息采取加密处理，保证信息的安全性。
                                    </p>
                                    <p style={this.styles.contentTitle}>版权归属</p>
                                    <p>
                                        本网站（<a href="https://www.calfdata.com" target="_blank">www.calfdata.com</a>）所有的产品、技术与所有程序均属于小牛数据知识产权，在此并未授权。“calfdata”、“小牛数据”及相关图形等为小牛数据的注册商标。
                                    </p>
                                    <p>
                                        未经小牛数据许可，任何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上载、下载）使用，或通过非常规方式（如：恶意干预小牛的数据）影响小牛数据的正常服务，
                                        任何人不得擅自以软件程序自动获得小牛提供的数据。否则，小牛数据将依法追究法律责任。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
