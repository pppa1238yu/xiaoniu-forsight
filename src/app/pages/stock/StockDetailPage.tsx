import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import KlineChartView from "../../components/stock/KlineChartView";
import StockHeader from "../../components/stock/StockHeader";
import AnalystRatingDetailView from "../../components/stock/AnalystRatingDetailView";
import ReportStockOpinionView from "../../components/stock/ReportStockOpinionView";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Collections, Util} from "../../Constants";
import {stockBaseInfoDataSource} from "../../model/ajax/KlineService";
import {observable, runInAction} from "mobx";
import {FirstLoading} from "../../components/common/Loading";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import JumpSmart from "material-ui/svg-icons/action/exit-to-app";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AnalystViewPointList, {ViewPointListSource} from "../../components/analyst/AnalystViewPointList";
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
import ExpandableList from "../../components/common/ExpandableList";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {EntityType} from "../../model/entities/EntityType";
import Attention, {AttentionStyle} from "../../components/common/Attention";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import Constants from "../../Constants";

enum StockDetailComponent {
    HEADER,
    HOT_REPORTS,
}
declare let $;

interface StockIndexPageProps {
    stockCode: string;
}
@observer
export default class StockDetailPage extends React.Component<RouteComponentProps<StockIndexPageProps>, null> {

    static linkPath = '/stock/detail/:stockCode';
    static path = '/stock/detail/';
    static defaultTitle = '';

    stockCode;
    firstLoading;
    @observable first;
    @observable error;
    mount = true;

    widthNotifier: WidthNotifier = null;

    constructor(props) {
        super(props);

        this.stockCode = this.props.match.params.stockCode;

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

    loadDone = () => {
        if (!this.mount) {
            return;
        }
        barInteraction.title = stockBaseInfoDataSource.$.stock.delistedDate?stockBaseInfoDataSource.$.stock.shortName+"(已退市)":stockBaseInfoDataSource.$.stock.shortName;
        barInteraction.doUpdate();
    };

    jumpToSmart = (symbol) => {
        window.open(window.location.protocol + '//' +Constants.remoteHost+"/smartReport.html#/smartReport?symbol="+symbol);
    };

    setFixButton = () => {
        if (this.first) {
            return;
        }

        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        if (Util.small(this.widthNotifier.device)) {
            const attention =
                <Attention
                    type={EntityType.STOCK}
                    code={this.stockCode}
                    fixDrawer={fixDrawer}
                    style={AttentionStyle.FLOATING}
                />;
            const smartReportAction =
                <FloatingActionButton
                    mini
                    onTouchTap={
                        (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.jumpToSmart(this.stockCode);
                        }
                    }
                >
                    <JumpSmart/>
                </FloatingActionButton>
                ;
            if(!stockBaseInfoDataSource.$.stock.delistedDate){
                fixButtonManager.showDefaultMulti([{icon: attention, float: true},{icon:smartReportAction,float:true}]);
            }else {
                // fixButtonManager.showDefaultMulti([{icon: attention, float: true}]);
                fixButtonManager.showOnlyUp();
            }

        }else if (!fixDrawer) {
            fixButtonManager.showOnlyUp();
        } else {
            fixButtonManager.hidden();
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
        this.firstLoading = [false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.stockCode != this.stockCode) {
            window.location.reload();
        }
    }

    componentDidMount() {
        barInteraction.title = this.stockCode;
        barInteraction.custom = true;

        stockBaseInfoDataSource.reset();
        stockBaseInfoDataSource.setResultNotify(
            (err) => this.onNotifyFirstLoad(StockDetailComponent.HEADER, err)
        );
        stockBaseInfoDataSource.refresh();
    }

    componentDidUpdate() {
        $('.scrollspy').scrollSpy();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier(this.setFixButton);

        this.restore();

        stockBaseInfoDataSource.stockCode = this.stockCode;

        Util.scrollTopInstant();
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        this.mount = false;
        barInteraction.restore();
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
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
            paddingBottom:16
        },
        pointListContainer: {
            position: 'relative',
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
        contentSmall: {
        },
        increment: {
            color: red500,
        },
        decrement: {
            color: green500,
        },
    };

    render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);

        let attention = (
            <Attention
                type={EntityType.STOCK}
                code={this.stockCode}
                fixDrawer={fixDrawer}
                style={small ? AttentionStyle.FLOATING : AttentionStyle.STOCK}
            />
        );

        let firstLoad = null;
        let graph = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        } else {

            /*graph = <div className="row-padding scrollspy" id="graph">
                <Paper>
                    <Subheader style={this.styles.header}>个股关系图谱</Subheader>
                    <Divider/>
                    <div style={this.styles.content}>
                        <GraphView identifier={this.stockCode} name={stockBaseInfoDataSource.$.stock.shortName} type="stock"/>
                    </div>
                </Paper>
            </div>*/
        }


        let left = null;
        if (!small) {
            if(barInteraction.title!=null){
                if(barInteraction.title.indexOf("已退市")!=-1){
                    attention=null;
                }
            }

            left = (
                <div>
                    <div role="stockBriefIntro" className="scrollspy" id="brief">
                        <StockHeader stock={stockBaseInfoDataSource.$} attention = {attention}/>
                    </div>
                    <div role="kline" className="row-padding scrollspy" id="kline">
                        <Paper>
                            <Subheader style={this.styles.header}>行情分析</Subheader>
                            <div style={this.styles.content}>
                                <KlineChartView
                                    symbol={this.stockCode}
                                />
                            </div>
                        </Paper>
                    </div>
                    <div role="opinionChart" className="row-padding scrollspy" id="opinion">
                        <Paper>
                            <Subheader style={this.styles.header}>个股情绪走势</Subheader>
                            <div style={this.styles.content}>
                                <ReportStockOpinionView
                                    stockCode={this.stockCode}
                                    monthNum={12}/>
                            </div>
                        </Paper>
                    </div>
                    <div role="stockRating" className="row-padding scrollspy" id="rating">
                        <Paper>
                            <Subheader style={this.styles.header}>个股专家评级</Subheader>
                            <Divider/>
                            <div style={this.styles.content}>
                                <AnalystRatingDetailView
                                    stockCode={this.stockCode}/>
                            </div>
                        </Paper>
                    </div>
                    <div role="analystViewPoint" className="row-padding scrollspy" id="point">
                        <Paper>
                            <Subheader style={this.styles.header}>热门观点</Subheader>
                            <Divider/>
                        </Paper>
                        <div style={this.styles.pointListContainer as any}>
                            <AnalystViewPointList viewPointSource={ViewPointListSource.STOCK_PAGE}
                                                  notifyResult={(err) => {this.onNotifyFirstLoad(StockDetailComponent.HOT_REPORTS, err)}}
                                                  small={small}
                                                  emptyFix
                                                  portrait={portrait}
                                                  id={this.stockCode}
                            />
                        </div>
                    </div>
                </div>

            );
        } else {
            let headerTitle: any = '重要指标';
            if (stockBaseInfoDataSource.$) {
                const stock = stockBaseInfoDataSource.$;

                const quotationSummary = stock.quotationSummary || {changeRatio : 0, change: 0, value : 0} as any;

                let rate = null;
                const rateText = Util.precisionRate2(quotationSummary.changeRatio,2,true);
                const changeText = Util.precisionIncrement(quotationSummary.change);
                const quotationText = " " + changeText + "/" + rateText;
                if (quotationSummary.change > 0) {
                    rate = <span style={this.styles.increment}>{quotationText}</span>;
                } else if (quotationSummary.change < 0) {
                    rate = <span style={this.styles.decrement}>{quotationText}</span>;
                } else {
                    rate = <span>{quotationText}</span>;
                }
                headerTitle = <span>{quotationSummary.value}{rate}</span>
            }

            left = (
                <div>
                    <div className="scrollspy" id="brief">
                        <ExpandableList
                            initialOpen={true}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title={headerTitle}
                            disableExpandable={false}
                            content={
                                <StockHeader stock={stockBaseInfoDataSource.$} small/>
                            }
                            linkMore=""
                        />
                    </div>
                    <div className="row-small-padding scrollspy" id="kline">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="行情分析"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.contentSmall}>
                                    <KlineChartView
                                        symbol={this.stockCode}
                                        small
                                    />
                                </div>
                            }
                            linkMore=""
                        />

                    </div>
                    <div className="row-small-padding scrollspy" id="opinion">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="个股情绪走势"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.contentSmall}>
                                    <ReportStockOpinionView
                                        stockCode={this.stockCode}
                                        small={small}
                                        monthNum={small ? 6 : 12}/>
                                </div>
                            }
                            linkMore=""
                            />
                    </div>
                    <div className="row-small-padding scrollspy" id="rating">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="个股专家评级"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.contentSmall}>
                                <AnalystRatingDetailView
                                stockCode={this.stockCode}/>
                                </div>
                            }
                            linkMore=""
                        />
                    </div>
                    <div className="row-small-padding scrollspy" id="point">
                        <ExpandableList
                            initialOpen={true}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="热门观点"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.pointListContainer as any}>
                                    <AnalystViewPointList viewPointSource={ViewPointListSource.STOCK_PAGE}
                                                          notifyResult={(err) => {this.onNotifyFirstLoad(StockDetailComponent.HOT_REPORTS, err)}}
                                                          small={small}
                                                          portrait={portrait}
                                                          emptyFix
                                                          id={this.stockCode}
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
                    <div className="fix-detail-width flex-start" style={this.first ? this.styles.hidden : this.styles.root}>

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
                                    <a href="#opinion">个股情绪走势</a>
                                </li>
                                <li>
                                    <a href="#rating">个股专家评级</a>
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

