import * as React from "react";
import {observer} from "mobx-react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Dialog from "material-ui/Dialog";
import If from "../common/If";
import {invitationRankDataSource, registratersDataSource} from "../../model/ajax/ActivityService";
import {Link} from "react-router-dom";
import MyPrizesPage from "../../pages/activity/MyPrizesPage";
import {userDataSource} from "../../model/ajax/UserService";
import Constants from "../../Constants";
class InvitationWay extends React.Component<any, any> {
    state = {
        open: false
    };
    style = {
        box: {
            border: "1px solid #6a6a6a",
            width: "365px",
            height: "386px",
            borderRadius: "5px",
            marginRight: "18px",
            padding: "32px",
            overflow:"hidden"
        },
        title: {
            fontSize: "18px",
            color: "#fcc02a",
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
            marginBottom: "35px"
        },
        content: {
            lineHeight: "1.8em",
            color: "#eee",
            marginBottom: "20px"
        },
        copyLink: {
            width: "168px",
            height: "35px",
            lineHeight: "35px",
            textAlign: "center",
            fontSize: "14px",
            color: "#161a38",
            backgroundColor: "#fcc02a",
            borderRadius: "10px",
            margin: "0 auto",
            cursor: "pointer"
        },
        detail: {
            fontSize: "12px",
            color: "#bdbdbd",
            marginBottom: "15px",
            lineHeight: "1.8em"
        },
        link: {
            color: "#fff"
        },
        dialogStyle: {
            maxWidth: 400
        },
        invitationCode: {
            fontSize: 24,
            textAlign: "center"
        },
        invitationCodeBox: {
            height: "105px"
        }
    };

    handleOpen = () => {
        this.setState(
            {open: true}
        )
    };

    copyInviteCode = () => {
        this.handleOpen();
    };
    handleClose = () => {
        this.setState(
            {open: false}
        );
    };

    render() {
        let dialog = (
            <Dialog
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                contentStyle={this.style.dialogStyle}
                autoDetectWindowHeight
            >
                复制成功
            </Dialog>
        );
        return <div style={this.style.box as any} className="flex-column-center invitation-box">
            <div style={this.style.title as any}>
                {this.props.title}
            </div>
            <div style={this.style.content}>
                {this.props.content}
            </div>
            <div className="invitation-detail">
                <If condition={this.props.title === "邀请方式一"} block={true}>
                    <div style={this.style.detail}>
                        给大家介绍一下，这是我新发现的智能炒股神器@小牛数据。公测送豪礼活动开始啦，
                        邀请股民朋友注册，不仅有京东卡，还能抽个爱疯X！嘿，你！！说的就是你！一起来吧！
                    </div>

                    <CopyToClipboard
                        text={"给大家介绍一下，这是我新发现的智能炒股神器@小牛数据。公测送豪礼活动开始啦，邀请股民朋友注册，" +
                        "不仅有京东卡，还能抽个爱疯X！嘿，你！！" +
                        "说的就是你！一起来吧！注册链接："+window.location.protocol + '//' + Constants.remoteHost + "/index.htm#/login#inviteCode=" + (userDataSource.$.inviteCode || '')}
                        onCopy={this.copyInviteCode}>
                        <div style={this.style.copyLink}>
                            点击复制
                        </div>
                    </CopyToClipboard>
                </If>
                <If condition={this.props.title === "邀请方式二"} block={true}>
                    <div style={this.style.invitationCodeBox}>
                        <p>
                            你的邀请码是：
                        </p>
                        <p style={this.style.invitationCode}>
                            {userDataSource.$.inviteCode || ""}
                        </p>
                    </div>
                    <CopyToClipboard text={userDataSource.$.inviteCode || ""} onCopy={this.copyInviteCode}>
                        <div style={this.style.copyLink}>
                            点击复制
                        </div>
                    </CopyToClipboard>
                </If>
            </div>
            {dialog}
        </div>
    }
}


@observer
class InvitationRank extends React.Component<any, any> {
    style = {
        box: {
            border: "1px solid #6a6a6a",
            width: "365px",
            height: "386px",
            borderRadius: "5px",
            marginRight: "18px",
            padding: "10px 16px 32px"
        },
        rankTitle: {
            textAlign: "center"
        },
        listHead: {
            fontSize: "14px",
            color: "#979797",
            display: "flex",
            textAlign: "center"
        },
        firstColumn: {
            width: "80px",
            height: "27px"
        },

        secondColumn: {
            width: "150px"
        },
        thirdColumn:{
            width:"96px"
        }
    };

    componentDidMount() {
        invitationRankDataSource.setNotifyResult(this.props.notifyResult2);
        invitationRankDataSource.request();
    }

    render() {
        let rankFirstColumn;
        return <div style={this.style.box}>
            <div style={this.style.rankTitle}>
                <img src="/images/activity/paihang.png" alt=""/>
            </div>
            <div>
                <ul className="invitation-list">
                    <li style={this.style.listHead}>
                        <div style={this.style.firstColumn}>
                            排行
                        </div>
                        <div style={this.style.secondColumn}>
                            会员名称
                        </div>

                        <div style={this.style.thirdColumn}>
                            邀请人数
                        </div>
                    </li>
                    {invitationRankDataSource.$.length?invitationRankDataSource.$.slice(0,10).map((ele, index) => {
                        if (index === 0) {
                            rankFirstColumn = <img src="/images/activity/cup1.png" alt=""/>;
                        } else if (index === 1) {
                            rankFirstColumn = <img src="/images/activity/cup2.png" alt=""/>;
                        } else if (index === 2) {
                            rankFirstColumn = <img src="/images/activity/cup3.png" alt=""/>;
                        } else {
                            rankFirstColumn = index + 1;
                        }
                        return <li key={index}>
                            <div style={this.style.firstColumn}>
                                {rankFirstColumn}
                            </div>
                            <div style={this.style.secondColumn}>
                                {ele.a}
                            </div>
                            <div style={this.style.thirdColumn}>
                                {ele.b}
                            </div>
                        </li>
                    }):<li key={-1}>
                        <div className="no-data">
                            暂无内容
                        </div>
                    </li>}
                </ul>
            </div>
        </div>
    }
}


@observer
export default class InvitationView extends React.Component<any, any> {
    style = {
        container: {
            width: "1134px",
            color: "#fff",
            margin: "0 auto"
        },
        registerSum: {
            fontSize: 20,
            marginRight: "78px"
        },
        registerNum: {
            display: "inline-block",
            backgroundColor: "#FBC228",
            color: "#161a38",
            padding: "3px",
            borderRadius: "5px",
            fontWeight: "bold",
            margin: "0 10px"
        },
        myPrize: {
            width: "123px",
            height: "35px",
            lineHeight: "35px",
            backgroundColor: "#EC302E",
            textAlign: "center",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            color:"#fff"
        },
        arrow: {
            marginLeft: "5px"
        },
        paddingTop: {
            paddingTop: "35px"
        }
    };

    componentDidMount() {
        registratersDataSource.setNotifyResult(this.props.notifyResult1);
        registratersDataSource.request();
    }

    render() {

        return <div style={this.style.container}>
            <div className="flex-start-center">
                <div style={this.style.registerSum}>
                    成功注册人数<span style={this.style.registerNum as any}>{registratersDataSource.$[0]||0}</span>人
                </div>
                <div>
                    <Link to={MyPrizesPage.path}>
                        <div style={this.style.myPrize} className="my-prize">
                            我的奖品<img src="/images/activity/arrow.png" alt="" style={this.style.arrow}/>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="flex-start-center" style={this.style.paddingTop}>
                <InvitationWay title="邀请方式一" content="复制专属链接，分享给您的好友。好友通过专属链接成功注册小牛数据，您即可累积邀请人数。"/>
                <InvitationWay title="邀请方式二" content="复制专属邀请码，分享给您的好友。好友在小牛数据网站注册时输入专属邀请码，您即可累积邀请人数。"/>
                <InvitationRank notifyResult2={this.props.notifyResult2}/>
            </div>
        </div>
    }
}