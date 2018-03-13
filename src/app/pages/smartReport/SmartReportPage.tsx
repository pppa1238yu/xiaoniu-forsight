import * as React from "react";
//页面中的自定义组件
//自定义的公共组件
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import {FirstLoading} from "../../components/common/Loading";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import EastmoneySentimentView from "../../components/index/EastmoneySentimentView";
import ExpandableList from "../../components/common/ExpandableList";
import BasicAnalysisGrow from "../../components/smartReport/BasicAnalysisGrow";
import BasicAnalysisProfit from "../../components/smartReport/BasicAnalysisProfit";
import ExpectValuation  from "../../components/smartReport/ExpectValuation";
import HistoryValuation from "../../components/smartReport/HistoryValuation";
import FinancingSecuritiesTendency from "../../components/smartReport/FinancingSecuritiesTendency";
import {
    yearGrowthIndicatorDataSource,
    ttmGrowthIndicatorDataSource,
    yearProfitabilityIndicatorDataSource,
    ttmProfitabilityIndicatorDataSource
} from "../../model/ajax/SmartReportService";
//第三方库
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {Tab, Tabs} from "material-ui/Tabs";
import {
    red500,
} from "material-ui/styles/colors";

import ReportHead from "../../components/smartReport/ReportHead";

import Benefit from "../../components/smartReport/Benefit";
import WeChatShow from "../../components/smartReport/WeChatShow";
import {RouteComponentProps} from "react-router";
//手机端页面
import ReportHeadSmall from "../../components/smartReport/ReportHeadSmall";
import If from "../../components/common/If";
import BasicAnalysicMobile  from "../../components/smartReport/BasicAnalysicMobile";
import BasicAnalysicProfitMobile from "../../components/smartReport/BasicAnalysicProfitMobile";
import ValuationPage from "../weChat/ValuationPage";
import Constants from "../../Constants";
import {financingSecuritiesTendencyDataSource} from "../../model/ajax/SmartReportService";
import FloatingActionButton from "material-ui/FloatingActionButton";
import DownLoadPdf from "material-ui/svg-icons/file/cloud-download";


enum SmartReport {
    HISTORY_VALUATION,
    BENEFIT,
    REPORTHEAD,
    HOTCATEGRAY,
    RISK,
    SHENWAN,
    TTM_GROW,
    YEAR_GROW,
    YEAR_PROFIT,
    TTM_PROFIT,
    EXPECT_VALUATION,
    FINANCING_SECURITIES_TENDENCY
}

@observer
export default class SmartReportPage extends React.Component<RouteComponentProps<null>, any> {

    static path = '/smartReport';

    static title = '智能研报';

    @observable first;
    @observable error;
    firstLoading = [];
    mount = true;

    totalScore = 0;

    private symbol: string;

    private pdf: boolean;

    widthNotifier: WidthNotifier = null;

    constructor(props: RouteComponentProps<null>, context?: any) {
        super(props, context);
        for (let nameValuePair of this.props.location.search.split(/\?|&/)) {
            let arr = nameValuePair.split('=');
            switch (arr[0]) {
                case "symbol":
                    this.symbol = arr[1];
                    break;
                case "pdf":
                    this.pdf = arr[1] == "true";
                    break;
            }
        }
    }

    componentDidMount() {
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        Constants.smartTotalScore = 0;
        barInteraction.restore();
        this.mount = false;
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    restore() {
        this.firstLoading = [false, false, false, false, false, false, false, false, false, false, false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    setFixButton = () => {
        if (this.first) {
            return;
        }
        if (Util.small(this.widthNotifier.device)) {
            const getPdf =
                <FloatingActionButton
                    mini
                    onTouchTap={
                        (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(
                                '/intelligentReport/pdf?symbol='+this.symbol
                            );
                        }
                    }
                >
                    <DownLoadPdf/>
                </FloatingActionButton>;
            fixButtonManager.showDefaultMulti([{icon: getPdf, float: true}]);
        }
    };

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
        }
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier(this.setFixButton);
        this.restore();
        Util.scrollTopInstant();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search.split('=')[1] != this.symbol) {
            window.location.reload();
        }
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
                this.setFixButton();
                this.totalScore = Constants.smartTotalScore;
            } else {
                //continue wait
            }

        }
    };

    styles = {
        scanImage: {
            height: 60,
            verticalAlign: 'bottom'
        },
        smallImage: {
            height: 40,
            verticalAlign: 'bottom'
        },
        title: {
            padding: '20px 0'
        },
        logoStyle: {
            width: 160,
            paddingTop: 60,
            paddingBottom: 40
        },
        footerText: {
            fontSize: 12,
            color: '#000'
        },
        valuationWidth: {
            width: "100%"
        },
        errorText: {
            color: '#0b0703',
            fontSize: 24
        },
        padding: {
            padding: '0 10px'
        },
        boxPadding: {
            padding: 20
        },
        imgLogoStyle: {
            display: 'inline-block',
            width: 100,
            height: 42,
            paddingBottom: 20
        },
        imgBox: {
            padding: '30px 0',
            textAlign: 'center',
        }
    };

    public render() {
        const small = Util.small(this.widthNotifier.device);

        let firstLoad = null;
        let error = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={true}/>;
        } else if (this.first && this.error) {
            return (
                <div className="fullScreen flexCenter">
                    <span className="center-align" style={this.styles.errorText as any}>生成智能研报失败</span>
                </div>
            );
        }

        return (
            <div className="fullScreen">
                {firstLoad}
                {error}
                <If condition={!small} block={true}>
                    <div className={this.first ? "hidden" : "smartReportPage"}>
                        <ReportHead
                            symbol={this.symbol}
                            score={this.totalScore}
                            pdf={this.pdf}
                            notifyResultHead={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.REPORTHEAD, err)
                                }
                            }
                            notifyResultHotCategray={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.HOTCATEGRAY, err)
                                }
                            }
                            notifyResultRisk={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.RISK, err)
                                }
                            }
                            notifyResultShenWan={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.SHENWAN, err)
                                }
                            }
                        />
                        <div style={{width:1200}}>
                            <FinancingSecuritiesTendency symbol={this.symbol} notifyResult={(err) => {
                                this.onNotifyFirstLoad(SmartReport.FINANCING_SECURITIES_TENDENCY, err)
                            }
                            }/>
                        </div>


                        <div className="fullItem">
                            <div style={this.styles.title}>
                                <img src="/images/scan.png" style={this.styles.scanImage}/>
                                <span className="titleBold boldText commen-pdl10">基本面分析</span>
                            </div>

                            <div className="flexBoxNormal">
                                <div role="growthAnalysis" className="leftItem">
                                    <div className="boxShadow reportHeader">
                                        <BasicAnalysisGrow title="成长性分析"
                                                           symbol={this.symbol}
                                                           notifyResultYear={
                                                               (err) => {
                                                                   this.onNotifyFirstLoad(SmartReport.YEAR_GROW, err)
                                                               }
                                                           }
                                                           notifyResultTTM={
                                                               (err) => {
                                                                   this.onNotifyFirstLoad(SmartReport.TTM_GROW, err)
                                                               }
                                                           }

                                        />
                                    </div>
                                    <div className="boxShadow reportHeader commen-mgt10">
                                        <BasicAnalysisProfit title="盈利性分析"
                                                             symbol={this.symbol}
                                                             notifyResultYear={
                                                                 (err) => {
                                                                     this.onNotifyFirstLoad(SmartReport.YEAR_PROFIT, err)
                                                                 }
                                                             }
                                                             notifyResultTTM={
                                                                 (err) => {
                                                                     this.onNotifyFirstLoad(SmartReport.TTM_PROFIT, err)
                                                                 }
                                                             }

                                        />
                                    </div>
                                </div>

                                <div className="rightItem">
                                    <div role="forecastProfitAnalysis" className="boxShadow">
                                        <Benefit
                                            symbol={this.symbol}
                                            notifyResult={
                                                (err) => {
                                                    this.onNotifyFirstLoad(SmartReport.BENEFIT, err)
                                                }}
                                        />
                                    </div>
                                    <div role="WeChatShow" className="boxShadow reportHeader commen-mgt10">
                                        <WeChatShow/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fullItem">
                            <div style={this.styles.title}>
                                <img src="/images/clock.png" style={this.styles.scanImage}/>
                                <span className="titleBold boldText commen-pdl10">估值分析</span>
                            </div>
                            <div role="valuation" className="flexBoxSmall boxShadow">
                                <div style={this.styles.valuationWidth} className="reportHeader">
                                    <ExpectValuation
                                        symbol={this.symbol}
                                        notifyResult={(err) => {
                                            this.onNotifyFirstLoad(SmartReport.EXPECT_VALUATION, err)
                                        }}
                                    />
                                </div>
                                <div style={this.styles.valuationWidth} className=" reportHeader">
                                    <HistoryValuation
                                        symbol={this.symbol}
                                        notifyResult={(err) => {
                                            this.onNotifyFirstLoad(SmartReport.HISTORY_VALUATION, err)
                                        }}
                                    />
                                </div>
                            </div>

                            <div role="footerOfSmartReport" className="fullItem footer">
                                <img src="/images/mainLogo.png" style={this.styles.logoStyle}/>
                                <p style={this.styles.footerText}>
                                    免责声明:报告中的内容和意见仅供参考，并不构成对所述证券买卖的出价或询价。投资者对其投资行为负完全责任，我公司及其雇员对使用本报告及其内容所引发的直接或间接损失概不负责。</p>
                            </div>
                        </div>
                    </div>
                </If>
                {/*当不是small的时候*/}
                <If condition={small} block={true}>
                    <div className={this.first ? "hidden" : "fullScreen"} style={this.styles.padding}>
                        {/*<div style={this.styles.padding}>*/}
                        <ReportHeadSmall
                            symbol={this.symbol}
                            score={this.totalScore}
                            notifyResultHead={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.REPORTHEAD, err)
                                }
                            }
                            notifyResultHotCategray={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.HOTCATEGRAY, err)
                                }
                            }
                            notifyResultRisk={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.RISK, err)
                                }
                            }
                            notifyResultShenWan={
                                (err) => {
                                    this.onNotifyFirstLoad(SmartReport.SHENWAN, err)
                                }
                            }
                        />

                        <FinancingSecuritiesTendency
                            symbol={this.symbol}
                            small = {true}
                            notifyResult={(err) => {
                                this.onNotifyFirstLoad(SmartReport.FINANCING_SECURITIES_TENDENCY, err)
                            }}
                        />

                        <div className="fullScreen">
                            <div className="titleBoldSmall">
                                <img src="/images/scan.png" style={this.styles.smallImage}/>
                                <span className="boldText commen-pdl10">基本面分析</span>
                            </div>
                            <div className="flexBoxSmall">

                                <div role="growthAnalysis" className="fullScreen">
                                    <div className="boxShadow reportHeader">
                                        <BasicAnalysicMobile title="成长性分析"
                                                             symbol={this.symbol}
                                                             notifyResultYear={
                                                                 (err) => {
                                                                     this.onNotifyFirstLoad(SmartReport.YEAR_GROW, err)
                                                                 }
                                                             }
                                                             notifyResultTTM={
                                                                 (err) => {
                                                                     this.onNotifyFirstLoad(SmartReport.TTM_GROW, err)
                                                                 }
                                                             }
                                        />
                                    </div>

                                    <div className="boxShadow reportHeader commen-mgt10">
                                        <BasicAnalysicProfitMobile title="盈利性分析"
                                                                   symbol={this.symbol}
                                                                   notifyResultYear={
                                                                       (err) => {
                                                                           this.onNotifyFirstLoad(SmartReport.YEAR_PROFIT, err)
                                                                       }
                                                                   }
                                                                   notifyResultTTM={
                                                                       (err) => {
                                                                           this.onNotifyFirstLoad(SmartReport.TTM_PROFIT, err)
                                                                       }
                                                                   }
                                        />
                                    </div>

                                </div>

                                <div className="commen-mgt10">

                                    <div role="forecastProfitAnalysis" className="boxShadow">
                                        <Benefit
                                            symbol={this.symbol}
                                            small={small}
                                            notifyResult={
                                                (err) => {
                                                    this.onNotifyFirstLoad(SmartReport.BENEFIT, err)
                                                }}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="fullScreen">
                                <div className="titleBoldSmall">
                                    <img src="/images/clock.png" style={this.styles.smallImage}/>
                                    <span className="boldText commen-pdl10">估值分析</span>
                                </div>
                                <div role="valuation" className="flexBoxSmall boxShadow" style={this.styles.boxPadding}>
                                    <ExpectValuation
                                        symbol={this.symbol}
                                        small={true}
                                        notifyResult={(err) => {
                                            this.onNotifyFirstLoad(SmartReport.EXPECT_VALUATION, err)
                                        }}
                                    />
                                    <HistoryValuation
                                        symbol={this.symbol}
                                        small={true}
                                        notifyResult={(err) => {
                                            this.onNotifyFirstLoad(SmartReport.HISTORY_VALUATION, err)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={this.styles.imgBox as any}>
                            <img src="/images/weChat/logo.png" alt="Logo" style={this.styles.imgLogoStyle}/>
                            <p style={this.styles.footerText}>
                                免责声明:报告中的内容和意见仅供参考，并不构成对所述证券买卖的出价或询价。投资者对其投资行为负完全责任，我公司及其雇员对使用本报告及其内容所引发的直接或间接损失概不负责。</p>
                        </div>
                    </div>
                </If>
            </div>
        )
    }

}
