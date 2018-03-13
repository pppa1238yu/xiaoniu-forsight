import * as React from "react";
import {observer} from "mobx-react";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import {
    blue500,
    darkBlack,
    green500,
    greenA200,
    grey400,
    grey500,
    lightBlack,
    red300,
    red500,
    red600,
    red200,
    transparent,
    yellow600
} from "material-ui/styles/colors";
import Bulk from "material-ui/svg-icons/action/lightbulb-outline";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import {List, ListItem} from "material-ui/List";
import Chip from "material-ui/Chip";

import {Button, Modal} from "react-materialize";

import History from "../../router/History";
import {observable} from "mobx";
import {CategoryType} from "../../model/entities/category/CategoryType";
import IndustryDetailPage from "../../pages/category/IndustryDetailPage";
import SubjectDetailPage from "../../pages/category/SubjectDetailPage";
import {Util} from "../../Constants";
import Divider from "material-ui/Divider";
import {CategorySummary} from "../../model/entities/category/CategorySummary";
import CategoryItemDialog from "./CategoryItemDialog";
import {ImageUrl} from "../../utils/ImageUrl";
import {Link} from "react-router-dom";
import StockDetailPage from "../../pages/stock/StockDetailPage";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import Explain from "../common/Explain";
interface Props {
    type: CategoryType;
    value: CategorySummary;
    fixDrawer?: boolean;
    small?: boolean;
    first?:boolean;
}

@observer
export default class CategoryCard extends React.Component<Props, null> {

    @observable openDialog: boolean = false;

    styles = {
        card: {
            cursor: 'pointer',
        },
        cardSmall: {
        },
        incrementText: {
            color: red500,
            fontSize: 16,
        },
        decrementText: {
            color: green500,
            fontSize: 16,
        },
        text: {
            fontSize: 14,
        },
        chip: {
            margin: 2,
            lineHeight:24,
            cursor: 'pointer',
        },
        link: {
        },
        chipLabel: {
            color: 'white',
            lineHeight:'24px',
            height:'24px'
        },
        stock: {
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 8,
        },
        stockSmall: {
            paddingBottom: 8,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 8,
        },
        titleWidth: {
            fontSize: 24,
            maxWidth: '50%',
        },
        subtitleWidth: {
            maxWidth: '50%'
        },
        actionContainer: {
            paddingTop: 10,
            paddingBottom: 10,
        },
        actionStyle: {
            padding:'10px 17px',
            marginRight:0
        },
        presentView: {
            fontSize:12,
            color:'#8ea1af'
        },
        mediaStyle: {
            height:100,
            overflow:'hidden',
            boxSizing:'border-box'
        },
        titleStyle: {
            textAlign:'center',
            fontSize:16,
            padding:3
        }
    };

    handleClose = () => {
        this.openDialog = false;
    };

    handleOpenDialog = () => {
        this.openDialog = true;
    };

    render() {
        let {
            code, name, reportCount,
            regionalIncrement, netCashFlow,
            stockIncrements, imageId,
        } = this.props.value;


        let rate = null;
        let rateText:any = parseFloat(Util.precisionRate(regionalIncrement, 2)).toFixed(2);

        if(rateText > 0){
            rateText = "+" + rateText + "%";
            rate = <span className="common-red" style={this.styles.text}>{rateText}</span>;
        }else if(rateText < 0) {
            rateText = rateText + "%";
            rate = <span className="common-green" style={this.styles.text}>{rateText}</span>;
        }else {
            rateText = rateText + "%";
            rate = <span className="common-grey" style={this.styles.text}>{rateText}</span>;
        }

        let flow = null;
        let flowText = Util.formatMoney2(netCashFlow / 100000000) + "亿元 ";
        if (netCashFlow > 0) {
            flowText = "+" + flowText;
            flow = <span className="common-red" style={this.styles.text}>{flowText}</span>;
        }else if(netCashFlow < 0) {
            flow = <span className="common-green" style={this.styles.text}>{flowText}</span>;
        }else {
            flow = <span className="common-grey" style={this.styles.text}>{flowText}</span>;
        }


        let stocks = null;
        const max = this.props.small ? 2 : 1;
        if (stockIncrements &&
            stockIncrements.length > 0) {
            const chips = [];

            for (let index = 0; index < stockIncrements.length; index++) {
                const ele = stockIncrements[index];
                let color = null;
                let labelStyle = null;
                if (ele.rate > 0) {
                    color = red200;
                    labelStyle = this.styles.chipLabel;
                } else if (ele.rate < 0) {
                    color = '#aed581';
                    labelStyle = this.styles.chipLabel;
                } else {
                }
                chips.push(
                    (
                        <Link role="linktoStockDetailPage" key={ele.symbol} to={StockDetailPage.path + ele.symbol} style={this.styles.link}>
                            <Chip style={this.styles.chip}
                                      backgroundColor={color}
                                      labelStyle={labelStyle}>
                                {ele.name + "" + Util.precisionRate2(ele.rate * 100, 2)}
                            </Chip>
                        </Link>
                    )
                );
                if (index == max - 1) {
                    break;
                }
            }

            stocks = (
                <CardText style={this.props.small ? this.styles.stockSmall : this.styles.stock}>
                    <div className="flex-center-wrap">
                        {chips}
                    </div>
                </CardText>
            );
        } else {
            stocks = (
                <CardText style={this.props.small ? this.styles.stockSmall : this.styles.stock}>
                    <div className="flex-center-wrap">
                    <Chip
                        labelStyle={this.styles.chipLabel}
                        style={this.styles.chip}>
                        无领涨
                    </Chip>
                    </div>
                </CardText>
            );

        }

        let action = null;
        if (this.props.small) {
            action =  (
                <CategoryItemDialog
                    type={this.props.type}
                    code={code}
                    open={this.openDialog}
                    handleClose={this.handleClose}
                />
            );
        } else {

            const cardText = [
                <div role="focusButton" className="auto-right" key={1}>
                    <Attention
                        type={this.props.type == CategoryType.Industry ? EntityType.INDUSTRY : EntityType.SUBJECT}
                        code={code}
                        fixDrawer={this.props.fixDrawer}
                        style={AttentionStyle.ICON}
                    />
                </div>
            ];
            action = (
                <CardActions style={this.styles.actionContainer}>
                    <div className="flex-center" style={this.styles.actionStyle}>
                        <div style={{textAlign:'center'}}>
                            <div role="numOfViewPoint" className="inline-block" style={{fontSize:24}}>
                                {reportCount}
                            </div>
                            <div style={this.styles.presentView}>
                                最新观点数
                            </div>
                        </div>
                        {cardText}
                    </div>
                </CardActions>
            );
        }
        let media = null;
        let title = null;
        let description = '';
        if(this.props.type == CategoryType.Subject){
            description = '题材时间区间内的资金净流入、题材指数时间区间内的涨跌幅'
        }else{
            description = '行业时间区间内的资金净流入、行业指数时间区间内的涨跌幅'
        }
        if (this.props.small) {
            media = (
                <CardMedia>
                    <img src={ImageUrl.getImageUrl(
                        this.props.type == CategoryType.Subject ?
                            EntityType.SUBJECT :
                            EntityType.INDUSTRY,
                        imageId
                    )} alt="" />
                </CardMedia>
            );
            title = (
                <CardTitle
                    title={
                    <div className="flex-center">
                        <div className="ellipsis-no-hover" style={this.styles.titleWidth}>
                            {name}
                        </div>
                        <div className="auto-right ellipsis-no-hover" style={this.styles.subtitleWidth}>
                            <span>{flow}{rate}</span>
                        </div>
                    </div>
                }
                />
            );
        } else {
            let explain=(<span style={{fontSize:12}}>（资金净流入/涨跌幅）</span>)
            media =
                <Link role="linktoDetailPage" to={this.props.type == CategoryType.Industry ? (IndustryDetailPage.PATH + code) : (SubjectDetailPage.PATH + code)} onClick={(event) => {
                        event.preventDefault()
                    }
                }>
                    <CardMedia
                        mediaStyle = {this.styles.mediaStyle}
                        overlay={
                            <CardTitle
                                role="name"
                                title={name}
                                titleStyle = {this.styles.titleStyle}
                                subtitle={
                                    <div>
                                        <p  role="flowAndChangeRatio" style={{textAlign:'center',margin:0}}>{flow}{rate}{this.props.first?explain:null}</p>
                                    </div>
                                }
                            />
                        }
                    >
                        <img src={ImageUrl.getImageUrl(
                            this.props.type == CategoryType.Subject ?
                                EntityType.SUBJECT :
                                EntityType.INDUSTRY,
                            imageId
                        )} style={{width:'100%'}} alt="" >
                        </img>
                    </CardMedia>
                </Link>
        }
        let divide = null;
        if (this.props.small) {
            divide = <Divider/>
        }
        if (this.props.small) {
            return (
                <div style={this.styles.cardSmall}>
                    {divide}
                    <Card
                        onTouchTap={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.handleOpenDialog();
                        }}>
                        {title}
                        {media}
                        {stocks}
                        {action}
                    </Card>
                </div>);
        } else {
            return (
                <div style={this.styles.card}>
                    {divide}
                    <Card
                        onTouchTap={
                        (event) => {
                            event.stopPropagation();
                            if (this.props.type == CategoryType.Industry) {
                                History.push(IndustryDetailPage.PATH + code);
                            } else {
                                History.push(SubjectDetailPage.PATH + code);
                            }
                        }
                    }>
                        {title}
                        {media}
                        {stocks}
                        {action}
                    </Card>
                </div>
            );
        }
    }
}
