import * as React from "react";
export default class WeChatShow extends React.Component<any, any> {
    styles = {
        padding:{
            padding:'20px',
            marginBottom:28
        },
        flexBox:{
            display:'flex',
            justifyContent:'space-around'
        },
        centerText:{
            textAlign:'center',
            margin:0
        },
        bottomText:{
            position:'absolute',
            bottom:'-36px',
            left:0,
            textAlign:'center',
            color:'#5a5b5d',
            width:'100%',
        },
        imgStyle: {
            boxSizing:'content-box',
            width:100,
            height:100,
            paddingBottom:10,
            paddingTop:10
        }
    };
    render() {
        return (
            <div className="reportHeader" style={this.styles.padding}>
                <p style={this.styles.centerText}>扫一扫关注公众号</p>
                <div style={this.styles.flexBox as any}>
                    <span>
                        <img src="/images/contact/percent5-2.jpg" style={this.styles.imgStyle}/>
                        <p style={this.styles.centerText}>百分五俱乐部</p>
                    </span>
                    <span>
                        <img src="/images/contact/calfdata-2.jpg" style={this.styles.imgStyle}/>
                        <p style={this.styles.centerText}>小牛数据</p>
                    </span>
                    <p style={this.styles.bottomText as any}>
                        客服QQ群号：575943511
                    </p>
                </div>
            </div>
        )
    }
}