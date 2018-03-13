import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import RaisedButton from 'material-ui/RaisedButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle-outline';
import StockDetailPage from "../stock/StockDetailPage";
import Dialog from "material-ui/Dialog";
import {EntityType} from "../../model/entities/EntityType";
import Favorite from "material-ui/svg-icons/action/favorite";
import {List, ListItem} from "material-ui/List";
import {Link} from "react-router-dom";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";
import Empty from "../../components/common/Empty";
import {default as Constants} from "../../Constants";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {green500, grey500, red500 , transparent} from "material-ui/styles/colors";
import Snackbar from "material-ui/Snackbar";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import ArrowDown from "material-ui/svg-icons/navigation/arrow-downward";
import ArrowUp from "material-ui/svg-icons/navigation/arrow-upward";

import {barInteraction} from "../../components/bar/BarInteraction";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {Util} from "../../Constants";
import {FirstLoading, FixLoading} from "../../components/common/Loading";
import {stockAttentionDataSource} from "../../model/ajax/SmartAccountService";

import ButtonGroup from "./ButtonGroup";
import EditableTagGroup from "./EditableTagGroup";
import {watchSearcher} from "./WatchSearcher";
import History from "../../router/History";
import SortDialog from "../../components/common/SortDialog";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import Sort from "material-ui/svg-icons/content/sort";
import {StockAttentionInfo} from "../../model/entities/StockAttentionInfo";

class SortItem extends React.Component<any, any> {
    isAsc:boolean=false;
    orderStocks() {
        stockAttentionDataSource.orderType = this.props.orderType;
        this.isAsc=!(this.isAsc);
        stockAttentionDataSource.order = this.isAsc ? "ASC" : "DESC";
        stockAttentionDataSource.request(()=>{
            this.props.refreshSortState(this.props.index);
        });
    }
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
            paddingLeft: 12,
            paddingRight: 12,
            overFlow:"hidden"
        },
        sortMoreWidth: {
            color: 'none',
            textAlign: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            width: 97
        },
        tagsColumn: {
            paddingLeft: 12,
            paddingRight: 12,
            width: "300px",
            textAlign: "center"
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
        }
    };
    render() {
        let arrowUp=null;
        let arrowDown=null;
        let explainText="";
        switch (this.props.sortName){
            case "目标价":explainText="分析师一致性预期的平均目标价";break;
            case "分析师观点":explainText="评级该股的所有分析师一致性预期";break;
            case "五星分析师观点":explainText="评级该股的所有五星得分的分析师一致性预期";break;
            case "关注时长":explainText="关注日起到当前日的天数";break;
            case "关注后表现":explainText="关注日起的涨跌幅表现";break;
            default:explainText="";
        }
        if(this.props.ifShow){
                if(this.isAsc){
                    arrowUp=(
                        <div>
                            <IconButton
                                iconStyle={this.styles.smallIcon}
                                style={this.styles.iconContainer}
                            >
                                <ArrowUp/>
                            </IconButton>
                        </div>
                    );
                }else{
                    arrowDown=(
                        <div>
                            <IconButton
                                iconStyle={this.styles.smallIcon}
                                style={this.styles.iconContainer}
                            >
                                <ArrowDown/>
                            </IconButton>
                        </div>
                    );
                }
        }
        return (
            <TableHeaderColumn
                style={!this.props.lastColumn ? (this.props.moreWidth ? this.styles.sortMoreWidth : this.styles.sort) : this.styles.tagsColumn}
                onTouchTap={
                    ()=>{
                        this.orderStocks();
                    }
                }
                title={explainText}
            >
                <div role="sortButton" className="flex-center">
                    {arrowUp}
                    {arrowDown}
                    <div>
                        <FlatButton label={this.props.sortName}
                                    style={this.styles.sortButton}
                                    labelStyle={this.styles.labelStyle}
                                    hoverColor="rgba(0,0,0,0)"
                                    onTouchTap={
                                        () => {

                                        }
                                    }
                        />
                    </div>
                </div>
            </TableHeaderColumn>
        );
    }
}

class MobileSort extends React.Component<any, any>{
    sortType=["STOCK_CODE","STOCK_CODE","STOCK_CHANGE_RATIO","STOCK_CHANGE_RATIO","FIVE_STAR_COMPOSITE_RATING",
        "FIVE_STAR_COMPOSITE_RATING","CURRENT_CHANGERATIO","CURRENT_CHANGERATIO"];
    state={
        openSort:false,
        selectedIndex:3
    };
    handleOpenSort(){
        this.setState({
            openSort:true
        })
    }
    handleCloseSort(){
        this.setState({openSort: false});
    };
    mobileSortStocks(index){
        stockAttentionDataSource.orderType = this.sortType[index];
        stockAttentionDataSource.order = index%2 ? "DESC" : "ASC";
        stockAttentionDataSource.request();
        this.setState({
            selectedIndex:index
        })
    }
    componentWillMount(){
        fixButtonManager.showDefaultMulti([
            {icon: <Sort />,onTouchTap: this.handleOpenSort.bind(this)}
        ]);
    }
    render(){
        return (
            <SortDialog
                open={this.state.openSort}
                handleClose={this.handleCloseSort.bind(this)}
                title="排序方式选择"
                value={this.state.selectedIndex}
                values={["公司升序","公司降序","现价涨跌升序","现价涨跌降序","五星分析师观点升序","五星分析师观点降序","关注后表现升序","关注后表现降序"]}
                onValueChange={(index)=>{
                    this.mobileSortStocks(index)
                }}
            />
        )
    }
}

@observer
export default class SmartAccountPage extends React.Component<any, any> {
    static path = "/smartAccount";
    static title = '智能账户';
    widthNotifier: WidthNotifier = null;
    @observable checkBoxState: boolean = false;
    @observable showArrIndex = 0;
    selectAll: boolean = false;
    deleteState: boolean = false;
    clickCheckIndex = 0;
    deleteWord: string = '删除';
    deleteRow = [];
    selectable: boolean = false;
    rowIndex:any;
    small:boolean = false;
    deselectOnClickaway:boolean = true;
    state = {
        open: false,
        inputVisible: false,
        inputValue: '',
        stockCode: '',
        data: '',
        sortShowArr:[false,true,false,false,false,false,false,false]
    };
    componentDidMount() {
        barInteraction.title = SmartAccountPage.title;
        barInteraction.custom = true;
        if (stockAttentionDataSource.first) {
            stockAttentionDataSource.request();
        }
        stockAttentionDataSource.requestTags();
        watchSearcher.register(()=>{
            stockAttentionDataSource.request();
        });
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        stockAttentionDataSource.setMount(false);
        barInteraction.restore();
        watchSearcher.unRegister();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        stockAttentionDataSource.setMount(true);
        stockAttentionDataSource.restore();
    }

    handleOpen = () => {
        this.clickCheckIndex++;
        if (this.deleteState) {
            runInAction(() => {
                this.deselectOnClickaway = true;
                this.selectable = false;
                this.deleteWord = '删除';
                this.checkBoxState = false;
                this.deleteState = false;
            });
            if (this.deleteRow.length) {
                stockAttentionDataSource.deleteStock(this.deleteRow);
            }
        } else {
            runInAction(() => {
                this.deselectOnClickaway = false;
                this.deleteRow = [];
                this.selectable = true;
                this.deleteWord = '完成';
                this.checkBoxState = true;
                this.deleteState = true;
            });
        }
    };
    changeTag = (index) => {
        this.showArrIndex = index;
    };

    tagsChange(value) {
        stockAttentionDataSource.requestTags(value);
    }

    addStockTag = (stockCode, chosenRequest) => {
        if(this.small){
            stockAttentionDataSource.addStockTag(stockCode, chosenRequest ,this.refreshState);
        }else {
            stockAttentionDataSource.addStockTag(stockCode, chosenRequest);
        }
    };

    deleteStockTag = (stockCode, chosenRequest) => {
        if(this.small){
            stockAttentionDataSource.deleteStockTag(stockCode, chosenRequest , this.refreshState);
        }else {
            stockAttentionDataSource.deleteStockTag(stockCode, chosenRequest);
        }

    };

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        tableContainer: {
            position: 'relative',
            paddingBottom: 24,
            flexGrow: 1,
            paddingTop: 6,
            display: 'flex',
            flexFlow: 'column',
        },
        indexStyle: {
            width: '24px'
        },
        tagsColumn: {
            width: "300px",
            textAlign: "center",
            paddingLeft:"12px",
            paddingRight:"12px"
        },
        tdPadding:{
            paddingLeft:"12px",
            paddingRight:"12px"
        }
    };

    numberColor(value) {
        if (value > 0) {
            return red500
        } else if (value === 0) {
            return grey500
        } else {
            return green500
        }
    }

    displayDays(value) {
        return Math.round(value / (24 * 60 * 60)) + "天";
    }

    refreshState = () => {
        const stocksArr = stockAttentionDataSource.$.map((ele, index) => {
            return ele.stocks
        });
        const stockDatasourse = stocksArr[this.showArrIndex];
        this.setState(
            {
                data:stockDatasourse[this.rowIndex],
            }
        )
    };
    refreshSortState(sortIndex){
        let newSortShowArr=this.state.sortShowArr.map((value,index)=>{
            return sortIndex==index;
        });
        this.setState({
            sortShowArr:newSortShowArr
        });
    }
    handleClose = () => {
        this.setState({
            open: false
        })
    };

    render() {
        //only small when mobile
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);

        const smallAndPortrait=Util.smallAndPortrait(this.widthNotifier.device);

        this.small = small;

        if (stockAttentionDataSource.first) {
            if (stockAttentionDataSource.loading) {
                return (
                    <FirstLoading label="努力加载中..." mobile={small}/>
                )
            } else {
                return null;
            }
        } else {
            const progress = stockAttentionDataSource.loading ? <FixLoading zIndex={1501} mobile={false} transparent/> : null;
            let showDeleteButton = null;
            if (!small) {
                showDeleteButton = (
                    <div style={{float: 'right', marginTop: 15}}>
                        <RaisedButton
                            label={this.deleteWord}
                            onTouchTap={this.handleOpen}
                            icon={<DeleteIcon color={grey500} style={{width:'18px',height:'18px'}}/>}
                            labelStyle={{fontSize: 12}}
                            labelColor = '#fff'
                            backgroundColor={transparent}
                            style={{background: 'transparent',boxShadow:'none'}}
                        />
                    </div>
                );
            }
            let tags = stockAttentionDataSource.tags.map(value => {
                return value;
            });
            let tagsArr = [];
            tagsArr = stockAttentionDataSource.$.map((ele, index) => {
                return ele.tag
            });
            let stockAttentionInfoArrs: Array<Array<StockAttentionInfo>> = stockAttentionDataSource.$.map((ele, index) => {
                return ele.stocks
            });
            let rowDataElements:Array<JSX.Element>;
            let stockAttentionInfos: Array<StockAttentionInfo>;//表格内容
            const stockLength = stockAttentionInfoArrs.length;
            if(this.showArrIndex == stockLength){
                const showIndex = this.showArrIndex - 1;
                stockAttentionInfos = stockAttentionInfoArrs[showIndex];
            }else {
                stockAttentionInfos = stockAttentionInfoArrs[this.showArrIndex];
            }

            let tableHeader;//表格表头

            let mobileSort=null;//手机端排序

            if (fixDrawer) {
                tableHeader = (
                    <TableHeader
                        displaySelectAll={false}
                    >
                        <TableRow>
                            <SortItem sortName="公司" orderType="STOCK_CODE" index="0" ifShow={this.state.sortShowArr[0]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="现价涨跌幅" orderType="STOCK_CHANGE_RATIO" index="1" ifShow={this.state.sortShowArr[1]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="目标价" orderType="TARGET_PRICE" index="2" ifShow={this.state.sortShowArr[2]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="分析师观点" orderType="COMPOSITE_RATING" index="3" ifShow={this.state.sortShowArr[3]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem moreWidth={true} sortName="五星分析师观点" orderType="FIVE_STAR_COMPOSITE_RATING" index="4" ifShow={this.state.sortShowArr[4]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="关注时长" orderType="TIME_DIFF" index="5" ifShow={this.state.sortShowArr[5]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="关注后表现" orderType="CURRENT_CHANGERATIO" index="6" ifShow={this.state.sortShowArr[6]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="自定义标签" lastColumn={true} orderType="FIRST_TAG" index="7" ifShow={this.state.sortShowArr[7]} refreshSortState={this.refreshSortState.bind(this)}/>
                        </TableRow>
                    </TableHeader>
                );
                rowDataElements = stockAttentionInfos.map((data, index) => {
                    let {shortName, stockCode, currentPrice, changeRatio, targetPrice, premiumRate, viewPoint, fiveStarAnalystViewpoint} = data.stockInfo;
                    return (
                        <TableRow role="stockItemOfSmartAccount" key={data.stockInfo.stockCode}>
                            {!this.checkBoxState ?
                                <TableRowColumn style={this.styles.indexStyle}>{index+1}</TableRowColumn> : null}
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div role="stockName">
                                    {shortName}
                                </div>
                                <div role="stockCode">
                                    {stockCode}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div role="currentPrice">
                                    {currentPrice !== undefined ? Util.formatMoney2(currentPrice) : "-"}
                                </div>
                                <div role="changeRatio_currentPrice" style={{color: this.numberColor(changeRatio)}}>
                                    {changeRatio !== undefined ? Util.precisionRate2(changeRatio, 2,true) : "-"}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div role="targetPrice">
                                    {targetPrice !== undefined ? Util.formatMoney2(targetPrice) : "-"}
                                </div>
                                <div role="changeRatio_targetPrice" style={{color: this.numberColor(premiumRate)}}>
                                    {premiumRate !== undefined ? Util.precisionRate2(premiumRate, 2,true) : "-"}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn role="viewPoint" style={this.styles.tdPadding}>
                                {viewPoint || "-"}
                            </TableRowColumn>
                            <TableRowColumn role="fiveStarAnalystViewpoint" style={{width: 80,paddingLeft:"12px",paddingRight:"12px"}}>
                                {fiveStarAnalystViewpoint || "-"}
                            </TableRowColumn>
                            <TableRowColumn role="lengthOfAttention" style={this.styles.tdPadding}>
                                {data.diff !== undefined ? this.displayDays(data.diff) : "-"}
                            </TableRowColumn>
                            <TableRowColumn role="changeRatio_afterFocus" style={this.styles.tdPadding}>
                                <div style={{color: this.numberColor(data.changeRatio)}}>
                                    {data.changeRatio !== undefined ? Util.precisionRate2(data.changeRatio, 2 ,true) : "-"}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn role="tagsColumn" style={this.styles.tagsColumn}>
                                <EditableTagGroup inputId={stockCode} data={data.stockAttention.attentionTags}
                                                  tags={tags} tagsChange={this.tagsChange}
                                                  addStockTag={this.addStockTag}
                                                  deleteStockTag={this.deleteStockTag}
                                />
                            </TableRowColumn>
                        </TableRow>
                    )
                });
            } else if (!small) {
                tableHeader = (
                    <TableHeader
                        displaySelectAll={false}
                    >
                        <TableRow>
                            <SortItem sortName="公司" orderType="STOCK_CODE" index="0" ifShow={this.state.sortShowArr[0]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="现价涨跌幅" orderType="STOCK_CHANGE_RATIO" index="1" ifShow={this.state.sortShowArr[1]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="五星观点" orderType="FIVE_STAR_COMPOSITE_RATING" index="4" ifShow={this.state.sortShowArr[4]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="表现" orderType="CURRENT_CHANGERATIO" index="6" ifShow={this.state.sortShowArr[6]} refreshSortState={this.refreshSortState.bind(this)}/>
                            <SortItem sortName="自定义标签" lastColumn={true} orderType="FIRST_TAG" index="7" ifShow={this.state.sortShowArr[7]} refreshSortState={this.refreshSortState.bind(this)}/>
                        </TableRow>
                    </TableHeader>
                );
                rowDataElements = stockAttentionInfos.map((data, index) => {
                    let {shortName, stockCode, currentPrice, changeRatio, targetPrice, premiumRate, viewPoint, fiveStarAnalystViewpoint} = data.stockInfo;
                    return (
                        <TableRow key={data.stockInfo.stockCode}>
                            {!this.checkBoxState ?
                                <TableRowColumn style={this.styles.indexStyle}>{index+1}</TableRowColumn> : null}
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div>
                                    {shortName}
                                </div>
                                <div>
                                    {stockCode}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div>
                                    {currentPrice}
                                </div>
                                <div style={{color: this.numberColor(changeRatio)}}>
                                    {changeRatio !== undefined ? Util.precisionRate2(changeRatio, 2,true) : "-"}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                {fiveStarAnalystViewpoint || "-"}
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div style={{color: this.numberColor(data.changeRatio)}}>
                                    {data.changeRatio !== undefined ? Util.precisionRate2(data.changeRatio, 2 ,true) : "-"}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tagsColumn}>
                                <EditableTagGroup inputId={stockCode} data={data.stockAttention.attentionTags}
                                                  tags={tags} tagsChange={this.tagsChange}
                                                  addStockTag={this.addStockTag}
                                                  deleteStockTag={this.deleteStockTag}
                                />
                            </TableRowColumn>
                        </TableRow>
                    )
                });
            } else {
                mobileSort=<MobileSort/>;
                tableHeader = (
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableHeaderColumn style={this.styles.tdPadding}>公司</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.tdPadding}>现价</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.tdPadding}>五星观点</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.tdPadding}>表现</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                );
                rowDataElements = stockAttentionInfos.map((data, index) => {
                    let {shortName, stockCode, currentPrice, changeRatio, targetPrice, premiumRate, viewPoint, fiveStarAnalystViewpoint} = data.stockInfo;
                    return (
                        <TableRow key={data.stockInfo.stockCode}>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div>
                                    {shortName}
                                </div>
                                <div>
                                    {stockCode}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div>
                                    {currentPrice}
                                </div>
                                <div style={{color: this.numberColor(changeRatio)}}>
                                    {changeRatio !== undefined ? Util.precisionRate2(changeRatio, 2,true) : "-"}
                                </div>
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                {fiveStarAnalystViewpoint || "-"}
                            </TableRowColumn>
                            <TableRowColumn style={this.styles.tdPadding}>
                                <div style={{color: this.numberColor(data.changeRatio)}}>
                                    {data.changeRatio !== undefined ? Util.precisionRate2(data.changeRatio, 2,true) : "-"}
                                </div>
                            </TableRowColumn>
                        </TableRow>
                    )
                });
            }
            let empty=null;
            if(stockAttentionDataSource.$[0].stocks.length==0){//没有自选股的时候
                empty=(
                    <div style={{textAlign:"center",height:"100px",lineHeight:"100px",color:'#fff'}}>请在右上方搜索区域添加自选股!</div>
                );
            }
            return (
                <div style={this.styles.container as any} className="smart-account-page">
                    <div style={this.styles.tableContainer as any}>
                        {progress}
                        {mobileSort}
                        <StockItemDialog
                            open={this.state.open}
                            handleClose={this.handleClose}
                            data={this.state.data}
                            small = {small}
                            stockCode={this.state.stockCode}
                            addStockTag={this.addStockTag}
                            deleteStockTag={this.deleteStockTag}
                            tagsChange={this.tagsChange}
                        />
                        <div>
                            <div className="fix-stocks fix-stocks-width">
                                <div style={{overflow: 'hidden'}}>
                                    <ButtonGroup tips={tagsArr} small={small} changeTag={this.changeTag}/>
                                    <span role="deleteButton">{showDeleteButton}</span>
                                </div>
                                <Table
                                    selectable={this.selectable}
                                    multiSelectable={true}
                                    enableSelectAll={true}
                                    allRowsSelected={this.selectAll}
                                    onCellClick={
                                        (row, col) => {
                                            if (this.selectable) {
                                                const stockCode = stockAttentionInfos[row].stockInfo.stockCode;
                                                const index = this.deleteRow.indexOf(stockCode);
                                                if (index != -1) {
                                                    this.deleteRow.splice(index, 1);
                                                } else {
                                                    this.deleteRow.push(stockCode);
                                                }
                                            } else {
                                                if (!small) {
                                                    if(!fixDrawer){
                                                        if (col != 6) {
                                                            History.push(StockDetailPage.path + stockAttentionInfos[row].stockInfo.stockCode);
                                                        }
                                                    }else {
                                                        if (col != 9) {
                                                            History.push(StockDetailPage.path + stockAttentionInfos[row].stockInfo.stockCode);
                                                        }
                                                    }
                                                }else{
                                                    this.rowIndex = row;
                                                    this.setState({
                                                        open: true,
                                                        data: stockAttentionInfos[row],
                                                        stockCode: stockAttentionInfos[row].stockInfo.stockCode
                                                    })
                                                }
                                            }
                                        }
                                    }
                                >
                                    {tableHeader}
                                    <TableBody
                                        showRowHover={true}
                                        deselectOnClickaway={this.deselectOnClickaway}
                                        displayRowCheckbox={this.checkBoxState}
                                    >
                                        {rowDataElements}
                                    </TableBody>
                                </Table>
                                {empty}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}


//用于手机端弹窗
class StockItemDialog extends React.Component<any, any> {
    render() {
        let stockCode = '',
            attentionTags = [];
        if (this.props.data.stockInfo) {
            stockCode = this.props.data.stockInfo.stockCode
        }
        if (this.props.data.stockAttention) {
            attentionTags = this.props.data.stockAttention.attentionTags
        }
        let tags = stockAttentionDataSource.tags.map(value => {
            return value;
        });

        return (
            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={true}
                autoDetectWindowHeight
            >
                <ListItem primaryText="删除自选股"
                          onTouchTap={
                              (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  this.props.handleClose();
                                  stockAttentionDataSource.deleteStock(this.props.stockCode);
                              }}
                          leftIcon={<DeleteIcon/>}
                />

                <ListItem primaryText="查看更多"
                          containerElement={<Link to={StockDetailPage.path + this.props.stockCode}/>}
                          leftIcon={<RemoveRedEye />}/>

                <div >
                    <EditableTagGroup inputId={stockCode} data={attentionTags}
                                      tags={tags} tagsChange={this.props.tagsChange}
                                      addStockTag={this.props.addStockTag}
                                      small={this.props.small}
                                      deleteStockTag={this.props.deleteStockTag}
                    />
                </div >
            </Dialog>
        );
    }
}