import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {stockAssociatedDataSource} from "../../model/ajax/CategoryService";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {grey700, red700, lightGreen500, red500, green500} from "material-ui/styles/colors";
import ShowMore from "../common/ShowMore";
import {Util, Collections} from "../../Constants";
import StockDetailPage from "../../pages/stock/StockDetailPage";
import {List, ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";
import {Link} from "react-router-dom";

interface StocksAssociatedMobileViewProps {
    type: string;
    symbol: string;
    notifyResult: (err) => void
}

@observer
export default class StocksAssociatedMobileView extends React.Component<StocksAssociatedMobileViewProps, any> {
    styles = {
        tableContainer: {
            paddingLeft: "16px"
        },
        th: {
            fontSize: 14,
            color: "#919191",
            paddingLeft: "4px",
            paddingRight: "4px"
        },
        td: {
            fontSize: 14,
            color: grey700,
            paddingLeft: "4px",
            paddingRight: "4px"
        },
        empty: {
            lineHeight: "50px"
        }
    };

    state = {
        dialogOpen: false,
        link: ""
    };


    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    stockClicked = (link) => {
        this.setState(
            {
                dialogOpen: true,
                link: link
            }
        )
    };

    numberColor(num) {
        if (num > 0) {
            return red500
        } else if (num == 0) {
            return grey700
        } else {
            return green500
        }
    };

    componentDidMount() {
        stockAssociatedDataSource.setResultNotify(this.props.notifyResult);
        stockAssociatedDataSource.type = this.props.type;
        stockAssociatedDataSource.setRequestId(this.props.symbol);
        stockAssociatedDataSource.refresh();
    }

    componentWillMount() {
        stockAssociatedDataSource.reset();
        stockAssociatedDataSource.restore();
    }

    render() {
        let more = null;
        if (stockAssociatedDataSource.$.pageIndex
            < stockAssociatedDataSource.$.pageCount - 1 && stockAssociatedDataSource.$.entities.length) {
            more = (
                <ShowMore loading={stockAssociatedDataSource.loading}
                          onTouchTap={
                              (event) => {
                                  event.preventDefault();
                                  stockAssociatedDataSource.requestMore();
                                  stockAssociatedDataSource.refresh();
                              }
                          }/>
            );
        }

        let data = Collections.distinct(stockAssociatedDataSource.more, stock => stock.symbol);//股票列表去重，避免key重复

        return (<div>
            <div style={this.styles.tableContainer}>
                {stockAssociatedDataSource.$.entities.length ? <Table selectable={false}>
                    <TableHeader displaySelectAll={false}
                                 adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={this.styles.th}>名称</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.th}>现价</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.th}>涨跌</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.th}>涨跌幅</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        showRowHover
                        displayRowCheckbox={false}>
                        {data.map((ele, index) => {
                            return <TableRow key={ele.symbol} onTouchTap={
                                (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.stockClicked(ele.symbol);
                                }}>
                                <TableRowColumn style={this.styles.td}>{ele.name}</TableRowColumn>
                                <TableRowColumn style={this.styles.td}>{ele.nowPrice.toFixed(2)}</TableRowColumn>
                                <TableRowColumn style={this.styles.td}><span
                                    style={{color: this.numberColor(ele.change)}}>{Util.precisionIncrement(ele.change)}</span></TableRowColumn>
                                <TableRowColumn style={this.styles.td}><span
                                    style={{color: this.numberColor(ele.changeRatio)}}>{Util.precisionRate2(ele.changeRatio, 2,true)}</span></TableRowColumn>
                            </TableRow>
                        })}
                    </TableBody>
                </Table> : <div className="center-align" style={this.styles.empty}>暂无数据</div>}
            </div>
            {more}
            <StockItemDialog
                open={this.state.dialogOpen}
                handleClose={this.handleClose}
                stockCode={this.state.link}
            />
        </div>)
    }
}

class StockItemDialog extends React.Component<any, any> {

    render() {
        return (
            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={true}
                autoDetectWindowHeight
            >
                <ListItem primaryText="查看更多"
                          containerElement={<Link to={StockDetailPage.path + this.props.stockCode} target="_blank"/>}
                          leftIcon={<RemoveRedEye />}/>
            </Dialog>
        );
    }
}