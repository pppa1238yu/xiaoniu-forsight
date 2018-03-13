import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import KlineChartView from "../../components/stock/KlineChartView";
import {observable, runInAction} from "mobx";
import EastmoneySentimentView from "../../components/index/EastmoneySentimentView";
import {barInteraction} from "../../components/bar/BarInteraction";
import {http} from "../../model/ajax/Http";
import {Util} from "../../Constants";
import {FirstLoading} from "../../components/common/Loading";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
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
import Chip from "material-ui/Chip";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {IdxBasicInfo} from "../../model/entities/IdxBasicInfo";
import {FormatNum} from "../../utils/NumberFormat";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";

declare let $;

interface IdxIndexPageProps {
    symbol: string;
}

@observer
export default class IdxDetailPage extends React.Component<RouteComponentProps<IdxIndexPageProps>, null> {

    static linkPath = '/idx/detail/:symbol';
    static path = '/idx/detail/';

    name;
    isHome: boolean = null;
    code;
    idxBasicInfo: IdxBasicInfo;
    @observable first;
    @observable error;
    mount = true;

    widthNotifier: WidthNotifier = null;

    constructor(props) {
        super(props);

        this.code = this.props.match.params.symbol;

    }

    loadDone = () => {
        if (!this.mount) {
            return;
        }

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

    restore() {
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.code != this.code) {
            window.location.reload();
        }
    }

    componentDidMount() {
        this.loadIdxBasicInfo(this.code);

    }

    componentDidUpdate() {
        $('.scrollspy').scrollSpy();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        this.restore();

        Util.scrollTopInstant();
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        this.mount = false;
        barInteraction.restore();
        tipManager.hidden();
    }

    private loadIdxBasicInfo(symbol: string) {
        http.post("/idx/idxBasicInfo.json", {symbol}).then((idxBasicInfo) => {
            this.idxBasicInfo = idxBasicInfo;
            this.isHome = this.idxBasicInfo.idx.home;
            this.name = this.idxBasicInfo.idx.shortName;
            this.loadDone();

            this.first = false;
        }).catch(() => {
            this.error = true;
            this.setError();
        })
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
        contentSmall: {
        },
        increment: {
            color: red500,
        },
        decrement: {
            color: green500,
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
    };

    render() {
        const small = Util.small(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);

        if (this.first && !this.error) {
            return <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        }

        let left = null;

        let quotationSummary = this.idxBasicInfo.quotationSummary;

        let rate = null;
        const rateText = Util.precisionRate2(quotationSummary.changeRatio, 2,true);
        const changeText = Util.precisionIncrement(quotationSummary.change);
        const quotationText = " " + changeText + "/" + rateText;
        if (quotationSummary.change > 0) {
            rate = <span style={this.styles.incrementText}>{quotationText}</span>;
        } else if (quotationSummary.change < 0) {
            rate = <span style={this.styles.decrementText}>{quotationText}</span>;
        } else {
            rate = <span style={this.styles.text}>{quotationText}</span>;
        }


        const idxMarketValue = this.idxBasicInfo.idxMarketValue || {} as any;
        let marketValue = new FormatNum(idxMarketValue.totalMarketValue || 0);
        let circleValue = new FormatNum(idxMarketValue.criculationMarketValue || 0);
        const idxAverageAmount = this.idxBasicInfo.idxAverageAmount || {} as any;
        let average = new FormatNum(idxAverageAmount.average || 0);
        let changeRatio = new FormatNum(idxAverageAmount.changeRatio || 0);
        if (!small) {
            left = (
                <div>
                    <div role="briefIntro" className="scrollspy" id="brief">
                        <Card style={this.styles.cardContainer}>
                            <CardHeader
                                style={this.styles.cardHeader}
                                title={
                                    <span role="indexName">{this.name + " "}<span role="indexValueAndChangeRatio" style={this.styles.quotation}>{quotationSummary.value}
                                        {rate}</span></span>
                                }
                                titleStyle={this.styles.title}
                            />
                            {this.isHome ?
                                <CardText style={this.styles.datum}>
                                    <Table>
                                        <TableBody
                                            displayRowCheckbox={false}
                                            showRowHover
                                        >
                                            <TableRow>
                                                <TableRowColumn style={this.styles.tableCell}>{this.code=="399001"||this.code=="399106"?"深证A股数":"成分股数"}</TableRowColumn>
                                                <TableRowColumn>
                                                    <div role="containStocks" className="flex-center-wrap"
                                                         style={this.styles.otherChipContainer}>
                                                        <Chip style={this.styles.chip}
                                                              labelStyle={this.styles.changeLabel}
                                                              backgroundColor={blueGrey500}
                                                        >
                                                            {"共 " + this.idxBasicInfo.idxMarketValue.sampleNumber + " 只"}
                                                        </Chip>
                                                        <Chip style={this.styles.chip}
                                                              labelStyle={this.styles.changeLabel}
                                                              backgroundColor={blueGrey500}
                                                        >
                                                            {"较上月末增加 " + (this.idxBasicInfo.idxSampleChangeNumber?(this.idxBasicInfo.idxSampleChangeNumber.enterNumber-this.idxBasicInfo.idxSampleChangeNumber.outNumber):0) + " 只"}
                                                        </Chip>
                                                    </div>

                                                </TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn style={this.styles.tableCell}>成分市值</TableRowColumn>
                                                <TableRowColumn>
                                                    <div role="marketValue" className="flex-center-wrap"
                                                         style={this.styles.otherChipContainer}>
                                                        <Chip style={this.styles.chip}
                                                              labelStyle={this.styles.changeLabel}
                                                              backgroundColor={blueGrey500}
                                                        >
                                                            {"总市值：" + marketValue.value.toFixed(2) + " " + marketValue.unit + "元"}
                                                        </Chip>
                                                        <Chip style={this.styles.chip}
                                                              labelStyle={this.styles.changeLabel}
                                                              backgroundColor={blueGrey500}
                                                        >
                                                            {"流通市值：" + circleValue.value.toFixed(2) + " " + circleValue.unit + "元"}
                                                        </Chip>
                                                    </div>
                                                </TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn style={this.styles.tableCell}>日均成交</TableRowColumn>
                                                <TableRowColumn>
                                                    <div role="dailyTurnover" className="flex-center-wrap"
                                                         style={this.styles.otherChipContainer}>
                                                        <Chip style={this.styles.chip}
                                                              labelStyle={this.styles.changeLabel}
                                                              backgroundColor={blueGrey500}
                                                        >
                                                            {average.value.toFixed(2) + " " + average.unit + "元"}
                                                        </Chip>
                                                        <Chip style={this.styles.chip}
                                                              labelStyle={this.styles.changeLabel}
                                                              backgroundColor={blueGrey500}
                                                        >
                                                            {"环比增长：" + (changeRatio.value*100).toFixed(2) + "%"}
                                                        </Chip>
                                                    </div>
                                                </TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardText>
                                : null
                            }
                        </Card>
                    </div>
                    <div role="kline" className="row-padding scrollspy" id="kline">
                        <Paper>
                            <Subheader style={this.styles.header}>行情分析</Subheader>
                            <div style={this.styles.content}>
                                <KlineChartView symbol={this.code} isIdx={true} isHome={this.isHome}/>
                            </div>
                        </Paper>
                    </div>
                </div>

            );
        } else {
            left = (
                <div>
                    <div className="scrollspy" id="brief">
                        {this.isHome ?
                            <ExpandableList
                                initialOpen={true}
                                needMore={false}
                                moreLabel=""
                                onMoreClicked={() => {
                                }}
                                title={
                                    <span style={this.styles.quotation}>{quotationSummary.value}
                                        {rate}</span>
                                }
                                disableExpandable={!this.isHome}
                                content={ this.isHome ?
                                    <div style={this.styles.cardContainerSmall}>
                                        <Table>
                                            <TableBody
                                                displayRowCheckbox={false}
                                                showRowHover
                                            >
                                                <TableRow>
                                                    <TableRowColumn style={this.styles.tableCellSmall}>
                                                        {this.code=="399001"||this.code=="399106"?"深证A股数":"成分股数"}
                                                    </TableRowColumn>
                                                    <TableRowColumn style={this.styles.tableContent}>
                                                        {this.idxBasicInfo.idxMarketValue.sampleNumber}
                                                    </TableRowColumn>
                                                </TableRow>
                                                <TableRow>
                                                    <TableRowColumn style={this.styles.tableCellSmall}>
                                                        总市值
                                                    </TableRowColumn>
                                                    <TableRowColumn style={this.styles.tableContent}>
                                                        {marketValue.value.toFixed(2) + " " + marketValue.unit + "元"}
                                                    </TableRowColumn>
                                                </TableRow>
                                                <TableRow>
                                                    <TableRowColumn style={this.styles.tableCellSmall}>
                                                        流通市值
                                                    </TableRowColumn>
                                                    <TableRowColumn style={this.styles.tableContent}>
                                                        {circleValue.value.toFixed(2) + " " + circleValue.unit + "元"}
                                                    </TableRowColumn>
                                                </TableRow>
                                                <TableRow>
                                                    <TableRowColumn style={this.styles.tableCellSmall}>
                                                        日均成交
                                                    </TableRowColumn>
                                                    <TableRowColumn style={this.styles.tableContent}>
                                                        {marketValue.value.toFixed(2) + " " + marketValue.unit + "元"}
                                                    </TableRowColumn>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    : <div/>
                                }
                                linkMore=""
                            /> :
                            <Paper>
                            <Subheader>
                                    <span style={this.styles.quotation}>{quotationSummary.value}
                                        {rate}</span>
                            </Subheader>
                            </Paper>
                        }
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
                                    <KlineChartView symbol={this.code} isIdx={true} isHome={this.isHome} small/>
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
                    <div style={this.styles.rootSmall}>
                        {left}
                    </div>
                </div>
            );
        } else {

            return (
                <div style={this.styles.container as any}>
                    <div className="fix-detail-width flex-start" style={this.styles.root}>

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
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

