import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {AnalystRating} from "../../model/entities/analyst/AnalystRating";
import {http} from "../../model/ajax/Http";
import {Objects} from "../../model/Objects";
import Increment from "../common/Increment";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import {Optional} from "../../model/entities/Optional";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import {Link} from "react-router-dom";
import StockDetailPage from "../../pages/stock/StockDetailPage";

import {grey700,red700,lightGreen500} from "material-ui/styles/colors";

interface Props {
    researcherId: string;
}
import RatingChartView from "../../components/analyst/RatingChartView";

const RATING_TYPE_TEXT_MAP = {
    STRONGSELL: '卖出',
    SELL: '减持',
    NEUTRAL: '中性',
    HOLD: '持有',
    STRONGERBUY: '买入',
    BUY: '增持',
    STRONGESTBUY: '强烈买入',
    NORATING: '未评级'
};

@observer
export default class AnalystRatingView extends React.Component<Props, null> {

    @observable private loading: number = 0;

    @observable private loaded: number = 0;

    @observable private error: boolean = false;

    @observable private readonly rating: AnalystRating = {
        successRate: 0,
        minProfit: 0,
        maxProfit: 0,
        items: []
    };

    @observable private page = 0;

    totalPage = 0;

    styles = {
        borderSpace: {
            paddingTop: 0,
        },
        title: {

        },
        subTitle: {
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '18px',
            position: 'relative',
            marginLeft:12
        },
        circle: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: 160,
            height: 80,
        },
        block: {
            display: 'block',
            fontSize:14,
            color:grey700,
            marginTop:5
        },
        tableContainer: {
            minHeight: 200,
        },
        summaryRow: {
            position:'relative',
            padding:'50px 0',
            margin: '0 auto',
            display:'flex',
            justifyContent:'space-around'
        },
        emptyFix: {
            width: '100%',
            height: 160,
            paddingTop: 60,
        },
        recommendCounts: {
            position:'absolute',
            fontSize: 14,
            color: grey700,
            lineHeight:"150px",
            left:20
        },
        chartLabel:{
            position:"absolute",
            left:0,
            top:40,
            textAlign:'center',
            width:150
        },
        asc:{
            fontSize:20,
            color:red700
        },
        desc:{
            fontSize:20,
            color:lightGreen500
        },
        th:{
            fontSize:14,
            color:"#919191"
        },
        td:{
            fontSize:14,
            color:grey700
        },
        footerPadding: {
            padding:'25px  0'
        },
        circleStyle: {
            display:'flex',
            width:500,
            justifyContent:'space-between'
        }
    };

    constructor(props: Props, context?: any) {
        super(props, context);
        this.refresh();
    }

    swithToPage(value: number) {
        this.page = value;
    }
    getPercent(value=0){
        return Math.round(value*100)+"%"
    }
    getNumber(value=0){
        let chartValue=0;
        if(value>1){
            chartValue=1;
        }else if(value<-1){
            chartValue=-1;
        }else{
            chartValue=value;
        }
        return Math.abs(Math.round(chartValue*100))
    }
    render() {
        if (!Optional.of(this.rating).map(rating => rating.items).map(items => items.length).orElse(0)) {
            return <div className="center-align" style={this.styles.emptyFix}>
                暂无数据
            </div>;
        }
        let footer = null;
        if (this.totalPage > 1) {
            footer = (
                <div role="pageTurner" className="center-align" style={this.styles.footerPadding}>
                    <UltimatePaginationMaterialUi
                        currentPage={this.page}
                        totalPages={this.totalPage}
                        hidePreviousAndNextPageLinks={true}
                        hideFirstAndLastPageLinks={true}
                        onChange={value => this.swithToPage(value)}
                    />
                </div>
            );
        }

        return (
            <div style={this.styles.borderSpace}>
                <div className="flex-start" style={this.styles.summaryRow as any}>
                    <div style={this.styles.recommendCounts as any}>
                        <span role="numOfRecommendation" style={this.styles.title}>
                        推荐次数
                            {" " + this.rating.items.length}
                        </span>
                    </div>
                    <div style={this.styles.circleStyle as any}>
                        <div style={this.styles.subTitle as any}>
                            <RatingChartView ringColor={this.rating.successRate>=0} value={this.getNumber(this.rating.successRate)}/>
                            <div style={this.styles.chartLabel as any}>
                                {/*<Increment value={this.rating.successRate} rate={true}/>*/}
                                <span role="risingProbabilityOf5Day" style={this.rating.successRate>=0?this.styles.asc:this.styles.desc}>{this.getPercent(this.rating.successRate)}</span>
                                <span style={this.styles.block}>5日上涨概率</span>
                            </div>
                        </div>
                        <div style={this.styles.subTitle as any}>
                            <RatingChartView ringColor={this.rating.maxProfit>=0} value={this.getNumber(this.rating.maxProfit)}/>
                            <div style={this.styles.chartLabel as any}>
                                {/*<Increment value={this.rating.maxProfit} rate={true}/>*/}
                                <span role="maxRisingChangeOf5Day" style={this.rating.maxProfit>=0?this.styles.asc:this.styles.desc}>{this.getPercent(this.rating.maxProfit)}</span>
                                <span style={this.styles.block}>5日最大涨幅</span>
                            </div>
                        </div>
                        <div style={this.styles.subTitle as any}>
                            <RatingChartView ringColor={this.rating.minProfit>=0} value={this.getNumber(this.rating.minProfit)}/>
                            <div style={this.styles.chartLabel as any}>
                                {/*<Increment value={this.rating.minProfit} rate={true}/>*/}
                                <span role="maxFallingChangeOf5Day" style={this.rating.minProfit>=0?this.styles.asc:this.styles.desc}>{this.getPercent(this.rating.minProfit)}</span>
                                <span style={this.styles.block}>5日最大跌幅</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={this.styles.tableContainer}>
                    <Table selectable={false}>

                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={this.styles.th}>股票</TableHeaderColumn>
                                <TableHeaderColumn style={this.styles.th}>推荐时间</TableHeaderColumn>
                                <TableHeaderColumn style={this.styles.th}>推荐次日开盘价</TableHeaderColumn>
                                <TableHeaderColumn style={this.styles.th}>推后5日收益率</TableHeaderColumn>
                                <TableHeaderColumn style={this.styles.th}>推后20日收益率</TableHeaderColumn>
                                <TableHeaderColumn style={this.styles.th}>推后30日收益率</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            showRowHover
                            displayRowCheckbox={false}>
                            {
                                this.rating.items.slice(AnalystRatingView.PAGE_SIZE * (this.page - 1), AnalystRatingView.PAGE_SIZE * (this.page)).map(
                                    (item, index) => (
                                        <TableRow role="detailOfRecommendation" key={index}>
                                            <TableRowColumn role="linktoStockDetailPage"><Link
                                                to={StockDetailPage.path + item.symbol} style={this.styles.td}>{item.companyName}</Link></TableRowColumn>
                                            <TableRowColumn role="reportDate" style={this.styles.td}>{item.reportDate}</TableRowColumn>
                                            <TableRowColumn role="originClosePrice" style={this.styles.td}>{item.originClosePrice && item.originClosePrice.toFixed(2)}</TableRowColumn>
                                            <TableRowColumn role="changeRatioFor5Days" style={this.styles.td}>
                                                <Increment value={item.incrementRateForFiveDays} rate={true}/>
                                            </TableRowColumn>
                                            <TableRowColumn role="changeRatioFor20Days" style={this.styles.td}>
                                                <Increment value={item.incrementRateForTwentyDays} rate={true}/>
                                            </TableRowColumn>
                                            <TableRowColumn role="changeRatioFor30Days" style={this.styles.td}>
                                                <Increment value={item.incrementRateForThirtyDays} rate={true}/>
                                            </TableRowColumn>
                                        </TableRow>
                                    )
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
                {footer}
            </div>
        );
    }

    static PAGE_SIZE = 6;

    private refresh() {
        runInAction(() => {
            this.error = false;
            this.loading++;
        });
        http.get("/analyst/rating.json", {analystId: this.props.researcherId})
            .then((rating) => {
                runInAction(() => {
                    Objects.assign(this.rating, rating);
                    this.loading--;
                    this.loaded++;
                    if (this.rating.items.length > 0) {
                        this.totalPage = Math.ceil(this.rating.items.length / AnalystRatingView.PAGE_SIZE);
                        this.page = 1;
                    }
                });
            }).catch(() => {
            runInAction(() => {
                this.error = true;
                this.loading--;
                this.loaded++;
            });
        });
    }
}