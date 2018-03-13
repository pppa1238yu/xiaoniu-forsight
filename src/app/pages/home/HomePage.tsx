import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Tab, Tabs} from "material-ui/Tabs";
import Constants, {Util} from "../../Constants";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import {blue400, greenA200, grey500, grey600, red500, yellow600} from "material-ui/styles/colors";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import {loginService, registerService, resetPasswordService, smsService} from "../../model/ajax/Login";
import {observer} from "mobx-react";
import Divider from "material-ui/Divider";
import SmartPhone from "material-ui/svg-icons/hardware/smartphone";
import Create from "material-ui/svg-icons/content/create";
import Avatar from "material-ui/Avatar";
import Dialog from 'material-ui/Dialog';
import {observable, runInAction} from "mobx";
import {FixLoading} from "../../components/common/Loading";
import CircularProgress from "material-ui/CircularProgress";
import {wechatQrcodeService, wechatScanResultService} from "../../model/ajax/WechatLoginService";
import {Http} from "../../model/ajax/Http";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import AboutUs from "../extra/AboutUs";
import Report from "../extra/Report";
import JoinUs from "../extra/JoinUs";
import Helps from "../extra/Helps";
import ContactUs from "../extra/ContactUs";
import UserText  from "./UserText";
import {tipManager} from "../../model/state/TipManager";
declare let $;

enum LoginState {
    LOGIN,
    REGISTER,
    FORGET,
}

@observer
class HomePage4MobileRegisterOrReset extends React.Component<any, any> {
    styles = {
        sign: {
            paddingTop: 16,
            paddingBottom: 0,
            fontSize: 24,
            fontWeight: 400,
            lineHeight: '32px',
            margin: 0,
        },
        subSign: {
            paddingTop: 1,
            paddingBottom: 3,
            margin: 0,
        },
        form: {
            paddingTop: 18,
            paddingBottom: 12,
        },
        confirm: {
            display: 'flex',
        },
        aggreContactDiv: {
            display: 'flex',
            fontSize: 12
        },
        aggreContact: {
            color: "-webkit-link",
            cursor: "auto",
            textDecoration: "underline"
        },
        registerConfirm: {
            paddingTop: 12,
            display: 'flex',
        },
        loginText: {
            fontSize: 18,
        },

        moreText: {
            color: red500,
            padding: 0,
        },
        more: {
            textAlign: 'left',
            minWidth: 'none',
        },
        fetch: {
            marginTop: 28
        },
        fetchText: {
            fontSize: 16,
        },
        sms: {
            flexGrow: 1,
        },
        userText: {
            width: '100%',
            paddingTop: '20px',
            paddingBottom: '10px'
        },
        linkUserText: {
            color: '#0293ff'
        },
        userTextStyle: {
            color: '#717171',
            fontSize: 14
        }
    };

    state = {
        disabled: true,
        open: false,
        inviteCode: ''
    };

    userName;
    password;
    smsCode;
    service;

    componentWillUnmount() {
        smsService.clearTimer();
        tipManager.hidden();
    }

    restore() {
        this.userName = '';
        this.password = '';
        this.smsCode = '';
        this.setState({
            inviteCode: ''
        })
    }

    setService(role: LoginState) {
        if (role == LoginState.REGISTER) {
            smsService.register = true;
            this.service = registerService;
        } else {
            smsService.register = false;
            this.service = resetPasswordService;
        }
        this.service.redirectToLogin = () => {
            this.props.onStateChange(LoginState.LOGIN);
        };
    }

    componentWillMount() {
        this.restore();
        this.setService(this.props.role);
        this.service.reset();
        smsService.reset();
        let hash = location.hash;
        if (hash.indexOf('#inviteCode') != -1) {
            this.setState({
                inviteCode: hash.split('#inviteCode=')[1]
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.role != this.props.role) {
            //this.restore();
            this.setService(nextProps.role);
            this.service.reset();
            smsService.reset();
        }
    }

    onKeyPress = (event) => {
        if (event.charCode != 13) {
            return;
        }

        // this.onEnterPress();
    };

    onEnterPress = () => {
        if(this.userName.indexOf('170') == 0){
            tipManager.showTip('暂不支持170号段');
        }else {
            runInAction(() => {
                smsService.clear();
                this.service.doUpdate();
                this.service.setValue(this.userName,
                    this.password, this.smsCode, this.state.inviteCode);
                if (this.service.hasErr()) {
                    return;
                }
                this.service.request();
            });
        }
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    };

    handleOpen = () => {
        this.setState({
            open: true
        })
    };

    render() {
        const register = this.props.role == LoginState.REGISTER;
        this.service.registerUpdate();
        smsService.registerUpdate();

        const fetch = smsService.count == 0;
        let loading = smsService.loading ||
        this.service.loading ? <FixLoading zIndex={2000}/> : null;
        let header;
        if (register) {
            header = (
                <div>
                    <h1 style={this.styles.sign as any}>注册</h1>
                </div>
            );
        } else {
            header = (
                <div>
                    <h1 style={this.styles.sign as any}>忘记密码</h1>
                </div>
            );
        }
        return (
            <div>
                {loading}
                {header}
                <div style={this.styles.form}>
                    <div>
                        <TextField
                            role="userName"
                            floatingLabelText="手机号码"
                            fullWidth
                            onChange={
                                (event, value) => {
                                    this.userName = value;
                                    runInAction(() => {
                                        this.service.clearUserNameErr();
                                        smsService.clearUserNameErr();
                                    });
                                }
                            }
                            errorText={this.service.userNameErr || smsService.userNameErr}
                            onKeyPress={this.onKeyPress}
                        />
                    </div>
                    <div>
                        <TextField
                            role="passWord"
                            floatingLabelText="输入您的密码（不少于 6 位）"
                            errorText={this.service.passwordErr}
                            fullWidth
                            onChange={
                                (event, value) => {
                                    this.password = value;
                                    this.service.clearPasswordErr();
                                }
                            }
                            type="password"
                            onKeyPress={this.onKeyPress}
                        />
                    </div>
                    <div className="flex-start">
                        <div style={this.styles.sms}>
                            <TextField
                                role="verificationCode"
                                floatingLabelText="请输入手机验证码"
                                errorText={this.service.smsCodeErr}
                                onChange={
                                    (event, value) => {
                                        this.smsCode = value;
                                        this.service.clearSmsCodeErr();
                                    }
                                }
                                fullWidth
                                onKeyPress={this.onKeyPress}
                            />
                        </div>
                        <div>
                            <FlatButton role="verificationCodeGetButton" label={
                                fetch ? '获取' : '' + (smsService.count)
                            }
                                        style={this.styles.fetch}
                                        labelStyle={this.styles.fetchText}
                                        disabled={!fetch}
                                        onTouchTap={
                                            (event) => {
                                                event.preventDefault();
                                                runInAction(() => {
                                                    this.service.clear();
                                                    smsService.doUpdate();
                                                    smsService.setValue(this.userName);
                                                    if (smsService.hasErr()) {
                                                        return;
                                                    }
                                                    smsService.request();
                                                });
                                            }
                                        }/>
                        </div>
                    </div>
                    {
                        register ? <div>
                            <TextField
                                role="inviteCode"
                                floatingLabelText="请输入邀请码 "
                                value={this.state.inviteCode}
                                onChange={
                                    (event, value) => {
                                        this.setState({
                                            inviteCode: value
                                        });
                                    }
                                }
                                fullWidth
                                onKeyPress={this.onKeyPress}
                            />
                        </div> : null
                    }

                </div>
                <div style={this.styles.userText as any}>
                    <input type="checkBox" id="userText" onClick={ () => {
                        let disabled = $('#userText').is(':checked');
                        if (disabled) {
                            this.setState({
                                disabled: false
                            })
                        } else {
                            this.setState({
                                disabled: true
                            })
                        }
                    }}/>
                    <label htmlFor="userText" style={this.styles.userTextStyle}>已阅读并同意相关</label>
                    <span className="linkUserText" onClick={this.handleOpen}>用户协议</span>
                    <Dialog
                        title="用户协议"
                        modal={false}
                        open={this.state.open}
                        autoScrollBodyContent={true}
                        onRequestClose={this.handleClose}
                    >
                        <UserText/>
                    </Dialog>
                </div>
                <div style={this.styles.confirm}>
                    <div role="moreOptionsButton">
                        <IconMenu
                            iconButtonElement={
                                <FlatButton label="更多选项"
                                            labelStyle={this.styles.moreText}
                                            style={this.styles.more}
                                />
                            }
                        >
                            <MenuItem primaryText={register ? "已有帐号" : "返回登录"}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              if (register) {
                                                  this.props.onStateChange(LoginState.LOGIN);
                                              } else {
                                                  this.props.onStateChange(LoginState.LOGIN);
                                              }
                                          }
                                      }/>
                            <MenuItem primaryText={register ? "忘记密码" : "创建帐号"}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              if (register) {
                                                  this.props.onStateChange(LoginState.FORGET);
                                              } else {
                                                  this.props.onStateChange(LoginState.REGISTER);
                                              }
                                          }
                                      }
                            />
                        </IconMenu>
                    </div>
                    <div className="auto-right">
                        <RaisedButton label={register ? "创建一个" : "立即重置"}
                                      role="registerButton"
                                      primary
                                      labelStyle={this.styles.loginText}
                                      backgroundColor={red500}
                                      disabled={this.state.disabled}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              this.onEnterPress();
                                          }
                                      }
                        />
                    </div>
                </div>
            </div>
        );
    }

}

@observer
class HomePage4MobileLogin extends React.Component<any, any> {
    styles = {
        sign: {
            paddingTop: 16,
            paddingBottom: 0,
            fontSize: 24,
            fontWeight: 400,
            lineHeight: '32px',
            margin: 0,
        },
        subSign: {
            paddingTop: 1,
            paddingBottom: 3,
            margin: 0,
        },
        form: {
            paddingTop: 18,
            paddingBottom: 12,
        },
        confirm: {
            display: 'flex',
            paddingTop: 32,
        },
        loginText: {
            fontSize: 18,
        },
        moreText: {
            color: red500,
            padding: 0,
        },
        more: {
            textAlign: 'left',
            minWidth: 'none',
        },
        loginSwitch: {
            display: 'flex',
            paddingTop: 24,
            justifyContent: 'space-between'
        },
        switchButton: {
            fontSize: 12,
            color: 'white'
        },
        divider: {
            marginTop: 16,
        }
    };

    constructor(props, context) {
        super(props, context);
    }

    userName;
    password;

    restore() {
        this.userName = '';
        this.password = '';
    }

    componentWillMount() {
        this.restore();
        loginService.reset();
    }

    onKeyPress = (event) => {
        if (event.charCode != 13) {
            return;
        }

        this.onEnterPress();
    };

    onEnterPress = () => {
        runInAction(() => {
            loginService.doUpdate();
            loginService.setValue(this.userName, this.password);
            if (loginService.hasErr()) {
                return;
            }
            loginService.request();
        });
    };

    render() {
        loginService.registerUpdate();

        let showRaiseButton = null;
        if (!this.props.fixDrawer) {
            showRaiseButton = (
                <RaisedButton
                    label="点击切换至AI实验室"
                    labelStyle={this.styles.switchButton}
                    backgroundColor="#ff8a00"
                    onTouchTap={
                        (event) => {
                            event.preventDefault();
                            window.open('http://ai.calfdata.com/')
                        }
                    }
                />
            )
        }
        let loading = loginService.loading ? <FixLoading zIndex={2000}/> : null;
        return (

            <div>
                {loading}
                <div>
                    <h1 style={this.styles.sign as any}>登录</h1>
                </div>
                <div style={this.styles.form}>
                    <div>
                        <TextField
                            role="userName"
                            floatingLabelText="手机号码 "
                            fullWidth
                            onChange={
                                (event, value) => {
                                    this.userName = value;
                                    loginService.clearUserNameErr();
                                }
                            }
                            errorText={loginService.userNameErr}
                            onKeyPress={this.onKeyPress}
                        />
                    </div>
                    <div>
                        <TextField
                            role="passWord"
                            floatingLabelText="输入您的密码"
                            errorText={loginService.passwordErr}
                            fullWidth
                            onChange={
                                (event, value) => {
                                    this.password = value;
                                    loginService.clearPasswordErr();
                                }
                            }
                            type="password"
                            onKeyPress={this.onKeyPress}
                        />
                    </div>
                </div>
                <div style={this.styles.confirm}>
                    <div role="moreOptionsButton">
                        <IconMenu
                            iconButtonElement={
                                <FlatButton label="更多选项"
                                            labelStyle={this.styles.moreText}
                                            style={this.styles.more}
                                />
                            }
                        >
                            <MenuItem primaryText="忘记密码？"
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              this.props.onStateChange(LoginState.FORGET);
                                          }
                                      }
                            />
                        </IconMenu>
                    </div>
                    <div className="auto-right">
                        <RaisedButton label="登录"
                                      role="loginButton"
                                      primary
                                      labelStyle={this.styles.loginText}
                                      backgroundColor={red500}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();

                                              this.onEnterPress();
                                          }
                                      }
                        />
                    </div>
                </div>

                <Divider style={this.styles.divider}/>
                <div>
                    <div style={this.styles.loginSwitch as any}>
                        <RaisedButton
                            role="linktoRegister"
                            label="创建帐号"
                            labelStyle={this.styles.switchButton}
                            primary
                            icon={
                                <Create />
                            }
                            onTouchTap={
                                (event) => {
                                    event.preventDefault();
                                    this.props.onStateChange(LoginState.REGISTER);
                                }
                            }
                        />
                        {showRaiseButton}
                    </div>
                </div>
            </div>
        );
    }

}

class HomePage4Portrait extends React.Component<any, any> {
    styles = {
        container: {
            position: 'relative',
            minHeight: '100vh',
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
            minHeight: 520,
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
        foot: {
            paddingBottom: 28,
            paddingLeft: 36,
            paddingRight: 36,
            display: 'flex',
            justifyContent: 'space-around',
        },
        links: {
            listStyle: 'none',
            paddingLeft: 0,
            paddingBottom: 24,
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
        },
        li: {
            display: 'inline-block',
            fontSize: 12,
            color: grey600,
        },
        link: {
            textAlign: 'left',
        },
        linkText: {
            padding: 0,
        },
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            login: LoginState.LOGIN,
        };
    }

    mount = true;

    componentWillUnmount() {
        this.mount = false;
    }

    handleState = (state) => {
        if (this.mount) {
            this.setState({
                login: state,
            })
        }
    };

    componentWillMount() {
        let hash = location.hash;
        if (hash.indexOf('#inviteCode') !== -1) {
            this.setState({
                login: LoginState.REGISTER
            })
        }
    }

    render() {
        let content = null;
        if (this.state.login == LoginState.LOGIN) {
            content = <HomePage4MobileLogin
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        } else if (this.state.login == LoginState.REGISTER) {
            content = <HomePage4MobileRegisterOrReset
                role={LoginState.REGISTER}
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        } else {
            content = <HomePage4MobileRegisterOrReset
                role={LoginState.FORGET}
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        }
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <Paper style={this.styles.content as any}>
                    <div style={this.styles.root}>
                        {content}
                    </div>
                    <div style={this.styles.foot as any}>
                        <ul style={this.styles.links}>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + AboutUs.path} target="_blank">关于小牛</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + Report.path} target="_blank">媒体报道</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + JoinUs.path} target="_blank">招贤纳士</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + Helps.path} target="_blank">帮助中心</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + ContactUs.path} target="_blank">联系我们</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href="http://ai.calfdata.com/" target="_blank">AI实验室</a>
                            </li>

                        </ul>
                    </div>

                </Paper>
                <div style={this.styles.after}/>
            </div>
        );
    }

}

class HomePage4Mobile extends React.Component<any, any> {
    styles = {
        container: {
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        root: {
            paddingBottom: 36,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 24,
            flexGrow: 1,
        },
        fix: {
            height: Constants.barHeight,
        },
        space: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        },
        foot: {
            paddingBottom: 16,
            paddingLeft: 8,
            paddingRight: 8,
            display: 'flex',
            justifyContent: 'space-around',
        },
        links: {
            textAlign: 'center',
            listStyle: 'none',
            paddingLeft: 0,
            paddingBottom: 24,
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
        },
        li: {
            display: 'inline-block',
            fontSize: 12,
            color: grey600,
        },
        link: {
            textAlign: 'left',
        },
        linkText: {
            padding: 0,
        },
        mobileAi: {
            textAlign: 'center',
            fontSize: 14,
            color: '#616161'
        },
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            login: LoginState.LOGIN,
        };
    }

    mount = true;

    componentWillUnmount() {
        this.mount = false;
    }

    componentWillMount() {
        let hash = location.hash;
        if (hash.indexOf('#inviteCode') !== -1) {
            this.setState({
                login: LoginState.REGISTER
            })
        }
    }

    handleState = (state) => {
        if (this.mount) {
            this.setState({
                login: state,
            })
        }
    };

    render() {

        let content = null;
        if (this.state.login == LoginState.LOGIN) {
            content = <HomePage4MobileLogin
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        } else if (this.state.login == LoginState.REGISTER) {
            content = <HomePage4MobileRegisterOrReset
                role={LoginState.REGISTER}
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        } else {
            content = <HomePage4MobileRegisterOrReset
                role={LoginState.FORGET}
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        }
        return (
            <Paper style={this.styles.container}>
                <div style={this.styles.space as any}>
                    <div style={this.styles.root as any}>
                        {content}
                    </div>
                    <div style={this.styles.foot as any}>
                        <ul style={this.styles.links}>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + AboutUs.path} target="_blank">关于小牛</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + Report.path} target="_blank">媒体报道</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + JoinUs.path} target="_blank">招贤纳士</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + Helps.path} target="_blank">帮助中心</a> · &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href={Constants.extraPrefix + ContactUs.path} target="_blank">联系我们</a>· &nbsp;
                            </li>
                            <li style={this.styles.li}>
                                <a href="http://ai.calfdata.com/" target="_blank">AI实验室</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Paper>
        );
    }
}
@observer
class WechatView extends React.Component<any, any> {
    styles = {
        sign: {
            paddingTop: 16,
            paddingBottom: 8,
            fontSize: 24,
            fontWeight: 400,
            lineHeight: '32px',
            margin: 0,
        },
        subSign: {
            paddingTop: 0,
            paddingBottom: 3,
            margin: 0,
        },
        form: {
            position: 'relative',
            textAlign: 'center',
        },
        qrcode: {
            position: 'relative',
            width: 250,
            height: 250,
            left: 0,
            transition: 'left 0.5s ease',
        },
        qrcodeHover: {
            position: 'relative',
            width: 250,
            height: 250,
            left: -50,
            transition: 'left 0.5s ease',
        },
        qrcodeTip: {
            width: 194,
            height: 210,
            position: 'absolute',
            top: 15,
            right: -60,
            opacity: 0,
            transition: 'all 0.5s ease',
        },
        qrcodeTipHover: {
            width: 194,
            height: 210,
            position: 'absolute',
            top: 15,
            right: -60,
            transition: 'all 0.5s ease',
        },
        confirm: {
            textAlign: 'center',
        },
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            hover: false,
            qrcodeRand: Math.random()
        };
    }

    render() {
        let contentDiv = wechatQrcodeService.loading || !wechatQrcodeService.$ ?
            <div className="qrcode center-align">
                <CircularProgress size={60} thickness={2} color="gray"/>
            </div>
            :
            <div>
                <div style={this.styles.form as any}
                     onMouseEnter={
                         () => {
                             this.setState({
                                 hover: true,
                             })
                         }
                     }
                     onMouseLeave={
                         () => {
                             this.setState({
                                 hover: false,
                             })
                         }
                     }>
                    <img className="qrcode" src={Http.BASE_URL + wechatQrcodeService.uri + "?" + this.state.qrcodeRand}
                         style={this.state.hover ? this.styles.qrcodeHover as any : this.styles.qrcode as any}/>
                    <img className="qrcode-tip" src="/images/wechat-diagram.png"
                         style={this.state.hover ? this.styles.qrcodeTipHover as any : this.styles.qrcodeTip}/>

                </div>
                <div style={this.styles.confirm}>
                    <img src="/images/qrcode-flow.png"/>
                </div>
            </div>

        return (
            <div>
                <div>
                    <h1 style={this.styles.sign as any}>微信登录</h1>
                    <p style={this.styles.subSign}>已注册用户扫码登录</p>
                </div>
                {contentDiv}
            </div>
        );
    }

    componentDidMount() {
        wechatQrcodeService.reset();
        wechatQrcodeService.refresh();
        wechatScanResultService.reset();
        wechatScanResultService.startFresh();
    }

    componentWillUnmount() {
        wechatScanResultService.stopFresh();
    }

}

class ActionContainer extends React.Component<any, any> {

    styles = {
        container: {
            position: 'relative',
            height: '100%',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        loginSwitch: {
            paddingTop: 24,
            paddingRight: 8,
        },
        switchButton: {
            color: 'white'
        },
        divider: {
            marginTop: 16,
        },
        before: {
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            flexGrow: 2,
            content: '',
            display: 'block',
        },
        content: {
            position: 'relative',
            width: 450,
            minHeight: 460,
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

    constructor(props, context) {
        super(props, context);

        this.state = {
            login: LoginState.LOGIN,
            wechat: false,
        };
    }

    mount = true;

    componentWillUnmount() {
        this.mount = false;
    }

    componentWillMount() {
        let hash = location.hash;
        if (hash.indexOf('#inviteCode') !== -1) {
            this.setState({
                login: LoginState.REGISTER
            })
        }
    }

    handleState = (state) => {
        if (this.mount) {
            this.setState({
                login: state,
            })
        }
    };

    loginSwitch = (wechat) => {
        this.setState(
            {
                wechat,
            }
        );
    };

    render() {

        let content = null;
        if (this.state.login == LoginState.LOGIN) {
            content =
                <div>
                    <HomePage4MobileLogin
                        onStateChange={this.handleState}
                        fixDrawer={this.props.fixDrawer}
                        onLoginSwitch={this.loginSwitch}/>
                </div>
        } else if (this.state.login == LoginState.REGISTER) {
            content = <HomePage4MobileRegisterOrReset
                role={LoginState.REGISTER}
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        } else {
            content = <HomePage4MobileRegisterOrReset
                role={LoginState.FORGET}
                onStateChange={this.handleState}
                fixDrawer={this.props.fixDrawer}/>;
        }
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <Paper style={this.styles.content as any}
                       zDepth={2}>
                    <div style={this.styles.root}>
                        {content}
                    </div>
                </Paper>
                <div style={this.styles.after}/>
            </div>
        );
    }
}

class LogoBox extends React.Component<any, any> {
    styles = {
        logoContainer: {
            position: "relative",
            height: "100%",
            maxHeight: "100%",
            display: "flex",
            flexDirection: "column"
        },
        before: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 2,
            content: '',
            display: 'block',
        },
        logo: {
            position: 'relative',
            width: '280px',
            textAlign: 'center'
        },
        fontStyle: {
            fontSize: '16px',
            color: '#5a5a5a'
        },
        loginLogo: {
            width: 190
        }
    };

    render() {
        return (
            <div style={this.styles.logoContainer as any}>
                <div style={this.styles.before}/>
                <div style={this.styles.logo as any}>
                    <img src="/images/loginLogo.png" alt="calfdata" style={this.styles.loginLogo}/>
                    <p style={this.styles.fontStyle}>看10000+财经大V如何评价你的股票</p>
                </div>
                <div style={this.styles.after}/>
            </div>
        )
    }
}

class HomePage4Desktop extends React.Component<any, any> {
    @observable showLogo: any;
    styles = {
        mainContainer: {
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        container: {
            position: 'absolute',
            right: '15%',
            top: 0,
            height: '100%',
            zIndex: 3,
        },

        containerBox: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
            background: 'url("/images/BG.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        },
        logoBox: {
            position: 'absolute',
            left: '30%',
            top: 0,
            height: '100%',
            zIndex: 3,
        },
        footerBox: {
            position: 'absolute',
            bottom: 0,
            height: '10%',
            zIndex: 10,
            width: '100%'
        },

        footerStyle: {
            fontSize: '14px',
            color: '#555',
            textAlign: 'center'
        },
        fix: {
            height: Constants.barHeight,
        },
        spanMargin: {
            margin: '0 21px'
        },
        aiShowBox: {
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            right: 0,
            height: 52,
            lineHeight: '52px',
            textAlign: 'center',
            width: 250,
            cursor: 'pointer',
            background: '#ff8a00'
        },
        aiLogo: {
            width: 150,
            marginTop: 7,
            transition: '.4s cubic-bezier(.3, 0, 0, 1.8)'
        },
        arrow: {
            position: 'absolute',
            right: 20,
            top: 21
        },
        aiFontLabel: {
            position: 'absolute',
            top: 11,
            left: 60,
            color: 'white',
            fontSize: 14,
            transition: '.4s cubic-bezier(.3, 0, 0, 1.8)'
        }
    };

    handleEnter(v) {
        v.target.setAttribute("style", 'text-decoration:underline');
    }

    handleLeave(v) {
        v.target.setAttribute("style", 'text-decoration:none');
    }

    render() {
        this.showLogo = (<img src="/images/ailogo.png" alt="ailogo" style={this.styles.aiLogo}/>);
        return (
            <div>
                <div>
                    <div style={this.styles.mainContainer as any}>
                        <div style={this.styles.containerBox as any}>

                            <div style={this.styles.logoBox as any}>
                                <LogoBox/>
                            </div>
                            <a role="linktoAICalfdata" href="http://ai.calfdata.com/" target="_blank"
                               style={this.styles.aiShowBox as any}>
                                <div style={this.styles.aiShowBox as any}>
                                    <span style={this.styles.aiFontLabel as any}>
                                        点击切换至AI实验室
                                    </span>
                                    <img src="/images/ailogo.png" alt="ailogo" style={this.styles.aiLogo}/>
                                    <br/>
                                    <img src="/images/arrow.png" alt="arrow" id="arrow"
                                         style={this.styles.arrow as any}/>
                                </div>
                            </a>
                            <div style={this.styles.footerBox as any}>
                                <div style={this.styles.footerStyle}>
                                        <span
                                            onMouseEnter={(v) => this.handleEnter(v)}
                                            onMouseLeave={(v) => this.handleLeave(v)}
                                        ><a role="linktoAboutUs" href={Constants.extraPrefix + AboutUs.path}
                                            target="_blank">关于小牛</a></span> · &nbsp;
                                    <span
                                        onMouseEnter={(v) => this.handleEnter(v)}
                                        onMouseLeave={(v) => this.handleLeave(v)}
                                    ><a role="linktoReport" href={Constants.extraPrefix + Report.path} target="_blank">媒体报道</a></span>
                                    · &nbsp;
                                    <span
                                        onMouseEnter={(v) => this.handleEnter(v)}
                                        onMouseLeave={(v) => this.handleLeave(v)}
                                    ><a role="linktoJoinUs" href={Constants.extraPrefix + JoinUs.path} target="_blank">招贤纳士</a></span>
                                    · &nbsp;
                                    <span
                                        onMouseEnter={(v) => this.handleEnter(v)}
                                        onMouseLeave={(v) => this.handleLeave(v)}
                                    ><a role="linktoHelps" href={Constants.extraPrefix + Helps.path}>帮助中心</a></span>
                                    · &nbsp;
                                    <span
                                        onMouseEnter={(v) => this.handleEnter(v)}
                                        onMouseLeave={(v) => this.handleLeave(v)}
                                    ><a role="linktoContactUs" href={Constants.extraPrefix + ContactUs.path}
                                        target="_blank">联系我们</a></span> · &nbsp;
                                    <span
                                        onMouseEnter={(v) => this.handleEnter(v)}
                                        onMouseLeave={(v) => this.handleLeave(v)}
                                    ><a role="linktoAILab" href="http://ai.calfdata.com/"
                                        target="_blank">AI实验室</a></span>

                                    <p>&copy;2017 calfdata.com 蜀ICP备15022989号</p>
                                </div>
                            </div>

                        </div>

                        <div style={this.styles.container as any}>
                            <ActionContainer fixDrawer={true}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default class HomePage extends React.Component<RouteComponentProps<null>, null> {

    static path = "/login";

    widthNotifier: WidthNotifier = null;

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        loginService.setMount(true);
        registerService.setMount(true);
        resetPasswordService.setMount(true);
        smsService.setMount(true);
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        runInAction(() => {
            loginService.setMount(false);
            registerService.setMount(false);
            resetPasswordService.setMount(false);
            smsService.setMount(false);
        });
    }

    render() {
        const small = Util.small(this.widthNotifier.device);
        const middleDown = Util.middleDown(this.widthNotifier.device);
        if (small) {
            return <HomePage4Mobile fixDrawer={false}/>;
        } else if (middleDown) {
            return <HomePage4Portrait fixDrawer={false}/>;
        } else {
            return <HomePage4Desktop fixDrawer={true}/>;
        }
    }
}
