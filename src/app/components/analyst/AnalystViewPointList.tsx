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
    suggestionViewPointList,
    allPageViewPointList,
    analystPageViewPointList,
    industryPageViewPointList,
    myFavouriteViewPointList,
    stockPageViewPointList,
    subjectPageViewPointList,
    ViewPointListDataSource
} from "../../model/ajax/ViewPointListService";
import {Card, CardActions, CardHeader, CardText, CardTitle} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import Paper from "material-ui/Paper";
import {List, ListItem} from "material-ui/List";
import ShowMore from "../common/ShowMore";
import Divider from "material-ui/Divider";
import Chip from "material-ui/Chip";
import {default as Constants, Util} from "../../Constants";
import IconButton from "material-ui/IconButton";
import More from "material-ui/svg-icons/navigation/more-horiz";
import MoreV from "material-ui/svg-icons/navigation/more-vert";
import Dialog from "material-ui/Dialog";
import {Link} from "react-router-dom";
import StockDetailPage from "../../pages/stock/StockDetailPage";
import Empty from "../common/Empty";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import {Report} from "../../model/entities/Report";
import {Collections} from "../../Constants";
import SmartAccountPage from "../../pages/smartAccount/SmartAccountPage";

interface DialogProps {
    id: any;
    open: boolean;
    handleClose: Function;
}


class AnalystViewItemDialog extends React.Component<DialogProps, null> {

    render() {
        return (
            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoDetectWindowHeight
            >
                <Attention
                    type={EntityType.REPORT}
                    code={this.props.id}
                    fixDrawer={false}
                    style={AttentionStyle.ITEM}
                />
                {/*<ListItem primaryText="查看更多"
                 leftIcon={<RemoveRedEye />}/>*/}
            </Dialog>
        );
    }
}

interface CardProps {
    viewPoint: Report;
    small: boolean;
    portrait: boolean;
    depth?: number;
    fixDrawer: boolean;
    key?: any;
}

@observer
export class AnalystViewCard extends React.Component<CardProps, any> {

    styles = {
        date: {
            fontSize: 14,
            minWidth: 100,
            textAlign: 'right',
            color: grey500,
        },
        author: {},
        title: {
            fontSize: 16,
            color: '#616161',
            fontWeight: "bold"
        },
        titleSmall: {
            fontSize: 18,
        },
        titleValue: {
            margin: 4,
        },
        titleContainer: {
            paddingBottom: 0,
        },
        stock: {
            paddingBottom: 0,
            paddingTop: 0,
        },
        stockSmall: {
            paddingTop: 0,
        },
        chip: {
            marginRight: 4,
            marginBottom: 6,
            cursor: "pointer",
            lineHeight: '24px'
        },
        changeLabel: {
            color: 'white',
            lineHeight: '24px',
            height: 24
        },
        noRateLabel: {
            lineHeight: '24px',
            height: 24
        },
        icon: {
            padding: 8,
            height: 40,
            width: 40,
        },
        action: {
            paddingTop: 0,
        },
        text: {
            fontSize: 14,
            color: '#6d6d6d',
            lineHeight: '20px',
            whiteSpace: "pre-line",
        },
    };

    static SUMMARY_FIX_LENGTH = 200;
    static SUMMARY_FIX_RANGE = 300;

    static CHIP_MAX_NUMBER = 3;
    static CHIP_MAX_NUMBER_SMALL = 1;

    state = {
        expand: false,
        showAllChips: false,
        dialogOpen: false,
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    handleExpand = (expand) => {
        this.setState(
            {
                expand
            }
        )
    };

    viewClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState(
            {
                dialogOpen: true,
            }
        )
    };

    render() {
        let researchName = null;
        if (this.props.viewPoint.researcher) {
            researchName = this.props.viewPoint.researcher.fullName;
        }
        const reportDate = this.displayReportDate(this.props.viewPoint.reportDate);
        let title = null;
        let subtitle = researchName;
        if (reportDate) {
            if (!(this.props.small || this.props.portrait)) {
                title = (
                    <div className="flex-center">
                        <div>
                            {this.props.viewPoint.title}
                        </div>
                        <div role="timeOfViewPoint" className="auto-right" style={this.styles.date}>
                            {reportDate}
                        </div>
                    </div>
                );
            } else {
                if (this.props.small) {
                    title = (
                        <div className="flex-center">
                            <div>
                                {this.props.viewPoint.title}
                            </div>
                            <div className="auto-right">
                                <IconButton>
                                    <MoreV/>
                                </IconButton>
                            </div>
                        </div>
                    );
                } else {
                    title = (
                        <span>{this.props.viewPoint.title}</span>
                    );

                }
                if (subtitle != null) {
                    subtitle = (
                        <div className="flex-center">
                            <div>
                                {subtitle}
                            </div>
                            <div className="auto-right">
                                {reportDate}
                            </div>
                        </div>
                    );
                }
            }
        } else {

            if (this.props.small) {
                title = (
                    <div className="flex-center">
                        <div>
                            {this.props.viewPoint.title}
                        </div>
                        <div className="auto-right">
                            <IconButton>
                                <MoreV/>
                            </IconButton>
                        </div>
                    </div>
                );
            } else {
                title = (
                    <span>{this.props.viewPoint.title}</span>
                )
            }
        }

        const summaryExpand = AnalystViewCard.SUMMARY_FIX_RANGE
            < this.props.viewPoint.summary.length;

        let summary = null;
        if (summaryExpand && !this.state.expand) {
            summary = this.props.viewPoint.summary.slice(0, 150) + '...';
        } else {
            summary = this.props.viewPoint.summary;
        }

        let stocks = null;
        const max = (this.props.small || this.props.portrait) ? AnalystViewCard.CHIP_MAX_NUMBER_SMALL : AnalystViewCard.CHIP_MAX_NUMBER;
        if (this.props.viewPoint.stockIncrements &&
            this.props.viewPoint.stockIncrements.length > 0) {
            const chips = [];

            for (let index = 0; index < this.props.viewPoint.stockIncrements.length; index++) {
                const ele = this.props.viewPoint.stockIncrements[index];

                let color = null;
                let labelStyle = null;
                if (ele.rate > 0) {
                    color = red200;
                    labelStyle = this.styles.changeLabel;
                } else if (ele.rate < 0) {
                    color = '#aed581';
                    labelStyle = this.styles.changeLabel;
                } else {
                    labelStyle = this.styles.noRateLabel;
                }
                chips.push(
                    (
                        <Link key={ele.symbol} to={StockDetailPage.path + ele.symbol}>
                            <Chip style={this.styles.chip}
                                  backgroundColor={color}
                                  labelStyle={labelStyle}>
                                {ele.name + "    " + Util.precisionRate2(ele.rate, 2, true)}
                            </Chip>
                        </Link>
                    )
                );
                if (!this.state.showAllChips && index == max - 1) {
                    break;
                }
            }
            let more = null;
            if (!this.props.small
                && this.props.viewPoint.stockIncrements.length > chips.length) {
                more = (
                    <div>
                        <IconButton
                            onTouchTap={
                                (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.setState(
                                        {
                                            showAllChips: true,
                                        }
                                    );
                                }
                            }
                            style={this.styles.icon}>
                            <More/>
                        </IconButton>
                    </div>
                );
            }

            stocks = (
                <CardText style={this.props.small ? this.styles.stockSmall : this.styles.stock}
                >
                    <div role="mentionStocks" className="flex-center-wrap">
                        {chips}
                        {more}
                    </div>
                </CardText>
            );
        }
        let action = null;
        if (this.props.small) {
            action = (
                <AnalystViewItemDialog
                    open={this.state.dialogOpen}
                    handleClose={this.handleClose}
                    id={this.props.viewPoint.id}
                />
            );
        } else {
            // (this.props.viewPoint.path);
            action = (
                <CardActions style={this.styles.action}>
                    <div className="flex-center">
                        <div role="collectButton" className="auto-right">
                            <Attention
                                type={EntityType.REPORT}
                                code={this.props.viewPoint.id}
                                fixDrawer={this.props.fixDrawer}
                                style={AttentionStyle.ICON}
                            />
                        </div>
                        <div>
                            <FlatButton role="readMoreButton" label="查看全文" disabled={!this.props.viewPoint.path}
                                        target="_blank"
                                        href={"/pdf/" + this.props.viewPoint.path}/>
                        </div>
                    </div>
                </CardActions>
            );
        }

        let depth = 1;
        if (this.props.depth != undefined) {
            depth = this.props.depth;
        }
        return (
            <div>
                <Card expandable={summaryExpand} onExpandChange={this.handleExpand} zDepth={depth}>
                    <CardTitle
                        title={title}
                        titleStyle={this.props.small ? this.styles.titleSmall : this.styles.title}
                        subtitle={subtitle}
                        subtitleStyle={this.styles.author}
                        style={this.styles.titleContainer}
                        onTouchTap={
                            this.props.small ?
                                (event) => {
                                    this.viewClicked(event);
                                } : () => {
                                }
                        }
                    />
                    <CardText actAsExpander={summaryExpand} style={this.styles.text}>
                        {summary}
                    </CardText>
                    {stocks}
                    {action}
                </Card>
                <Divider/>
            </div>
        );

    }

    private displayReportDate(reportDate: Date): string {
        if (!reportDate) {
            return '';
        }
        let now: Date = new Date;
        let hours: number = Math.round((now.getTime() - reportDate.getTime()) / (60 * 60 * 1000));
        if (hours <= 0) {
            return '刚刚';
        }
        if (hours < 24) {
            return hours + '小时前';
        }
        let days = Math.round(hours / 24);
        if (days <= 90) {
            return days + '天前';
        }
        return reportDate.getFullYear() + '年' + (reportDate.getMonth() + 1) + '月' + (reportDate.getDate()) + '日';
    }
}

interface Props {
    viewPointSource: any;
    id?: any;
    notifyResult?: any;
    small?: any;
    portrait?: any;
    fixDrawer?: any;
    showNoDataPic?: boolean;
    emptyFix?: boolean;
}

@observer
export default class AnalystViewPointList extends React.Component<Props, null> {

    styles = {
        empty: {
            position: 'absolute',
            width: '100%',
            height: 160,
            paddingTop: 60,
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
    };

    componentWillUnmount() {
        this.dataSource.setMount(false);
    }

    componentWillMount() {
        this.dataSource.setMount(true);
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
                    <Empty mobile={this.props.small} imageLink={Constants.noDataImage} label=""/>
                );
            } else if (this.props.emptyFix) {
                return (
                    <Paper className="center-align" style={this.styles.emptyFix}>
                        暂无数据
                    </Paper>
                );
            } else if (this.props.viewPointSource == ViewPointListSource.SUGGESTION) {
                return (
                    <Paper>
                        <Link to={SmartAccountPage.path}>
                            <div className="report-tip-banner">添加自选股，实现智能推荐</div>
                        </Link>
                    </Paper>
                )
            }
        } else {
            let data = Collections.distinct(this.dataSource.$, standPoint => standPoint.id);
            let cards: any = data.map(viewPoint =>
                <AnalystViewCard
                    small={this.props.small}
                    portrait={this.props.portrait}
                    fixDrawer={this.props.fixDrawer}
                    viewPoint={viewPoint}
                    key={viewPoint.id}/>
            );

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
        //this.dataSource.offset = 0;
        this.dataSource.setNotifyResult(this.props.notifyResult);
        this.dataSource.resetWithId(this.props.id);
        this.dataSource.request();
    }


    private get dataSource(): ViewPointListDataSource {
        switch (this.props.viewPointSource) {
            case ViewPointListSource.STOCK_PAGE :
                return stockPageViewPointList;
            case ViewPointListSource.SUBJECT_PAGE :
                return subjectPageViewPointList;
            case ViewPointListSource.ANALYST_PAGE :
                return analystPageViewPointList;
            case ViewPointListSource.INDUSTRY_PAGE :
                return industryPageViewPointList;
            case ViewPointListSource.MY_FAVOURITE:
                return myFavouriteViewPointList;
            case ViewPointListSource.ALL_PAGE:
                return allPageViewPointList;
            case ViewPointListSource.SUGGESTION:
                return suggestionViewPointList;
            default :
                throw new Error("数据源错误!");
        }
    }
}

export enum ViewPointListSource {
    ANALYST_PAGE,
    STOCK_PAGE,
    SUBJECT_PAGE,
    INDUSTRY_PAGE,
    ALL_PAGE,
    MY_FAVOURITE,
    SUGGESTION
}