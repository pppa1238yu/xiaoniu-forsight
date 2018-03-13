import * as React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import SearchInp from "../../components/weChat/SearchInp";
declare let $;
export default class SearchPage extends React.Component<any, null> {
    static path = '/search';
    static title = '估值分析';
    styles = {
        inputStyle: {
            boxSizing: 'border-box',
            width: '100%',
            height: 40,
            padding: '0 45px 0 10px',
            color: '#616161',
            outline: 'none',
            border: 'none',
            fontSize: 14,
            flexGrow: 1,
            backgroundColor: '#d0d0d0',
        },
        relative: {
            position: 'relative',
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: 10,
            display: 'flex',
            justifyContent: 'space-between'
        },
        bottom: {
            position: 'absolute',
            bottom: 33,
            left: '50%',
            marginLeft: '-50px'
        },
        center: {
            flexGrow: 1,
            paddingTop: '30%'
        },
        buttonStyle: {
            fontSize: 14,
            backgroundColor: '#ff9c0d',
            color: '#fff',
            border: 'none',
            outline: 'none',
            width: 150,
            flexGrow: 1,
            textAlign: 'center',
            height: 40
        },
        padding: {
            padding: '20px 0'
        }
    };

    scrollToTop = () => {
        let top = $('#textTitle').offset().top;
        $('html,body').scrollTop(top);
    };

    render() {
        return (
            <div className="mainBox">
                <div style={this.styles.center as any}>
                    <p className="commonColor  boldText" style={this.styles.padding}>估值分析</p>
                    <div id="textTitle">
                        <SearchInp
                            inputStyle={this.styles.inputStyle}
                            buttonStyle={this.styles.buttonStyle}
                            initialOpen={true}
                            scrollTop = {this.scrollToTop}
                            link="weChat.html#/valuation"
                            disableExpandable={true}/>
                    </div>

                </div>
                <div style={this.styles.bottom as any}>
                    <img src="/images/weChat/logo.png" alt="logo" className="logoStyle"/>
                </div>
            </div>
        )
    }
}