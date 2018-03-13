import * as React from "react";
import Constants from "../../Constants";
import {
    red300,
    red400,
    red500,
    grey300,
    orange300,
    green500,
    grey500
} from "material-ui/styles/colors";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Risk from "../../components/smartReport/Risk";
import HotCategray from "../../components/smartReport/HotCategray";
import ShenWanRaiseRank from "../../components/smartReport/ShenWanRaiseRank";
import {getStockDataSource}  from   "../../model/ajax/SmartReportService"
import RateLevel from "./RateLevel";
import Explain from "../common/Explain";
import {Collections} from "../../Constants";


export default class ReportHeadSmall extends React.Component<any, null> {

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
            height: 25,
            textAlign: 'left',
            verticalAlign: 'top'
        },
        contentCell: {
            paddingLeft: 2,
            paddingRight: 0,
            textAlign: 'left',
            whiteSpace: 'wrap'
        },
        explainCell: {
            width: '58px',
            paddingLeft: 2,
            paddingRight: 2,
            textAlign: 'left',
            whiteSpace: 'wrap',
            overflow: "visible"
        },
        lastTable: {
            fontSize: 14,
            height: 25,
            padding: 0
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
            lineHeight: '24px',
            marginRight: "20px"
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
            paddingRight: 20,
            display: 'flex',
            justifyContent: 'space-between'
        },
        rateRow: {
            display: 'flex'
        },

        smallPaddingBox: {
            margin: '30px 0px 10px 0px'
        },
        paddingBottom: {},
        tableStyle: {
            boxSizing: 'border-box',
            padding: 5,
            backgroundColor: '#b4b4b4'
        },
        minWidth: {
            minWidth: 95,
            lineHeight: '20px'
        },
        paddingLeft: {
            padding: '0 20px 20px',
            backgroundColor: '#e5e2e2'
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
    private riskText = [
        "Beta系数：衡量个别股票相对于总体市场的价格波动情况，可以评估证券的系统性风险，一般值越大，系统性风险越大。",
        "波动率风险：波动率越大，个股风险越大",
        "研报提取的风险：从研报中提取公司相关的事件风险、政策风险、公司管理风险"
    ];

    render() {

        const dataSource = getStockDataSource.$;
        const
            items = dataSource.items.slice(),
            quotationSummary = dataSource.basicInfo.quotationSummary,
            perShare = dataSource.basicInfo.perShare,
            valuationMetric = dataSource.basicInfo.valuationMetric,
            industryNames = dataSource.industryNames,
            stock = dataSource.basicInfo.stock,
            introduction = dataSource.conclusion;

        let subjects = stock.subjects.map(v => v.name);
        const headData = {
            headImg: Constants.imageBaseUrl + stock.imageId,
            title: quotationSummary.shortName || stock.shortName,
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

        let mainProducts = headData.main.join(' ; ');
        let theme = headData.categray.join(' , ');
        let industry = headData.industry.join(' - ');

        let price = null;
        if (headData.rate > 0) {
            price = (
                <span role="stockPrice"
                      className="colorRed boldText font40 commen-pdl20">{headData.price.toFixed(2)}</span>
            )
        } else if (headData.rate < 0) {
            price = (
                <span role="stockPrice"
                      className="colorGreen boldText font40 commen-pdl20">{headData.price.toFixed(2)}</span>
            )
        } else {
            price = (
                <span role="stockPrice"
                      className="commen-color boldText font40 commen-pdl20">{headData.price.toFixed(2)}</span>
            )
        }
        return (
            <div className="fullItem commen-pdt20" style={this.styles.paddingBottom}>
                <div className="contentHead">
                    {/*头部信息部分*/}
                    <div role="reportHead" className="header">
                        <img src={headData.headImg} className="headItemIcon"/>
                        <div style={this.styles.fullWidth}>
                            <span id="stockNameAndCode" role="stockNameAndCode"
                                  className="commen-pdl20 commen-color font18 boldText">{headData.title}
                                ({headData.symbol})</span>
                            {stock.delistedDate ? "（已退市）" : null}
                            <div className="flexBoxSmall">
                                <div style={this.styles.viewConfigPadding as any}>
                                    {price}
                                    <span role="stockChangeRatio"
                                          className="colorRed font14 flexBox boldText"
                                          style={this.styles.minWidth}
                                    >
                                        {this.calcRate(headData.up)} <span style={{color:Collections.numberColor(headData.rate)}}>{Collections.getPercentage(headData.rate)}</span>
                                    </span>
                                </div>
                                <div style={this.styles.viewConfigPadding as any}>
                                    <span role="EPS"
                                          className="commen-pdl20 font12 boldText">每股收益(EPS) &nbsp;&nbsp;&nbsp;{this.calcNaNType(headData.per)}元</span>
                                    <span role="TTM"
                                          className="font12 boldText">市盈率(TTM) &nbsp;&nbsp;&nbsp;{this.calcNaNType(headData.ttm)}</span>
                                </div>


                                <div style={this.styles.viewConfigPadding as any}>
                                    <ul className="introduction-ul-small">
                                        {introduction.length ? introduction.map((e, index) => {
                                            return <li key={index}><span>{e}</span></li>
                                        }) : null}
                                    </ul>
                                </div>
                                <div role="focusStarScore" style={this.styles.rateRow}>
                                    <span style={this.styles.lableStyle}>关注星级</span>
                                    <RateLevel
                                        score={headData.score}
                                        small={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flexBoxSmall">
                        {/*头部左边栏*/}
                        <div role="stockBriefIntro" className="boxShadow reportHeader">
                            {/*<span className="font14 boldText title commen-color">个股信息</span>*/}
                            <Table selectable={false}>
                                <TableBody
                                    displayRowCheckbox={false}
                                    showRowHover={false}
                                >
                                    <TableRow style={this.styles.noBottomBorder}>
                                        <TableRowColumn style={this.styles.explainCell}>行业<Explain
                                            message="分别为申万1/2/3级行业，下文中的行业都指公司所在申万三级行业" toolTipWidth="80px" small={true}
                                            toolTipPosition="bottom-center"/></TableRowColumn>
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
                                </TableBody>
                            </Table>
                            <div style={{fontSize: 14, color: '#1a1a1a', margin: '10px 0'}}>
                                <span >风险评估</span>
                                <Explain
                                    message={this.riskText}
                                    toolTipWidth="250px"
                                />
                            </div>

                            <div role="risk" style={this.styles.paddingLeft}>
                                {/*<div style={{textAlign:"left",fontSize:12,color:'#101010'}}>*/}
                                {/*Beta系数：衡量个别股票相对于总体市场的价格波动情况，可以评估证券的系统性风险，一般值越大，系统性风险越大。*/}
                                {/*<br/>*/}
                                {/*波动率风险：波动率越大，个股风险越大*/}
                                {/*<br/>*/}
                                {/*研报提取的风险：从研报中提取公司相关的事件风险、政策风险、公司管理风险*/}
                                {/*</div>*/}
                                <Risk
                                    small={true}
                                    notifyResultRisk={this.props.notifyResultRisk}
                                    symbol={this.props.symbol}
                                />
                            </div>

                        </div>
                        {/*头部右边栏*/}
                        <div className="commen-mgt10 ">
                            <div role="ShenWanRaiseRank" className="boxShadow reportHeader">
                                <ShenWanRaiseRank
                                    symbol={this.props.symbol}
                                    notifyResultShenWan={this.props.notifyResultShenWan}
                                />
                                <HotCategray
                                    symbol={this.props.symbol}
                                    notifyResultHotCategray={this.props.notifyResultHotCategray}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
