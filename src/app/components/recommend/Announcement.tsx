import * as React from "react";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
import {Card, CardActions, CardHeader, CardText, CardTitle} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import MoreV from "material-ui/svg-icons/navigation/more-vert";
import {List, ListItem} from "material-ui/List";
import {Link} from "react-router-dom";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";
import Constants from "../../Constants";

export default class Announcement extends React.Component<any, any> {
    state = {
        dialogOpen: false,
    };

    styles = {
        action: {
            paddingTop: 0,
        },
        titleSmall: {
            fontSize: 16,
            cursor: 'pointer'
        },
        title: {
            fontSize: 16,
            color: '#616161',
            fontWeight: "bold",
            cursor: 'pointer'
        },
        titleContainer: {
            paddingBottom: 0,
        },
        declareDate: {
            paddingLeft: 10,
            fontSize: 14,
            color: '#92999A',
            fontWeight: 'normal'
        },
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    viewClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState(
            {
                dialogOpen: true,
            }
        )
    };

    handleJumpPdf = (annId) => {
      window.open(window.location.protocol + '//' +Constants.remoteHost+"/announcement/announcementInfo.json?annId="+annId);
    };

    render() {
        let action = null;
        let title = null;
        let spliceTitle = this.props.viewPoint.target.title;
        if (spliceTitle) {
            if (spliceTitle.length > 24) {
                spliceTitle = spliceTitle.slice(0, 24) + "...";
            }
        }

        if (this.props.small) {
            action = (
                <AnalystViewItemDialog
                    open={this.state.dialogOpen}
                    handleClose={this.handleClose}
                    id={this.props.viewPoint.target.id}
                    path = {this.props.viewPoint.target.announcementRoute}
                    handleJump = {() => this.handleJumpPdf(this.props.viewPoint.target.id)}
                />
            );
            title = (
                <div className="flex-center">
                    <div >
                        {spliceTitle}
                    </div>
                    <div className="auto-right">
                        <IconButton>
                            <MoreV/>
                        </IconButton>
                        {action}
                    </div>
                </div>
            );
        } else {
            // (this.props.viewPoint.path);
            action = (
                <CardActions style={this.styles.action}>
                    <div className="flex-center">
                        <div className="auto-right">
                            <Attention
                                type={EntityType.ANNOUNCE}
                                code={this.props.viewPoint.target.id}
                                fixDrawer={this.props.fixDrawer}
                                style={AttentionStyle.ICON}
                            />
                        </div>
                    </div>
                </CardActions>
            );
            title = (
                <div className="flex-center">
                    <div onClick={() => this.handleJumpPdf(this.props.viewPoint.target.id)}>
                        <span title={this.props.viewPoint.target.title} className="spliceTitle">
                            {spliceTitle}
                        </span>
                        <span style={this.styles.declareDate as any}>
                            {this.props.viewPoint.target.declareDate.split(" ")[0]}
                        </span>
                    </div>
                    <div className="auto-right">
                        {action}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <Card>
                    <CardTitle
                        title={title}
                        titleStyle={this.props.small ? this.styles.titleSmall : this.styles.title}
                        style={this.styles.titleContainer}
                        onTouchTap={
                            this.props.small ?
                                (event) => {
                                    this.viewClicked(event);
                                } : () => {
                            }
                        }
                    />
                </Card>
            </div>
        )
    }
}

interface DialogProps {
    id: any;
    open: boolean;
    handleClose: Function;
    path:string;
    handleJump?:any;
}

class AnalystViewItemDialog extends React.Component<DialogProps, null> {
    render() {
        const path = this.props.path;
        return (
            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoDetectWindowHeight
            >
                <Attention
                    type={EntityType.ANNOUNCE}
                    code={this.props.id}
                    fixDrawer={false}
                    style={AttentionStyle.ITEM}
                />
                <ListItem primaryText="查看更多"
                          onClick={this.props.handleJump}
                          leftIcon={<RemoveRedEye />}/>
            </Dialog>
        );
    }
}