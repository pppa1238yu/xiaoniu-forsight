import * as React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {hotSubjectsDataSource} from "../../model/ajax/SmartReportService";
export default class HotCategray extends React.Component<any, null> {
    componentWillUnmount() {
        hotSubjectsDataSource.setMount(false);
    }

    componentWillMount() {
        hotSubjectsDataSource.setMount(true);
    }

    componentDidMount() {
        hotSubjectsDataSource.setNotifyResult(this.props.notifyResultHotCategray);
        hotSubjectsDataSource.resetWithId(this.props.symbol);
        hotSubjectsDataSource.request();
    }

    styles = {
        padding: {
        },
        noBottomBorder: {
            height: 36,
            borderBottom: 'none',
        },
        borderTop: {
            height:36,
            borderTop:'1px solid #000',
            borderBottom: 'none',
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
        leftPadding:{
            padding:'0 60px'
        }
    };

    calcRate = (num,rate?) => {
        if(rate){
            if(rate == "%") {
                num = (num * 100).toFixed(2);
            }else {
                num = num.toFixed(2);
            }
            if(num < 0) return (<span className="colorGreen">{num}{rate}</span>);
            if(num > 0) return (<span className="colorRed">+{num}{rate}</span>);
            if(num == 0) return (<span className="commen-color">+{num}{rate}</span>)
        }else {
            num = num.toFixed(2);
            if(num < 0) return (<span className="colorGreen">{num}</span>);
            if(num > 0) return (<span className="colorRed">+{num}</span>);
            if(num == 0) return (<span className="commen-color">+{num}</span>)
        }
    };
    calcData=(num)=> (num/100000000).toFixed(2)+"亿";

    numberColor=(num)=>{
        if(num < 0) return (<span className="colorGreen">{this.calcData(num)}</span>);
        if(num > 0) return (<span className="colorRed">+{this.calcData(num)}</span>);
        if(num == 0) return (<span className="commen-color">+{this.calcData(num)}</span>)
    };
    render() {

        const items = hotSubjectsDataSource.$.items;
        if(items.length){
            const tableHotHeader = (
                <TableRow>
                    <TableHeaderColumn style={this.styles.leftCellHeader}>题材排名</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>涨跌幅</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>资金净流入</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.centerCellHeader}>领涨股</TableHeaderColumn>
                </TableRow>
            );

            let hotTableBody = [];
            items.map((item, index) => {
                hotTableBody.push(
                    <TableRow style={this.styles.noBottomBorder} key={index}>
                        <TableRowColumn role="hotSubject_name" style={this.styles.centerLeft}>{item.name?item.name:"-"}</TableRowColumn>
                        <TableRowColumn role="hotSubject_chg" style={this.styles.centerCell}>{this.calcRate(item.regionalIncrement,'%')}</TableRowColumn>
                        <TableRowColumn role="hotSubject_netCashFlow" style={this.styles.centerCell}>{item.netCashFlow?this.numberColor(item.netCashFlow):'-'}</TableRowColumn>
                        <TableRowColumn role="hotSubject_bellwether" style={this.styles.centerCell}>{item.stockIncrements[0]?item.stockIncrements[0].name:"-"}</TableRowColumn>
                    </TableRow>
                )

            });

            return (
                <div className="contentHead" style={this.styles.padding}>
                    <div className="header">
                        <span className="font14 boldText title commen-color">本周涉及热门题材</span>
                    </div>

                    <div style={this.props.showPdf?this.styles.leftPadding:{}}>
                        <Table selectable={false}>
                            <TableHeader
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                                enableSelectAll={false}
                                style={this.styles.noBottomBorder}
                            >
                                {tableHotHeader}
                            </TableHeader>
                            <TableBody
                                displayRowCheckbox={false}
                                showRowHover={false}
                            >
                                {hotTableBody}
                            </TableBody>
                        </Table>
                    </div>

                </div>
            )
        }else {
            return null
        }
    }
}