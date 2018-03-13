import * as React from "react";
import {observer} from "mobx-react";

import {
    blue500,
    darkBlack,
    green300,
    green400,
    greenA200,
    grey400,
    grey500,
    lightBlack,
    red300,
    red500,
    red200,
    yellow600
} from "material-ui/styles/colors";
import {
    hotNewsDataSource,
    noticeDataSource,
    favorNoticeDataSource,
    newsFlashDataSource,
    RecommendedSystemDataSource
} from "../../model/ajax/RecommendedSystemService";
import {Card, CardActions, CardHeader, CardText, CardTitle} from "material-ui/Card";

import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import Paper from "material-ui/Paper";
import {List, ListItem} from "material-ui/List";
import ShowMore from "../common/ShowMore";

import {default as Constants, Util} from "../../Constants";

import Empty from "../common/Empty";

import Announcement  from "../../components/recommend/Announcement";

import NewsFlashCard  from "../../components/recommend/NewsFlashCard";

import HotNews  from "../../components/hotNews/HotNews";
import SmartAccountPage from "../../pages/smartAccount/SmartAccountPage";
import {Link} from "react-router-dom";

interface Props {
    recommendedSource: any;//数据源
    id?: any;
    notifyResult?: any;//板块加载成功与否的监听
    small?: any;
    portrait?: any;
    fixDrawer?: any;
    showNoDataPic?: boolean;
    emptyFix?: boolean;
    ifNotice?: boolean;//判断是否是公告板块
}

@observer
export class RecommendedSystemView extends React.Component<Props, null> {

    styles = {
        empty: {
            position: 'absolute',
            width: '100%',
            height: 120,
            paddingTop: 53,
            left: 0,
            top: 0,
        },
        emptyFix: {
            width: '100%',
            height: 160,
            paddingTop: 60,
        },
        loading: {
            paddingTop: 10,
            height: 56,
        },
        showBox: {
            position: 'relative',
            minHeight: 'calc(100vh - 114px)',
            zIndex: 1
        }
    };

    componentWillUnmount() {
        this.dataSource.setMount(false);
    }

    componentWillMount() {
        this.dataSource.setMount(true);
    }

    unique(data) {
        let res = [];
        let json = {};
        for (let i = 0; i < data.length; i++) {
            if (!json[data[i]]) {
                res.push(data[i]);
                json[data[i]] = 1;
            }
        }
        return res;
    }

    render() {
        if (this.dataSource.$.length == 0) {
            if (this.dataSource.loading) {
                return (
                    <Paper>
                        <ShowMore loading={true}
                                  onTouchTap={
                                      () => {
                                      }
                                  }/>
                    </Paper>
                )
            }
            if (this.dataSource.error) {
                return (
                    <Paper>
                        <ShowMore loading={false}
                                  onTouchTap={
                                      (event) => {
                                          event.preventDefault();
                                          this.dataSource.request();
                                      }
                                  }/>
                    </Paper>

                );
            }
            if (this.props.showNoDataPic) {
                return (
                    <div style={this.styles.showBox as any}>
                        <Empty mobile={this.props.small} imageLink={Constants.noDataImage} label=""/>
                    </div>
                );
            } else if (this.props.emptyFix) {
                return (
                    <Paper className="center-align" style={this.styles.emptyFix}>
                        暂无数据
                    </Paper>
                );
            } else if (this.props.ifNotice) {

                let notice = "";
                switch (this.props.recommendedSource) {
                    case RecommendedListSource.NOTICE:
                        notice = "添加自选股，获知相应的公告";
                        break;
                    case RecommendedListSource.NEWS_FLASH:
                        notice = "添加自选股，获知相应的快讯";
                        break;
                    default:
                        break;
                }
                return (
                    <Paper>
                        <Link to={SmartAccountPage.path}>
                            <div className="report-tip-banner">添加自选股，实现智能推荐</div>
                        </Link>
                    </Paper>
                )
            }
            else {
                return (
                    <Paper className="center-align" style={this.styles.empty as any}>
                        暂无数据
                    </Paper>
                )
            }
        } else {
            let cards: any = [];
            switch (this.props.recommendedSource) {
                case RecommendedListSource.NOTICE ://公告
                    cards = this.dataSource.$
                        .map(viewPoint =>
                            <Announcement
                                small={this.props.small}
                                portrait={this.props.portrait}
                                fixDrawer={this.props.fixDrawer}
                                viewPoint={viewPoint}
                                key={viewPoint.target.id}/>
                        );
                    break;
                case RecommendedListSource.HOT_NEWS://热门新闻
                    let titles = this.dataSource.$.map(title => title.title);
                    let titlesUnique = this.unique(titles);
                    let indexesUnique = titlesUnique.map(uniqueEle => {
                        return titles.indexOf(uniqueEle)
                    });

                    let data=indexesUnique.map(e=>{
                        return this.dataSource.$[e]
                    });

                    cards = data
                        .map(viewPoint =>
                            <HotNews
                                small={this.props.small}
                                portrait={this.props.portrait}
                                fixDrawer={this.props.fixDrawer}
                                viewPoint={viewPoint}
                                key={viewPoint.id}/>
                        );
                    //定义卡片列表
                    break;
                case RecommendedListSource.NEWS_FLASH://快讯
                    //定义卡片列表
                    cards = this.dataSource.$.map(value => <NewsFlashCard key={value.id} data={value}/>);
                    break;
                case RecommendedListSource.MY_FAVOURITE://收藏的公告
                    cards = this.dataSource.$
                        .map(viewPoint =>
                            <Announcement
                                small={this.props.small}
                                portrait={this.props.portrait}
                                fixDrawer={this.props.fixDrawer}
                                viewPoint={viewPoint}
                                key={viewPoint.target.id}/>
                        );
                    break;
                default:
                    cards = [];
            }
            let more = null;
            if (this.dataSource.hasMore) {
                if (this.dataSource.$.length < 200) {//观点流最多显示200条
                    more = (
                        <Paper>
                            <ShowMore loading={this.dataSource.loading}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              this.dataSource.request();
                                          }
                                      }/>
                        </Paper>
                    );
                }
            }
            return (
                <Paper zDepth={0}>
                    {cards}
                    {more}
                </Paper>
            );
        }
    }

    componentDidMount() {
        this.dataSource.setNotifyResult(this.props.notifyResult);
        this.dataSource.resetWithId();
        this.dataSource.request();
    }

    private get dataSource(): RecommendedSystemDataSource<any> {
        switch (this.props.recommendedSource) {
            case RecommendedListSource.HOT_NEWS:
                return hotNewsDataSource;
            case RecommendedListSource.NOTICE:
                return noticeDataSource;
            case RecommendedListSource.NEWS_FLASH:
                return newsFlashDataSource;
            case RecommendedListSource.MY_FAVOURITE:
                return favorNoticeDataSource;
            default :
                throw new Error("数据源错误!");
        }
    }
}

export enum RecommendedListSource{
    HOT_NEWS,
    NOTICE,
    NEWS_FLASH,
    MY_FAVOURITE
}