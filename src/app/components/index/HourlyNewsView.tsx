import * as React from "react";
import ExpandableList from "../common/ExpandableList";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {http} from "../../model/ajax/Http";
import {Objects} from "../../model/Objects";
import {HourlyNews} from "../../model/entities/HourlyNews";
import {CSSTransitionGroup} from "react-transition-group";
import MoreNewsPage from "../../pages/home/MoreNewsPage";
import {Util} from "../../Constants"; // ES6
@observer
export default class HourlyNewsView extends React.Component<any, any> {
    styles = {
        newsBox: {
            position: "relative"
        },
        time: {
            fontSize: "12px",
            marginBottom: "5px",
            position: "relative",
            color: "#9fa7ac"
        },
        everyNewsPadding: {
            padding: "20px"
        },
        newsContent: {
            fontSize: "14px"
        },
        timeLine: {
            width: "1px",
            height: "95%",
            borderLeft: "1px dotted #ccc",
            position: "absolute",
            left: "30px",
            top: "20px",
            zIndex: 1
        }
    };

    @observable update = false;

    doUpdate() {
        this.update = !this.update;
    }

    registerUpdate() {
        return this.update;
    }

    private data: Array<HourlyNews> = [];
    private timerStatus: boolean = true;
    private updateTime: number = 60000;
    private lastId;
    constructor(props, context) {
        super(props, context);
        this.refresh();
    }

    componentWillUnmount() {
        this.timerStatus = false;
    }

    render() {
        this.registerUpdate();

        let content = null;
        if (this.data.length) {
            content = (
                <div style={this.styles.newsBox as any}>
                    <div style={this.styles.timeLine as any}>

                    </div>
                    <ul className="HourlyNewsList">
                        <CSSTransitionGroup transitionName="newsListChange"
                                            transitionEnterTimeout={500}
                                            transitionLeaveTimeout={300}>
                            {
                                this.data.slice(0, 10).map((item, index) => {
                                    return <li style={this.styles.everyNewsPadding}
                                               className="newsItem on" key={item.id}>
                                        <div style={this.styles.time as any}><i/><span>{item.postTimestamp}</span></div>
                                        <div className="newsContent">
                                            {item.contentText}
                                        </div>
                                    </li>
                                })
                            }
                        </CSSTransitionGroup>
                    </ul>
                </div>
            );
        } else {
            content = <p style={{textAlign: "center"}}>暂无数据</p>;
        }

        return (
            <ExpandableList needMore
                            initialOpen={this.props.initialOpen}
                            disableExpandable={this.props.disableExpandable}
                            moreLabel="更多"
                            onMoreClicked={
                                (event) => {

                                }
                            }
                            linkMore={MoreNewsPage.path}
                            title={MoreNewsPage.title}
                            content={content}/>
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
        http.post(
            '/news/newestNewsFlows', {lastId: "", limit: 10}
        ).then((data) => {
            if(data.length){
                this.lastId=data[0].id;
            }else {
                this.lastId="";
            }
            Objects.assign(this.data, this.timeOrderedData(data));
            this.doUpdate();
            setTimeout(() => {
                this.autoRefresh();
            }, this.updateTime);//初加载成功后，新闻开始自动刷新
        }).catch(() => {
            setTimeout(() => {
                this.refresh();
            }, this.updateTime * 2);//初加载失败后，一段时间后再次刷新
        });
    }

    private autoRefresh() {
        http.post(
            '/news/newestNewsFlows', {lastId: this.lastId, limit: 10}
        ).then((data) => {
            if(data.length){
                this.lastId=data[0].id;
            }
            this.data.unshift(...data);
            this.data=this.timeOrderedData(this.data);//新增新闻后再次进行排序

            if (this.data.length > 200) {//数组最多存200条新闻
                this.data = this.data.slice(0, 200);
            }

            this.doUpdate();

            if (this.timerStatus) {
                setTimeout(() => {
                    this.autoRefresh();
                }, this.updateTime)
            }
        }).catch(() => {
            console.error("获取最新新闻流失败");

            if (this.timerStatus) {
                setTimeout(() => {
                    this.autoRefresh();
                }, this.updateTime)
            }
        });
    }

}