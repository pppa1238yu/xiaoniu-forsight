import * as React from "react";
import {Util} from "../../Constants";
import Header from "../../components/common/Header";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {RouteComponentProps} from "react-router";

export default class Report extends React.Component<RouteComponentProps<any>, null> {
    static path = "/report";

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
        backImg:{
            position:'relative',
            backgroundImage:"url('/images/bannerReport.png')"
        }
    };
    render () {
        let small = Util.small(this.widthNotifier.device);
        let reportDate = [];
        if (!small) {
            reportDate[0] = '网易新闻 2017.06.12 15:44';
            reportDate[1] = '中青在线 2017.05.23 10:23';
        }else {
            reportDate[0] = '网易新闻';
            reportDate[1] = '中青在线';
        }
        return(
            <div style={{paddingTop:53}}>
                <header style={this.styles.backImg as any}>
                    <Header index="2"/>
                    <p>媒体报道</p>
                </header>
                <div style={{minHeight:300}}>
                    <div className="container dashBorder mg-tp-32">
                        <ul className="report reportUl">
                            <li className="row">
                                <a href="http://news.163.com/17/0612/16/CMOCMC5T000187VG.html" className="reportColor col-xs-8" target="_blank">
                                    数据思维驱动金融科技，小牛数据引领炒股理性时代
                                </a>
                                <span className="rightText col-xs-4">{reportDate[0]}</span>
                            </li>
                            <li  className="row">
                                <a href="http://zqb.cyol.com/html/2017-05/23/nw.D110000zgqnb_20170523_1-12.htm" className="reportColor col-xs-8" target="_blank">
                                    大数据能狙击"股市黑嘴"吗
                                </a>
                                <span className="rightText col-xs-4">{reportDate[1]}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}