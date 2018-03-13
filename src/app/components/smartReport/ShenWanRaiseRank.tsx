import * as React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {industryStockRankDataSource} from "../../model/ajax/SmartReportService";
import {ReactElement} from "react";
import {FormatNum} from "../../utils/NumberFormat";

export default class ShenWanRaiseRank extends React.Component<any, null> {

    componentWillUnmount() {
        industryStockRankDataSource.setMount(false);
    }

    componentWillMount() {
        industryStockRankDataSource.setMount(true);
    }

    componentDidMount() {
        industryStockRankDataSource.setNotifyResult(this.props.notifyResultShenWan);
        industryStockRankDataSource.resetWithId(this.props.symbol);
        industryStockRankDataSource.request();
    }

    styles = {
        padding: {
        },
        noBottomBorder: {
            height: 36,
            borderBottom: 'none',
        },
        noBottomBorderBold: {
            height: 36,
            borderBottom: 'none',
            fontWeight:'600'
        },
        borderTop: {
            height:36,
            borderTop:'1px dotted #101010',
            borderBottom: 'none',
            fontWeight:'600'
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
        centerCellHeader: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'right',
            color: '#101010',
            fontWeight:600
        },
        leftCellHeader: {
            fontSize: 12,
            paddingLeft: 0,
            paddingRight: 0,
            height: 36,
            textAlign: 'left',
            color: '#101010',
            fontWeight:600
        },
        paddingUD: {
            marginTop:10,
            marginBottom:10
        },
        leftPadding: {
            padding:'0 60px'
        }
    };

    render() {

        const dataSource = industryStockRankDataSource.$;
        const data = dataSource.items.slice();
        const
            rank = dataSource.currentItemIndex,
            indexDelta = dataSource.indexDelta;

        const tableShenwanHeader = (
            <TableRow>
                <TableHeaderColumn style={this.styles.leftCellHeader}>本周排名</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>涨跌幅</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>换手率</TableHeaderColumn>
                <TableHeaderColumn style={this.styles.centerCellHeader}>资金流入额</TableHeaderColumn>
            </TableRow>
        );

        let showRank = null;
        if(indexDelta != undefined){
            if(indexDelta < 0){
                showRank = (
                    <div className="font14 commen-color" style={{lineHeight:'60px'}}>本周排名&nbsp;
                        <span role="rank" className="font18 colorRed boldText">{rank}</span>&nbsp;
                        <span role="indexDelta" className="font12 colorRed"><i className="stockIcon upArrow"/>{-indexDelta}</span>
                    </div>
                )
            }else {
                showRank = (
                    <div className="font14 commen-color" style={{lineHeight:'60px'}}>本周排名&nbsp;
                        <span role="rank" className="font18 colorGreen boldText">{rank}</span>&nbsp;
                        <span role="indexDelta" className="font12 colorGreen"><i className="stockIcon downArrow"/>{indexDelta}</span>
                    </div>
                )
            }
        }

        let tableBody = [];
        data.map((item, index) => {
            if(index < 5){
                if(item.rank == rank){
                    tableBody.push(
                        <TableRow style={this.styles.noBottomBorderBold} key={index}>
                            <TableRowColumn role="rank_name" style={this.styles.centerLeft}>{item.rank}.{item.name}</TableRowColumn>
                            <TableRowColumn role="rank_incrementRate" style={this.styles.centerCell}>{this.calcRate(item.incrementRate,'%')}</TableRowColumn>
                            <TableRowColumn role="rank_turnoverRate" style={this.styles.centerCell}>{this.calcRate(item.turnoverRate,'%')}</TableRowColumn>
                            <TableRowColumn role="rank_netCashFlow" style={this.styles.centerCell}>{this.calcRate(item.netCashFlow,'$')}</TableRowColumn>
                        </TableRow>
                    )
                }else {
                    tableBody.push(
                        <TableRow style={this.styles.noBottomBorder} key={index}>
                            <TableRowColumn role="rank_name" style={this.styles.centerLeft}>{item.rank}.{item.name}</TableRowColumn>
                            <TableRowColumn role="rank_incrementRate" style={this.styles.centerCell}>{this.calcRate(item.incrementRate,'%')}</TableRowColumn>
                            <TableRowColumn role="rank_turnoverRate" style={this.styles.centerCell}>{this.calcRate(item.turnoverRate,'%')}</TableRowColumn>
                            <TableRowColumn role="rank_netCashFlow" style={this.styles.centerCell}>{this.calcRate(item.netCashFlow,'$')}</TableRowColumn>
                        </TableRow>
                    )
                }

            }else {
                tableBody.push(
                    <TableRow style={this.styles.borderTop} key={index}>
                        <TableRowColumn role="rank_name" style={this.styles.centerLeft}>{item.rank}.{item.name}</TableRowColumn>
                        <TableRowColumn role="rank_incrementRate" style={this.styles.centerCell}>{this.calcRate(item.incrementRate,'%')}</TableRowColumn>
                        <TableRowColumn role="rank_turnoverRate" style={this.styles.centerCell}>{this.calcRate(item.turnoverRate,'%')}</TableRowColumn>
                        <TableRowColumn role="rank_netCashFlow" style={this.styles.centerCell}>{this.calcRate(item.netCashFlow,'$')}</TableRowColumn>
                    </TableRow>
                )
            }
        });

        return (
            <div className="contentHead" style={this.styles.padding}>
                <div className="header">
                    <span className="font14 boldText title commen-color">申万二级涨幅排名</span>
                    {showRank}
                </div>
                <div style={this.props.showPdf?this.styles.leftPadding:{}}>
                    <Table
                        selectable={false}
                        style={{width:'99%'}}
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                            enableSelectAll={false}
                            style={this.styles.noBottomBorder}
                        >
                            {tableShenwanHeader}
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover={false}
                        >
                            {tableBody}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    private calcRate(num: number, rate?: string) {
        if(num == undefined) {
            return "-";
        }

        if(rate == '%'){
            let text = (num * 100).toFixed(2);
            if(num < 0) return (<span className="colorGreen">{text}%</span>);
            if(num > 0) return (<span className="colorRed">+{text}%</span>);
            if(num == 0) return (<span className="commen-color">{text}%</span>)
        } else if (rate == '$') {
            let text = (num / 100000000).toFixed(2);
            if(num < 0) return (<span className="colorGreen">{text}亿</span>);
            if(num > 0) return (<span className="colorRed">+{text}亿</span>);
            if(num == 0) return (<span className="commen-color">{text}亿</span>)
        } else {
            let text = num.toFixed(2);
            if(num < 0) return (<span className="colorGreen">{text}</span>);
            if(num > 0) return (<span className="colorRed">+{text}</span>);
            if(num == 0) return (<span className="commen-color">{text}</span>)
        }
    }
}