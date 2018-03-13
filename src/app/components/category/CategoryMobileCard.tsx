import * as React from "react";
import {observer} from "mobx-react";
import Chip from "material-ui/Chip";
import {List, ListItem} from "material-ui/List";
import History from "../../router/History";
import {observable} from "mobx";
import {CategoryType} from "../../model/entities/category/CategoryType";
import IndustryDetailPage from "../../pages/category/IndustryDetailPage";
import SubjectDetailPage from "../../pages/category/SubjectDetailPage";
import {CategorySummary} from "../../model/entities/category/CategorySummary";
import CategoryItemDialog from "./CategoryItemDialog";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import {Link} from "react-router-dom";
import {Util} from "../../Constants";
import StockDetailPage from "../../pages/stock/StockDetailPage";
import {
    red200,
    transparent,
} from "material-ui/styles/colors";
import {ImageUrl} from "../../utils/ImageUrl";

interface Props {
    type: CategoryType;
    value: CategorySummary;
    fixDrawer?: boolean;
    small?: boolean;
    first?:boolean;
}

@observer
export default class CategoryMobileCard extends React.Component<Props, null> {

    @observable openDialog: boolean = false;

    handleClose = () => {
        this.openDialog = false;
    };

    handleOpenDialog = () => {
        this.openDialog = true;
    };

    styles = {
        text: {
            fontSize: 12,
        },
        chipLabel: {
            color: 'white',
            lineHeight:'20px',
            height:'20px',
            fontSize:12
        },
        chip: {
            margin: 2,
            lineHeight:24,
            cursor: 'pointer',
        },
        card: {
            cursor: 'pointer',
            display:'flex',
            justifyContent:'space-between',
            marginTop:5
        },
        leftBox:{
            position:'relative',
            zIndex:1,
            width:140,
            height:120,
            overflow:'hidden'
        },
        leftMenban: {
            position:'absolute',
            top:0,
            zIndex:2,
            width:'100%',
            height:'100%',
            background:'rgba(0,0,0,.7)',
            display:'flex',
            justifyContent:'space-around',
            alignItems:'center'
        },
        centerStyle: {
            textAlign:'center',
            color:'#fff',
            margin:'10px 0',
            fontSize:14
        },
        rightBox: {
            position:'relative',
            width:'calc(100% - 140px)',
            padding:'16px 20px',
            display:'flex',
            justifyContent:'space-between',
            flexDirection:'column',
            backgroundColor:'#fff'
        },
        cardBottom: {
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center'
        },
        presentView: {
            fontSize:12,
            color:'#8ea1af'
        },
        imgStyle: {
            height:'100%',
        },
        explainStyle:{
            color:"#fff",
            fontSize:12
        }
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
        let flowText = Util.formatMoney2(netCashFlow / 100000000) + "亿";
        if (netCashFlow > 0) {
            flowText = "+" + flowText;
            flow = <span className="common-red" style={this.styles.text}>{flowText}</span>;
        }else if(netCashFlow < 0) {
            flow = <span className="common-green" style={this.styles.text}>{flowText}</span>;
        }else {
            flow = <span className="common-grey" style={this.styles.text}>{flowText}</span>;
        }


        let stocks = null;
        const max = 1;
        if (stockIncrements &&
            stockIncrements.length > 0) {
            const chips = [];

            for (let index = 0; index < stockIncrements.length; index++) {
                const ele = stockIncrements[index];
                let color = '#a9a9a9';
                let labelStyle = this.styles.chipLabel;

                chips.push(
                    (
                        <Link role="linktoStockDetailPage" key={ele.symbol} to={StockDetailPage.path + ele.symbol}>
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
                    <div className="flex-center-wrap">
                        {chips}
                    </div>
            );
        } else {
            stocks = (
                    <div className="flex-center-wrap">
                        <Chip
                            labelStyle={this.styles.chipLabel}
                            style={this.styles.chip}>
                            无领涨
                        </Chip>
                    </div>
            );
        }

        const action =  (
            <CategoryItemDialog
                type={this.props.type}
                code={code}
                open={this.openDialog}
                handleClose={this.handleClose}
            />
        );

        return (
            <div style={this.styles.card as any}>
                <div style={this.styles.leftBox as any}
                     onClick={
                         (event) => {
                             event.stopPropagation();
                             if (this.props.type == CategoryType.Industry) {
                                 History.push(IndustryDetailPage.PATH + code);
                             } else {
                                 History.push(SubjectDetailPage.PATH + code);
                             }
                         }
                     }
                >
                    <img src={ImageUrl.getImageUrl(
                        this.props.type == CategoryType.Subject ?
                            EntityType.SUBJECT :
                            EntityType.INDUSTRY,
                        imageId
                    )} style={this.styles.imgStyle}>
                    </img>
                    <div style={this.styles.leftMenban as any}>
                        <div>
                            <div style={this.styles.centerStyle}>{name}</div>
                            <div style={this.styles.centerStyle}>{flow}{rate}</div>
                            <div style={this.styles.explainStyle}>
                                {this.props.first?"（资金净流入/涨跌幅）":null}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={this.styles.rightBox as any}>
                    {stocks}
                    <div style={this.styles.cardBottom as any}>
                        <div style={{textAlign:'center'}}>
                            <div className="inline-block" style={{fontSize:20}}>
                                {reportCount}
                            </div>
                            <div style={this.styles.presentView}>
                                最新观点数
                            </div>
                        </div>
                        <Attention
                            type={this.props.type == CategoryType.Industry ? EntityType.INDUSTRY : EntityType.SUBJECT}
                            code={code}
                            fixDrawer={this.props.fixDrawer}
                            style={AttentionStyle.ICON}
                        />
                    </div>
                </div>
            </div>
        )
    }
}