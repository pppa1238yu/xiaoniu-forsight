import * as React from "react";
import Constants from "../../Constants";
import {green500, grey300, grey500, orange300, red300, red400, red500} from "material-ui/styles/colors";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import Risk from "../../components/smartReport/Risk";
import HotCategray from "../../components/smartReport/HotCategray";
import ShenWanRaiseRank from "../../components/smartReport/ShenWanRaiseRank";
import {getStockDataSource} from "../../model/ajax/SmartReportService";
import If from "../common/If";
import {observable} from "mobx";
import RateLevel from "./RateLevel";

interface Props {
    symbol: string;
    pdf?: boolean;
    small?: boolean;
    notifyResultHead?: (any) => void;
    notifyResultHotCategray?: (any) => void;
    notifyResultRisk?: (any) => void;
    notifyResultShenWan?: (any) => void;
    score?: number;
    showScore?: boolean;
}

export default class ReportHead extends React.Component<Props, null> {

    componentWillUnmount() {
        getStockDataSource.setMount(false);
    }

    componentWillMount() {
        getStockDataSource.setMount(true);
    }

    componentDidMount() {
        getStockDataSource.setNotifyResult(this.props.notifyResultHead);
        getStockDataSource.resetWithId(this.props.symbol);
        getStockDataSource.request();
    }

    styles = {
        noBottomBorder: {
            height: 36,
            borderBottom: 'none',
        },
        tableCell: {
            width: '58px',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
            textAlign: 'left',
        },
        tableTopCell: {
            width: '58px',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 7,
            textAlign: 'left',
            verticalAlign: 'top'
        },
        contentCell: {
            paddingLeft: 2,
            paddingRight: 0,
            textAlign: 'left',
            whiteSpace: 'wrap'
        },
        centerCell: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'right',
            color: '#101010',
        },
        centerCellFir: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'left',
            color: '#101010',
            fontWeight: 600,
            whiteSpace: 'normal',
            borderRight: '1px solid #ccc'
        },
        centerCellHeader: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'right',
            color: '#101010',
            fontWeight: 600
        },
        changeLabel: {
            color: 'white',
            height: '24px',
            lineHeight: '24px'
        },
        lableStyle: {
            fontSize: 12,
            color: '#616161',
            lineHeight: '24px'
        },
        inlineBox: {
            display: 'inline-block',
            verticalAlign: 'top'
        },
        fullWidth: {
            width: '100%',
            paddingBottom: 20
        },
        viewConfigPadding: {
            paddingRight: 20
        },
        smallPaddingBox: {
            margin: '30px 0px 10px 0px'
        }
    };

    calcRate = (num, rate?) => {
        if (num == undefined) return "-";
        num = num.toFixed(2);
        if (rate) {
            if (num < 0) return (<span className="colorGreen">{num}{rate}</span>);
            if (num > 0) return (<span className="colorRed">+{num}{rate}</span>);
            if (num == 0) return (<span className="commen-color">+{num}{rate}</span>)
        } else {
            if (num < 0) return (<span className="colorGreen">{num}</span>);
            if (num > 0) return (<span className="colorRed">+{num}</span>);
            if (num == 0) return (<span className="commen-color">+{num}</span>)
        }
    };

    calcNaNType = (num, type?) => {
        if (num == undefined) return "-";
        num = num.toFixed(2);
        if (type) {
            return (<span>{num}{type}</span>)
        } else {
            return (<span>{num}</span>)
        }
    };

    render() {

        const dataSource = getStockDataSource.$;
        const
            items = dataSource.items.slice(),
            quotationSummary = dataSource.basicInfo.quotationSummary,
            perShare = dataSource.basicInfo.perShare,
            valuationMetric = dataSource.basicInfo.valuationMetric,
            industryNames = dataSource.industryNames,
            stock = dataSource.basicInfo.stock;

        let subjects = stock.subjects.map(v => v.name);
        const headData = {
            headImg: Constants.imageBaseUrl + stock.imageId,
            title: quotationSummary.shortName,
            symbol: quotationSummary.symbol,
            price: quotationSummary.value,
            up: quotationSummary.change,
            rate: quotationSummary.changeRatio,
            per: perShare.eps,
            ttm: valuationMetric.peTtm,
            industry: industryNames,
            main: [stock.company.mainBusiness ? stock.company.mainBusiness : '暂无'],
            categray: subjects,
            score: this.props.score
        };

        let nowDate = new Date();
        let year = nowDate.getFullYear(),
            month = nowDate.getMonth() + 1,
            day = nowDate.getDate();

        const nowTime = year + "." + month + "." + day;

        let tableHeader = null;

        tableHeader = (
            <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                style={this.styles.noBottomBorder}
            >
                <TableRow>
                    <TableHeaderColumn role="currentDate"
                                       style={this.styles.centerCellFir}>{nowTime}</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>主营收入(万元)</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>收入比例</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>主营成本(万元)</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>成本比例</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>毛利占比</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>毛利率</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );

        let tableRowColumn = [];

        items.map((item, index) => {
            if (!this.props.small) {
                tableRowColumn.push(
                    <TableRow style={this.styles.noBottomBorder} key={index}>
                        <TableRowColumn style={this.styles.centerCellFir}>
                            {item.name}
                        </TableRowColumn>
                        <TableRowColumn role="earning" style={this.styles.centerCell}>
                            {this.calcNaNType(item.earning / 10000)}
                        </TableRowColumn>
                        <TableRowColumn role="earningProportion" style={this.styles.centerCell}>
                            {this.calcNaNType(item.earningProportion, '%')}
                        </TableRowColumn>
                        <TableRowColumn role="cost" style={this.styles.centerCell}>
                            {this.calcNaNType((item.cost ? item.cost : 0) / 10000)}
                        </TableRowColumn>
                        <TableRowColumn role="costProportion" style={this.styles.centerCell}>
                            {this.calcNaNType(item.costProportion, '%')}
                        </TableRowColumn>
                        <TableRowColumn role="grossMarginProportion" style={this.styles.centerCell}>
                            {this.calcNaNType(item.grossMarginProportion, '%')}
                        </TableRowColumn>
                        <TableRowColumn role="grossMarginRate" style={this.styles.centerCell}>
                            {this.calcNaNType(item.grossMarginRate, '%')}
                        </TableRowColumn>
                    </TableRow>
                )
            } else {
                tableRowColumn.push(
                    <TableRow style={this.styles.noBottomBorder} key={index}>
                        <TableRowColumn style={this.styles.centerCellFir}>
                            {item.name}
                        </TableRowColumn>
                        <TableRowColumn role="earning" style={this.styles.centerCell}>
                            {this.calcNaNType(item.earning / 10000)}
                        </TableRowColumn>
                        <TableRowColumn role="grossMarginRate" style={this.styles.centerCell}>
                            {this.calcNaNType(item.grossMarginRate, '%')}
                        </TableRowColumn>
                    </TableRow>
                )
            }

        });

        let mainProducts = headData.main.join(' ; ');
        let theme = headData.categray.join(' , ');
        let industry = headData.industry.join(' - ');

        let price = null;
        if (headData.rate > 0) {
            price = (
                <span role="stockPrice"
                      className="colorRed boldText font50 commen-pdl20">{headData.price.toFixed(2)}</span>
            )
        } else if (headData.rate < 0) {
            price = (
                <span role="stockPrice"
                      className="colorGreen boldText font50 commen-pdl20">{headData.price.toFixed(2)}</span>
            )
        } else {
            price = (
                <span role="stockPrice"
                      className="commen-color boldText font50 commen-pdl20">{headData.price.toFixed(2)}</span>
            )
        }

        return (
            <div className="fullItem commen-pdt20">

                <div className="contentHead">
                    {/*头部信息部分*/}
                    <div role="reportHead" className="header">
                        <img src={headData.headImg} className="headItemIcon"/>
                        <div style={this.styles.fullWidth}>
                            <span id="stockNameAndCode" role="stockNameAndCode"
                                  className="commen-pdl20 commen-color font18 boldText">{headData.title}
                                ({headData.symbol})</span>

                            <div className="flexBox">
                                <div>
                                    {price}
                                    <span role="stockChangeRatio"
                                          className="colorRed font14 commen-pdl10 boldText">{this.calcRate(headData.up)}{this.calcRate(headData.rate, '%')}</span>
                                    <span role="EPS"
                                          className="commen-pdl20 boldText">每股收益(EPS){this.calcNaNType(headData.per)}元</span>
                                    <span role="TTM"
                                          className="commen-pdl20 boldText">市盈率(TTM){this.calcNaNType(headData.ttm)}</span>
                                </div>

                                <div role="focusStarScore">
                                    <span className="font12">关注星级</span>
                                    <div>
                                        <RateLevel score={headData.score}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fullItem boxShadow reportHeader">
                    <span className="font14 boldText title commen-color">个股信息</span>
                    <Table selectable={false}>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover={false}
                        >
                            <TableRow style={this.styles.noBottomBorder}>
                                <TableRowColumn style={this.styles.tableCell}>行业</TableRowColumn>
                                <TableRowColumn role="industry" style={this.styles.contentCell}>
                                    <span className="boldText">{industry}</span>
                                </TableRowColumn>
                            </TableRow>

                            <TableRow style={this.styles.noBottomBorder}>
                                <TableRowColumn style={this.styles.tableCell}>题材</TableRowColumn>
                                <TableRowColumn role="subject" style={this.styles.contentCell}>
                                    {theme}
                                </TableRowColumn>
                            </TableRow>

                            <TableRow style={this.styles.noBottomBorder}>
                                <TableRowColumn style={this.styles.tableCell}>主营</TableRowColumn>
                                <TableRowColumn role="majorBusiness" style={this.styles.contentCell}>
                                    {mainProducts}
                                </TableRowColumn>
                            </TableRow>

                            <TableRow style={this.styles.noBottomBorder}>
                                <TableRowColumn style={this.styles.tableTopCell}>构成</TableRowColumn>
                                <TableRowColumn style={this.styles.contentCell}>
                                    <div>
                                        <Table selectable={false}>
                                            {tableHeader}
                                            <TableBody
                                                displayRowCheckbox={false}
                                                showRowHover={false}
                                            >
                                                {tableRowColumn}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Risk
                        notifyResultRisk={this.props.notifyResultRisk}
                        symbol={this.props.symbol}
                        showPdf = {true}
                    />
                </div>

                <div role="ShenWanRaiseRank" className="commen-mgt10 boxShadow reportHeader">
                    <ShenWanRaiseRank
                        symbol={this.props.symbol}
                        showPdf = {true}
                        notifyResultShenWan={this.props.notifyResultShenWan}
                    />
                    <HotCategray
                        symbol={this.props.symbol}
                        showPdf = {true}
                        notifyResultHotCategray={this.props.notifyResultHotCategray}
                    />
                </div>

            </div>
        )
    }
}