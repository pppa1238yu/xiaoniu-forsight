import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";
import Chip from 'material-ui/Chip';
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import LeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import {observable, runInAction} from "mobx";
import {grey400} from "material-ui/styles/colors";
declare let $;
@observer

export default class ButtonGroup extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    @observable rightButton:any = null;
    @observable leftButton:any = null;
    clickIndex = 0;
    chipIndex = 0;
    styles = {
        wrapper: {
            position:'relative',
            display: 'inline-block',
            whiteSpace: 'noWrap',
            marginTop:16,
        },
        rightIcon: {
            position:'absolute',
            right:0,
            top:0,
            height:64,
            backgroundColor:'rgba(189,189,189,.9)',
            zIndex:10,
            cursor:'pointer'
        },
        rightSmallIcon: {
            position:'absolute',
            right:0,
            top:0,
            height:64,
            backgroundColor:'rgba(189,189,189,.9)',
            zIndex:10,
            cursor:'pointer'
        },
        leftIcon: {
            position:'absolute',
            left:0,
            top:0,
            height:64,
            backgroundColor:'rgba(189,189,189,.9)',
            zIndex:10,
            cursor:'pointer'
        },
        leftSmallIcon: {
            position:'absolute',
            left:0,
            top:0,
            height:64,
            backgroundColor:'rgba(189,189,189,.9)',
            zIndex:10,
            cursor:'pointer'
        },
        smallOuter: {
            display:'inline-block',
            overflow:'hidden',
            position:'relative',
            height:64,
            width:'calc(100% - 50px)',
            marginLeft:25
        },
        outerStyle: {
            display:'inline-block',
            overflow:'hidden',
            position:'relative',
            height:64,
            width:'calc(100% - 100px)',
        }
    };

    judgeRightButton = () =>  {
        const outerWidth =  ReactDOM.findDOMNode(this.refs['outer']).clientWidth;
        const tipsWidth = ReactDOM.findDOMNode(this.refs['tipsDiv']).clientWidth;
        const rightButton = (
            <div style={this.styles.rightIcon as any}
                 onClick = {this.handleClickRight}
            >
                <RightIcon color="#fff" style={{marginTop:20}}/>
            </div>
        );
        const leftButton =  (
            <div style={this.styles.leftIcon as any}
                 onClick = {this.handleClickLeft}
            >
                <LeftIcon color="#fff" style={{marginTop:20}}/>
            </div>
        );
        if( tipsWidth > outerWidth ){
            if(this.clickIndex > 0){
                if(tipsWidth - this.clickIndex * outerWidth <= outerWidth){
                    runInAction(() => {
                        this.rightButton = null;
                        this.leftButton = leftButton;
                    });
                }else if(tipsWidth - this.clickIndex * outerWidth > outerWidth){
                    runInAction(() => {
                        this.leftButton = leftButton;
                        this.rightButton = rightButton;
                    });
                }
            }else {
                runInAction(() => {
                    this.leftButton = null;
                    this.rightButton = rightButton;
                });
            }
        }
    };

    handleTransform = () => {
        const outerWidth =  ReactDOM.findDOMNode(this.refs['outer']).clientWidth;
        let tipsdiv = $('#tipsDiv');
        tipsdiv.stop().animate({
            left:-outerWidth * this.clickIndex
        },500);
        this.judgeRightButton();
    };

    handleClickRight = () => {
        this.clickIndex ++;
        this.handleTransform();
    };

    handleClickLeft = () => {
        this.clickIndex --;
        this.handleTransform();
    };

    mouseEnter = () => {
        this.judgeRightButton();
    };

    mouseLeave = () => {
        runInAction(() => {
            this.leftButton = null;
            this.rightButton =  null;
        });
    };
    componentDidMount(){
        if(this.props.small){
            this.judgeRightButton();
        }
    }

    render() {
        const tips  = this.props.tips;
        const length = tips.length;
        let showIndex = this.chipIndex;
        if(length == showIndex){
            showIndex--;
        }
        let showOpearButton = (
            <div>
                {this.rightButton}
                {this.leftButton}
            </div>
        );
        const content =  (
            <div style={this.styles.wrapper as any}
                 id="tipsDiv"
                 ref = "tipsDiv"
            >
                {
                    tips.map( ( data,index )  => {
                        return (
                            <Chip
                                key =  {index}
                                onTouchTap={ ()  => {
                                    this.props.changeTag(index);
                                    this.chipIndex = index;
                                }}
                                backgroundColor={index==showIndex?grey400:null}
                                labelStyle = {{fontSize:12}}
                                style={{marginRight:5,display:'inline-block',padding:' 0 10px'}}
                            >
                                {data}
                            </Chip>
                        )
                    })
                }
            </div>
        );
        if(this.props.small){
            return (
                <div style={{position:'relative'}}>
                    <div
                        ref="outer"
                        style={this.styles.smallOuter as any}
                    >
                        {content}
                    </div>
                    {showOpearButton}
                </div>

            )
        }else {
            return (
                <div
                    ref="outer"
                    style={this.styles.outerStyle as any}
                    onMouseEnter={this.mouseEnter}
                    onMouseLeave={this.mouseLeave}
                >
                    {content}
                    {showOpearButton}
                </div>
            )
        }

    }
}