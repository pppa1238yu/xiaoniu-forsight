import * as React from "react";
import {observer} from "mobx-react";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import {
    amber600,
    blue500,
    darkBlack,
    greenA200,
    grey400,
    grey500,
    lightBlack,
    red500,
    red600,
    transparent,
    yellow900
} from "material-ui/styles/colors";
import Bulk from "material-ui/svg-icons/action/lightbulb-outline";
import Avatar from "material-ui/Avatar";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import {List, ListItem} from "material-ui/List";
import AnalystDetailPage from "../../pages/analyst/AnalystDetailPage";

import {Button, Modal} from "react-materialize";

import History from "../../router/History";
import Constants from "../../Constants";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import {Link} from "react-router-dom";
import Rate from "../../components/rate/Rate";
interface Props {
    value: any;
    fixDrawer: boolean;
}

@observer
export  default  class AnalystCard extends React.Component<Props, any> {

    styles = {
        card: {
            cursor: 'pointer',
        },
        header: {
            paddingBottom: 0,
        },
        titleOverlay: {
            width: "calc(100% - 64px)",
            paddingRight: 0,
        },
        pointValue: {
            fontSize: 22,
            lineHeight: "40px",
        },
        personTitleText: {
            fontSize: 16,
            lineHeight: '40px',
            display: "block",
            maxWidth: 94,
        },
        personSubTitleText: {
            fontSize: 13,
            lineHeight: '14px',
            display: "block",
            maxWidth: 94,
        },
        titleStyle: {
            fontSize: 14,
            color:'#616161',
            lineHeight: '40px',
        },
        subtitleStyle: {
            fontSize: 14,
            lineHeight: '18px',
        },
        actionWithNoSub: {
            paddingTop: 30,
        },
        personTitleWithNoSub: {
            paddingTop: 8,
            paddingBottom: 0,
        },
        avatar: {
            display: 'inline-block',
        },
        paddingLeft: {
            paddingLeft:20
        },
        labelStyle: {
            fontSize:14,
            color:'#616161'
        },
        iconStyle: {
            width:30
        },
        newHonours: {
            verticalAlign:'2px',
            fontSize:14,
            color:'#616161'
        }
    };

    render() {
        let {
            gtaId, fullName, brokerage,
            title, subTitle, analystHonors, viewPointCount,
            imageId, score
        } = this.props.value;

        if (title == undefined) {
            title = {typeName: '证券分析师'};
        }

        const specific = (title && title.id == 1);
        let analystTypeName = null;

        let shortName = "";
        if(brokerage){
            shortName = brokerage.shortName;
        }else {
            shortName =this.props.value.gtaCsrcPersonMapping.csrcInfo.brokerageName.split('有限')[0];
        }


        if (specific) {
            if (subTitle) {
                analystTypeName = subTitle.typeName + '分析师' ;
            } else {
                analystTypeName = title.typeName;
            }
        } else {
            analystTypeName = title.typeName;
        }

        let honours = false;
        if (analystHonors) {
            if(analystHonors.length>0){
                honours = true;
            }
            /*for (let analystHonor of analystHonors) {
                if(analystHonor.dataSource == 1) {
                    honours = true;
                    break;
                }
            }*/
        }

        let imageHref = '';
        if(imageId){
            imageHref = Constants.imageBaseUrl + imageId;
        }else {
            imageHref = Constants.noDataHeadImg;
        }
        let cardText = null;
        if (honours) {
            cardText = [
                <div className="" key={0}>
                    <IconButton tooltip="新财富最佳分析师" style={this.styles.iconStyle}>
                        <img src="/images/label1.png"/>
                    </IconButton>
                    <div role="新财富" className="inline-block" style={this.styles.newHonours}>
                        新财富
                    </div>
                </div>,
                <div role="focusButton" className="auto-right" key={1}>
                    <Attention
                        type={EntityType.RESEARCHER}
                        code={gtaId}
                        fixDrawer={this.props.fixDrawer}
                        style={AttentionStyle.ICON}
                    />
                </div>
            ];
        } else {
            cardText = [
                <div role="focusButton" className="auto-right" key={1}>
                    <Attention
                        type={EntityType.RESEARCHER}
                        code={gtaId}
                        fixDrawer={this.props.fixDrawer}
                        style={AttentionStyle.ICON}
                    />
                </div>
            ];
        }
        const isSub = subTitle && subTitle.typeName;

        return (
            <div role="linktoAnalystDetailPage">
                <Card
                    style={this.styles.card}
                    onTouchTap={(event) => {
                        event.stopPropagation();
                        History.push(AnalystDetailPage.path + gtaId);
                    }}>

                    <Link to={AnalystDetailPage.path + gtaId} onClick={(event) => {
                        event.preventDefault()
                    }}>
                    <CardHeader
                        title={
                            <div className="flex-start">
                                <div>
                                    <span role="analystName" className="limit-text" style={this.styles.personTitleText}>{fullName}</span>
                                </div>
                                <div role="analystStarScore" className="auto-right" style={this.styles.pointValue}>
                                    <Rate score={score}/>
                                </div>
                            </div>
                        }
                        avatar={
                            <Avatar
                                src={imageHref}
                                style={this.styles.avatar}
                            />
                        }
                        textStyle={this.styles.titleOverlay}
                        style={this.styles.header}
                    />
                    <CardTitle
                        title={<div>
                            <span role="任职券商">{shortName}</span>
                            <span style={this.styles.paddingLeft} role="职位类型">{analystTypeName}</span>
                        </div>}
                        titleStyle={this.styles.titleStyle}
                        style={this.styles.personTitleWithNoSub}
                    />
                    </Link>
                    <CardActions style={this.styles.actionWithNoSub}>
                        <div className="flex-center">
                            <div>
                                <IconButton className="icon-center" tooltip="最新观点数" style={this.styles.iconStyle}>
                                    <img src="/images/label2.png" />
                                </IconButton>
                                <div role="countOfViewPoints" className="inline-block" style={this.styles.labelStyle}>
                                    {viewPointCount ? viewPointCount : 0}篇
                                </div>
                            </div>
                            {cardText}
                        </div>
                    </CardActions>
                </Card>
            </div>
        );
    }
}
