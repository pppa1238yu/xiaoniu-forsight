import * as React from "react";
import {observer} from "mobx-react";
import {runInAction} from "mobx";
import {RouteComponentProps} from "react-router";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import Avatar from "material-ui/Avatar";
import Dialog from "material-ui/Dialog";
import {
    blue400,
    cyanA200,
    greenA200,
    grey500,
    grey600,
    lightBlue500,
    red500,
    yellow600
} from "material-ui/styles/colors";

import {barInteraction} from "../../components/bar/BarInteraction";
import TextField from "material-ui/TextField";
import CircularProgress from "material-ui/CircularProgress";
import {default as Constants, Util} from "../../Constants";
import {
    bindPhoneService,
    bindPhoneSmsService, changePhoneService, changePhoneSmsService,
    modifyPasswordService,
    unbindWechatService
} from "../../model/ajax/Account";
import {userDataSource} from "../../model/ajax/UserService";
import {FixLoading} from "../../components/common/Loading";
import {
    wechatBindSubmitService,
    wechatQrcodeService,
    wechatScanResultService
} from "../../model/ajax/WechatLoginService";
import {Http} from "../../model/ajax/Http";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
declare let __user_info__;
const dialogRight4Desktop = {
    right: -Constants.drawerWidth / 2,
};

export default class AccountSettingPage extends React.Component<RouteComponentProps<any>, any> {
    static path = '/account/setting';
    static title = '帐号设置';

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
    };

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = AccountSettingPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.custom = false;
        runInAction(() => {
            bindPhoneService.setMount(false);
            bindPhoneSmsService.setMount(false);
            modifyPasswordService.setMount(false);
            changePhoneService.setMount(false);
            changePhoneSmsService.setMount(false);
            unbindWechatService.setMount(false);
        });
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        bindPhoneService.setMount(true);
        bindPhoneSmsService.setMount(true);
        modifyPasswordService.setMount(true);
        changePhoneService.setMount(true);
        changePhoneSmsService.setMount(true);
        unbindWechatService.setMount(true);
    }

    render() {
        const small = Util.small(this.widthNotifier.device);
        const middleDown = Util.middleDown(this.widthNotifier.device);

        let content = null;
        if (small) {
            content = <AccountSettingPage4Mobile/>
        } else if (middleDown) {
            content = <AccountSettingPage4Tablet/>
        } else {
            content = <AccountSettingPage4Desktop/>
        }
        return (
            <div style={this.styles.container as any}>
                {content}
            </div>
        );
    }
}

@observer
class ChangeBindDialog extends React.Component<any, any> {

    styles = {
        dialog: {
            width: '100%',
            maxWidth: 'none',
        },
        dialogSmall: {
            maxWidth: 420
        },
        bodyStyle: {},
        root: {
            paddingTop: 0,
        },
        list: {
            minHeight: 700,
        },
        radioButton: {
            paddingTop: 16,
        },
        fetch: {
            marginTop: 28
        },
        fetchText: {
            fontSize: 16,
        },
        sms: {
            flexGrow: 1,
        }
    };

    userName;
    password;
    smsCode;

    restore() {
        this.userName = '';
        this.smsCode = '';
        this.password = '';
    }

    mount = true;

    componentWillUnmount() {
        this.mount = false;
    }

    componentWillMount() {
        this.restore();
        changePhoneService.clear();
        changePhoneSmsService.clear();
        //don't need reset service, do by parent when mount
    }

    onKeyPress = (event) => {
        if (event.charCode != 13) {
            return;
        }

        this.onEnterPress();
    };

    onEnterPress = () => {
        runInAction(() => {
            changePhoneSmsService.clear();

            changePhoneService.doUpdate();
            changePhoneService.setValue(
                this.userName, this.password, this.smsCode);
            if (changePhoneService.hasErr()) {
                return;
            }
            changePhoneService.request(
                () => {
                    if (!changePhoneService.hasErr() && !changePhoneService.error && this.mount) {
                        this.props.handleClose();
                    }
                }
            );
        });
    };

    render() {
        changePhoneService.registerUpdate();
        changePhoneSmsService.registerUpdate();

        const fetch = changePhoneSmsService.count == 0;
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="确认"
                primary={true}
                onTouchTap={
                    (event) => {
                        event.preventDefault();

                        this.onEnterPress();
                    }
                }
            />,
        ];

        let dialogStyle: any = this.styles.dialog;
        if (this.props.fixDrawer) {
            dialogStyle = (Object as any).assign({}, this.styles.dialogSmall, dialogRight4Desktop);
        } else if (!this.props.small) {
            dialogStyle = this.styles.dialogSmall;
        }
        return (
            <div>
                <Dialog
                    title={this.props.title}
                    actions={actions}
                    modal
                    open={this.props.open}
                    onRequestClose={this.props.handleClose}
                    contentStyle={dialogStyle}
                    style={this.styles.root}
                    autoScrollBodyContent={true}
                    bodyStyle={this.styles.bodyStyle}
                    autoDetectWindowHeight
                >
                    <TextField
                        floatingLabelText="请输入手机号码"
                        fullWidth
                        onChange={
                            (event, value) => {
                                this.userName = value;
                                runInAction(() => {
                                    changePhoneService.clearUserNameErr();
                                    changePhoneSmsService.clearUserNameErr();
                                });
                            }
                        }
                        errorText={changePhoneService.userNameErr || changePhoneSmsService.userNameErr}
                        onKeyPress={this.onKeyPress}
                    />
                    <TextField
                        floatingLabelText="请输入密码"
                        fullWidth
                        onChange={
                            (event, value) => {
                                this.password = value;
                                runInAction(() => {
                                    changePhoneService.clearPasswordErr();
                                });
                            }
                        }
                        errorText={changePhoneService.passwordErr}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />
                    <div className="flex-start">
                        <div style={this.styles.sms}>
                            <TextField
                                floatingLabelText="请输入手机验证码"
                                fullWidth
                                onChange={
                                    (event, value) => {
                                        this.smsCode = value;
                                        runInAction(() => {
                                            changePhoneService.clearSmsCodeErr();
                                        });
                                    }
                                }
                                errorText={changePhoneService.smsCodeErr}
                                onKeyPress={this.onKeyPress}
                            />
                        </div>
                        <div>
                            <FlatButton label={
                                fetch ? '获取' : '' + (changePhoneSmsService.count)
                            }
                                        style={this.styles.fetch}
                                        labelStyle={this.styles.fetchText}
                                        disabled={!fetch}
                                        onTouchTap={
                                            (event) => {
                                                event.preventDefault();


                                                runInAction(() => {
                                                    changePhoneService.clear();

                                                    changePhoneSmsService.doUpdate();
                                                    changePhoneSmsService.setValue(this.userName);
                                                    if (changePhoneSmsService.hasErr()) {
                                                        return;
                                                    }
                                                    changePhoneSmsService.request();
                                                });

                                            }
                                        }/>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

@observer
class PhoneBindDialog extends React.Component<any, any> {

    styles = {
        dialog: {
            width: '100%',
            maxWidth: 'none',
        },
        dialogSmall: {
            maxWidth: 420
        },
        bodyStyle: {},
        root: {
            paddingTop: 0,
        },
        list: {
            minHeight: 600,
        },
        radioButton: {
            paddingTop: 16,
        },
        fetch: {
            marginTop: 28
        },
        fetchText: {
            fontSize: 16,
        },
        sms: {
            flexGrow: 1,
        }
    };

    userName;
    smsCode;

    restore() {
        this.userName = '';
        this.smsCode = '';
    }

    mount = true;

    componentWillUnmount() {
        this.mount = false;
    }

    componentWillMount() {
        this.restore();
        bindPhoneService.clear();
        bindPhoneSmsService.clear();
        //don't need reset service, do by parent when mount
    }

    onKeyPress = (event) => {
        if (event.charCode != 13) {
            return;
        }

        this.onEnterPress();
    };

    onEnterPress = () => {
        runInAction(() => {
            bindPhoneSmsService.clear();

            bindPhoneService.doUpdate();
            bindPhoneService.setValue(
                this.userName, "nothing", this.smsCode);
            if (bindPhoneService.hasErr()) {
                return;
            }
            bindPhoneService.request(
                () => {
                    if (!bindPhoneService.hasErr() && !bindPhoneService.error && this.mount) {
                        this.props.handleClose();
                    }
                }
            );
        });
    };

    render() {
        bindPhoneService.registerUpdate();
        bindPhoneSmsService.registerUpdate();

        const fetch = bindPhoneSmsService.count == 0;
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="确认"
                primary={true}
                onTouchTap={
                    (event) => {
                        event.preventDefault();

                        this.onEnterPress();
                    }
                }
            />,
        ];

        let dialogStyle: any = this.styles.dialog;
        if (this.props.fixDrawer) {
            dialogStyle = (Object as any).assign({}, this.styles.dialogSmall, dialogRight4Desktop);
        } else if (!this.props.small) {
            dialogStyle = this.styles.dialogSmall;
        }
        return (
            <div>
                <Dialog
                    title={this.props.title}
                    actions={actions}
                    modal
                    open={this.props.open}
                    onRequestClose={this.props.handleClose}
                    contentStyle={dialogStyle}
                    style={this.styles.root}
                    autoScrollBodyContent={true}
                    bodyStyle={this.styles.bodyStyle}
                    autoDetectWindowHeight
                >
                    <TextField
                        floatingLabelText="请输入手机号码"
                        fullWidth
                        onChange={
                            (event, value) => {
                                this.userName = value;
                                runInAction(() => {
                                    bindPhoneService.clearUserNameErr();
                                    bindPhoneSmsService.clearUserNameErr();
                                });
                            }
                        }
                        errorText={bindPhoneService.userNameErr || bindPhoneSmsService.userNameErr}
                        onKeyPress={this.onKeyPress}
                    />
                    <div className="flex-start">
                        <div style={this.styles.sms}>
                            <TextField
                                floatingLabelText="请输入手机验证码"
                                fullWidth
                                onChange={
                                    (event, value) => {
                                        this.smsCode = value;
                                        bindPhoneService.clearSmsCodeErr();
                                    }
                                }
                                errorText={bindPhoneService.smsCodeErr}
                                onKeyPress={this.onKeyPress}
                            />
                        </div>
                        <div>
                            <FlatButton label={
                                fetch ? '获取' : '' + (bindPhoneSmsService.count)
                            }
                                        style={this.styles.fetch}
                                        labelStyle={this.styles.fetchText}
                                        disabled={!fetch}
                                        onTouchTap={
                                            (event) => {
                                                event.preventDefault();


                                                runInAction(() => {
                                                    bindPhoneService.clear();

                                                    bindPhoneSmsService.doUpdate();
                                                    bindPhoneSmsService.setValue(this.userName);
                                                    if (bindPhoneSmsService.hasErr()) {
                                                        return;
                                                    }
                                                    bindPhoneSmsService.request();
                                                });

                                            }
                                        }/>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

@observer
class PhoneBindView extends React.Component<any, any> {
    styles = {
        header: {
            /*
             display: "inline-block",
             width: 'none',
             */
            padding: 0,
        },
        headerContainer: {},
        buttonContainer: {
            paddingTop: 12,

        },
        buttonLabel: {
            fontSize: 16,
            color: 'white'
        },
        unbindLabel: {
            fontSize: 16,
            color: 'black',
        },
        dialog: {
            width: '100%',
            maxWidth: 'none',
        },
        dialogSmall: {
            maxWidth: 420,
        },
        bodyStyle: {
            position: 'relative',
        },
        root: {
            paddingTop: 0,
        },
        qrContainer: {
            position: 'relative',
            textAlign: 'center',
        },
        qrFooter: {
            textAlign: 'center',
        },
        dialogQrCode: {
            width: '100%',
            maxWidth: 'none',
        },
        qrcode: {
            position: 'relative',
            width: 220,
            height: 220,
            left: 0,
        },
    };

    service = null;

    componentWillMount() {
        changePhoneService.reset();
        changePhoneSmsService.reset();
        bindPhoneService.reset();
        bindPhoneSmsService.reset();

        this.setService(this.props.bindPhone);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.bindPhone != nextProps.bindPhone) {
            if (this.props.bindWechat) {
                bindPhoneService.reset();
                bindPhoneSmsService.reset();
            } else {
                changePhoneSmsService.reset();
                changePhoneService.reset();
            }
            this.setState(
                {
                    open: false,
                }
            );
            this.setService(nextProps.bindPhone);
        }
    }

    setService(bindPhone) {
        if (bindPhone) {
            this.service = changePhoneService;
        } else {
            this.service = bindPhoneService;
        }
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
        };
    }

    handleClose = () => {
        this.setState(
            {open: false}
        );
    };

    openDialog = (event) => {
        event.preventDefault();
        this.setState(
            {open: true}
        );
    };


    render() {
        this.service.registerUpdate();

        let button = null;
        let dialog = null;
        const loading = bindPhoneSmsService.loading ||
        changePhoneSmsService.loading ||
        this.service.loading ? <FixLoading zIndex={2000}/> : null;
        if (this.props.bindPhone) {
            button = (
                <RaisedButton
                    primary
                    label={
                        <span>
                                <span style={this.styles.buttonLabel}>{userDataSource.$.telePhone}</span>
                                <span style={this.styles.unbindLabel}>（更改手机）</span>
                            </span>
                    }
                    fullWidth
                    onTouchTap={
                        this.openDialog
                    }
                />
            );

            dialog = this.state.open ? (
                <ChangeBindDialog
                    title="更改绑定手机"
                    open={this.state.open}
                    handleClose={this.handleClose}
                    small={this.props.small}
                    fixDrawer={this.props.fixDrawer}
                />
            ) : null;

        } else {
            button = (
                <RaisedButton
                    primary
                    label={
                        <span style={this.styles.buttonLabel}>
                            绑定手机
                        </span>
                    }
                    fullWidth
                    onTouchTap={
                        this.openDialog
                    }
                />
            );

            dialog = this.state.open ? (
                <PhoneBindDialog
                    title="绑定手机"
                    open={this.state.open}
                    handleClose={this.handleClose}
                    small={this.props.small}
                    fixDrawer={this.props.fixDrawer}
                />
            ) : null;
        }
        return (
            <div>
                <div style={this.styles.headerContainer}>
                    <Subheader style={this.styles.header}>手机</Subheader>
                </div>
                <Divider/>
                <div role="bindPhoneButtonParent" style={this.styles.buttonContainer}>
                    {button}
                </div>
                {dialog}
                {loading}
            </div>
        );
    }

}

@observer
class InviteCode extends React.Component<any, any> {

    state = {
        open: false
    };
    styles = {
        headerContainer: {},
        header: {
            /*
             display: "inline-block",
             width: 'none',
             */
            padding: 0,
        },
        buttonContainer: {
            paddingTop: 12,

        },
        unbindLabel: {
            fontSize: 16,
            color: 'black',
        },
        buttonLabel: {
            fontSize: 16,
            color: 'white'
        },
        dialogStyle: {
            maxWidth: 400
        }
    };

    handleClose = () => {
        this.setState(
            {open: false}
        );
    };

    handleOpen = () => {
        this.setState(
            {open: true}
        )
    };

    copyInviteCode = () => {
        this.handleOpen();
    };

    render() {
        // 设置验证码复制按钮
        let button = (
            <CopyToClipboard
                text={window.location.protocol + '//' + Constants.remoteHost + "/index.htm#/login#inviteCode=" + (this.props.inviteCode || '-')}
                onCopy={this.copyInviteCode}>
                <RaisedButton
                    label={
                        <span>
                            <span style={this.styles.buttonLabel}>{this.props.inviteCode || '-'}</span>
                            <span style={this.styles.unbindLabel}>(复制邀请链接)</span>
                        </span>
                    }
                    primary
                    fullWidth
                />
            </CopyToClipboard>
        );
        let dialog = (
            <Dialog
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                contentStyle={this.styles.dialogStyle}
                autoDetectWindowHeight
            >
                复制成功
            </Dialog>
        );

        return (
            <div>
                <div style={this.styles.headerContainer}>
                    <Subheader style={this.styles.header}>邀请码</Subheader>
                </div>
                <Divider/>
                <div style={this.styles.buttonContainer}>
                    {button}
                </div>
                {dialog}
            </div>
        )
    }
}

@observer
class SocialView extends React.Component<any, any> {
    styles = {
        header: {
            /*
             display: "inline-block",
             width: 'none',
             */
            padding: 0,
        },
        headerContainer: {},
        buttonContainer: {
            paddingTop: 12,

        },
        buttonLabel: {
            fontSize: 16,
            color: 'white'
        },
        unbindLabel: {
            fontSize: 16,
            color: 'black',
        },
        dialog: {
            width: '100%',
            maxWidth: 'none',
        },
        dialogSmall: {
            maxWidth: 420
        },
        bodyStyle: {
            position: 'relative',
        },
        root: {
            paddingTop: 0,
        },
        qrContainer: {
            position: 'relative',
            textAlign: 'center',
        },
        qrFooter: {
            textAlign: 'center',
        },
        dialogQrCode: {
            width: '100%',
            maxWidth: 'none',
        },
        qrcode: {
            position: 'relative',
            width: 220,
            height: 220,
            left: 0,
        },
    };

    componentWillMount() {
        unbindWechatService.reset();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.bindWechat != nextProps.bindWechat) {
            if (this.props.bindWechat) {
                //TODO add bind wechat service
            } else {
                unbindWechatService.reset();
            }
            this.setState(
                {
                    open: false,
                }
            );
        }
    }

    registerUpdate() {
        if (this.props.bindWechat) {
            //TODO add bind wechat service
        } else {
            unbindWechatService.registerUpdate();
        }
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
        };
    }

    handleClose = () => {
        wechatScanResultService.stopFresh();
        this.setState(
            {open: false}
        );
    };

    openDialog = (event) => {
        event.preventDefault();
        if (!this.props.bindWechat) {
            wechatQrcodeService.reset();
            wechatQrcodeService.refresh();
            wechatScanResultService.reset();
            wechatScanResultService.startFresh(() => this.handleClose(), wechatBindSubmitService);
        }
        this.setState(
            {open: true}
        );
    };


    render() {
        this.registerUpdate();

        let button = null;
        let dialog = null;
        let loading = null;
        if (this.props.bindWechat) {
            button = (
                <RaisedButton
                    label={
                        <span>
                                <span style={this.styles.buttonLabel}>{userDataSource.$.wechatName}</span>
                                <span style={this.styles.unbindLabel}>（解绑）</span>
                            </span>
                    }
                    backgroundColor="rgb(100, 171, 35)"
                    icon={
                        <Avatar src="/images/wechat1.svg"
                                size={26}
                                backgroundColor={red500}/>
                    }
                    fullWidth
                    onTouchTap={
                        this.openDialog
                    }
                />
            );

            const actions = [
                <FlatButton
                    label="取消"
                    primary={true}
                    onTouchTap={this.handleClose}
                />,
                <FlatButton
                    label="解绑"
                    primary={true}
                    onTouchTap={
                        (event) => {
                            event.preventDefault();
                            unbindWechatService.request(() => this.handleClose());
                        }
                    }
                />,
            ];

            let dialogStyle: any = {};
            if (this.props.fixDrawer) {
                dialogStyle = (Object as any).assign({}, this.styles.dialogSmall, dialogRight4Desktop);
            } else if (!this.props.small) {
                dialogStyle = this.styles.dialogSmall;
            }

            dialog = (
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    contentStyle={dialogStyle}
                    onRequestClose={this.handleClose}
                    style={this.styles.root}
                    autoScrollBodyContent={true}
                    bodyStyle={this.styles.bodyStyle}
                    autoDetectWindowHeight
                >
                    解绑微信？
                </Dialog>
            );

            loading = unbindWechatService.loading ? <FixLoading zIndex={2000}/> : null;
        } else {
            button = (
                <RaisedButton
                    label={
                        <span style={this.styles.buttonLabel}>
                            绑定微信
                        </span>
                    }
                    backgroundColor="rgb(100, 171, 35)"
                    icon={
                        <Avatar src="/images/wechat1.svg"
                                size={26}
                                backgroundColor={red500}/>
                    }
                    fullWidth
                    onTouchTap={
                        this.openDialog
                    }
                />
            );

            const actions = [
                <FlatButton
                    label="取消"
                    primary={true}
                    onTouchTap={this.handleClose}
                />,
            ];

            let dialogStyle: any = this.styles.dialogQrCode;
            if (this.props.fixDrawer) {
                dialogStyle = (Object as any).assign({}, this.styles.dialogSmall, dialogRight4Desktop);
            } else if (!this.props.small) {
                dialogStyle = this.styles.dialogSmall;
            }
            dialog = (
                <Dialog
                    actions={actions}
                    modal
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    contentStyle={dialogStyle}
                    style={this.styles.root}
                    autoScrollBodyContent={true}
                    bodyStyle={this.styles.bodyStyle}
                    autoDetectWindowHeight
                >
                    {wechatQrcodeService.loading || !wechatQrcodeService.$ ?
                        <div className="qrcode center-align">
                            <CircularProgress size={60} thickness={2} color="gray"/>
                        </div>
                        :
                        <div>
                            <div style={this.styles.qrContainer as any}>
                                <img className="qrcode"
                                     src={Http.BASE_URL + wechatQrcodeService.uri + "?" + Math.random()}
                                     style={this.styles.qrcode as any}/>

                            </div>
                            <div style={this.styles.qrFooter}>
                                <img src="/images/qrcode-flow.png"/>
                            </div>
                        </div>}
                </Dialog>
            );
        }
        return (
            <div>
                <div style={this.styles.headerContainer}>
                    <Subheader style={this.styles.header}>社交帐号</Subheader>
                </div>
                <Divider/>
                <div role="wechatButtonParent" style={this.styles.buttonContainer}>
                    {button}
                </div>
                {dialog}
                {loading}
            </div>
        );
    }

}

@observer
class ModifyPasswordDialog extends React.Component<any, any> {

    styles = {
        dialog: {
            width: '100%',
            maxWidth: 'none',
        },
        dialogSmall: {
            maxWidth: 420
        },
        bodyStyle: {},
        root: {
            paddingTop: 0,
        },
        list: {
            minHeight: 600,
        },
        radioButton: {
            paddingTop: 16,
        },
    };

    oldPassword;
    password;
    confirmPassword;

    restore() {
        this.oldPassword = '';
        this.password = '';
        this.confirmPassword = '';
    }

    mount = true;

    componentWillUnmount() {
        this.mount = false;
    }

    componentWillMount() {
        this.restore();
        modifyPasswordService.reset();
    }

    onKeyPress = (event) => {
        if (event.charCode != 13) {
            return;
        }

        this.onEnterPress();
    };

    onEnterPress = () => {
        runInAction(() => {

            modifyPasswordService.doUpdate();
            modifyPasswordService.setValue(
                this.oldPassword, this.password, this.confirmPassword);
            if (modifyPasswordService.hasErr()) {
                return;
            }
            modifyPasswordService.request(
                () => {
                    if (!modifyPasswordService.hasErr() && !modifyPasswordService.error && this.mount) {
                        this.props.handleClose();
                    }
                }
            );
        });
    };

    render() {
        modifyPasswordService.registerUpdate();
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="确认"
                primary={true}
                onTouchTap={
                    (event) => {
                        event.preventDefault();

                        this.onEnterPress();
                    }
                }
            />,
        ];

        let dialogStyle: any = this.styles.dialog;
        if (this.props.fixDrawer) {
            dialogStyle = (Object as any).assign({}, this.styles.dialogSmall, dialogRight4Desktop);
        } else if (!this.props.small) {
            dialogStyle = this.styles.dialogSmall;
        }
        return (
            <div>
                <Dialog
                    title={this.props.title}
                    actions={actions}
                    modal
                    open={this.props.open}
                    onRequestClose={this.props.handleClose}
                    contentStyle={dialogStyle}
                    style={this.styles.root}
                    autoScrollBodyContent={true}
                    bodyStyle={this.styles.bodyStyle}
                    autoDetectWindowHeight
                >
                    <TextField
                        floatingLabelText="请输入旧密码"
                        fullWidth
                        onChange={
                            (event, value) => {
                                this.oldPassword = value;
                                modifyPasswordService.clearOldPasswordErr();
                            }
                        }
                        errorText={modifyPasswordService.oldPasswordErr}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />
                    <TextField
                        floatingLabelText="请输入新密码"
                        fullWidth
                        onChange={
                            (event, value) => {
                                this.password = value;
                                modifyPasswordService.clearPasswordErr();
                            }
                        }
                        errorText={modifyPasswordService.passwordErr}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />
                    <TextField
                        floatingLabelText="再次确认新密码"
                        fullWidth
                        onChange={
                            (event, value) => {
                                this.confirmPassword = value;
                                modifyPasswordService.clearConfirmPasswordErr();
                            }
                        }
                        errorText={modifyPasswordService.confirmPasswordErr}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />
                </Dialog>
            </div>
        );
    }
}

@observer
class ModifyPasswordView extends React.Component<any, any> {
    styles = {
        header: {
            /*
             display: "inline-block",
             width: 'none',
             */
            padding: 0,
        },
        headerContainer: {},
        buttonContainer: {
            paddingTop: 12,

        },
        buttonLabel: {
            fontSize: 16,
        }
    };


    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
        };
    }

    handleClose = () => {
        this.setState(
            {open: false}
        );
    };

    openDialog = (event) => {
        event.preventDefault();
        this.setState(
            {open: true}
        );
    };

    render() {
        const dialog = this.state.open ?
            <ModifyPasswordDialog
                title="修改密码"
                open={this.state.open}
                handleClose={this.handleClose}
                small={this.props.small}
                fixDrawer={this.props.fixDrawer}
            /> : null;

        let loading = modifyPasswordService.loading ? <FixLoading zIndex={2000}/> : null;
        return (
            <div>
                <div style={this.styles.headerContainer}>
                    <Subheader style={this.styles.header}>帐号密码</Subheader>
                </div>
                <Divider/>
                <div style={this.styles.buttonContainer} role="passwordButtonParent">
                    <RaisedButton
                        label="修改密码"
                        labelStyle={this.styles.buttonLabel}
                        primary
                        onTouchTap={this.openDialog}
                        fullWidth/>
                </div>
                {loading}
                {dialog}
            </div>
        );
    }
}

@observer
class AccountSettingPage4Desktop extends React.Component<any, any> {
    styles = {
        viewContainer: {
            paddingTop: 16,
        },
        container: {
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        before: {
            minHeight: 30,
            flexGrow: 2,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        content: {
            position: 'relative',
            width: 450,
            minHeight: 500,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
        },
        root: {
            paddingTop: 32,
            paddingBottom: 36,
            paddingLeft: 40,
            paddingRight: 40,
            flexGrow: 1,
        },
    };

    render() {
        userDataSource.registerUpdate();
        let inviteCode = userDataSource.$.inviteCode || '-';
        let modifyPasswordView = null;
        if (userDataSource.$.hasTelePhone) {
            modifyPasswordView = (
                <div style={this.styles.viewContainer}>
                    <ModifyPasswordView
                        fixDrawer/>
                </div>
            );
        }

        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <div style={this.styles.content as any}>
                    <Paper style={this.styles.root}>
                        {modifyPasswordView}
                        {/*<div style={this.styles.viewContainer}>*/}
                            {/*<SocialView bindWechat={userDataSource.$.hasWechat}*/}
                                        {/*fixDrawer/>*/}
                        {/*</div>*/}
                        <div style={this.styles.viewContainer}>
                            <PhoneBindView bindPhone={userDataSource.$.hasTelePhone}
                                           fixDrawer/>
                        </div>
                        <div style={this.styles.viewContainer}>
                            <InviteCode inviteCode={inviteCode}/>
                        </div>
                    </Paper>
                </div>
                <div style={this.styles.after}/>
                <div style={this.styles.after}/>
                <div style={this.styles.after}/>
            </div>
        );
    }
}

@observer
class AccountSettingPage4Tablet extends React.Component<any, any> {
    styles = {
        viewContainer: {
            paddingTop: 16,
        },
        container: {
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        before: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        content: {
            position: 'relative',
            width: 450,
            minHeight: 500,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
        },
        root: {
            paddingTop: 32,
            paddingBottom: 36,
            paddingLeft: 40,
            paddingRight: 40,
            flexGrow: 1,
        },
    };

    render() {
        userDataSource.registerUpdate();
        let inviteCode = userDataSource.$.inviteCode || '-';
        let modifyPasswordView = null;
        if (userDataSource.$.hasTelePhone) {
            modifyPasswordView = (
                <div style={this.styles.viewContainer}>
                    <ModifyPasswordView/>
                </div>
            );
        }

        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <div style={this.styles.content as any}>
                    <Paper style={this.styles.root}>
                        {modifyPasswordView}
                        {/*<div style={this.styles.viewContainer}>*/}
                            {/*<SocialView bindWechat={userDataSource.$.hasWechat}/>*/}
                        {/*</div>*/}
                        <div style={this.styles.viewContainer}>
                            <PhoneBindView bindPhone={userDataSource.$.hasTelePhone}/>
                        </div>
                        <div style={this.styles.viewContainer}>
                            <InviteCode inviteCode={inviteCode}/>
                        </div>
                    </Paper>
                </div>
                <div style={this.styles.after}/>
            </div>
        );
    }
}

@observer
class AccountSettingPage4Mobile extends React.Component<any, any> {
    styles = {
        root: {
            paddingBottom: 20,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 14,
            flexGrow: 1,
        },
        viewContainer: {
            paddingTop: 16,
        },
        space: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        },
    };

    render() {
        userDataSource.registerUpdate();

        let inviteCode = userDataSource.$.inviteCode || '-';
        let modifyPasswordView = null;
        if (userDataSource.$.hasTelePhone) {
            modifyPasswordView = (
                <div style={this.styles.viewContainer}>
                    <ModifyPasswordView small/>
                </div>
            );
        }

        return (
            <Paper style={this.styles.root}>
                {modifyPasswordView}
                {/*<div style={this.styles.viewContainer}>*/}
                    {/*<SocialView bindWechat={userDataSource.$.hasWechat}*/}
                                {/*small/>*/}
                {/*</div>*/}
                <div style={this.styles.viewContainer}>
                    <PhoneBindView bindPhone={userDataSource.$.hasTelePhone}
                                   small/>
                </div>
                <div style={this.styles.viewContainer}>
                    <InviteCode inviteCode={inviteCode}/>
                </div>
            </Paper>
        );
    }
}
