import * as React from "react";
import {observer} from "mobx-react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {hotOpportunityDataSource} from "../../model/ajax/IndexService";
import {ImageUrl} from "../../utils/ImageUrl";
import {EntityType} from "../../model/entities/EntityType";
import {green500, grey500, red500} from "material-ui/styles/colors";
import {Link} from "react-router-dom";
import IndustryDetailPage from "../../pages/category/IndustryDetailPage";
import SubjectDetailPage from "../../pages/category/SubjectDetailPage";
interface HotOppProps {
    small?: boolean;
    notifyResult?:(err)=>void
}
@observer
export default class HotOpportunities extends React.Component<HotOppProps, any> {
    styles = {
        container:{
            display: "flex",
            padding: "0 16px 16px"
        },
        containerMobile: {
            display: "flex",
            padding: "16px"
        },
        cardRow: {
            display:"block",
            width: "21%",
            height: "222px",
            marginRight: "6px",
            position: "relative"
        },
        cardColumnBox: {
            flexGrow: 1
        },
        cardColumn: {
            display:"block",
            height: "70px",
            marginBottom: "6px",
            borderRadius: "5px",
            position: "relative"
        },
        imageRow: {
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            overflow: "hidden"
        },
        imageColumn: {
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            overflow: "hidden"
        },
        title: {
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center"
        },
        titleColumn: {
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px"
        },
        mask: {
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            opacity: .65,
            zIndex: 2,
            borderRadius: "5px"
        },
        titleName: {
            fontSize: 24,
            fontWeight: 600,
            color: "#fff"
        },
        titleNameColumn: {
            fontSize: 18,
            fontWeight: 600,
            color: "#fff"
        },
        regionalIncrement: {
            fontSize: 24,
            marginTop: "5px",
            fontWeight: 600
        },
        regionalIncrementColumn: {
            fontSize: 18,
            fontWeight: 600
        },
        regionalIncrementColumnMobile:{
            fontSize: 18,
            fontWeight: 600,
            marginRight:"60px"
        },
        rank: {
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "#fff",
            zIndex: 10
        },
        detail: {
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 11,
            backgroundColor: "#393F4F",
            opacity: .75,
            width: "100%",
            height: 0,
            color: "#fff",
            fontSize: 16,
            overflow: "hidden"
        },
        detailBox: {
            display: "flex",
            justifyContent: "space-between",
            margin: "10px"
        },
        detailBoxColumn: {
            textAlign: "center"
        },
        icon: {
            verticalAlign: "middle",
            marginRight: "5px"
        },
        iconColumn: {
            verticalAlign: "middle",
            marginRight: "5px",
            width: "12px"
        },
        subCompany: {
            fontSize: 12,
            margin: "10px"
        },
        subItemMargin: {
            marginRight: "5px"
        }
    };

    numberColor(num) {
        if (num == 0) {
            return <span style={{color: grey500}}>{(num * 100).toFixed(2) + "%"}</span>
        } else if (num > 0) {
            return <span style={{color: red500}}>{"+" + (num * 100).toFixed(2) + "%"}</span>
        } else {
            return <span style={{color: green500}}>{(num * 100).toFixed(2) + "%"}</span>
        }
    }

    componentDidMount() {
        hotOpportunityDataSource.setNotifyResult(this.props.notifyResult);
        hotOpportunityDataSource.refresh();
    }

    render() {

        let listRow = hotOpportunityDataSource.$.slice(0, 3).map((ele, index) => {
            return <Link to={ele.subject?SubjectDetailPage.PATH+ele.code:IndustryDetailPage.PATH+ele.code} style={this.styles.cardRow as any} className="hot-card-row"  key={index}>
                <div>
                    <div style={this.styles.mask as any}>
                    </div>
                    <div style={this.styles.imageRow as any}>
                        <img src={ImageUrl.getImageUrl(EntityType.HOT_OPP, ele.imageId)}
                             alt=""/>
                    </div>

                    <div style={this.styles.title as any}>
                        <div style={this.styles.titleName as any}>
                            {ele.name}
                        </div>
                        <div style={this.styles.regionalIncrement as any}>
                            {this.numberColor(ele.regionalIncrement)}
                        </div>
                    </div>
                    <div style={this.styles.rank as any}>
                        {index + 1}
                    </div>
                    <div style={this.styles.detail as any} className="hot-detail">
                        <div style={this.styles.detailBox as any}>
                            <div>
                                <img src="/images/hotOpportunity/up.png" alt=""
                                     style={this.styles.icon}/><span>{ele.positiveStockCount}</span>
                            </div>
                            <div>
                                <img src="/images/hotOpportunity/down.png" alt=""
                                     style={this.styles.icon}/><span>{ele.negativeStockCount}</span>
                            </div>
                            <div>
                                <img src="/images/hotOpportunity/total.png" alt=""
                                     style={this.styles.icon}/><span>{ele.positiveStockCount + ele.negativeStockCount + ele.stableStockCount}</span>
                            </div>
                        </div>
                        <div style={this.styles.subCompany}>
                            {ele.stockIncrements.slice(0, 1).map((value, index) => {
                                return <span key={index}>
                                <span style={this.styles.subItemMargin}>{value.name}</span>
                                <span>{value.rate > 0 ? "+" + (value.rate * 100).toFixed(2) + "%" : (value.rate * 100).toFixed(2) + "%"}</span>
                            </span>
                            })}
                        </div>
                    </div>
                </div>
            </Link>
        });

        let listColumnData = this.props.small ? hotOpportunityDataSource.$ : hotOpportunityDataSource.$.slice(3);

        let listColumn = <div
            style={this.styles.cardColumnBox}>{listColumnData.map((ele, index) => {
            return <Link to={ele.subject?SubjectDetailPage.PATH+ele.code:IndustryDetailPage.PATH+ele.code} key={index + 3} style={this.styles.cardColumn as any} className="hot-card-column">
                <div>
                    <div style={this.styles.mask as any}>

                    </div>
                    <div style={this.styles.imageColumn as any}>
                        <img src={ImageUrl.getImageUrl(EntityType.HOT_OPP, ele.imageId)}
                             alt=""/>
                    </div>
                    <div style={this.styles.titleColumn as any}>
                        <div style={this.styles.titleNameColumn as any}>
                            {ele.name}
                        </div>
                        <div style={this.props.small?this.styles.regionalIncrementColumnMobile as any:this.styles.regionalIncrementColumn}>
                            {this.numberColor(ele.regionalIncrement)}
                        </div>
                    </div>
                    <div className={this.props.small ? "detail-column detail-column-mobile" : "detail-column"}>
                        <div style={this.styles.detailBoxColumn}>
                            <img src="/images/hotOpportunity/up.png" alt=""
                                 style={this.styles.iconColumn}/><span>{ele.positiveStockCount}</span>
                        </div>
                        <div style={this.styles.detailBoxColumn}>
                            <img src="/images/hotOpportunity/down.png" alt=""
                                 style={this.styles.iconColumn}/><span>{ele.negativeStockCount}</span>
                        </div>
                        <div style={this.styles.detailBoxColumn}>
                            <img src="/images/hotOpportunity/total.png" alt=""
                                 style={this.styles.iconColumn}/><span>{ele.positiveStockCount + ele.negativeStockCount + ele.stableStockCount}</span>
                        </div>
                    </div>
                </div>
            </Link>
        })}</div>;


        let content = this.props.small ? <div style={this.styles.containerMobile}>{listColumn}</div> :
            <div style={this.styles.container}>
                {listRow}
                {listColumn}
            </div>;

        return (<div>
            {hotOpportunityDataSource.$.length ? content : null}
        </div>)
    }
}