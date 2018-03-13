import * as React from "react";
import {observer} from "mobx-react";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {FormatNum} from "../../utils/NumberFormat";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    red300,
    red400,
    red500,
    yellow600
} from "material-ui/styles/colors";
import Chip from "material-ui/Chip";
import {Util} from "../../Constants";
import {Collections} from "../../Constants";
import {Link} from "react-router-dom";
import IndustryDetailPage from "../../pages/category/IndustryDetailPage";
import SubjectDetailPage from "../../pages/category/SubjectDetailPage";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {StockBasicInfo} from "../../model/entities/StockBasicInfo";
import RaisedButton from 'material-ui/RaisedButton';
import Constants from "../../Constants";
import IconButton from "material-ui/IconButton";
import Block from "material-ui/svg-icons/content/block";



interface Props {
    stock: StockBasicInfo;
    attention?: any;
    small?: boolean;
    match?: any;
}

@observer
export default class StockHeader extends React.Component<Props, null> {

    baseInfo = this.props.stock;

    componentWillReceiveProps(nextProps) {
        if (this.baseInfo != nextProps.stock) {
            this.baseInfo = nextProps.stock;
        }
    }

    styles = {
        container: {},
        containerSmall: {
            paddingLeft: 16,
        },
        header: {
            paddingLeft: 36,
        },
        title: {
            fontSize: 18,
        },
        quotation: {
            fontSize: 16,
        },
        incrementText: {
            color: red500,
            fontSize: 16,
        },
        decrementText: {
            color: green500,
            fontSize: 16,
        },
        increment: {
            color: red500,
        },
        titleOverlay: {
            width: "100%",
            paddingRight: 0,
        },
        decrement: {
            color: green500,
        },
        changeLabel: {
            color: 'white',
            height: '24px',
            lineHeight: '24px'
        },
        text: {
            color: grey500,
            fontSize: 18,
        },
        symbol: {
            fontSize: 18,
            paddingLeft: 15,
            color: grey500,
        },
        datum: {
            paddingBottom: 20,
            paddingTop: 8,
            paddingLeft: 38
        },
        chip: {
            marginRight: 4,
            marginTop: 1,
            marginBottom: 1,
        },
        warpChip: {
            whiteSpace: "normal"
        },
        linkChip: {
            marginRight: 4,
            cursor: "pointer",
            marginTop: 1,
            marginBottom: 1,
        },
        center: {
            verticalAlign: 'middle',
            display: "inline-block"
        },
        chipLabel: {
            height: '24px',
            lineHeight: '24px'
        },
        business: {
            display: 'block',
        },
        businessLabel: {
            color: 'white',
        },
        image: {
            height: 70,
            width: 'auto',
        },
        tableCell: {
            width: '12%',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
            textAlign: 'left',
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
        noBottomBorder: {
            borderBottom: 'none'
        },
        jumpToSmart: {
            display: 'inline-block'
        }
    };

    jumpToSmart = (symbol) => {
        window.open('https:' + '//' + Constants.remoteHost + "/smartReport.html#/smartReport?symbol=" + symbol);
    };

    render() {
        let attention = null;

        if (this.props.attention) {
            attention = this.props.attention;
        }
        if (!this.baseInfo) {
            return <div/>;
        }
        let stock = this.baseInfo.stock;
        let industry = stock.industry;
        let company = stock.company;
        let subjects = stock.subjects || [];
        const quotationSummary = this.baseInfo.quotationSummary || {changeRatio: 0, change: 0, value: 0} as any;
        let change = quotationSummary.change || 0;
        let perShare = this.baseInfo.perShare || {} as any;
        let incomeSummary = this.baseInfo.incomeSummary || {};
        let revenueChangeRatio = incomeSummary.revenueChangeRatio || 0;
        let netProfitChangeRatio = incomeSummary.netProfitChangeRatio || 0;
        let netProfit = new FormatNum(incomeSummary.netProfit || 0);
        let totalRevenue = new FormatNum(incomeSummary.totalRevenue || 0);
        let valuationMetric = {
            tradingDate: new Date,
            peTtm: 0
        };
        if (this.baseInfo.valuationMetric !== undefined) {
            valuationMetric = this.baseInfo.valuationMetric;
        }

        if (this.props.small) {
            let subjectChip = [];
            for (const subject of subjects) {
                if (!subject) {
                    continue;
                }

                subjectChip.push(
                    <Link to={SubjectDetailPage.PATH + subject.code} key={subject.code}>
                        {subject.name}
                    </Link>
                );

            }

            return (
                <div style={this.styles.containerSmall}>
                    <Table>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover
                        >
                            <TableRow>
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    每股收益率
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {(perShare.eps || 0).toFixed(2) + " 元"}
                                </TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    市盈率(TTM)
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {(valuationMetric.peTtm || 0).toFixed(2)}
                                </TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            )
        } else {

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

            let eps = (
                <Chip
                    labelStyle={this.styles.chipLabel}
                    style={this.styles.chip}>
                    {"每股收益率(EPS)：" + (perShare.eps || 0).toFixed(2) + " 元"}
                </Chip>

            );
            /*

             营业收入：}>{totalRevenue.value.toFixed(2) + total(revenueChangeRatio)+NumberFormat.getPercentageStyle(revenueChangeRatio)}</span>
             */

            let income = (
                <Chip
                    labelStyle={this.styles.chipLabel}
                    style={this.styles.chip}>
                    {"营业收入：" + (totalRevenue.value || 0).toFixed(2) + totalRevenue.unit + " 元 " + Util.precisionRate(revenueChangeRatio, 2)}
                </Chip>

            );

            const revenue = (
                <Chip
                    labelStyle={this.styles.chipLabel}
                    style={this.styles.chip}>
                    {"净利润：" + (netProfit.value || 0).toFixed(2) + netProfit.unit + " 元 " + Util.precisionRate(netProfitChangeRatio, 2)}
                </Chip>

            );

            let business = [];
            let index = 0;
            if (company) {
                for (const b of company.mainBusiness.split('；')) {
                    business.push(
                        <Chip
                            style={this.styles.warpChip}
                            labelStyle={this.styles.warpChip}
                            key={index}>
                        <span style={this.styles.business}>
                            {b}
                        </span>
                        </Chip>
                    );
                    index += 1;
                }
            }

            let subjectChip = [];
            index = 0;
            for (const subject of subjects) {

                subjectChip.push(
                    <Link to={SubjectDetailPage.PATH + subject.code} key={subject.code}>
                        <Chip key={subject.code} style={this.styles.linkChip}
                              backgroundColor={red400}
                              labelStyle={this.styles.changeLabel}>
                            {subject.name}
                        </Chip>
                    </Link>
                );
                index++;

            }

            return (
                <Card style={this.styles.container}>
                    <CardHeader
                        style={this.styles.header}
                        title={
                            <div className="flex-center">
                                <span>
                                    <span role="stockShortName">{stock.shortName + " "}</span>
                                    <span role="stockCode" style={this.styles.symbol}>{stock.symbol}</span>
                                </span>
                                <div className="auto-right">

                                    <div role="focusButton" style={this.styles.jumpToSmart}>
                                        {attention}
                                    </div>
                                    <RaisedButton
                                        role="buttonOfGenerateReport"
                                        label="一键生成智能研报"
                                        disabled={this.props.stock.stock.delistedDate}
                                        primary={true}
                                        style={this.styles.jumpToSmart}
                                        onTouchTap={ () => this.jumpToSmart(stock.symbol) }
                                    />
                                </div>
                            </div>
                        }
                        titleStyle={this.styles.title}
                        textStyle={this.styles.titleOverlay}
                        subtitle={
                            <span role="stockPrice" style={this.styles.quotation}>
                            {quotationSummary.value}
                                {rate}
                        </span>
                        }
                    />
                    <CardText style={this.styles.datum}>
                        <div className="">
                            <Table>
                                <TableBody
                                    displayRowCheckbox={false}
                                    showRowHover
                                >
                                    <TableRow style={this.styles.noBottomBorder}>
                                        <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                            行业
                                        </TableRowColumn>
                                        <TableRowColumn className="table-cell">
                                            <div className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                                {
                                                    industry ? <div>
                                                        {industry.parentIndustry ? <Link role="linktoIndustryDetailPage"
                                                                                         style={this.styles.center}
                                                                                         to={IndustryDetailPage.PATH + industry.parentIndustry.code}>
                                                            <Chip style={this.styles.linkChip}
                                                                  labelStyle={this.styles.changeLabel}
                                                                  backgroundColor={red400}
                                                            >
                                                                {industry.parentIndustry.name}
                                                            </Chip>
                                                        </Link> : null}
                                                    </div> : null
                                                }

                                            </div>
                                        </TableRowColumn>
                                    </TableRow>
                                    <TableRow style={this.styles.noBottomBorder}>
                                        <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                            主营
                                        </TableRowColumn>
                                        <TableRowColumn className="table-cell">
                                            <div role="majorBusiness" className="flex-center-wrap"
                                                 style={this.styles.otherChipContainer}>
                                                {business}
                                            </div>
                                        </TableRowColumn>
                                    </TableRow>
                                    <TableRow style={this.styles.noBottomBorder}>
                                        <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                            题材
                                        </TableRowColumn>
                                        <TableRowColumn className="table-cell">
                                            <div role="linktoSubjectDetailPage" className="flex-center-wrap"
                                                 style={this.styles.otherChipContainer}>
                                                {subjectChip}
                                            </div>
                                        </TableRowColumn>
                                    </TableRow>
                                    <TableRow style={this.styles.noBottomBorder}>
                                        <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                            重要指标
                                        </TableRowColumn>
                                        <TableRowColumn className="table-cell">
                                            <div role="importantIndicators" className="flex-center-wrap"
                                                 style={this.styles.otherChipContainer}>
                                                {eps}
                                                {income}
                                                <Chip
                                                    labelStyle={this.styles.chipLabel}
                                                    style={this.styles.chip}
                                                >
                                                    {"市盈率(TTM)：" + (valuationMetric.peTtm || 0).toFixed(2)}
                                                </Chip>
                                                {revenue}
                                            </div>
                                        </TableRowColumn>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardText>
                </Card>
            );
        }
    }

}