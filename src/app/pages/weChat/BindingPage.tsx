import * as React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import If from "../../components/common/If";
import {http} from "../../model/ajax/Http";
import {Util} from "../../Constants";

@observer
export default class BindingPage extends React.Component<any, null> {

    static path = '/binding';

    @observable private phone: string = "";

    @observable private phoneErr: string = "";

    @observable private sms: string = "";

    @observable private dialogOpenning: boolean = false;

    @observable private dialogMessage: string = "";

    @observable private loadingSms: boolean = false;

    @observable private binding: boolean = false;

    @observable label = "获取";
    styles = {
        layoutRow: {
            margin: '10px'
        },
        title: {
            fontSize: 'bigger',
            fontWeight: 'bold',
            textAlign: 'center'
        },
        flex: {
            display: 'flex',
            alignItems: 'flex-end'
        },
        grow: {
            flexGrow: 1
        },
        sms: {
            marginLeft: '10px'
        }
    };

    render() {
        return (
            <div>
                <div style={{...this.styles.layoutRow, ...this.styles.title as any}}>
                    微信绑定
                </div>
                <div style={this.styles.layoutRow}>
                    <TextField
                        floatingLabelText="请输入手机号"
                        fullWidth={true}
                        value={this.phone}
                        onChange={(e, value) => {this.onPhoneChange(value);}}
                        errorText={this.phoneErr}/>
                </div>
                <div style={{...this.styles.layoutRow, ...this.styles.flex as any}}>
                    <div style={this.styles.grow}>
                        <TextField
                            floatingLabelText="请输入微信验证码"
                            fullWidth={true}
                            disabled = {!this.isPhoneValid()}
                            value={this.sms} onChange={(e, value) => {this.onSmsChange(value);}}/>
                    </div>
                    <div style={this.styles.sms}>
                        <If condition={!this.loadingSms}>
                            <FlatButton
                                label={this.label}
                                disabled={this.phone == null || this.phone == ''|| this.label != "获取"}
                                onClick={() => {this.onGetSmsClick()}}/>
                        </If>
                        <If condition={this.loadingSms}>
                            <CircularProgress size={40} thickness={3}/>
                        </If>
                    </div>
                </div>
                <div style={this.styles.layoutRow}>
                    <If condition={!this.binding} block={true}>
                        <RaisedButton
                            label="绑定"
                            fullWidth={true}
                            primary={true}
                            disabled={!this.isPhoneValid() || !this.isSmsValid()}
                            onClick={() => {this.onBindingClick()}}/>
                    </If>
                    <If condition={this.binding}>
                        <LinearProgress mode="indeterminate" />
                    </If>
                </div>
                <Dialog
                    title="错误"
                    open={this.dialogOpenning}
                    onRequestClose={() => {this.dialogOpenning = false;}}>
                    {this.dialogMessage}
                </Dialog>
            </div>
        );
    }

    private onPhoneChange(value) {
        this.phone = value;
        if (value != null && value != '' && !Util.validatePhone(value)) {
            this.phoneErr = "请输入正确格式的手机号码";
        } else {
            this.phoneErr = null;
        }
    }

    private onSmsChange(value) {
        this.sms = value;
    }

    private setTime = () => {
        let time = 60;
        let timeSet = setInterval( ()=>{
            time--;
            this.label = time +'s';
            if(time <= 0){
                this.label = "获取";
                clearInterval(timeSet);
            }
        },1000);
    };
    private onGetSmsClick() {
        this.loadingSms = true;
        http
            .post("user/postBindTelephoneSmsCode", {
                cellphoneNumber: this.phone
            })
            .then(data => {
                runInAction(() => {
                    this.loadingSms = false;
                    if (data.success === false) {
                        this.showMessage("获取验证码失败：" + data.msg || data.errorMessage);
                    }
                    if(this.phoneErr == null){
                        this.setTime();
                    }
                });
            })
            .catch(err => {
                runInAction(() => {
                    this.loadingSms = false;
                    this.showMessage("获取验证码故障。");
                });
            });
    }

    private onBindingClick() {
        this.binding = true;
        http
            .post("user/wechatBindTelephone", {
                cellphoneNumber: this.phone,
                smsCode: this.sms
            })
            .then(data => {
                runInAction(() => {
                    this.binding = false;
                    if (data.success === false) {
                        this.showMessage("绑定操作失败：" + data.msg || data.errorMessage);
                    } else {
                        let  src = data.savedRequest;
                        http
                            .get("logout.do",{})
                            .then(  data => {
                                window.location.assign(src || '/');
                            })
                            .catch( ()=>{
                                window.location.assign(src || '/');
                            });
                    }
                });
            })
            .catch(err => {
                runInAction(() => {
                    this.binding = false;
                    this.showMessage("绑定操作故障。");
                });
            });
    }

    private showMessage(message: string) {
        this.dialogMessage = message;
        this.dialogOpenning = true;
    }

    private isPhoneValid(): boolean {
        return !BindingPage.isEmpty(this.phone) && BindingPage.isEmpty(this.phoneErr);
    }

    private isSmsValid(): boolean {
        return !BindingPage.isEmpty(this.sms);
    }

    private static isEmpty(str: string): boolean {
        return str == null || str == "";
    }
}