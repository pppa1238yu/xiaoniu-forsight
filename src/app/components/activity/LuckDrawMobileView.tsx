import * as React from "react";
import {observer} from "mobx-react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Dialog from "material-ui/Dialog";
import If from "../common/If";
import {
    drawChanceNumDataSource, drawResultDataSource, drawTimeLimitDataSource,
    luckyUsersDataSource
} from "../../model/ajax/ActivityService";
declare let $;


@observer
export default class LuckDrawMobileView extends React.Component<any, any> {
    state = {
        open: false,
        ruleOpen: false
    };

    unusedPrizeId: number = -1;
    prizeArr = ["iphone-x", "小米MIX2", "JBL蓝牙音箱", "京东E卡","爱奇艺月卡", "谢谢参与，再接再厉"];
    winPrize: number = 6;
    listScrollStatus: boolean = true;
    updateLuckUsers: boolean = true;
    handleOpen = (prize) => {
        this.winPrize = prize;
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    style = {
        container: {
            color: "#fff",
            margin: "20px auto 0"
        },
        luckDrawTitle: {
            fontSize: "28px",
            color: "#fcc02a",
            textAlign: "center",
            marginBottom: "20px"
        },
        drawNum: {
            fontSize: "35px",
            color: "#fff",
            fontWeight: "bold"
        },
        fullWH: {
            width: "100%",
            height: "100%"
        },
        drawBox: {},
        drawHead: {
            display: "flex",
            justifyContent: "flex-end",
            marginBottom:"10px"
        },
        ruleTitle: {
            backgroundColor: "#FBC22A",
            color: "#161a38",
            borderRadius: "70%",
            width: "135px",
            lineHeight: "46px",
            textAlign: "center",
            height: "46px",
            marginTop: "10px"
        },
        ruleBox: {
            flexGrow: 1,
            fontSize: "14px",
            marginLeft: "64px"
        },
        winningArea: {
            width: "300px",
            height: "66px",
            backgroundColor: "#1D2549",
            borderRadius: "5px",
            overflow: "hidden",
            margin:"20px auto"
        },
        ruleItem: {
            marginTop: "20px"
        },
        ruleItemHead: {
            marginBottom: "20px"
        },
        center: {
            textAlign: "center",
            marginTop: "20px"
        },
        winningNews: {
            margin: "30px 0",
            lineHeight: "1.4em",
            textAlign:"center"
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
            cursor: "pointer",
            marginTop:"10px"
        },
        bottom:{
            marginTop:"100px"
        },
        fullWidth:{
            width:"100%"
        },
    };
    componentDidUpdate() {
        if (luckyUsersDataSource.$.length && this.listScrollStatus) {
            $("div.list_lh").myScroll({
                speed: 80, //数值越大，速度越慢
                rowHeight: 25 //li的高度
            });
            this.listScrollStatus = false
        }
    }

    componentDidMount() {
        let that = this;
        let rotateTimeOut = function () {
            $('#rotate').rotate({
                angle: 0,
                animateTo: 2160,
                duration: 8000,
                callback: function () {
                    alert('网络超时，请检查您的网络设置！');
                }
            });
        };
        let bRotate = false;//防止转动过程中多次点击
        let request = true;//防止网络不好的时候多次点击带来的多次ajax请求
        let rotateFn = function (awards, angles, prize) {
            bRotate = !bRotate;
            $('#rotate').stopRotate();
            $('#rotate').rotate({
                angle: 0,
                animateTo: angles + 1800,
                duration: 8000,
                callback: function () {
                    that.handleOpen(prize);
                    bRotate = !bRotate;
                }
            })
        };
        $(".turntable-bg-mobile").on("click", "#pointer", () => {

            if (bRotate)return;
            let item = 6;

            if(request){

                request=false;
                drawResultDataSource.resetWithId(this.unusedPrizeId);
                drawResultDataSource.request((value) => {
                    request=true;//抽奖接口成功返回后，可继续发ajax请求
                    if (value) {
                        item = value[0];
                    }

                    switch (item) {
                        case 2:
                            let angle0 = [145, 150, 155];
                            rotateFn(2, angle0[rnd(0, 2)], 2);
                            break;
                        case 1:
                            let angle1 = [205, 210, 215];
                            rotateFn(1, angle1[rnd(0, 2)], 1);
                            break;
                        case 6:
                            let angle2 = [320, 325, 330, 335, 340];
                            rotateFn(6, angle2[rnd(0, 4)], 6);
                            break;
                        case 5:
                            let angle3 = [25, 30, 35];
                            rotateFn(5, angle3[rnd(0, 2)], 5);
                            break;
                        case 3:
                            let angle4 = [85, 90, 95];
                            rotateFn(3, angle4[rnd(0, 2)], 3);
                            break;
                        case 4:
                            let angle5 = [265, 270, 275];
                            rotateFn(4, angle5[rnd(0, 2)], 4);
                            break;
                        default:
                            let angle6 = [320, 325, 330, 335, 340];
                            rotateFn(6, angle6[rnd(0, 4)], -1);
                            break;
                    }

                    drawChanceNumDataSource.request((value) => {
                        if (value) {
                            if (value.length) {
                                this.unusedPrizeId = value[0];
                            }
                        }
                    });//每抽一次请求一次剩余机会接口
                });
            }

        });
        function rnd(n, m) {
            return Math.floor(Math.random() * (m - n + 1) + n)
        }


        drawChanceNumDataSource.setNotifyResult(this.props.notifyResult);
        drawChanceNumDataSource.request((value) => {
            if (value) {
                if (value.length) {
                    this.unusedPrizeId = value[0];
                }
            }
        });//页面初加载时访问一次剩余抽奖机会接口

        drawTimeLimitDataSource.setNotifyResult(this.props.notifyResult1);
        drawTimeLimitDataSource.request();//判断抽奖活动是否结束
        function refreshLuckUsers() {
            luckyUsersDataSource.request(() => {
                if (that.updateLuckUsers) {
                    setTimeout(refreshLuckUsers, 10000);
                }
            });//指数板块非走势图的数据
        }

        refreshLuckUsers();
    }

    render() {
        drawChanceNumDataSource.registerUpdate();
        luckyUsersDataSource.registerUpdate();
        let pointer = <div className="pointer"><img src="images/luckDraw/drawOver.png" alt="pointer"
                                                    style={this.style.fullWH}/></div>;

        if (drawTimeLimitDataSource.$[0]) {
            if (drawChanceNumDataSource.$.length) {
                pointer = <div className="pointer" id="pointer"><img src="images/luckDraw/pointer.png" alt="pointer"
                                                                     style={this.style.fullWH}/></div>
            } else {
                pointer = <div className="pointer"><img src="images/luckDraw/disabledPointer.png" alt="pointer"
                                                        style={this.style.fullWH}/></div>
            }
        } else {
            pointer = <div className="pointer"><img src="images/luckDraw/drawOver.png" alt="pointer"
                                                    style={this.style.fullWH}/></div>
        }

        let prizeImgUri = "";
        switch (this.winPrize) {
            case 1:
                prizeImgUri = "/images/activity/iphoneX1.png";
                break;
            case 2:
                prizeImgUri = "/images/activity/mix21.png";
                break;
            case 3:
                prizeImgUri = "/images/activity/JBL1.png";
                break;
            case 4:
                prizeImgUri = "/images/activity/jindonge1.png";
                break;
            case 5:
                prizeImgUri = "/images/activity/iqiy1.png";
                break;
            case 6:
                prizeImgUri = "";
                break;
        }

        return <div style={this.style.container}>
            <div style={this.style.luckDrawTitle}>
                获取抽奖机会 <span style={this.style.drawNum as any}>{drawChanceNumDataSource.$.length}</span> 次
            </div>
            <div style={this.style.drawBox}>
                <div style={this.style.ruleBox}>
                    <div style={this.style.drawHead as any}>
                        <div style={this.style.ruleTitle} onClick={()=>{this.setState({ruleOpen:true})}}>
                            规则说明
                        </div>
                    </div>
                </div>
                <div>
                    <div className="turntable-bg-mobile">
                        {pointer}
                        <div className="rotate"><img id="rotate" src="images/luckDraw/turntable.png" alt="turntable"
                                                     style={this.style.fullWH}/></div>
                    </div>
                </div>
                {luckyUsersDataSource.$.length?<div style={this.style.winningArea as any} className="list_lh">
                    <ul>
                        {luckyUsersDataSource.$.map((ele, index) => {
                            return <li key={index}>
                                {ele.a} 抽中了 {this.prizeArr[ele.b - 1]}
                            </li>
                        })}
                    </ul>
                </div>:null}

                <div style={this.style.bottom}>
                    <img src="/images/activity/mobileActivity/erweima.png" alt="" style={this.style.fullWidth}/>
                </div>
            </div>
            <Dialog
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                contentStyle={{width: "300px"}}
            >
                <div style={this.style.center}>
                    <img src={prizeImgUri} alt=""/>
                </div>
                {this.winPrize === -1 ? <div style={this.style.winningNews}>
                    出现未知错误!
                </div> : <div style={this.style.winningNews}>
                    {this.winPrize === 6 ? "谢谢参与，再接再厉" : "恭喜您获得小牛数据提供的" + this.prizeArr[this.winPrize-1] + "奖品"}
                </div>}
                <div onClick={this.handleClose} style={this.style.closeBtn}>
                    知道了
                </div>
            </Dialog>
            <Dialog
                modal={false}
                open={this.state.ruleOpen}
                onRequestClose={() => {
                    this.setState({ruleOpen: false})
                }}
                contentStyle={{width: "300px"}}
                autoScrollBodyContent={true}
            >
                <div>
                    <div style={this.style.ruleItem}>活动时间 10月25日-11月24日</div>
                    <div style={this.style.ruleItem}>
                        <div style={this.style.ruleItemHead}>活动奖品</div>
                        <div className="rule-item-detail">1、本次大转盘活动奖品为一等奖iphone X 2台，二等奖小米MIX 2 3台，三等奖JBL蓝牙音箱30台，四等奖100元京东E卡400张，五等奖爱奇艺月卡600张。</div>

                    </div>
                    <div style={this.style.ruleItem}>
                        <div style={this.style.ruleItemHead}>抽奖资格</div>
                        <div className="rule-item-detail">1、每邀请10人可得一次抽奖机会，抽奖次数不设上限，邀请越多，抽奖机会越多。</div>
                        <div className="rule-item-detail">
                            2、邀请活动11月24日24点截止，邀请人数排名第一可额外获得3张100元京东E卡，排名第二可额外获得2张100元京东E卡，排名第三可额外获得1张100元京东E卡。
                        </div>
                    </div>
                    <div style={this.style.ruleItem}>
                        <div style={this.style.ruleItemHead}>发奖方式</div>
                        <div className="rule-item-detail">
                            1、奖品将在邀请信息审核完成以后发放，审核时间为2个工作日内。
                        </div>
                        <div className="rule-item-detail">
                            2、虚拟奖品可直接在“我的奖品”页面实时领取；实物奖品将在中奖的2个工作日内由工作人员联系登记收货地址后寄出。（IPHONE X除外）
                        </div>
                    </div>
                    <div onClick={()=>{this.setState({ruleOpen:false})}} style={this.style.closeBtn}>
                        知道了
                    </div>
                </div>
            </Dialog>
        </div>
    }
}