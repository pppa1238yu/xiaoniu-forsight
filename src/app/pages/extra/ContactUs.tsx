import * as React from "react";
import Header from "../../components/common/Header";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {Util} from "../../Constants";
declare let $;

export default class ContactUs extends React.Component<any, null> {
    static path = "/contactUs";

    pop = false;

    widthNotifier: WidthNotifier = null;

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        if (this.props.history.action == 'POP') {
            this.pop = true;
            //don't restore
        }
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
    }

    styles = {
        backImg: {
            position:'relative',
            backgroundImage:"url('/images/bannerConnect.png')"
        },
        ulStyle: {
            display:'block',
            padding: '28px 40px',
            position: 'relative',
            listSyle: 'disc',
            width:325,
            margin:'auto'
        },
        spanStyle:{
            display:'inline-block',
            width:'50px',
            fontSize:'14px',
            marginTop:'16px',
            color:'#969696'
        },
        labelStyle:{
            cursor:'pointer'
        },
        imgStyle:{
            width:'250px',
            height:'250px'
        },
        imgStyleMobile:{
            width:'100px',
            height:'100px'
        },
        flexStyle:{
            display:'flex',
            justifyContent:'space-around',
            padding:'20px 0'
        },
        centerStyle:{
            textAlign:'center',
            fontSize:'24px',
            padding:'20px 0'
        }
    };
    render () {
        let small = Util.small(this.widthNotifier.device);

        return(
            <div style={{paddingTop:53}}>
                <header style={this.styles.backImg as any}>
                    <Header index="5"/>
                    <p>联系Calf Data</p>

                </header>
                <div>
                    <ul style={this.styles.ulStyle as any}>
                        <li  className="outerStyle">
                            市场合作
                            <br/>
                            <ul style={{listStyle:'none',paddingLeft:'20px'}}>
                                <li><span style={this.styles.spanStyle}>联系人:</span>杨女士</li>
                                <li><span style={this.styles.spanStyle}>电话:</span>180-0808-7449</li>
                                <li><span style={this.styles.spanStyle}>邮箱:</span>yangqian@calfdata.com</li>
                            </ul>
                        </li>
                        <li  className="outerStyle">
                            产品咨询
                            <br/>
                            <ul style={{listStyle:'none',paddingLeft:'20px'}}>
                                <li><span style={this.styles.spanStyle}>联系人:</span>邓先生 </li>
                                <li><span style={this.styles.spanStyle}>电话:</span>138-6013-0332 </li>
                                <li><span style={this.styles.spanStyle}>邮箱:</span>denghongbo@calfdata.com</li>
                            </ul>
                        </li>
                        <li  className="outerStyle">
                            媒体采访
                            <br/>
                            <ul style={{listStyle:'none',paddingLeft:'20px'}}>
                                <li><span style={this.styles.spanStyle}>联系人:</span>门女士 </li>
                                <li><span style={this.styles.spanStyle}>电话:</span>180-0808-6180</li>
                                <li><span style={this.styles.spanStyle}>邮箱:</span>menxiu@calfdata.com</li>
                            </ul>
                            <div style={{padding:'20px',marginTop:40}}>
                                <img
                                    src="/images/QQ.png"
                                    alt="QQ"
                                    className="col-md-4"
                                    data-toggle="modal"
                                    data-target="#myModal1"
                                    style={this.styles.labelStyle}/>
                                <img
                                    src="/images/weix.png"
                                    alt="WEIXIN"
                                    className="col-md-4"
                                    data-toggle="modal"
                                    data-target="#myModal2"
                                    style={this.styles.labelStyle}/>
                                <img
                                    src="/images/weibo.png"
                                    alt="WEIBO"
                                    className="col-md-4"
                                    data-toggle="modal"
                                    data-target="#myModal3"
                                    style={this.styles.labelStyle}/>
                            </div>
                        </li>
                    </ul>
                    <div className="centerText">
                        {/*<p>028-8436-9317</p>*/}
                        <p>客服QQ群:575943511</p>
                        <p>四川省成都市成华区二环路东二段7号东城国际中心A座11楼</p>
                    </div>

                </div>

                <div className="modal fade" id="myModal1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body" style={this.styles.flexStyle as any}>
                                <div  style={this.styles.centerStyle}>
                                    <img src="/images/contact/qq-1.png" style={small?{width:200}:null}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade bs-example-modal-sm" id="myModal2" tabIndex={-1} role="dialog" aria-labelledby="mySmallModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={this.styles.flexStyle as any}>
                            <div  style={this.styles.centerStyle}>
                                <img src="/images/contact/percent5-2.jpg" style={small?this.styles.imgStyleMobile : this.styles.imgStyle}/>
                                <p>百分5俱乐部</p>
                            </div>
                            <div  style={this.styles.centerStyle}>
                                <img src="/images/contact/calfdata-2.jpg" style={small?this.styles.imgStyleMobile :this.styles.imgStyle}/>
                                <p>小牛数据</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bs-example-modal-sm" id="myModal3" tabIndex={-1} role="dialog" aria-labelledby="mySmallModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={this.styles.flexStyle as any}>

                            <div  style={this.styles.centerStyle}>
                                <img src="/images/contact/percent5-1.png"  style={small?this.styles.imgStyleMobile :this.styles.imgStyle}/>
                                <p>百分5俱乐部</p>
                            </div>
                            <div style={this.styles.centerStyle}>
                                <img src="/images/contact/calfdataWeibo-1.png" style={small?this.styles.imgStyleMobile :this.styles.imgStyle}/>
                                <p>小牛数据</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}