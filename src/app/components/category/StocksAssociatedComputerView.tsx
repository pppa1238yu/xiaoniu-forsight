import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {stockAssociatedDataSource} from "../../model/ajax/CategoryService";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {green500, grey500, red500, grey700} from "material-ui/styles/colors";
import {FixLoading} from "../common/Loading";
import {Util} from "../../Constants";
import StockDetailPage from "../../pages/stock/StockDetailPage";
import History from "../../router/History";
interface StocksAssociatedComputerViewProps {
    type: string;
    symbol: string;
    notifyResult?: (err) => void
}

@observer
export default class StocksAssociatedComputerView extends React.Component<StocksAssociatedComputerViewProps, any> {
    styles = {
        tableContainer: {
            minHeight: 200,
        },
        th: {
            fontSize: 14,
            color: "#919191"
        },
        td: {
            fontSize: 14,
            color: grey700
        },
        empty: {
            lineHeight: "200px"
        },
        pages: {
            padding: "10px 0"
        },
        netCashFlowTh: {
            fontSize: 14,
            color: "#919191",
            padding: 0,
            width: "150px"
        },
        netCashFlowTd: {
            fontSize: 14,
            color: grey700,
            padding: 0,
            width: "150px"
        },
        zeroPaddingTh:{
            fontSize: 14,
            color: "#919191",
            padding: 0,
        },
        zeroPaddingTd:{
            fontSize: 14,
            color: grey700,
            padding: 0,
        },
    };

    onPageChange = (index) => {
        stockAssociatedDataSource.setRequestPageIndex(index - 1);
        stockAssociatedDataSource.refresh();
    };

    numberColor(num) {
        if (num > 0) {
            return red500
        } else if (num < 0) {
            return green500
        } else {
            return grey700
        }
    };

    cashHandle(cash) {
        if (cash > 0) {
            return "+" + (cash / 10000).toFixed(2) + "万"
        } else if (cash < 0) {
            return (cash / 10000).toFixed(2) + "万"
        } else {
            return cash
        }
    }

    componentWillMount() {
        stockAssociatedDataSource.reset();
        stockAssociatedDataSource.restore();
    }


    componentDidMount() {
        stockAssociatedDataSource.setResultNotify(this.props.notifyResult);
        stockAssociatedDataSource.type = this.props.type;
        stockAssociatedDataSource.setRequestId(this.props.symbol);
        stockAssociatedDataSource.refresh();
    }

    render() {
        let pages = null;
        let progress = stockAssociatedDataSource.loading ? <FixLoading mobile={false} transparent={true}/> : null;

        if (stockAssociatedDataSource.$.pageCount > 1) {
            pages = <div role="pageTurner" className="center-align" style={this.styles.pages}>
                <UltimatePaginationMaterialUi
                    currentPage={stockAssociatedDataSource.$.pageIndex + 1}
                    totalPages={stockAssociatedDataSource.$.pageCount}
                    hideFirstAndLastPageLinks={true}
                    onChange={this.onPageChange}/>
            </div>
        }

        return (<div>
            <div style={this.styles.tableContainer}>
                {stockAssociatedDataSource.$.entities.length ? <Table selectable={false} onCellClick={
                    (row, col) => {
                        window.open("#"+StockDetailPage.path + stockAssociatedDataSource.$.entities[row].symbol);
                    }
                }>
                    <TableHeader displaySelectAll={false}
                                 adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={this.styles.th}>序号</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.zeroPaddingTh}>代码</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.zeroPaddingTh}>名称</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.th}>现价</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.th}>涨跌</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.th}>涨跌幅</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.netCashFlowTh}>今日资金净流入</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        showRowHover
                        displayRowCheckbox={false}>
                        {stockAssociatedDataSource.$.entities.map((ele, index) => {
                            return <TableRow key={ele.symbol}>
                                <TableRowColumn style={this.styles.td}>{index + 1}</TableRowColumn>
                                <TableRowColumn style={this.styles.zeroPaddingTd}>{ele.symbol}</TableRowColumn>
                                <TableRowColumn style={this.styles.zeroPaddingTd}>{ele.name}</TableRowColumn>
                                <TableRowColumn
                                    style={this.styles.td}>{ele.nowPrice ? ele.nowPrice.toFixed(2) : "-"}</TableRowColumn>
                                <TableRowColumn style={this.styles.td}><span
                                    style={{color: this.numberColor(ele.change)}}>{ele.change ? Util.precisionIncrement(ele.change) : "-"}</span></TableRowColumn>
                                <TableRowColumn style={this.styles.td}><span
                                    style={{color: this.numberColor(ele.changeRatio)}}>{ele.changeRatio ? Util.precisionRate2(ele.changeRatio, 2,true) : "-"}</span></TableRowColumn>
                                <TableRowColumn style={this.styles.netCashFlowTd}><span
                                    style={{color: this.numberColor(ele.netCashFlow)}}>{ele.netCashFlow ? this.cashHandle(ele.netCashFlow) : "-"}</span></TableRowColumn>
                            </TableRow>
                        })}
                    </TableBody>
                </Table> : <div className="center-align" style={this.styles.empty}>暂无数据</div>}
            </div>
            {progress}
            {pages}
        </div>)
    }
}