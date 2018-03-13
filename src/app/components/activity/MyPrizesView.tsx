import * as React from "react";
import {observer} from "mobx-react";
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {jdeDataSource, prizeListDataSource, registratersDataSource, getAQYCode} from "../../model/ajax/ActivityService";

@observer
export default class MyPrizesView extends React.Component<any, any> {
    state = {
        open: false,
        jdeOpen: false,
        jdData: {cardAccount:"",cardPassword:""},
        prizeDialog: null
    };
    handleOpen = (index) => {
        let priseBoxImg = ['', '/images/activity/iphoneX.png', '/images/activity/mix2.png', '/images/activity/JBL.png', '/images/activity/iqiy.png', ''];
        let congrationWords = '';
        let prize = ['', 'Iphone X', '小米 MIX2', 'JBL蓝牙音箱', '100元京东E卡', '爱奇艺月卡',''];
        if (index !== 4 && index!==5) {
            congrationWords = '恭喜您获得小牛数据提供的 “' + prize[index] + '" 奖品,' +
                '我们的工作人员会在2个工作日内,与您留下的注册手机号取得联系,' +
                '请保持通信畅通,谢谢！'
        }
        let dialogShow = <div>
            <div style={this.styles.center}>
                <img src={priseBoxImg[index]} alt=""/>
            </div>
            <div style={this.styles.winningNews}>
                {congrationWords}
            </div>
            <div onClick={this.handleClose} style={this.styles.closeBtn}>
                知道了
            </div>
        </div>;
        this.setState({
            prizeDialog: dialogShow,
            open: true
        });
    };

    aqyOpen = (value) => {
        let dialogShow = <div>
            <div style={this.styles.center}>
                <img src="/images/activity/iqiy.png" alt=""/>
            </div>
            <div style={this.styles.winningNews}>
                恭喜您获得小牛数据提供的"爱奇艺月卡"奖品,
                <br/>
                卡号:{value.cardAccount || '数据出错'}
                <br/>
                密码:{value.cardPassword || '数据出错'}
            </div>
            <div onClick={this.handleClose} style={this.styles.closeBtn}>
                知道了
            </div>
        </div>;
        this.setState({
            prizeDialog: dialogShow,
            open: true
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };


    jdeOpen = (value) => {
        this.setState({
            jdeOpen: true,
            jdData: value
        });
    };

    jdeClose = () => {
        this.setState({jdeOpen: false});
    };

    getPrize = () => {
        prizeListDataSource.request();
        // prizeListDataSource.setNotifyResult(this.props.onNotifyFirstLoad2);
    };


    getInviteCount = () => {
        registratersDataSource.request();
        registratersDataSource.setNotifyResult(this.props.onNotifyFirstLoad1);
    };

    componentDidMount() {
        this.getPrize();
        this.getInviteCount();
    }

    styles = {
        container: {
            width: "967px",
            margin: "0 auto",
            fontSize: "14px",
            color: "#fff"
        },
        myPrizeTitle: {
            textAlign: "center"
        },
        titleImg: {
            width: "200px"
        },
        jindonge: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },
        progressBg: {
            width: "630px",
            height: "25px",
            backgroundColor: "#3B4476",
            borderRadius: "15px"
        },
        progress: {
            height: "84px"
        },
        registerNum: {
            textAlign: "right",
            marginBottom: "15px"
        },
        prizeBtnDisabled: {
            padding: "10px 40px",
            backgroundColor: "#878787",
            borderRadius: "10px"
        },
        prizeBtn: {
            padding: "10px 40px",
            backgroundColor: "#FBC22A",
            borderRadius: "10px",
            cursor: "pointer"
        },
        prizeShow: {
            display: "flex",
            marginTop: "56px",
            flexWrap: "wrap",
            width: "1030px"
        },
        prizeItem: {
            marginRight: "59px",
            marginTop: "40px",
            position: "relative",
            cursor: "pointer",
            overflow: "hidden"
        },
        mask: {
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            opacity: .6,
            zIndex: 1,
            borderRadius: "10px"
        },
        prizeDetail: {
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2,
            width: "100%",
            textAlign: "center",
            lineHeight: "195px",
            fontSize: "22px"
        },
        prizeImg: {
            width: "100%",
            height: "100%"
        },
        center: {
            textAlign: "center",
            marginTop: "20px"
        },
        winningNews: {
            margin: "30px 0",
            lineHeight: "1.4em"
        },
        closeBtn: {
            width: "135px",
            height: "40px",
            lineHeight: "40px",
            color: "#fff",
            backgroundColor: "#169BD5",
            margin: "0 auto",
            textAlign: "center",
            borderRadius: "5px",
            cursor: "pointer"
        }
    };

    render() {
        let inviteCount = registratersDataSource.$[0] || 0;
        let allPrise = prizeListDataSource.$;
        let priseBoxImg = ['', '/images/activity/iphoneX.png', '/images/activity/mix2.png', '/images/activity/JBL.png','/images/activity/jindonge.png' ,'/images/activity/iqiy.png', ''];
        let showAllPrize = [];
        showAllPrize = allPrise.map((item, index) => {
            if (item.typeId == '6') {
                return null
            } else {
                if (item.typeId === 4) {
                    return <div style={this.styles.prizeItem as any} key={index} className="prize-item">
                        <img src={priseBoxImg[item.typeId]} alt="" style={this.styles.prizeImg}/>
                        <div className="prize-detail-box">
                            <div className="prize-mask">
                            </div>
                            <div className="prize-detail" onClick={() => {
                                jdeDataSource.resetWithId(item.instanceId);
                                jdeDataSource.request((value) => {
                                    this.jdeOpen(value);
                                });
                            }
                            }>
                                点击查看
                            </div>
                        </div>
                    </div>
                } else if (item.typeId === 5) {
                    return <div style={this.styles.prizeItem as any} key={index} className="prize-item">
                        <img src={priseBoxImg[item.typeId]} alt="" style={this.styles.prizeImg}/>
                        <div className="prize-detail-box">
                            <div className="prize-mask">
                            </div>
                            <div className="prize-detail" onClick={() => {
                                getAQYCode.resetWithId(item.instanceId);
                                getAQYCode.request((value) => {
                                    this.aqyOpen(value);
                                });
                            }
                            }>
                                点击查看
                            </div>
                        </div>
                    </div>
                }else {
                    return <div style={this.styles.prizeItem as any} key={index} className="prize-item">
                        <img src={priseBoxImg[item.typeId]} alt="" style={this.styles.prizeImg}/>
                        <div className="prize-detail-box">
                            <div className="prize-mask">
                            </div>
                            <div className="prize-detail" onClick={() => {
                                this.handleOpen(item.typeId);
                            }
                            }>
                                点击查看
                            </div>
                        </div>
                    </div>
                }

            }
        });
        let jdCode = '', jdPassCode = '';
        jdCode = this.state.jdData.cardAccount;
        jdPassCode = this.state.jdData.cardPassword;
        return <div style={this.styles.container}>
            <div style={this.styles.myPrizeTitle}>
                <img src="/images/activity/myPrizeTitle.png" alt="" style={this.styles.titleImg}/>
            </div>
            {/*<div style={this.styles.jindonge as any}>
             <div>
             <div>
             <img src="/images/activity/jindonge.png" alt=""/>
             </div>
             <div>京东E卡 100元</div>
             </div>
             <div style={this.styles.progress}>
             <div style={this.styles.registerNum}>
             应邀注册人数 <span>{inviteCount}</span>/10 人
             </div>
             <LinearProgress mode="determinate" value={inviteCount} max={10} style={this.styles.progressBg}
             color="#FBC22A"/>
             </div>
             <div>
             {
             inviteCount < 10 ? <div style={this.styles.prizeBtnDisabled}>
             点击领取
             </div> : <div style={this.styles.prizeBtn} onClick={() => {
             jdeDataSource.resetWithId();
             jdeDataSource.request((value) => {
             this.jdeOpen(value);
             });
             }}>
             点击领取
             </div>
             }
             </div>
             </div>*/}
            <div style={this.styles.prizeShow as any}>
                {showAllPrize}
            </div>
            <Dialog
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                contentStyle={{width: "380px"}}
            >
                {this.state.prizeDialog}

            </Dialog>
            <Dialog
                modal={false}
                open={this.state.jdeOpen}
                onRequestClose={this.jdeClose}
                contentStyle={{width: "380px"}}
            >
                <div style={this.styles.center}>
                    <img src="/images/activity/jindonge.png" alt=""/>
                </div>
                <div style={this.styles.winningNews}>
                    恭喜您获得小牛数据提供的 “京东购物卡" 奖品,
                    <br/>
                    卡号:{jdCode}
                    <br/>
                    密码:{jdPassCode}
                </div>
                <div onClick={this.jdeClose} style={this.styles.closeBtn}>
                    知道了
                </div>
            </Dialog>
        </div>
    }
}

