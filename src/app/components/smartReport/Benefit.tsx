import * as React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {profitForecastDataSource} from "../../model/ajax/SmartReportService";
import Explain from "../common/Explain";

export default class Benefit extends React.Component<any, any> {

    styles = {
        padding: {
            padding: '20px 20px'
        },
        noBottomBorder: {
            height: 36,
            borderBottom: 'none',
        },
        leftCellHeader: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'left',
            color: '#101010',
            fontWeight: 600
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
        centerCell: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'right',
            color: '#101010'
        },
        centerLeft: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'left',
            color: '#101010'
        },
        benifitStyle: {
            fontSize: 14,
            paddingTop: 20
        }
    };

    componentDidMount() {
        profitForecastDataSource.setNotifyResult(this.props.notifyResult);
        profitForecastDataSource.resetWithId(this.props.symbol);
        profitForecastDataSource.request();
    }

    calcData = (data, type?) => {
        if (data == undefined) return '-';
        if (type) {
            return (data * 100).toFixed(2) + "%"
        } else {
            return (data / 100000000).toFixed(2) + "亿元"
        }
    };

    render() {

        const dataSource = profitForecastDataSource.$;

        const tableHeader = (
            <TableRow>
                <TableHeaderColumn style={this.styles.leftCellHeader}>预测指标</TableHeaderColumn>
                <TableHeaderColumn
                    style={this.styles.centerCellHeader}>2016({dataSource.flag ? "实际" : "预测"})</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>2017(预测)</TableHeaderColumn>
            </TableRow>
        );


        let tableBody = null;

        tableBody = (
            <TableBody
                displayRowCheckbox={false}
                showRowHover={false}
            >
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn role="营业收入" style={this.styles.centerLeft}>营业收入(元)</TableRowColumn>
                    <TableRowColumn role="income"
                                    style={this.styles.centerCell}>{this.calcData(dataSource.income)}</TableRowColumn>
                    <TableRowColumn role="targetIncome"
                                    style={this.styles.centerCell}>
                        <span className="boldText">
                            {this.calcData(dataSource.targetIncome)}
                        </span>
                    </TableRowColumn>
                </TableRow>
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn role="营业收入增长率" style={this.styles.centerLeft}>营业收入增长率</TableRowColumn>
                    <TableRowColumn role="incomeRate"
                                    style={this.styles.centerCell}>{this.calcData(dataSource.incomeRate, true)}</TableRowColumn>
                    <TableRowColumn role="targetIncomeRate"
                                    style={this.styles.centerCell}>
                        <span className="boldText">
                            {this.calcData(dataSource.targetIncomeRate, true)}
                        </span>
                    </TableRowColumn>
                </TableRow>
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn role="净利润" style={this.styles.centerLeft}>净利润</TableRowColumn>
                    <TableRowColumn role="netProfit"
                                    style={this.styles.centerCell}>{this.calcData(dataSource.netProfit)}</TableRowColumn>
                    <TableRowColumn role="targetProfit"
                                    style={this.styles.centerCell}>
                        <span className="boldText">
                            {this.calcData(dataSource.targetProfit)}
                        </span>
                    </TableRowColumn>
                </TableRow>
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn role="每股收益率" style={this.styles.centerLeft}>每股收益</TableRowColumn>
                    <TableRowColumn role="profitPerShare"
                                    style={this.styles.centerCell}>{dataSource.profitPerShare ? dataSource.profitPerShare.toFixed(2) + '元' : '-'}</TableRowColumn>
                    <TableRowColumn role="targetProfitPerShare"
                                    style={this.styles.centerCell}>
                        <span className="boldText">
                            {dataSource.targetProfitPerShare ? dataSource.targetProfitPerShare.toFixed(2) + '元' : '-'}
                        </span>
                    </TableRowColumn>
                </TableRow>
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn role="净资产收益率" style={this.styles.centerLeft}>净资产收益率</TableRowColumn>
                    <TableRowColumn role="roeb"
                                    style={this.styles.centerCell}>{this.calcData(dataSource.roeb, true)}</TableRowColumn>
                    <TableRowColumn role="targetRoeb"
                                    style={this.styles.centerCell}>
                        <span className="boldText">
                            {this.calcData(dataSource.targetRoeb, true)}
                        </span>
                    </TableRowColumn>
                </TableRow>
            </TableBody>
        );
        const showDate = dataSource.date.toLocaleDateString().split('/').join('-');

        let showDescripe = `
         截止${showDate}日，最近1年以内共有${dataSource.borkerogeCount}家机构对${dataSource.shortName}的2017年度业绩作出预测，被上调${dataSource.upgradeCount}次下调${dataSource.downgradeCount}次。
        `;
        return (
            <div className="reportHeader" style={this.styles.padding}>
                <div className="header">
                    <span className="font14 boldText title commen-color">
                        盈利预测分析
                        {this.props.small ? <Explain
                            message="上调或者下调次数的意义：由于券商机构（分析师）很少对股票进行负面评级，当前市场机构投资者惯用的方式是用机构评级的上调或者下调来判定分析师的正负面指向，上调代表正面评价，下调代表负面评价。"
                            toolTipPosition="bottom-center"
                            toolTipWidth="260px"
                        /> : <Explain
                            message="上调或者下调次数的意义：由于券商机构（分析师）很少对股票进行负面评级，当前市场机构投资者惯用的方式是用机构评级的上调或者下调来判定分析师的正负面指向，上调代表正面评价，下调代表负面评价。"
                            toolTipPosition="bottom-left"
                        />}
                    </span>
                </div>
                <p role="conclusionOfForecast" className="commen-color font14"
                   style={this.props.small ? {} : this.styles.benifitStyle}>
                    {showDescripe}
                </p>
                <Table selectable={false}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                        style={this.styles.noBottomBorder}
                    >
                        {tableHeader}
                    </TableHeader>

                    {tableBody}

                </Table>
            </div>
        )
    }
}