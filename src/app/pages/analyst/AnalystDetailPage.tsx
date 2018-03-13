import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import AnalystDetailHeader from "../../components/analyst/AnalystDetailHeader";
import AnalystRankingView from "../../components/analyst/AnalystRankingView";
import ViewPointsAndBacktracking from "../../components/analyst/ViewPointsBacktracking";
import AnalystRatingView from "../../components/analyst/AnalystRatingView";
import {analystBaseInfoDataSource, analystRankingDataSource} from "../../model/ajax/AnalystService";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import {Util} from "../../Constants";
import {observable, runInAction} from "mobx";
import {barInteraction} from "../../components/bar/BarInteraction";
import AnalystViewPointList, {ViewPointListSource} from "../../components/analyst/AnalystViewPointList";
import ExpandableList from "../../components/common/ExpandableList";
import {FirstLoading} from "../../components/common/Loading";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    grey700,
    red300,
    red500,
    yellow600
} from "material-ui/styles/colors";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import Attention, {AttentionStyle} from "../../components/common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import Explain from "../../components/common/Explain";

interface AnalystDetailPageParams {
    researcherId: string;
}
declare let $;
enum AnalystDetailComponent {
    HEADER,
    HOT_REPORTS,
    VIEW_RATING,
}
@observer
export default class AnalystDetailPage extends React.Component<RouteComponentProps<AnalystDetailPageParams>, null> {
    static linkPath='/analyst/detail/:researcherId';
    static path='/analyst/detail/';

    code;
    name;
    firstLoading;
    @observable first;
    @observable error;
    mount = true;

    widthNotifier: WidthNotifier = null;

    constructor(props) {
        super(props);

        this.code = this.props.match.params.researcherId;
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier(this.setFixButton);
        this.restore();

        Util.scrollTopInstant();
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        this.mount = false;
        barInteraction.restore();
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.researcherId != this.code) {
            window.location.reload();
        }
    }

    restore() {
        this.firstLoading = [false, false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    componentDidMount(){

        analystBaseInfoDataSource.reset();
        analystBaseInfoDataSource.analystId = this.code;
        analystBaseInfoDataSource.setResultNotify(
            (err) => this.onNotifyFirstLoad(AnalystDetailComponent.HEADER, err)
        );
        analystBaseInfoDataSource.refresh();

        analystRankingDataSource.analystId = this.code;
        analystRankingDataSource.reset();
        analystRankingDataSource.setResultNotify(
            (err) => this.onNotifyFirstLoad(AnalystDetailComponent.VIEW_RATING, err)
        );
        analystRankingDataSource.refresh();
    }

    componentDidUpdate() {
        $('.scrollspy').scrollSpy();
    }

    loadDone = () => {
        if (!this.mount) {
            return;
        }
        this.name = analystBaseInfoDataSource.$.target.fullName;
        barInteraction.title = this.name;
        barInteraction.doUpdate();

    };

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
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
                this.loadDone();
                this.first = false;
                this.setFixButton();
            } else {
                //continue wait
            }

        }
    };

    setFixButton = () => {
        if (this.first) {
            return;
        }

        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        if (Util.small(this.widthNotifier.device)) {
            const attention =
                <Attention
                    type={EntityType.RESEARCHER}
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

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1
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
            paddingLeft: 56,
            paddingRight: 56,
        },

        header: {
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft:34
        },
        headerSmall: {
            paddingLeft: 2,
            paddingTop: 6,
            lineHeight: 'none',
            height: 36,
        },
        contentSmall: {

        },
        tableCell: {
            width: '12%',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
            textAlign: 'center',
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
        },
        linkChip: {
            marginRight: 4,
            cursor: "pointer",
            marginTop: 1,
            marginBottom: 1,
        },
        title: {
            fontSize: 24,
        },
        cardHeader: {
            paddingLeft: 36,
            paddingBottom: 16,
        },
        cardContainer: {
        },
        cardContainerSmall: {
            paddingLeft: 16,
        },
        quotation: {
            fontSize: 20,
        },
        incrementText: {
            color: red500,
            fontSize: 18,
        },
        decrementText: {
            color: green500,
            fontSize: 18,
        },
        text: {
            color: grey500,
            fontSize: 18,
        },
        pointListContainer: {
            position: 'relative',
        },
        rateView: {
            padding: '32px 16px 8px',
            flex: 4,
            display: 'flex',
            flexFlow: 'column',
        },
        rateText: {
            flex: 5,
        },
        rateViewSmall: {
            display: 'flex',
            flexFlow: 'column',
        },
        floatButton: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
    };

    render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        let left = null;
        let firstLoad = null;
        let header = null;
        let headerNotSmall = null;
        let ratingView = null;
        let special = false;
        let backView = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        } else {
            header = <AnalystDetailHeader
                            info={analystBaseInfoDataSource.$}
                            small={small}
                            fixDrawer={fixDrawer}
                            code={this.code}
                        />;

            if (!small) {
                headerNotSmall = <Paper className="flex-stretch">
                    <div style={this.styles.rateText}>
                        {header}
                    </div>
                    <div style={this.styles.rateView}>
                        <AnalystRankingView researcherId={this.code}/>
                    </div>
                </Paper>
            } else {
                ratingView = <div className="keep-aspect-ratio aspect-3-of-4">
                        <div className="aspect-target" style={this.styles.rateViewSmall}>
                            <AnalystRankingView researcherId={this.props.match.params.researcherId} small={true}/>
                        </div>
                    </div>;
            }

            const analyst = analystBaseInfoDataSource.$.target;
            let title:any = analyst.title;

            special = (title && title.id == 1);
            backView = <ViewPointsAndBacktracking portrait={portrait} small={small} fixDrawer={fixDrawer}/>;
        }

        let rating = null;
        if (special) {
            if (!small) {
                rating = (
                    <div role="stockRating" className="row-padding scrollspy" id="rating">
                        <Paper>
                            <Subheader style={this.styles.header}>个股评级</Subheader>
                            <div style={this.styles.content as any}>
                                <AnalystRatingView researcherId={this.props.match.params.researcherId}/>
                            </div>
                        </Paper>
                    </div>
                );
            } else {
                /*
                rating = (
                    <div className="row-padding scrollspy" id="rating">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="个股评级 "
                            disableExpandable={false}
                            content={
                                <div style={this.styles.contentSmall}>
                                <AnalystRatingView researcherId={this.props.match.params.researcherId}/>
                                </div>
                            }
                            linkMore=""
                        />
                    </div>

                );
                */
            }
        }

        if(!small){
            left =  (
                <div>
                    <div role="analystBriefIntro" className="scrollspy" id="brief">
                        {headerNotSmall}
                    </div>

                    <div role="backView"  className="row-padding scrollspy" id="backView">
                        <Paper>
                            <Subheader style={this.styles.header}>
                                观点回溯
                                <Explain
                                    message="通过将分析师发表观点的时间点与大盘指数/行业指数相结合，可以验证分析师研究的持续性和把握拐点能力。"
                                />
                            </Subheader>
                            <div style={this.styles.content as any}>
                                {backView}
                            </div>
                        </Paper>
                    </div>
                    {rating}
                    <div role="analystViewPoint" className="row-padding scrollspy" id="point">
                        <Paper>
                            <Subheader style={this.styles.header}>热门观点</Subheader>
                            <Divider/>
                        </Paper>
                        <div style={this.styles.pointListContainer as any}>
                            <AnalystViewPointList viewPointSource={ViewPointListSource.ANALYST_PAGE}
                                                  small={small}
                                                  emptyFix
                                                  portrait={portrait}
                                                  notifyResult={(err) => {this.onNotifyFirstLoad(AnalystDetailComponent.HOT_REPORTS, err)}}
                                                  id={this.props.match.params.researcherId}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            left = (
                <div>
                    <div className="scrollspy" id="brief">
                        <ExpandableList
                            initialOpen={true}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="分析师详情"
                            disableExpandable={false}
                            content={
                                header
                            }
                            linkMore=""
                        />
                    </div>
                    <div className="row-small-padding scrollspy" id="backView">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="分析师倾向"
                            disableExpandable={false}
                            content={
                                ratingView
                            }
                            linkMore=""
                        />
                    </div>
                    <div className="row-small-padding scrollspy" id="backView">
                        <ExpandableList
                            initialOpen={false}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="观点回溯"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.contentSmall}>
                                    <Explain
                                        message="通过将分析师发表观点的时间点与大盘指数/行业指数相结合，可以验证分析师研究的持续性和把握拐点能力。"
                                        toolTipWidth="260px"
                                    />
                                    {backView}
                                </div>
                            }
                            linkMore=""
                        />
                    </div>
                    {rating}
                    <div className="row-small-padding scrollspy" id="rating">
                        <ExpandableList
                            initialOpen={true}
                            needMore={false}
                            moreLabel=""
                            onMoreClicked={() => {}}
                            title="热门观点"
                            disableExpandable={false}
                            content={
                                <div style={this.styles.pointListContainer as any}>
                                    <AnalystViewPointList viewPointSource={ViewPointListSource.ANALYST_PAGE}
                                                          small={small}
                                                          portrait={portrait}
                                                          notifyResult={(err) => {this.onNotifyFirstLoad(AnalystDetailComponent.HOT_REPORTS, err)}}
                                                          emptyFix
                                                          id={this.props.match.params.researcherId}/>
                                </div>
                            }
                            linkMore=""
                        />
                    </div>

                </div>
            )
        }
        if(fixDrawer){
            return (
                <div style={this.styles.container as any}>
                    {firstLoad}
                    <div className="fix-detail-width flex-start" style={this.first ? this.styles.hidden : this.styles.root}>
                        <div  className="fix-detail-left-width">
                            {left}
                        </div>

                        <div className="fix-detail-right-width">
                            <ul>
                                <li>
                                    <a href="#brief">概览</a>
                                </li>
                                <li>
                                    <a href="#backView">观点回溯</a>
                                </li>
                                {special ?
                                    <li>
                                        <a href="#rating">个股评级</a>
                                    </li> : null
                                }
                                <li>
                                    <a href="#point">热门观点</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            );
        }else {
            return (
                <div style={this.styles.container as any}>
                    {firstLoad}
                    <div style={this.first ? this.styles.hiddenSmall : this.styles.rootSmall}>
                        {left}
                    </div>
                </div>
            );
        }

    }
}

