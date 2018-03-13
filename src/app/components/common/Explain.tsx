import * as React from "react";
import Help from "material-ui/svg-icons/action/help";
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
interface ExplainProps {
    message: any;
    toolTipPosition?: string;
    toolTipWidth?: string;
    small?: boolean;
    onlyIcon?:boolean;
}
export default class Explain extends React.Component<ExplainProps, any> {
    styles = {
        content: {
            display: "inline-block"
        },
        icon: {
            verticalAlign: "middle"
        },
        smallIcon: {
            width: 24,
            padding:0,
            verticalAlign: "middle"
        },
        toolTip: {
            width: this.props.toolTipWidth || "650px",
            whiteSpace: "normal",
            overflow: "visible",
            fontSize: "14px",
            textAlign: "left"
        },
        smallToolTop: {
            width: this.props.toolTipWidth || "650px",
            whiteSpace: "normal",
            overflow: "visible",
            fontSize: "12px",
            textAlign: "left"
        }
    };

    render() {
        let messageNode = this.props.message instanceof Array ? (<div style={this.props.small?this.styles.smallToolTop:this.styles.toolTip as any}>
            {this.props.message.map((e, index) => {
                return <p key={index}>
                    {e}
                </p>
            })}
        </div>) : (<p style={this.props.small?this.styles.smallToolTop:this.styles.toolTip as any}>{this.props.message}</p>);
        if(this.props.onlyIcon){
            messageNode=null;
        }
        return (
            <div style={this.styles.content}>
                <IconButton tooltip={messageNode} style={this.props.small ? this.styles.smallIcon : this.styles.icon}
                            tooltipPosition={this.props.toolTipPosition || "bottom-right"}
                            tooltipStyles={{opacity: "1"}}>
                    <Help color="#9a9a9a" hoverColor="#616161"/>
                </IconButton>
            </div>
        )
    }
}