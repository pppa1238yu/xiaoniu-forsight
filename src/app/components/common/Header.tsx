import * as React from "react";
import {Link} from "react-router-dom";
import Report from "../../pages/extra/Report";
import ContactUs from "../../pages/extra/ContactUs";
import AboutUs from "../../pages/extra/AboutUs";
import Helps from "../../pages/extra/Helps";
import JoinUs from "../../pages/extra/JoinUs";

export default class Header extends React.Component<any, any> {
    styles={
        logoStyle: {
            position:'relative',
            height:31,
        }
    };
    render(){
        return(
            <div className="navbar navbar-fixed-top navbar-inverse" style={{height:54}}>
                <div className="container">
                    <div className="nav-logo">
                        <a href="#">
                            <img src="images/LOGO.png" alt="小牛数据" style={this.styles.logoStyle as any}/>
                        </a>
                    </div>
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navBar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse navbar-right" id="navBar">
                        <ul className="nav navbar-nav header-links " id="headerLinks">
                            <li><a href="/#/login" className={this.props.index==0?"nav-active":""}>首页</a></li>
                            <li><Link to={AboutUs.path} className={this.props.index==1?"nav-active":""}>关于小牛</Link></li>
                            <li><Link to={Report.path} className={this.props.index==2?"nav-active":""}>媒体报道</Link></li>
                            <li><Link to={JoinUs.path} className={this.props.index==3?"nav-active":""}>招贤纳士</Link></li>
                            <li><Link to={Helps.path} className={this.props.index==4?"nav-active":""}>帮助中心</Link></li>
                            <li><Link to={ContactUs.path} className={this.props.index==5?"nav-active":""}>联系我们</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}