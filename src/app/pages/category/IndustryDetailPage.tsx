import * as React from "react";
import {RouteComponentProps} from "react-router";
import {CategoryType} from "../../model/entities/category/CategoryType";
import {IndustryInfoRefDataSource} from "../../model/ajax/CategoryService";
import CategoryTendenciesView from "../../components/category/CategoryTendenciesView";
import AnalystViewPointList, {ViewPointListSource} from "../../components/analyst/AnalystViewPointList";
import Subheader from "material-ui/Subheader";
import Paper from "material-ui/Paper";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    red300,
    red500,
    yellow600
} from "material-ui/styles/colors";
import {observer} from "mobx-react";
import {Util} from "../../Constants";
import ExpandableList from "../../components/common/ExpandableList";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Link} from "react-router-dom";
import {observable, runInAction} from "mobx";
import {barInteraction} from "../../components/bar/BarInteraction";
import {FirstLoading} from "../../components/common/Loading";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import Chip from "material-ui/Chip";
import Divider from "material-ui/Divider";
import StockDetailPage from "../stock/StockDetailPage";
import Attention, {AttentionStyle} from "../../components/common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import Explain from "../../components/common/Explain";
import {grey700,red700,lightGreen500} from "material-ui/styles/colors";
import StocksAssociatedComputerView from "../../components/category/StocksAssociatedComputerView";
import StocksAssociatedMobileView from "../../components/category/StocksAssociatedMobileView";
interface ParamMap {
    identifier: string;
}
enum IndustryDetailComponent {
    HEADER,
    HOT_REPORTS,
    STOCKS_ASS
}
declare let $;
@observer
export default class IndustryDetailPage extends React.Component<RouteComponentProps<ParamMap>, null> {

    static readonly PATH = '/industry/detail/';
    static readonly LINK_PATH = IndustryDetailPage.PATH + ':identifier';

    code;
    name;
    firstLoading;
    @observable first;
    @observable error;
    mount = true;

    private industryInfoRefDataSource: IndustryInfoRefDataSource;
    private styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
            paddingBottom: 20
        },
        root: {
            flexGrow: 1,
            paddingBottom: 36,
        },
        hidden: {
            visibility: 'hidden',
            flexGrow: 1,
            paddingBottom: 36,
        },
        rootSmall: {
            flexGrow: 1,
        },
        hiddenSmall: {
            visibility: 'hidden',
            flexGrow: 1,
        },
        content: {
            paddingLeft: 16,
            paddingRight: 16,
        },

        header: {
            paddingTop: 8,
            paddingBottom: 8,
        },
        headerSmall: {
            paddingLeft: 2,
            paddingTop: 6,
            lineHeight: 'none',
            height: 36,
        },
        contentSmall: {},
        increment: {
            color: red500,
        },
        decrement: {
            color: green500,
        },
        tableCell: {
            width: '12%',
            fontSize: 14,
            paddingLeft: 20,
            paddingRight: 2,
            textAlign: 'left',
        },
        datum: {
            paddingBottom: 0,
            paddingTop: 0,
        },
        tableCellSmall: {
            width: '30%',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
        },
        tableContent: {
            textAlign: 'center',
            paddingLeft: 2,
            paddingRight: 2,
        },
        otherChipContainer: {
            paddingTop: 5,
            paddingBottom: 5,
        },
        chip: {
            marginRight: 4,
            marginTop: 1,
            marginBottom: 1,
        },
        changeLabel: {
            color: 'white',
            height: '24px',
            lineHeight: '24px'
        },
        linkChip: {
            marginRight: 10,
            cursor: "pointer",
            marginTop: 1,
            marginBottom: 1,
        },
        title: {
            fontSize: 18,
        },
        titleOverlay: {
            width: "100%",
            paddingRight: 0,
        },
        cardHeader: {
            paddingLeft: 36,
            paddingBottom: 16,
        },
        cardContainer: {},
        cardContainerSmall: {
            paddingLeft: 16,
        },
        quotation: {
            fontSize: 18,
            paddingLeft: 10
        },
        incrementText: {
            color: red500,
            fontSize: 16,
            paddingLeft: 10
        },
        decrementText: {
            color: green500,
            fontSize: 16,
            paddingLeft: 10
        },
        text: {
            color: grey500,
            fontSize: 16,
            paddingLeft: 10
        },
        pointListContainer: {
            position: 'relative',
        },
        floatButton: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
        noBottomBorder: {
            borderBottom: 'none'
        },
        chipLabel: {
            color: '#fff',
            height: '24px',
            lineHeight: '24px'
        },
        chipUp: {
            backgroundColor: red300,
            marginRight: 10
        },
        chipDown: {
            backgroundColor: green400,
            marginRight: 10
        },
        chipMain: {
            backgroundColor: grey500
        },
        explainArea:{
            padding:12,
            fontSize:12,
            color:"#616161"
        },
        center:{
            textAlign:"center"
        },
        tableContainer: {
            minHeight: 200,
        },
        th:{
            fontSize:14,
            color:"#919191"
        },
        td:{
            fontSize:14,
            color:grey700
        },
    };

    constructor(props) {
        super(props);
        this.code = this.props.match.params.identifier;
        this.industryInfoRefDataSource = new IndustryInfoRefDataSource(this.props.match.params.identifier);
    }

    onNotifyFirstLoad = (index, err) => {
        if (!this.first || this.error) {
            return;
        }
        if (this.firstLoading[index]) {
            return;
        }
        if (err) {
            this.error = true;
            this.setError();
        } else {
            this.firstLoading[index] = true;
            let all = true;
            for (const value of this.firstLoading) {
                if (!value) {
                    all = false;
                    break;
                }
            }
            if (all) {
                this.loadDone();
                this.first = false;
                this.setFixButton();
            } else {
                //continue wait
            }

        }
    };

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
        }
    }

    restore() {
        this.firstLoading = [false, false,false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    loadDone = () => {
        if (!this.mount) {
            return;
        }

        this.name = this.industryInfoRefDataSource.$.name;
        barInteraction.title = this.industryInfoRefDataSource.$.name;
        barInteraction.doUpdate();

    };

    widthNotifier: WidthNotifier = null;

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.identifier != this.code) {
            window.location.reload();
        }
    }

    componentDidMount() {
        this.industryInfoRefDataSource.setResultNotify(
            (err) => this.onNotifyFirstLoad(IndustryDetailComponent.HEADER, err)
        );
        this.industryInfoRefDataSource.refresh();
    }

    componentDidUpdate() {
        $('.scrollspy').scrollSpy();
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        this.mount = false;
        barInteraction.restore();
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    setFixButton = () => {
        if (this.first) {
            return;
        }

        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        if (Util.small(this.widthNotifier.device)) {
            const attention =
                <Attention
                    type={EntityType.INDUSTRY}
                    code={this.code}
                    fixDrawer={fixDrawer}
                    style={AttentionStyle.FLOATING}
                />;
            fixButtonManager.showDefaultMulti([{icon: attention, float: true}]);
        } else if (!fixDrawer) {
            fixButtonManager.showOnlyUp();
        } else {
            fixButtonManager.hidden();
        }
    };


    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier(this.setFixButton);
        this.restore();

        Util.scrollTopInstant();
    }

    render() {

        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        let firstLoad = null;
        let tendenciesView = null;
        let header = null;
        let rate = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        } else {
            tendenciesView = (
                <CategoryTendenciesView
                    categoryType={CategoryType.Industry}
                    small = {small}
                    categoryInfo={this.industryInfoRefDataSource.$}/>
            );

            let incrementValue = this.industryInfoRefDataSource.$.indexIncrementValue;
            let incrementRatio = this.industryInfoRefDataSource.$.indexIncrementRate;

            const rateText = Util.precisionRate2(incrementRatio * 100, 2);
            const changeText = Util.precisionIncrement(incrementValue);
            const quotationText = " " + changeText + "/" + rateText;
            if (incrementValue > 0) {
                rate = <span style={this.styles.incrementText}>{quotationText}</span>;
            } else if (incrementValue < 0) {
                rate = <span style={this.styles.decrementText}>{quotationText}</span>;
            } else {
                rate = <span style={this.styles.text}>{quotationText}</span>;
            }

            let bestStockCount = Math.min(this.industryInfoRefDataSource.$.positiveStockCount, 3);

            const attention =
                <Attention
                    type={EntityType.INDUSTRY}
                    code={this.code}
                    fixDrawer={fixDrawer}
                    style={small ? AttentionStyle.FLOATING : AttentionStyle.ICON}
                />;
            if (!small) {
                if (!fixDrawer) {
                    //fixButtonManager.showOnlyUp();
                } else {
                    //fixButtonManager.hidden();
                }
                header = (
                    <Card style={this.styles.container}>
                        <CardHeader
                            style={this.styles.cardHeader}
                            title={
                                <div className="flex-center">
                                    <div role="industryNameAndChangeRatio">
                                <span>{this.industryInfoRefDataSource.$.name + " "}<span style={this.styles.quotation}>
                                {this.industryInfoRefDataSource.$.index}{rate}</span></span>
                                    </div>
                                    <div role="focusButton" className="auto-right">
                                        {attention}
                                    </div>
                                </div>
                            }
                            titleStyle={this.styles.title}
                            textStyle={this.styles.titleOverlay}
                        />
                        <CardText style={this.styles.datum}>
                            <div className="">
                                <Table>
                                    <TableBody
                                        displayRowCheckbox={false}
                                        showRowHover
                                    >
                                        <TableRow style={this.styles.noBottomBorder}>
                                            <TableRowColumn style={this.styles.tableCell}>行业成分股</TableRowColumn>
                                            <TableRowColumn>
                                                <div role="industryConstituents" className="flex-center-wrap"
                                                     style={this.styles.otherChipContainer}>
                                                    <Chip style={this.styles.chipUp}
                                                          labelStyle={this.styles.chipLabel}
                                                    >
                                                        {"上涨 " + (this.industryInfoRefDataSource.$.positiveStockCount) + " 只"}
                                                    </Chip>
                                                    <Chip style={this.styles.chipDown}
                                                          labelStyle={this.styles.chipLabel}
                                                    >
                                                        {"下跌 " + (this.industryInfoRefDataSource.$.negativeStockCount) + " 只"}
                                                    </Chip>
                                                    <Chip style={this.styles.chipMain}
                                                          labelStyle={this.styles.chipLabel}
                                                    >
                                                        {"共 " + this.industryInfoRefDataSource.$.stockIncrements.length + " 只"}
                                                    </Chip>
                                                </div>
                                            </TableRowColumn>
                                        </TableRow>
                                        <TableRow style={this.styles.noBottomBorder}>
                                            <TableRowColumn style={this.styles.tableCell}>龙头股</TableRowColumn>
                                            <TableRowColumn>
                                                <div role="bellwetherOfIndustry" className="flex-center-wrap"
                                                     style={this.styles.otherChipContainer}>
                                                    {
                                                        this.industryInfoRefDataSource.$.stockIncrements.slice(0, bestStockCount).map((increment, index) => {

                                                                let color = null;
                                                                let labelStyle = null;
                                                                if (increment.rate > 0) {
                                                                    color = red300;
                                                                    labelStyle = this.styles.changeLabel;
                                                                } else if (increment.rate < 0) {
                                                                    color = green400;
                                                                    labelStyle = this.styles.changeLabel;
                                                                } else {

                                                                }

                                                                return <Link role="linktoDetailStockPage"
                                                                             key={increment.symbol}
                                                                             to={StockDetailPage.path + increment.symbol}>
                                                                    <Chip style={this.styles.linkChip}
                                                                          backgroundColor={color}
                                                                          labelStyle={labelStyle}>
                                                                        {increment.name + "    " + Util.precisionRate(increment.rate, 2)}
                                                                    </Chip>
                                                                </Link>
                                                            }
                                                        )
                                                    }
                                                </div>
                                            </TableRowColumn>
                                        </TableRow>
                                        <TableRow style={{display: 'none'}}>
                                            <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                                重要指标:
                                            </TableRowColumn>
                                            <TableRowColumn className="table-cell">
                                                <div className="flex-center-wrap"
                                                     style={this.styles.otherChipContainer}>
                                                    <Chip style={this.styles.chip}
                                                          labelStyle={this.styles.changeLabel}
                                                          backgroundColor={blueGrey500}
                                                    >
                                                        行业毛利率(最新):
                                                    </Chip>
                                                    <Chip style={this.styles.chip}
                                                          labelStyle={this.styles.changeLabel}
                                                          backgroundColor={blueGrey500}
                                                    >
                                                        融资余额:{this.industryInfoRefDataSource.$.financingResidualAmount}
                                                    </Chip>
                                                    <Chip style={this.styles.chip}
                                                          labelStyle={this.styles.changeLabel}
                                                          backgroundColor={blueGrey500}
                                                    >
                                                        环比昨日: {this.industryInfoRefDataSource.$.financingResidualAmountDayIncrement}
                                                    </Chip>
                                                    <Chip style={this.styles.chip}
                                                          labelStyle={this.styles.changeLabel}
                                                          backgroundColor={blueGrey500}
                                                    >
                                                        行业市盈率(PE):
                                                    </Chip>
                                                    <Chip style={this.styles.chip}
                                                          labelStyle={this.styles.changeLabel}
                                                          backgroundColor={blueGrey500}
                                                    >
                                                        本季解禁市值:{this.industryInfoRefDataSource.$.liftingMarketValue}
                                                    </Chip>
                                                    <Chip style={this.styles.chip}
                                                          labelStyle={this.styles.changeLabel}
                                                          backgroundColor={blueGrey500}
                                                    >
                                                        环比上季: {this.industryInfoRefDataSource.$.liftingMarketValueQuarterIncrement}
                                                    </Chip>
                                                </div>
                                            </TableRowColumn>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardText>
                    </Card>
                )
            } else {
                //fixButtonManager.showDefaultMulti([{icon: attention, float: true}]);
                header = (
                    <ExpandableList
                        initialOpen={true}
                        needMore={false}
                        moreLabel=""
                        onMoreClicked={() => {
                        }}
                        title={
                            <span style={this.styles.quotation}>
                            {this.industryInfoRefDataSource.$.index}{rate}</span>
                        }
                        disableExpandable={false}
                        content={
                            <div style={this.styles.cardContainerSmall}>
                                <Table>
                                    <TableBody
                                        displayRowCheckbox={false}
                                        showRowHover
                                    >
                                        <TableRow>
                                            <TableRowColumn style={this.styles.tableCellSmall}>
                                                行业成分股
                                            </TableRowColumn>
                                            <TableRowColumn style={this.styles.tableContent}>
                                                {this.industryInfoRefDataSource.$.stockIncrements.length} 只
                                            </TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn style={this.styles.tableCellSmall}>
                                                龙头股
                                            </TableRowColumn>
                                            <TableRowColumn style={this.styles.tableContent}>
                                                <div className="flex-start-wrap">
                                                    {
                                                        this.industryInfoRefDataSource.$.stockIncrements.slice(0, bestStockCount).map((increment, index) => {

                                                                return <Link key={increment.symbol}
                                                                             to={StockDetailPage.path + increment.symbol}>
                                                                <span style={this.styles.linkChip}>
                                                                    {increment.name}
                                                                </span>
                                                                </Link>
                                                            }
                                                        )
                                                    }
                                                </div>
                                            </TableRowColumn>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        }
                        linkMore=""
                    />
                )
            }
        }
        let left = null;

        if (!small) {
            left = (
                <div>
                    <div role="industryBriefIntro" className="scrollspy" id="brief">
                        {header}
                    </div>
                    <div role="tendenciesView" className="row-padding scrollspy" id="kline">
                        <Paper>
                            <Subheader style={this.styles.header}>
                                行情分析
                                <Explain
                                    message="图中上半部分给出了板块价格指数和沪深300相对于基准日的涨跌幅，可以借此比较分析板块价格指数和沪深300的相对走势。基准点不同，相对涨跌幅不同，不同期限下的走势图存在差异属正常现象。下半部分展示了按一定规则计算的行业规模指数走势，可直接进行横纵向比较。"
                                    toolTipPosition="top-right"
                                />
                            </Subheader>
                            <div style={this.styles.content}>
                                {tendenciesView}
                            </div>
                        </Paper>
                    </div>
                    <div className="row-padding scrollspy" id="stockAss">
                        <Paper>
                            <Subheader style={this.styles.header}>
                                个股关联
                            </Subheader>
                            <Divider/>
                            <div style={this.styles.content}>
                                <StocksAssociatedComputerView symbol={this.code} notifyResult={(err)=>this.onNotifyFirstLoad(IndustryDetailComponent.STOCKS_ASS,err)} type="industry"/>
                            </div>
                        </Paper>
                    </div>

                    <div role="analystViewPoint" className="row-padding scrollspy" id="point">
                        <Paper>
                            <Subheader style={this.styles.header}>热门观点</Subheader>
                            <Divider/>
                        </Paper>
                        <div style={this.styles.pointListContainer as any}>
                            <AnalystViewPointList viewPointSource={ViewPointListSource.INDUSTRY_PAGE}
                                                  notifyResult={(err) => {
                                                      this.onNotifyFirstLoad(IndustryDetailComponent.HOT_REPORTS, err)
                                                  }}
                                                  small={small}
                                                  emptyFix
                                                  portrait={portrait}
                                                  id={this.code}
                            />
                        </div>
                    </div>
                </div>

            );
        } else {
            left = (
                <div>
                    <div role="industryBriefIntro" className="scrollspy" id="brief">
                        {header}
                    </div>
                    <div role="tendenciesView" className="row-small-padding scrollspy" id="kline">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {
                            }}
                            title="行情分析"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.contentSmall}>
                                    <div style={this.styles.center}>
                                        <Explain
                                            message="图中上半部分给出了板块价格指数和沪深300相对于基准日的涨跌幅，可以借此比较分析板块价格指数和沪深300的相对走势。基准点不同，相对涨跌幅不同，不同期限下的走势图存在差异属正常现象。下半部分展示了按一定规则计算的行业规模指数走势，可直接进行横纵向比较。"
                                            toolTipWidth="260px"
                                            toolTipPosition="bottom-center"
                                        />
                                    </div>
                                    {tendenciesView}
                                </div>
                            }
                            linkMore=""
                        />

                    </div>
                    <div className="row-small-padding scrollspy">
                        <ExpandableList
                            initialOpen={false}
                            title="个股关联"
                            disableExpandable={false}
                            content={
                                <StocksAssociatedMobileView symbol={this.code} type="industry" notifyResult={(err)=>this.onNotifyFirstLoad(IndustryDetailComponent.STOCKS_ASS,err)}/>
                            }
                        />
                    </div>
                    <div className="row-small-padding scrollspy" id="point">
                        <ExpandableList
                            initialOpen={true}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {
                            }}
                            title="热门观点"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.pointListContainer as any}>
                                    <AnalystViewPointList viewPointSource={ViewPointListSource.INDUSTRY_PAGE}
                                                          notifyResult={(err) => {
                                                              this.onNotifyFirstLoad(IndustryDetailComponent.HOT_REPORTS, err)
                                                          }}
                                                          small={small}
                                                          emptyFix
                                                          portrait={portrait}
                                                          id={this.code}
                                    />
                                </div>
                            }
                            linkMore=""
                        />
                    </div>
                </div>

            );
        }
        if (!fixDrawer) {

            return (
                <div style={this.styles.container as any}>
                    {firstLoad}
                    <div style={this.first ? this.styles.hiddenSmall : this.styles.rootSmall}>
                        {left}
                    </div>
                </div>
            );
        } else {

            return (
                <div style={this.styles.container as any}>
                    {firstLoad}
                    <div className="fix-detail-width flex-start"
                         style={this.first ? this.styles.hidden : this.styles.root}>

                        <div className="fix-detail-left-width">
                            {left}
                        </div>
                        <div className="fix-detail-right-width">
                            <ul>
                                <li>
                                    <a href="#brief">概览</a>
                                </li>
                                <li>
                                    <a href="#kline">行情分析</a>
                                </li>
                                <li>
                                    <a href="#stockAss">个股关联</a>
                                </li>
                                <li>
                                    <a href="#point">热门观点</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
    }
}