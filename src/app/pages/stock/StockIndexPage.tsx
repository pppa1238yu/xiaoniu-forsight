///<reference path="../../model/state/FixButtonManager.tsx"/>
import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import {FirstLoading, FixLoading} from "../../components/common/Loading";
import {stockIndexDataSource} from "../../model/ajax/StockService";
import Paper from "material-ui/Paper";
import FlatButton from "material-ui/FlatButton";

import FilterList from "material-ui/svg-icons/content/filter-list";
import Time from "material-ui/svg-icons/device/access-time";
import {darkBlack, grey400, lightBlack, red600, transparent} from "material-ui/styles/colors";
import Filter from "../../components/common/Filter";
import FilterDialog from "../../components/common/FilterDialog";
import SortDialog from "../../components/common/SortDialog";
import Empty from "../../components/common/Empty";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";

import Snackbar from "material-ui/Snackbar";
import IconButton from "material-ui/IconButton";
import ArrowDown from "material-ui/svg-icons/navigation/arrow-downward";
import {List, ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";

import History from "../../router/History";

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import ShowMore from "../../components/common/ShowMore";
import StockDetailPage from "./StockDetailPage";
import {Link} from "react-router-dom";
import TimeButton from "../../components/common/TimeButton";
import {Simulate} from "react-dom/test-utils";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import change = Simulate.change;
import {EntityType} from "../../model/entities/EntityType";
import Attention, {AttentionStyle} from "../../components/common/Attention";
import Block from "material-ui/svg-icons/content/block";
import {Collections} from "../../Constants";
@observer
export default class StockIndexPage extends React.Component<RouteComponentProps<null>, null> {

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
    };

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = StockIndexPage.title;
        barInteraction.custom = true;

        if (stockIndexDataSource.first) {
            if (Util.smallAndPortrait(this.widthNotifier.device)) {
                stockIndexDataSource.isMore = true;
            }

            stockIndexDataSource.request();
        }
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        stockIndexDataSource.setMount(false);
        barInteraction.restore();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        stockIndexDataSource.setMount(true);

        if (this.props.history.action == 'POP') {
            //don't restore
        } else {
            stockIndexDataSource.reset();
            stockIndexDataSource.restore();
        }

        Util.scrollTopInstant();
    }

    onValuesChange = (value) => {
        stockIndexDataSource.setFilter(
            value.queryName,
            value.values,
            value.origin,
        );
        stockIndexDataSource.request();
    };

    onTimeChange = (value) => {
        stockIndexDataSource.setTime(value);
        stockIndexDataSource.request();
    };

    static path = '/stock';
    static title = '智能选股';
    static primaryTitle = (
        <div className="title-margin">
            <div className="primaryTitle">智能选股</div>
            <div className="subTitle">股票热议排名</div>
        </div>
    );
    timeSelect = ['最近 1 周', '最近 1 月', '最近 3 月', '最近 6 月'];

    render() {
        //only small when mobile
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);

        if (stockIndexDataSource.first) {
            if (stockIndexDataSource.loading) {
                return (
                    <FirstLoading label="努力加载中..." mobile={small}/>
                )
            } else {
                return null;
            }
        } else {
            const filter = small ?
                <SmallFilterView
                    values={stockIndexDataSource.filtersOrigin}
                    onValuesChange={this.onValuesChange}
                    onTimeChange={this.onTimeChange}
                    times={this.timeSelect}
                /> :

                <FilterView
                    values={stockIndexDataSource.filtersOrigin}
                    onValuesChange={this.onValuesChange}
                    onTimeChange={this.onTimeChange}
                    times={this.timeSelect}
                />;

            return (
                <div style={this.styles.container as any}>
                    {filter}
                    <StockTable small={small}
                                fixDrawer={fixDrawer}
                                portrait={portrait}/>

                </div>
            );
        }
    }
}

class SmallFilterView extends React.Component<any, any> {
    state = {
        openFilter: false,
        openSort: false,
    };

    handleOpenFilter = () => {
        this.setState({openFilter: true});
    };

    handleCloseFilter = () => {
        this.setState({openFilter: false});
    };

    handleOpenSort = () => {
        this.setState({openSort: true});
    };

    handleCloseSort = () => {
        this.setState({openSort: false});
    };

    componentWillMount() {
        fixButtonManager.showDefaultMulti([
            {icon: <FilterList />, onTouchTap: this.handleOpenFilter},
            {icon: <Time />, onTouchTap: this.handleOpenSort}
        ]);
    }

    componentWillUnmount() {
        fixButtonManager.hidden();
    }

    render() {
        return (
            <div>
                <FilterDialog
                    filterItems={stockIndexDataSource.filterItems}
                    values={this.props.values}
                    onValuesChange={this.props.onValuesChange}
                    handleClose={this.handleCloseFilter}
                    title="股票筛选器"
                    open={this.state.openFilter}
                />
                <SortDialog
                    open={this.state.openSort}
                    handleClose={this.handleCloseSort}
                    title="时间范围选择"
                    value={stockIndexDataSource.time}
                    values={this.props.times}
                    onValueChange={this.props.onTimeChange}
                />
            </div>
        );
    }
}

class FilterView extends React.Component<any, any> {
    styles = {
        paper: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 9,
            paddingBottom: 10,
        },
        selectContainer: {
            marginLeft: 'auto',
        },
        clearColor: {
            color: null,
        }
    };

    state = {time: stockIndexDataSource.time};

    handleChange = (time) => {
        //this.setState({time});
        this.props.onTimeChange(time);
    };

    render() {
        let filters = stockIndexDataSource.filterItems.map(
            (ele, index) => {
                if (ele.labelName == "总市值" || ele.labelName == "风险" || ele.labelName=="综合观点" ) {
                    return (
                        <div role="filterItem" key={index}>
                            <Filter multi={true}
                                    filterData={ele}
                                    single={true}
                                    values={this.props.values}
                                    onValuesChange={this.props.onValuesChange}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div role="filterItem" key={index}>
                            <Filter multi={true}
                                    filterData={ele}
                                    values={this.props.values}
                                    onValuesChange={this.props.onValuesChange}
                            />
                        </div>
                    );
                }
            }
        );
        return (
            <div>
                <Paper style={this.styles.paper}>
                    <div role="filter" className="flex-center">
                        {filters}
                        <div role="timeFilter" className="auto-right">
                            <TimeButton
                                onValueChange={
                                    this.handleChange
                                }
                                value={this.state.time}
                                values={this.props.times}
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}

class SortItem extends React.Component<any, any> {
    styles = {
        smallIcon: {
            width: 16,
            height: 16,
            paddingRight: 2,
        },
        smallIconGrey: {
            width: 16,
            height: 16,
            paddingRight: 2,
            color: '#ccc',
        },
        iconContainer: {
            padding: 0,
            width: 16,
            height: 21,
            paddingTop: 5,
        },
        sort: {
            color: 'none',
            textAlign: 'center',
            paddingLeft: 6,
            paddingRight: 6,
        },
        sortButton: {
            minWidth: 'none',
            lineHeight: 'none',
            height: 'none',
            padding: 0,
        },
        labelStyle: {
            fontSize: 12,
            lineHeight: 'none',
            verticalAlign: 'none',
            fontWeight: 'none',
            padding: 0,
        },
    };

    render() {
        let explainText = "";
        if (this.props.sortName === "目标价涨幅") {
            explainText = "平均目标价与当前价之差除以当前价";
        }
        if (this.props.selected) {
            return (
                <TableHeaderColumn style={this.styles.sort} className="stock-sort" onTouchTap={() => {
                    this.props.sortHandle(this.props.sort, this.props.sortName)
                }} title={explainText}>
                    <div className="flex-center-mid" title={this.props.title} role={this.props.role}>
                        <div>
                            <IconButton
                                iconStyle={this.styles.smallIcon as any}
                                style={this.styles.iconContainer}
                            >
                                <ArrowDown />
                            </IconButton>
                        </div>
                        <div>
                            <FlatButton label={this.props.sortName}
                                        style={this.styles.sortButton}
                                        labelStyle={this.styles.labelStyle}
                                        hoverColor="rgba(0,0,0,0)"
                                        onTouchTap={
                                            (event) => {
                                                // event.preventDefault();
                                                // this.props.sortHandle(this.props.sort, this.props.sortName)
                                            }
                                        }
                            />
                        </div>
                    </div>
                </TableHeaderColumn>
            );
        } else {
            return (
                <TableHeaderColumn style={this.styles.sort} className="stock-sort" onTouchTap={() => {
                    this.props.sortHandle(this.props.sort, this.props.sortName)
                }} title={explainText}>

                    <div className="flex-center-mid" title={this.props.title} role={this.props.role}>
                        <IconButton
                            iconStyle={this.styles.smallIconGrey as any}
                            style={this.styles.iconContainer}
                        >
                            <ArrowDown />
                        </IconButton>
                        <FlatButton label={this.props.sortName}
                                    style={this.styles.sortButton}
                                    labelStyle={this.styles.labelStyle}
                                    hoverColor="rgba(0,0,0,0)"
                                    onTouchTap={
                                        (event) => {
                                            // event.preventDefault();
                                            // this.props.sortHandle(this.props.sort, this.props.sortName)
                                        }
                                    }
                        />
                    </div>
                </TableHeaderColumn>
            );
        }
    }
}

class StockTable4Desktop extends React.Component<any, any> {
    styles = {
        smallIcon: {
            width: 16,
            height: 16,
        },
        iconContainer: {
            padding: 0,
            width: 16,
            height: 21,
            paddingTop: 5,
        },
        sort: {
            color: 'none',
            textAlign: 'center',
        },
        sortButton: {
            minWidth: 'none',
            lineHeight: 'none',
            height: 'none',
            padding: 0,
        },
        labelStyle: {
            fontSize: 12,
            lineHeight: 'none',
            verticalAlign: 'none',
            fontWeight: 'none',
            padding: 0,
        },
        tableCell: {
            textAlign: 'center',
            paddingLeft: 16,
            paddingRight: 16,
        },
        tableCellNumber: {
            textAlign: 'center',
            paddingLeft: 12,
            paddingRight: 12,
        },
        tableCellNumberRed: {
            color: "red",
            textAlign: 'center',
            paddingLeft: 12,
            paddingRight: 12,
        },
        tableCellNumberGreen: {
            color: "green",
            textAlign: 'center',
            paddingLeft: 12,
            paddingRight: 12,
        },
        tableCellText: {
            textAlign: 'center',
            paddingLeft: 16,
            paddingRight: 16,
        },
        tableCellRight: {
            textAlign: 'right',
            paddingLeft: 16,
            paddingRight: 16,
        },
        tableCellIndustry: {
            textAlign: 'center',
            paddingLeft: 32,
            paddingRight: 32,
        },
        rowStyle: {
            height: 58
        },
        headerStyle: {
            height: 50,
            fontSize: 14,
            color: '#9e9e9e'
        },
        firstColumn: {
            paddingLeft: 0,
            paddingRight: 0,
            overflow: "visible"
        },
        circleStyle: {
            display:'inline-block',
            width:5,
            height:5,
            margin:'0 1px',
            backgroundColor:'#ff6b00',
            borderRadius:'2.5px'
        },
        scoreStyle:{
            display:'inline-block',
            padding:'0 3px'
        }
    };

    sortHandle = (value, name) => {
        if (stockIndexDataSource.sort == value) {
            //ignore
            this.tipSortReady(name);
        } else {
            stockIndexDataSource.setSort(value);
            stockIndexDataSource.request();
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            tipOpen: false,
        };
    }

    tipSortReady = (name) => {
        this.setState({
            tipOpen: true,
            sortName: name,
        });
    };

    handleRequestClose = () => {
        this.setState({
            tipOpen: false,
        });
    };

    getTableCellNumberStyle(value: number) {
        let tableCellNumberStyle = this.styles.tableCellNumber;
        if (value > 0) {
            tableCellNumberStyle = this.styles.tableCellNumberRed;
        }
        if (value < 0) {
            tableCellNumberStyle = this.styles.tableCellNumberGreen;
        }
        return tableCellNumberStyle;
    };

    calcRate = (score) => {
        let num = Math.floor(score / 2);
        let rateArray = [];
        if(score == 0){
            rateArray.push(<span style={this.styles.circleStyle} key={1}/>);
        }else {
            if (score >= 0 && score < 3) {
                num = 1;
            } else if (score >= 3 && score < 7) {
                num = 2;
            } else if (score >= 7 && score < 11) {
                num = 3;
            } else if (score >= 11 && score < 15) {
                num = 4;
            } else {
                num = 5;
            }
            for (let i = 0; i < num; i++) {
                rateArray.push(<span style={this.styles.circleStyle} key={i}/>)
            }
        }
        rateArray.push(<span key={6}>/{(score/2).toFixed(1)}</span>);
        return rateArray;
    };

    render() {
        /*
         const cards = stockIndexDataSource.$.entities.map(
         (ele) => (
         <div className="fix-card" key={ele.target.gtaId}>
         <AnalystCard value={ele}/>
         </div>)
         );
         */
        const rows = stockIndexDataSource.$.entities.map(
            (ele) => {
                let {
                    stockCode, shortName, marketValue, industryName, riskLevel, fundamentalsScore, totalScore, valuationScore,
                    viewPointCount, targetPrice, prices, changeRatio, premiumRate,
                    currentPrice, viewPoint, delistedDate
                } = ele.target;
                const market = marketValue != undefined ? "" + Util.formatMoney2(marketValue / 100000000) : '-';
                const current = currentPrice == undefined ? '-' : currentPrice;

                targetPrice = (targetPrice && targetPrice.toFixed(2)) || '-';
                let changeRatioStyle = this.getTableCellNumberStyle(changeRatio);

                if (premiumRate == undefined) {
                    premiumRate = '-';
                } else {
                    premiumRate = Util.precisionRate2(premiumRate, 2, true);
                }

                const delistedIcon = delistedDate !== undefined ? (
                    <IconButton tooltip="已退市"><Block/></IconButton>) : null;

                let totalScoreShow = [];
                if(totalScore != undefined){
                    totalScoreShow = this.calcRate(totalScore);
                }
                if (this.props.portrait) {
                    return (
                        <TableRow key={stockCode} style={this.styles.rowStyle}>
                            <TableRowColumn role="stockCode"
                                            style={this.styles.tableCellNumber}>
                                <span style={{verticalAlign: "6px"}}>{stockCode}</span>
                            </TableRowColumn>
                            <TableRowColumn role="stockShortName"
                                            style={delistedDate ? this.styles.firstColumn : this.styles.tableCellText}>
                                {delistedIcon}
                                <span style={{verticalAlign: "6px"}}>{shortName}</span>
                            </TableRowColumn>
                            <TableRowColumn role="currentPrice"
                                            style={this.styles.tableCellNumber}>{current}</TableRowColumn>
                            <TableRowColumn role="综合观点" style={this.styles.tableCellText}>{viewPoint}</TableRowColumn>
                            <TableRowColumn role="小牛智选"
                                            style={this.styles.tableCellRight}>{totalScoreShow || '-'}</TableRowColumn>
                            <TableRowColumn role="focusButton" style={this.styles.tableCellNumber}>
                                {delistedDate == undefined ? <Attention
                                    type={EntityType.STOCK}
                                    code={stockCode}
                                    fixDrawer={this.props.fixDrawer}
                                    style={this.props.small ? AttentionStyle.FLOATING : AttentionStyle.ICON}
                                /> : null}
                            </TableRowColumn>
                        </TableRow>
                    );
                } else {
                    return (
                        <TableRow role="stockItemOfIndexPage" key={stockCode} style={this.styles.rowStyle}>
                            <TableRowColumn role="stockCode"
                                            style={delistedDate ? this.styles.firstColumn : this.styles.tableCellNumber}>
                                {delistedIcon}
                                <span style={{verticalAlign: "6px"}}>{stockCode}</span>
                            </TableRowColumn>
                            <TableRowColumn role="stockShortName"
                                            style={this.styles.tableCellText}>{shortName}</TableRowColumn>
                            <TableRowColumn role="currentPrice"
                                            style={this.styles.tableCellNumber}>{current}</TableRowColumn>
                            <TableRowColumn role="changeRatio_currentPrice"
                                            style={changeRatioStyle}>{Collections.getPercentage(changeRatio)}</TableRowColumn>
                            <TableRowColumn role="riskLevel"
                                            style={this.styles.tableCellNumber}>{riskLevel}</TableRowColumn>
                            <TableRowColumn role="综合观点" style={this.styles.tableCellText}>{viewPoint}</TableRowColumn>
                            <TableRowColumn role="viewPointCount"
                                            style={this.styles.tableCellText}>{viewPointCount}</TableRowColumn>
                            <TableRowColumn role="财务评级"
                                            style={this.styles.tableCellText}>{(fundamentalsScore/9*10).toFixed(1) || '-'}</TableRowColumn>
                            <TableRowColumn role="估值表现"
                                            style={this.styles.tableCellText}>{(valuationScore*2).toFixed(1) || '-'}</TableRowColumn>
                            <TableRowColumn role="小牛智选"
                                            style={this.styles.tableCellRight}>{totalScoreShow || '-'}</TableRowColumn>
                            <TableRowColumn role="focusButton" style={this.styles.tableCellNumber}>
                                {delistedDate == undefined ? <Attention
                                    type={EntityType.STOCK}
                                    code={stockCode}
                                    fixDrawer={this.props.fixDrawer}
                                    style={this.props.small ? AttentionStyle.FLOATING : AttentionStyle.ICON}
                                /> : null}
                            </TableRowColumn>
                        </TableRow>
                    );

                }

            }
        );

        const viewSort = stockIndexDataSource.sort == stockIndexDataSource.sortItems[11].value;
        const viewColumn = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[1].value}
                                     sort={stockIndexDataSource.sortItems[1].value}
                                     sortName="观点数"
                                     sortHandle={this.sortHandle}
                                     role="viewPoint"
        />;
        const finatial = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[12].value}
                                   sort={stockIndexDataSource.sortItems[12].value}
                                   sortName="财务评级"
                                   title="根据个股成长性、盈利性和分析师预测三个基本面计算获得，分数越高，基本面越好。"
                                   role="financialRating"
                                   sortHandle={this.sortHandle}/>;
        const valueRate = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[13].value}
                                    sort={stockIndexDataSource.sortItems[13].value}
                                    sortName="估值表现"
                                    title="根据智能研报估值分析总评分进行一级排序，并按历史估值分析进行二级排序，排名越靠前，股票被低估的可能性越大。"
                                    role="valuation"
                                    sortHandle={this.sortHandle}/>;
        const smartCow = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[11].value}
                                   sort={stockIndexDataSource.sortItems[11].value}
                                   sortName="小牛智选"
                                   title = "个股智能研报总评分(满分10分)，分数越高，综合表现越好。"
                                   role="smartScore"
                                   sortHandle={this.sortHandle}/>;
        const curPrice = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[7].value}
                                   sort={stockIndexDataSource.sortItems[7].value}
                                   sortName="现价"
                                   role="price"
                                   sortHandle={this.sortHandle}/>;
        const upDownRate = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[8].value}
                                     sort={stockIndexDataSource.sortItems[8].value}
                                     sortName="涨跌幅"
                                     role="changeRatio"
                                     sortHandle={this.sortHandle}/>;

        const headers = this.props.portrait ?
            (
                <TableRow style={this.styles.headerStyle}>
                    <TableHeaderColumn style={this.styles.tableCellText}>股票代码</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.tableCellNumber}>股票名称</TableHeaderColumn>
                    {curPrice}
                    <TableHeaderColumn style={this.styles.tableCellText} title="分析师一致性预期">综合观点</TableHeaderColumn>
                    {smartCow}
                    <TableHeaderColumn style={this.styles.tableCellNumber}>自选股</TableHeaderColumn>
                </TableRow>
            ) :
            (
                <TableRow style={this.styles.headerStyle}>
                    <TableHeaderColumn style={this.styles.tableCellNumber}>股票代码</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.tableCellText}>股票名称</TableHeaderColumn>
                    {curPrice}
                    {upDownRate}
                    <TableHeaderColumn
                        style={this.styles.tableCellNumber}
                        title="根据个股系统风险和个股波动风险得到评级"
                    >风险评级</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.tableCellText} title="分析师一致性预期">综合观点</TableHeaderColumn>
                    {viewColumn}
                    {finatial}
                    {valueRate}
                    {smartCow}
                    <TableHeaderColumn style={this.styles.tableCellNumber}>自选股</TableHeaderColumn>
                </TableRow>

            );
        return (
            <div>
                <Table fixedHeader
                       onCellClick={
                           (row, col) => {
                               if ((!this.props.portrait && col != 11) || (this.props.portrait && col != 8)) {
                                   History.push(StockDetailPage.path + stockIndexDataSource.$.entities[row].target.stockCode);
                               }
                           }
                       }
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}>
                        {headers}
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        showRowHover
                    >
                        {rows}
                    </TableBody>
                </Table>
                <Snackbar
                    open={this.state.tipOpen}
                    message={"当前已按 " + this.state.sortName + " 排序"}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

@observer
class Stock4Desktop extends React.Component<any, any> {

    styles = {
        container: {
            position: 'relative',
            paddingBottom: 24,
            flexGrow: 1,
            paddingTop: 10,
            display: 'flex',
            flexFlow: 'column',
        },
        space: {
            flexGrow: 1,
        },
        page: {
            paddingTop: 8,
        }
    };

    onPageChange = (index) => {
        stockIndexDataSource.setRequestPageIndex(index - 1);
        stockIndexDataSource.request(() => Util.scrollTop());
    };

    render() {
        const loading = stockIndexDataSource.loading;

        if (!loading && stockIndexDataSource.error) {
            return null;
        } else {
            const progress = loading ? <FixLoading mobile={false} transparent={true}/> : null;
            if (stockIndexDataSource.$.totalRowCount == 0) {
                return (
                    <div style={this.styles.container as any}>
                        <Empty mobile={false}/>
                        {progress}
                    </div>
                );
            } else {
                return (
                    <div style={this.styles.container as any}>
                        <div className="">
                            <div className="fix-stocks fix-stocks-width">
                                <StockTable4Desktop fixDrawer={this.props.fixDrawer} portrait={this.props.portrait}/>
                            </div>
                        </div>
                        <div style={this.styles.space}/>
                        <div className="center-align" style={this.styles.page}>
                            <Paper role="pageTurner" className="fix-stocks-width">
                                <UltimatePaginationMaterialUi
                                    currentPage={stockIndexDataSource.$.pageIndex + 1}
                                    totalPages={stockIndexDataSource.$.pageCount}
                                    hideFirstAndLastPageLinks={true}
                                    onChange={this.onPageChange}/>
                            </Paper>
                        </div>
                        {progress}
                    </div>
                );
            }
        }
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
                {this.props.delistedDate == undefined ? <Attention
                    type={EntityType.STOCK}
                    code={this.props.stockCode}
                    fixDrawer={false}
                    style={AttentionStyle.ITEM}
                /> : null}
                <ListItem primaryText="查看更多"
                          containerElement={<Link to={StockDetailPage.path + this.props.stockCode}/>}
                          leftIcon={<RemoveRedEye />}/>
            </Dialog>
        );
    }
}

@observer
class Stock4Mobile extends React.Component<any, any> {
    styles = {
        list: {
            paddingBottom: 0,
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 0,
        },
        more: {},
        point: {
            fontSize: 30,
            right: 38,
            top: 18,
            height: 'none',
            width: 'none',
        },
        tableCell: {
            textAlign: 'center',
            paddingLeft: 2,
            paddingRight: 2,
        },
        tableCellNumber: {
            textAlign: 'center',
            paddingLeft: 4,
            paddingRight: 4,
        },
        tableCellRight: {
            textAlign: 'right',
            paddingLeft: 4,
            paddingRight: 4,
        },
        tableCellText: {
            textAlign: 'center',
            paddingLeft: 4,
            paddingRight: 4,
        },
        firstColumn: {
            paddingLeft: 0,
            paddingRight: 0,
            overflow: "visible"
        },
        delisted: {
            fontSize: 12,
            color: "#919191"
        },
        circleStyle: {
            display:'inline-block',
            width:5,
            height:5,
            margin:'0 1px',
            backgroundColor:'#ff6b00',
            borderRadius:'2.5px'
        }
    };

    state = {
        dialogOpen: false,
        link: "",
        delistedDate: false
    };

    handleOpen = (link) => {
        this.setState(
            {
                dialogOpen: true,
                link: link,
            }
        );
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    stockClicked = (link, delistedDate) => {
        this.setState(
            {
                dialogOpen: true,
                link: link,
                delistedDate: delistedDate
            }
        )
    };

    calcRate = (score) => {
        let num = Math.floor(score / 2);
        let rateArray = [];
        if(score == 0){
            rateArray.push(<span style={this.styles.circleStyle} key={1}/>);
        }else {
            if (score >= 0 && score < 3) {
                num = 1;
            } else if (score >= 3 && score < 7) {
                num = 2;
            } else if (score >= 7 && score < 11) {
                num = 3;
            } else if (score >= 11 && score < 15) {
                num = 4;
            } else {
                num = 5;
            }
            for (let i = 0; i < num; i++) {
                rateArray.push(<span style={this.styles.circleStyle} key={i}/>)
            }
        }
        rateArray.push(<span key={6}>/{(score/2).toFixed(1)}</span>);
        return rateArray;
    };

    sortHandle = (value, name) => {
        if (stockIndexDataSource.sort == value) {
            //ignore
        } else {
            stockIndexDataSource.setSort(value);
            stockIndexDataSource.request();
        }
    };

    render() {
        const loading = stockIndexDataSource.loading;
        if (stockIndexDataSource.$.totalRowCount == 0) {
            if (loading) {
                return (
                    <FirstLoading mobile={true}/>
                );
            }
            return (
                <div>
                    <Empty mobile/>
                </div>
            );
        } else {
            const curPrice = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[7].value}
                                       sort={stockIndexDataSource.sortItems[7].value}
                                       sortName="现价"
                                       sortHandle={this.sortHandle}/>;
            const smartCow = <SortItem selected={stockIndexDataSource.sort == stockIndexDataSource.sortItems[11].value}
                                       sort={stockIndexDataSource.sortItems[11].value}
                                       sortName="小牛智选"
                                       sortHandle={this.sortHandle}/>;
            const rows = stockIndexDataSource.more.map(
                (ele) => {
                    let {
                        stockCode, shortName, targetPrice, viewPointCount, currentPrice, delistedDate,totalScore
                    } = ele.target;
                    const current = currentPrice == undefined ? '-' : currentPrice;

                    let totalScoreShow = [];
                    if(totalScore != undefined){
                        totalScoreShow = this.calcRate(totalScore);
                    }
                    targetPrice = (targetPrice && targetPrice.toFixed(2)) || '-';
                    const delisted = delistedDate ? <span style={this.styles.delisted}>(已退市)</span> : null;
                    return (
                        <TableRow key={stockCode} onTouchTap={
                            (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.stockClicked(stockCode, delistedDate);
                            }
                        }>
                            <TableRowColumn style={this.styles.tableCellNumber}>{stockCode}</TableRowColumn>
                            <TableRowColumn style={delistedDate ? this.styles.firstColumn : this.styles.tableCellText}>
                                {shortName}
                                {delisted}
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tableCellNumber}>{current}</TableRowColumn>
                            <TableRowColumn style={this.styles.tableCellNumber}>{totalScoreShow || '-'}</TableRowColumn>
                        </TableRow>
                    );
                }
            );

            const headers = (
                <TableRow>
                    <TableHeaderColumn style={this.styles.tableCellText}>股票代码</TableHeaderColumn>
                    <TableHeaderColumn style={this.styles.tableCellNumber}>股票名称</TableHeaderColumn>
                    {curPrice}
                    {smartCow}
                </TableRow>
            );

            let more = null;
            if (stockIndexDataSource.$.pageIndex
                < stockIndexDataSource.$.pageCount - 1) {
                more = (
                    <ShowMore loading={stockIndexDataSource.loading}
                              onTouchTap={
                                  (event) => {
                                      event.preventDefault();
                                      stockIndexDataSource.requestMore();
                                      stockIndexDataSource.request();
                                  }
                              }/>
                );
            }
            //<Empty mobile={true} label="No Result"/>
            return (
                <Paper style={this.styles.list}>

                    <Table fixedHeader
                           onCellClick={
                               (row) => {
                               }
                           }
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}>
                            {headers}
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover
                        >
                            {rows}
                        </TableBody>
                    </Table>

                    {more}
                    {
                        <StockItemDialog
                            open={this.state.dialogOpen}
                            handleClose={this.handleClose}
                            stockCode={this.state.link}
                            delistedDate={this.state.delistedDate}
                        />
                    }
                </Paper>
            )
            //<AnalystItemDialog open={this.state.dialogOpen} handleClose={this.handleClose}/>

        }
        // }
    }
}

class StockTable extends React.Component<any, any> {
    render() {
        if (this.props.small) {
            return <Stock4Mobile/>;
        } else {
            return <Stock4Desktop
                portrait={this.props.portrait}
                fixDrawer={this.props.fixDrawer}/>;
        }
    }
}