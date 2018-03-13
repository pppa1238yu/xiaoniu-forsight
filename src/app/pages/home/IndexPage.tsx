import * as React from "react";
import SeveralIndexesComponent from "../../components/index/SeveralIndexes";
import HourlyNewsView from "../../components/index/HourlyNewsView";
import HotAnalystView from "../../components/index/HotAnalystView";
import AnalystViewPointList, {ViewPointListSource} from "../../components/analyst/AnalystViewPointList";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import {FirstLoading} from "../../components/common/Loading";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import EastmoneySentimentView from "../../components/index/EastmoneySentimentView";
import ExpandableList from "../../components/common/ExpandableList";
import {Tab, Tabs} from "material-ui/Tabs";
import  NotifyBox from "../../components/common/NotifyBox";
import {
    red500,
} from "material-ui/styles/colors";
import StockTrend from "../../components/index/StockTrend";
import {RecommendedSystemView, RecommendedListSource} from "../../components/index/RecommendedSystemView";
import SmartReportEntryView from "../../components/index/SmartReportEntryView";
import Explain from "../../components/common/Explain";
import Help from "material-ui/svg-icons/action/help";
import {Link} from "react-router-dom";
import SmartAccountPage from "../smartAccount/SmartAccountPage";
import HotOpportunities from "../../components/index/HotOpportunities";


enum IndexComponent {
    NOTICE,
    HOT_NEWS,
    NEWS_FLASH,
    SUGGEST_REPORT,
    HOT_OPP,
    STOCK_TREND
}


const SENTIMENT_DAYS = 50;

@observer
export default class IndexPage extends React.Component<any, any> {

    static path = "/discover";
    static title = '发现';

    @observable first;
    @observable error;
    defaultViewPoint;
    firstLoading = [];
    mount = true;

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = IndexPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
        this.mount = false;
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    restore() {
        this.firstLoading = [ false, false, false, false, false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        })
    }

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
        }
    }

    componentWillMount() {
        this.restore();
        this.widthNotifier = widthListener.createWidthNotifier();

        Util.scrollTopInstant();
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
                this.first = false;
                fixButtonManager.showOnlyUp();
            } else {
                //continue wait
            }

        }
    };

    styles = {
        hidden: {
            visibility: 'hidden',
        },
        show: {
            paddingBottom: 48,
        },
        fixRight: {},
        right: {
            paddingRight: 4,
        },
        floatButton: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 6,
        },
        pointListContainer: {
            position: 'relative',
        },
        maxWidth: {
            maxWidth: 918
        },
        imageBox: {
            width: '100%',
            height: 414,
            lineHeight: '414px',
            marginBottom: 6,
            backgroundColor: '#fff',
            backgroundImage: 'url("/images/banner.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        },
        imageTextStyle: {
            textAlign: 'center',
            color: '#fff',
            fontSize: 18,
            margin: 0
        },
        tabs: {
            position: 'relative',
            zIndex: 10,
            width: '100%',
            fontSize: '14px',
        },
        labelColor: {
            color: '#616161',
            borderBottom: '1px solid #dfdfdf'
        },
        inkBarStyle: {
            backgroundColor: red500
        },
        zIndexStyle: {
            position: 'relative',
            zIndex: 1
        },
    };

    public render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const middleDown = Util.middleDown(this.widthNotifier.device);
        let firstLoad = null;
        let error = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        }
        let content = null;
        let modelTips = null;
        let hotTipsExplain = (
            <span title="基于多源的新闻特征与时间序列差异性特征,热点发现系统在热点爆发前能够对其有效识别。另外,结合自然语言处理技术,该系统能够对热点事件高效概括,并建立热点事件与新闻的关联关系。">
                热点发现 <Explain message="" onlyIcon={true}/>
            </span>
        );
        let hotTipsSmall = (<span>
            热点发现
        </span>);
        if (portrait || small) {
            content = (
                <div className="row-revert-margin" style={this.styles.right}>
                    <ExpandableList
                        initialOpen={false}
                        title="热门机会"
                        disableExpandable={false}
                        content={<HotOpportunities small={true}
                                                   notifyResult={(err) => this.onNotifyFirstLoad(IndexComponent.HOT_OPP, err)}/>}
                    />
                    <div role="smartReportEntry">
                        <SmartReportEntryView
                            small={true}
                            initialOpen={true}
                            limit={10}/>
                    </div>
                    <div className="row-small-padding">
                        <HotAnalystView/>
                    </div>
                    <div className="row-small-padding">
                        <HourlyNewsView/>
                    </div>
                    <div className="row-small-padding">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            title="股民舆情指数"
                            disableExpandable={false}
                            content={<StockTrend
                                notifyResult={(err) => {
                                    this.onNotifyFirstLoad(IndexComponent.STOCK_TREND, err)
                                }}
                                small={true}/>}
                            linkMore=""
                        />
                    </div>
                    <div className="row-small-padding" style={this.styles.zIndexStyle as any}>
                        <Paper >
                            <Tabs
                                inkBarStyle={this.styles.inkBarStyle}
                                style={this.styles.tabs}
                                tabItemContainerStyle={{backgroundColor: '#fff'}}
                            >
                                <Tab
                                    style={this.styles.labelColor}
                                    label={hotTipsSmall}>
                                    <RecommendedSystemView recommendedSource={RecommendedListSource.HOT_NEWS}
                                                           notifyResult={(err) => {
                                                               this.onNotifyFirstLoad(IndexComponent.HOT_NEWS, err)
                                                           }}
                                                           small={small}
                                                           portrait={portrait}
                                    />
                                </Tab>
                                <Tab
                                    style={this.styles.labelColor}
                                    label="公告">
                                    <RecommendedSystemView recommendedSource={RecommendedListSource.NOTICE}
                                                           notifyResult={(err) => {
                                                               this.onNotifyFirstLoad(IndexComponent.NOTICE, err)
                                                           }}
                                                           small={small}
                                                           portrait={portrait}
                                                           ifNotice={true}
                                    />
                                </Tab>

                                <Tab
                                    style={this.styles.labelColor}
                                    label="研报">
                                    <div style={this.styles.pointListContainer as any}>
                                        <AnalystViewPointList viewPointSource={ViewPointListSource.SUGGESTION}
                                                              small={small}
                                                              portrait={portrait}
                                                              notifyResult={(err) => {
                                                                  this.onNotifyFirstLoad(IndexComponent.SUGGEST_REPORT, err)
                                                              }}
                                        />
                                    </div>
                                </Tab>
                                <Tab
                                    style={this.styles.labelColor}
                                    label="快讯">
                                    <RecommendedSystemView recommendedSource={RecommendedListSource.NEWS_FLASH}
                                                           notifyResult={(err) => {
                                                               this.onNotifyFirstLoad(IndexComponent.NEWS_FLASH, err)
                                                           }}
                                                           small={small}
                                                           portrait={portrait}
                                                           ifNotice
                                    />
                                </Tab>
                            </Tabs>
                        </Paper>
                    </div>
                </div>
            );
        } else {
            content = (
                <div className="row-no-margin flex-start" style={this.styles.right}>
                    <div className="fix-discover-left-width" style={this.styles.maxWidth}>
                        <div>
                            <Paper>
                                <Subheader>
                                    热门机会
                                </Subheader>
                                <div>
                                    <HotOpportunities
                                        notifyResult={(err) => this.onNotifyFirstLoad(IndexComponent.HOT_OPP, err)}/>
                                </div>
                            </Paper>
                        </div>
                        <div role="viewpoint" className="row-padding">
                            <Paper>
                                <Tabs
                                    inkBarStyle={this.styles.inkBarStyle}
                                    style={this.styles.tabs}
                                    tabItemContainerStyle={{backgroundColor: '#fff'}}
                                >
                                    <Tab
                                        role="hotNews"
                                        style={this.styles.labelColor}
                                        label={hotTipsExplain}>
                                        <RecommendedSystemView recommendedSource={RecommendedListSource.HOT_NEWS}
                                                               notifyResult={(err) => {
                                                                   this.onNotifyFirstLoad(IndexComponent.HOT_NEWS, err)
                                                               }}
                                                               fixDrawer={!middleDown}
                                        />
                                    </Tab>
                                    <Tab
                                        role="notices"
                                        style={this.styles.labelColor}
                                        label="公告">
                                        <RecommendedSystemView recommendedSource={RecommendedListSource.NOTICE}
                                                               notifyResult={(err) => {
                                                                   this.onNotifyFirstLoad(IndexComponent.NOTICE, err)
                                                               }}
                                                               fixDrawer={!middleDown}
                                                               ifNotice={true}
                                        />
                                    </Tab>
                                    <Tab
                                        role="reports"
                                        style={this.styles.labelColor}
                                        label="研报">
                                        <div style={this.styles.pointListContainer as any}>
                                            <AnalystViewPointList viewPointSource={ViewPointListSource.SUGGESTION}
                                                                  fixDrawer={!middleDown}
                                                                  notifyResult={
                                                                      (err) => {
                                                                          this.onNotifyFirstLoad(IndexComponent.SUGGEST_REPORT, err)
                                                                      }
                                                                  }
                                            />
                                        </div>
                                    </Tab>
                                    <Tab
                                        role="newsFlash"
                                        style={this.styles.labelColor}
                                        label="快讯">
                                        <RecommendedSystemView recommendedSource={RecommendedListSource.NEWS_FLASH}
                                                               notifyResult={(err) => {
                                                                   this.onNotifyFirstLoad(IndexComponent.NEWS_FLASH, err)
                                                               }}
                                                               ifNotice={true}
                                                               fixDrawer={!middleDown}
                                        />
                                    </Tab>
                                </Tabs>
                            </Paper>
                        </div>
                    </div>
                    <div className="auto-right fix-discover-right-width" style={this.styles.fixRight}>
                        <div role="stockTrend">
                            <StockTrend
                                notifyResult={(err) => {
                                    this.onNotifyFirstLoad(IndexComponent.STOCK_TREND, err)
                                }}
                                small={small}
                            />
                        </div>
                        <div role="smartReportEntry">
                            <SmartReportEntryView initialOpen={true} disableExpandable={true} newWindow={true}/>
                        </div>
                        <div role="hotAnalysts" className="row-padding">
                            <HotAnalystView initialOpen disableExpandable/>
                        </div>
                        <div role="hourlyNews" className="row-padding">
                            <HourlyNewsView initialOpen disableExpandable/>
                        </div>
                    </div>
                </div>
            );

            modelTips = (
                <NotifyBox
                    title="新功能提示"
                    content="结合公司人工智能方面的技术优势，我们隆重推出智能研报产品。您只需要输入代码/股票简称，便可一键生成一份最新的系统化、多维度投资分析报告。"
                />
            )

        }

        return (
            <div style={(small || portrait) ? {} : this.styles.show}>
                {firstLoad}
                {error}
                <div className="fix-discover-width"
                     style={this.first ? this.styles.hidden : {}}>
                    <div className="row-padding">
                        <SeveralIndexesComponent
                            middleDown={middleDown}
                            small={small}
                        />
                    </div>
                    {content}
                    {/*{modelTips}*/}
                </div>
            </div>
        );
    }
}
