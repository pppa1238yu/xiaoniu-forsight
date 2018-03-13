import * as React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import Search from "material-ui/svg-icons/action/search";
import TextField from 'material-ui/TextField';
import {observer} from "mobx-react";
import {orange500, blue500} from 'material-ui/styles/colors';
@observer
export default class  AddButton  extends React.Component<any, any>{
    styles = {
        pStyle : {
            position:'relative',
            backgroundColor:'#ef5350',
            color:'#fff',
            paddingLeft:'53px',
            fontSize:'14px',
            lineHeight:'5px'
        },
        searchStyle : {
            position:'absolute',
            top:11,
            left:12,
            width:30,
            height:30,
            cursor:'pointer'
        },
        closeStyle : {
            position:'absolute',
            right:12,
            cursor:'pointer',
            lineHeight:'5px'
        },
        searchDiv : {
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            minHeight:360
        }
    };

    render() {
        let content;
        content = (<div style={this.styles.searchDiv as any}>
            <div style={{paddingBottom:'40px'}}>
                <TextField
                    floatingLabelText="搜索股票名或代码"
                />
                <RaisedButton
                    label="搜索"
                    primary={true}
                    style={{position:'relative',top:'-3px'}}
                    onTouchTap={this.props.handleOpen}
                />
            </div>
        </div>);

        return (
            <div>
                <RaisedButton
                    label="确认 "
                    primary={true}
                    onTouchTap={this.props.handleOpen}
                />
                <Dialog
                    title={
                        <p style={this.styles.pStyle as any}
                        >
                            <Search color="#fff" style={this.styles.searchStyle}/>
                            <TextField
                                hintText="搜索股票名或代码"
                                hintStyle= {{color:'#fff'}}
                                style ={{top:-21}}
                                inputStyle =  {{color:'#fff'}}
                                underlineStyle={{borderBottom:'none'}}
                            />
                            <span
                                onClick={this.props.handleClose}
                                style={this.styles.closeStyle as any}
                            >关闭</span>
                        </p>
                    }
                    titleStyle = {{boxSizing:'border-box',height:'50px'}}
                    modal = {false}
                    open={this.props.open}
                    onRequestClose={this.props.handleClose}
                    autoScrollBodyContent={true}
                    contentStyle = {{position:'relative',width:520}}
                >
                    {content}
                </Dialog>
            </div>
        )
    }
}