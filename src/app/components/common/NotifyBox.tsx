import * as React from "react";
import * as ReactDOM from "react-dom";
import ClearButton from 'material-ui/svg-icons/content/clear';
import AlertButton from 'material-ui/svg-icons/alert/error-outline';
import Constants from "../../Constants";

export  default class NotifyBox extends React.Component<any, any>{

    styles = {
        flexBox: {
            display:'flex',
            justifyContent:'space-between',
            paddingBottom:15
        },
        paddingBox: {
            position:'fixed',
            top:76,
            right:10,
            width:335,
            minHeight:100,
            zIndex:99,
            padding:'20px 20px 20px 45px',
            boxShadow:'0 2px 8px  rgba(0,0,0,.2)',
            backgroundColor:'#fff',
            borderRadius:'4px',
        },
        iconStyle: {
            width:'18px',
            height:'18px',
            cursor:'pointer'
        },
        notifyTitle: {
            color:'#272727',
            fontSize:14
        },
        notifyContent: {
            fontSize:12,
            color:'#5f5f5f',
            width:270,
            lineHeight:'20px'
        },
        alertButton: {
            position:'absolute',
            left:11,
            top:17,
        }
    };

    handleClick = () => {
        let notifyBox = ReactDOM.findDOMNode(this.refs['notifyBox']);
        notifyBox.setAttribute("style","display:none");
        Constants.NotifyBoxShow = false;
    };

    render(){
        const title = this.props.title;
        const content = this.props.content;
        if(Constants.NotifyBoxShow){
            return(
                <div style={this.styles.paddingBox as any} ref="notifyBox">
                    <AlertButton style={this.styles.alertButton} color="#ff8b24"/>
                    <div style={this.styles.flexBox as any}>
                        <span style={this.styles.notifyTitle}>{title}</span>
                        <ClearButton style={this.styles.iconStyle}
                                     color="#979797"
                                     hoverColor="#272727"
                                     onClick={this.handleClick}/>
                    </div>
                    <div style={this.styles.notifyContent}>
                        {content}
                    </div>
                </div>
            )
        }else {
            return null
        }

    }
}