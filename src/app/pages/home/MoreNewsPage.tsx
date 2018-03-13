import * as React from "react";
import Paper from "material-ui/Paper";
import ShowMore from "../../components/common/ShowMore";
import {barInteraction} from "../../components/bar/BarInteraction";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {default as Constants, Util} from "../../Constants";
import {http} from "../../model/ajax/Http";
import {FirstLoading} from "../../components/common/Loading";
import {HourlyNews} from "../../model/entities/HourlyNews";
import {CSSTransitionGroup} from "react-transition-group"; // ES6
import Empty from "../../components/common/Empty";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import {RouteComponentProps} from "react-router";

@observer
export default class MoreNewsPage extends React.Component<RouteComponentProps<null>, null> {
    static path = '/moreNews';

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        newsBox: {
            position: "relative",
            margin: "0 auto",
            width: "800px",
            paddingBottom: 48,
        },
        newsBoxMobile: {
            position: "relative",
            width: "100%",
        },
        time: {
            fontSize: "14px",
            marginBottom: "5px",
            position: "relative",
        },
        everyNewsPadding: {
            padding: "20px 40px"
        },
        firstItemPadding: {
            padding: "0 40px 20px"
        },
        newsContent: {
            fontSize: "14px",
            lineHeight: "24px",
            color: "#5e686d"
        },
        timeLine: {
            width: "1px",
            height: "100%",
            borderLeft: "1px solid #ccc",
            position: "absolute",
            left: "39px",
            top: 0,
            zIndex: 1
        },
        newsBanner: {
            maxWidth: "100%",
            height: "auto",
            display: "block"
        },
        newsDay: {
            height: "16px",
            paddingLeft: "5px",
            borderLeft: "4px solid #ec6947",
            fontSize: "18px",
        },
        scrollTop: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
        emptyFix: {
            width: '100%',
            height: 160,
            paddingTop: 60,
        },
    };

    @observable update = false;

    doUpdate() {
        this.update = !this.update;
    }

    registerUpdate() {
        return this.update;
    }

    private data: Array<HourlyNews> = [];

    private loading: boolean = false;
    private loadedCount: number = 0;

    private error: boolean = false;
    private hasMore: boolean = true;

    private timerStatus: boolean = true;
    private updateTime: number = 60000;
    private lastId;
    private preId;
    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = MoreNewsPage.title;
        barInteraction.custom = true;
        this.refresh();//初次加载
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
        this.timerStatus = false;

        if (this.error) {
            tipManager.hidden();
        }
        fixButtonManager.hidden();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();

        Util.scrollTopInstant();
    }

    static title = '7 × 24小时新闻资讯';

    render() {
        this.registerUpdate();

        let small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);

        if (!this.error && this.loadedCount === 0) {
            return <FirstLoading label="努力加载中" mobile={small}/>;
        } else if (this.loadedCount == 0) {
            //first loading & error
            return null;
        }

        let content = null;
        if (this.data.length == 0) {
            if (this.loading) {
                content = (
                    <Paper>
                        <ShowMore loading={true} onTouchTap={() => {
                        }}/>
                    </Paper>
                )
            } else {
                if (this.error) {
                    content = (
                        <Paper>
                            <ShowMore loading={false}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              this.moreRefresh();
                                          }
                                      }/>
                        </Paper>);
                } else {

                    return <div style={this.styles.container as any}>
                        <Empty mobile={small} imageLink={Constants.noDataImage} label=""/>
                    </div>
                }
            }
        } else {
            let showMore = null;
            if (this.hasMore) {
                showMore = (
                    <Paper>
                        <ShowMore loading={this.loading}
                                  onTouchTap={
                                      (event) => {
                                          event.preventDefault();
                                          this.moreRefresh();
                                      }
                                  }/>
                    </Paper>
                );
            }
            content = (
                <Paper>
                    <div style={{position: "relative"}}>
                        <ul className="HourlyNewsList morePage">
                            <CSSTransitionGroup transitionName="newsListChange"
                                                transitionEnterTimeout={500}
                                                transitionLeaveTimeout={300}>
                                {this.data.map((item, index) => {
                                    return <li
                                        style={index === 0 ? this.styles.firstItemPadding : this.styles.everyNewsPadding}
                                        className="newsItem" key={item.id}>
                                        <div style={this.styles.time as any}><i/><span
                                            className="icon-date">{item.postTimestamp}</span></div>
                                        <div style={this.styles.newsContent}>
                                            {item.contentText}
                                        </div>
                                    </li>
                                })}
                            </CSSTransitionGroup>
                        </ul>
                        <div style={this.styles.timeLine as any}>
                        </div>
                    </div>
                    {showMore}
                </Paper>
            );
        }


        return (
            <div style={this.styles.container as any}>
                <div style={(small || portrait) ? this.styles.newsBoxMobile as any : this.styles.newsBox as any}>
                    {content}
                </div>
            </div>
        );
    }

    private timeOrderedData(data) {
        let datesArr = data.map(e => {
            let time = e.postTimestamp.split(/[- :\/]/);
            return new Date(parseInt(time[0]), parseInt(time[1]) - 1, parseInt(time[2]), parseInt(time[3]), parseInt(time[4]), parseInt(time[5])).getTime()
        });
        let sortedArr = datesArr.sort((a, b) => b - a);
        let oldArr = data.map(e => {
            let time = e.postTimestamp.split(/[- :\/]/);
            return new Date(parseInt(time[0]), parseInt(time[1]) - 1, parseInt(time[2]), parseInt(time[3]), parseInt(time[4]), parseInt(time[5])).getTime()
        });
        let sortIndexes = sortedArr.map((sortedEle) => {
            return oldArr.indexOf(sortedEle);//返回排序后的日期对应于排序前的数组的index
        });
        return sortIndexes.map((e) => {
            return data[e]
        });
    }

    private refresh() {
        if (this.error) {
            tipManager.hidden();
        }
        this.error = false;//网络出错后,再次刷新需复位状态
        this.loading = true;
        this.doUpdate();
        http.post(
            '/news/newestNewsFlows', {lastId: "", limit: 10}
        ).then(data => {
            if (data.length) {
                this.lastId = data[0].id;
                this.preId = data[data.length - 1].id;
            } else {
                this.lastId = "";
                this.preId = "";
            }

            this.data.push(...data);
            this.data = this.timeOrderedData(this.data);
            setTimeout(() => {
                this.autoRefresh();
            }, this.updateTime);//新闻自动刷新
            fixButtonManager.showOnlyUp();
            this.loadedCount++;
            this.loading = false;
            this.doUpdate();

        }).catch(() => {
            this.error = true;
            this.loading = false;
            tipManager.showRefresh(() => {
                this.refresh();
            });
            this.doUpdate();
        });
    }

    private autoRefresh() {

        http.post(
            '/news/newestNewsFlows.json', {lastId: this.lastId, limit: 10}
        ).then((data) => {
            if (data.length) {
                this.lastId = data[0].id;
            }
            this.data.unshift(...data);
            this.data = this.timeOrderedData(this.data);
            this.doUpdate();
            if (this.timerStatus) {
                setTimeout(() => {
                    this.autoRefresh();
                }, this.updateTime)
            }
        }).catch(() => {
            console.error("自动刷新新闻失败");
            if (this.timerStatus) {
                setTimeout(() => {
                    this.autoRefresh();
                }, this.updateTime)
            }
        })
    }

    private moreRefresh() {
        if (this.error) {
            tipManager.hidden();
        }
        this.error = false;//网络出错后,复位状态
        this.loading = true;
        this.doUpdate();
        http.post(
            '/news/newsFlows', {preId: this.preId, limit: 10}
        ).then(data => {
            if (data.length) {
                this.preId = data[data.length - 1].id;
            }
            this.hasMore = data.length != 0;
            this.data.push(...data);
            this.data = this.timeOrderedData(this.data);
            this.loading = false;
            this.doUpdate();
        }).catch(() => {
            this.error = true;
            tipManager.showTip("获取新闻流失败");
            this.loading = false;
            this.doUpdate();
        });
    }
}