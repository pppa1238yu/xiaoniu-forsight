import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {
    blue500,
    darkBlack,
    greenA200,
    grey400,
    grey500,
    lightBlack,
    red500,
    red600,
    transparent,
    yellow600
} from "material-ui/styles/colors";
import Avatar from "material-ui/Avatar";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import {List, ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import Constants from "../../Constants";
import {Button, Modal} from "react-materialize";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";
import {Link} from "react-router-dom";
import AnalystDetailPage from "../../pages/analyst/AnalystDetailPage";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import Rate from "../../components/rate/Rate";
interface DialogProps {
    open: boolean;
    handleClose: Function;
    analystId: any;
}

class AnalystItemDialog extends React.Component<DialogProps, any> {

    render() {
        return (
            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={true}
                autoDetectWindowHeight
            >
                <Attention
                    type={EntityType.RESEARCHER}
                    code={this.props.analystId}
                    fixDrawer={false}
                    style={AttentionStyle.ITEM}
                />
                <ListItem primaryText="查看更多"
                          containerElement={<Link to={AnalystDetailPage.path + this.props.analystId}/>}
                          leftIcon={<RemoveRedEye />} />
            </Dialog>
        );
    }
}

@observer
export default class AnalystItemMobile extends  React.Component<any, any>{
    @observable dialogOpen:boolean = false;

    styles = {
        point: {
            fontSize: 18,
            lineHeight: '36px',
            right: 20,
            top: 20,
            height: 'none',
            width: 'none',
            marginTop: 0
        },
        name: {
        },
        title: {
        },
    };

    handleClose = () => {
        this.dialogOpen = false;
    };

    showDialog = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.dialogOpen = true;
    };

    render() {
        let {fullName, score, imageId , title, subTitle} = this.props.item.target;
        let imageHref = '';
        if(imageId){
            imageHref = Constants.imageBaseUrl+imageId;
        }else {
            imageHref = Constants.noDataHeadImg;
        }
        let secondText;
        if (title == undefined) {
            title = {typeName: '证券分析师'};
        }
        if (subTitle && subTitle.typeName) {
            secondText = (
                <p>
                    <span style={{color: darkBlack}}>{title.typeName}</span> -- {subTitle.typeName}
                </p>
            );

        } else {
            secondText = (
                <p>
                    <span style={{color: darkBlack}}>{title.typeName}</span>
                </p>
            );
        }

        return (
            <div>
                <ListItem
                    primaryText={
                        <span style={this.styles.name}>{fullName}</span>
                    }
                    secondaryText={
                        secondText
                    }
                    leftAvatar={<Avatar src={imageHref} />}
                    rightIcon ={
                        <Rate score={score}/>
                    }
                    onTouchTap = {this.showDialog}
                />
                {<AnalystItemDialog
                    open = {this.dialogOpen}
                    analystId = {this.props.item.target.gtaId}
                    handleClose = {this.handleClose}
                />}
            </div>
        )
    }
}