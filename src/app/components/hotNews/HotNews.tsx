import * as React from "react";
import IconButton from "material-ui/IconButton";
import MoreV from "material-ui/svg-icons/navigation/more-vert";
import {List, ListItem} from "material-ui/List";
import {Card, CardActions, CardHeader, CardText, CardTitle} from "material-ui/Card";

export default class HotNews extends React.Component<any, any> {
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
        sourceStyle: {
            fontSize:16,
            color: '#616161',
            fontWeight:'normal'
        },
        sourceSmallStyle: {
            fontSize:14,
            color: '#616161',
            fontWeight:'normal'
        },
        paddingLeft: {
            paddingLeft:15
        }
    };

    handleJumpPdf = (path) => {
        window.open(path);
    };

    render(){
        let action = null;
        let title = null;
        let spliceTitle = this.props.viewPoint.title;
        if (spliceTitle) {
            if (spliceTitle.length > 24) {
                spliceTitle = spliceTitle.slice(0, 24) + "...";
            }
        }
        if (this.props.small) {
            title = (
                <div className="flex-center">
                    <div >
                        {spliceTitle}
                        <br/>
                        <span style={this.styles.sourceSmallStyle as any}>
                                 {this.props.viewPoint.time.split(" ")[0]}
                                 <span style={this.styles.paddingLeft}>
                                     {this.props.viewPoint.source}
                                 </span>
                        </span>
                    </div>
                </div>
            );
        } else {
            // (this.props.viewPoint.path);
            action = (
                <CardActions style={this.styles.action}>
                    <div className="flex-center">
                        <div className="auto-right">
                            <span style={this.styles.sourceStyle as any}>
                                {this.props.viewPoint.source}
                            </span>
                        </div>
                    </div>
                </CardActions>
            );
            title = (
                <div className="flex-center">
                    <div onClick={() => this.handleJumpPdf(this.props.viewPoint.url)}>
                        <span title={this.props.viewPoint.title} className="spliceTitle">
                            {spliceTitle}
                        </span>
                        <span style={this.styles.declareDate as any}>
                            {this.props.viewPoint.time.split(" ")[0]}
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
                            this.props.small?
                            () => {
                                this.handleJumpPdf(this.props.viewPoint.url);
                            }:()=>{}
                        }
                    />
                </Card>
            </div>
        )
    }
}