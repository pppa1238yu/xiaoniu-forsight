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
import Block from "material-ui/svg-icons/content/block";
import IconButton from "material-ui/IconButton";
import Explain from "../common/Explain";
import RateLevel from "./RateLevel";
import {Collections} from "../../Constants";
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

    @observable private downloadingPdf: boolean = false;

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
        tableHeader : {
            height: 36,
            width:'99%',
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
        },
        vertical: {
            verticalAlign:'text-bottom'
        },
        exlpainTd:{
            paddingLeft: 2,
            paddingRight: 0,
            textAlign: 'left',
            overflow:"visible"
        },
        buttonStyle: {
            position:'relative',
            top:'-7px',
            paddingLeft:30
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
        const delistedDate = dataSource.basicInfo.stock.delistedDate;
        const delistedIcon = delistedDate ? (<IconButton tooltip="已退市"><Block/></IconButton>) : null;
        const
            items = dataSource.items.slice(),
            quotationSummary = dataSource.basicInfo.quotationSummary,
            perShare = dataSource.basicInfo.perShare,
            valuationMetric = dataSource.basicInfo.valuationMetric,
            industryNames = dataSource.industryNames,
            stock = dataSource.basicInfo.stock,
            introduction=dataSource.conclusion;

        let subjects = stock.subjects.map(v => v.name);
        const headData = {
            headImg: Constants.imageBaseUrl + stock.imageId,
            title: quotationSummary.shortName || stock.shortName,
            symbol: quotationSummary.symbol,
            price: quotationSummary.value || 0,
            up: quotationSummary.change,
            rate: quotationSummary.changeRatio,
            per: perShare.eps,
            ttm: valuationMetric.peTtm,
            industry: industryNames,
            main: [stock.company.mainBusiness ? stock.company.mainBusiness : '暂无'],
            categray: subjects,
            score: this.props.score
        };

        let tableHeader = null;

        tableHeader = (
            <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                style={this.styles.tableHeader}
            >
                <TableRow>
                    <TableHeaderColumn role="currentDate"
                                       style={this.styles.centerCellFir}>{dataSource.itemDate.replace('-', '.')}</TableHeaderColumn>
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
                            {item.earning?this.calcNaNType(item.earning / 10000):'-'}
                        </TableRowColumn>
                        <TableRowColumn role="earningProportion" style={this.styles.centerCell}>
                            {Collections.getPercentage(item.earningProportion)}
                        </TableRowColumn>
                        <TableRowColumn role="cost" style={this.styles.centerCell}>
                            {item.cost?this.calcNaNType(item.cost / 10000):'-'}
                        </TableRowColumn>
                        <TableRowColumn role="costProportion" style={this.styles.centerCell}>
                            {Collections.getPercentage(item.costProportion)}
                        </TableRowColumn>
                        <TableRowColumn role="grossMarginProportion" style={this.styles.centerCell}>
                            {Collections.getPercentage(item.grossMarginProportion)}
                        </TableRowColumn>
                        <TableRowColumn role="grossMarginRate" style={this.styles.centerCell}>
                            {Collections.getPercentage(item.grossMarginRate)}
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
                            {Collections.getPercentage(item.grossMarginRate)}
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
                                  className="commen-pdl20 commen-color font18 boldText"
                                  style = {this.styles.vertical}
                            >{headData.title}
                                ({headData.symbol})</span>
                            {delistedIcon}
                            <div className="flexBox">
                                <div>
                                    {price}
                                    <span role="stockChangeRatio"
                                          className="colorRed font14 commen-pdl10 boldText">{this.calcRate(headData.up)} <span style={{color:Collections.numberColor(headData.rate)}}>{Collections.getPercentage(headData.rate)}</span> </span>
                                    <span role="EPS"
                                          className="commen-pdl20 boldText">每股收益(EPS){this.calcNaNType(headData.per)}元</span>
                                    <span role="TTM"
                                          className="commen-pdl20 boldText">市盈率(TTM){this.calcNaNType(headData.ttm)}</span>
                                </div>

                                <div role="focusStarScore">
                                    <If condition={typeof(this.props.pdf) != 'boolean' || !this.props.pdf}>
                                        <div className="flexBox">
                                            <div>
                                                <span style={this.styles.lableStyle}>关注星级</span>
                                                <div>
                                                    <RateLevel
                                                        score={headData.score}
                                                        small={false}
                                                    />
                                                </div>
                                            </div>
                                            <div style={this.styles.buttonStyle as any}>
                                                <RaisedButton
                                                    label="下载PDF"
                                                    primary={true}
                                                    href={
                                                        '/intelligentReport/pdf?symbol='+this.props.symbol
                                                    }/>
                                            </div>

                                        </div>

                                    </If>
                                </div>
                            </div>
                            <div>
                                <ul className="introduction-ul">
                                    {introduction.length?introduction.map((e,index)=>{
                                        return <li key={index}><span>{e}</span></li>
                                    }):null}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flexBoxNormal">
                        {/*头部左边栏*/}
                        <div role="stockBriefIntro" className="leftItem">
                            <div className="reportHeader boxShadow">
                                <span className="font14 boldText title commen-color">个股信息</span>
                                <Table selectable={false}>
                                    <TableBody
                                        displayRowCheckbox={false}
                                        showRowHover={false}
                                    >
                                        <TableRow style={this.styles.noBottomBorder}>
                                            <TableRowColumn style={this.styles.tableCell}>行业</TableRowColumn>
                                            <TableRowColumn role="industry" style={this.styles.exlpainTd}>
                                                <span className="boldText">{industry}</span>
                                                <Explain
                                                    message="分别为申万1/2/3级行业，下文中的行业都指公司所在申万三级行业"
                                                    toolTipWidth="450px"
                                                />
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
                                                    <Table
                                                        style = {{width:'99%'}}
                                                        selectable={false}>
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
                            </div>

                            <div role="risk" className="commen-mgt10 boxShadow">
                                <Risk
                                    notifyResultRisk={this.props.notifyResultRisk}
                                    symbol={this.props.symbol}
                                />
                            </div>
                        </div>
                        {/*头部右边栏*/}
                        <div className="rightItem ">
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

