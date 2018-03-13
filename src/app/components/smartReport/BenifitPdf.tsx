import * as React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {profitForecastDataSource} from "../../model/ajax/SmartReportService";

export default class BenifitPdf extends React.Component<any, any> {

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
        },
        leftPadding:{
            padding:'0 60px'
        }
    };

    componentDidMount() {
        profitForecastDataSource.setNotifyResult(this.props.notifyResult);
        profitForecastDataSource.resetWithId(this.props.symbol);
        profitForecastDataSource.request();
    }

    calcData = (data, type?) => {
        if(data == undefined) return '-';
        if (type) {
            return (data *  100).toFixed(2) + "%"
        } else {
            return (data / 100000000).toFixed(2)
        }
    };

    render() {

        const dataSource = profitForecastDataSource.$;

        const tableHeader = (
            <TableRow>
                <TableHeaderColumn style={this.styles.leftCellHeader}>预测指标</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>营业收入(亿元)</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>营业收入增长率</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>净利润(亿元)</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>净资产收益率</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>每股收益(元)</TableHeaderColumn>
            </TableRow>
        );


        let tableBody = null;

        tableBody = (
            <TableBody
                displayRowCheckbox={false}
                showRowHover={false}
            >
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn style={this.styles.centerLeft}>2016({dataSource.flag?"实际":"预测"})</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.income)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.incomeRate , true)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.netProfit)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.roeb, true)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{dataSource.profitPerShare.toFixed(2)}</TableRowColumn>
                </TableRow>
                <TableRow style={this.styles.noBottomBorder}>
                    <TableRowColumn style={this.styles.centerLeft}>2017(预测)</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.targetIncome)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.targetIncomeRate, true)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.targetProfit)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{this.calcData(dataSource.targetRoeb, true)}</TableRowColumn>
                    <TableRowColumn style={this.styles.centerCell}>{dataSource.targetProfitPerShare.toFixed(2)}</TableRowColumn>
                </TableRow>
            </TableBody>
        );
        const date = new Date();
        const year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
        const showDate = year + "-" + month + "-" + day;

        let showDescripe = `
         截止${showDate}日，最近1年以内共有${dataSource.borkerogeCount}家机构对${dataSource.shortName}的2017年度业绩作出预测，被上调${dataSource.upgradeCount}次下调${dataSource.downgradeCount}次。
        `;
        return (
            <div className="reportHeader" style={this.styles.padding}>
                <div className="header">
                    <span className="font14 boldText title commen-color">盈利预测分析</span>
                </div>
                <p role="conclusionOfForecast" className="commen-color verdict font14" >
                    {showDescripe}
                </p>
                <div style={this.styles.leftPadding}>
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

            </div>
        )
    }
}