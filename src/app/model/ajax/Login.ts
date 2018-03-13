///<reference path="DataSource.ts"/>

import {userDataSource} from "./UserService";
import {DataSource, ObjDataSource} from "./DataSource";
import {UserForm} from "../entities/UserForm";
import {Util} from "../../Constants";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";

const PHONE_ERR_TIP = "请输入手机号码";
const PHONE_ERR_TIP2 = "请输入正确的手机号码";
const PASSWORD_ERR_TIP = "请输入密码";
const PASSWORD_ERR_TIP2 = "密码长度应不少于 6 位";
const SMS_ERR_TIP = '请输入手机验证码';

export let TIPS = {
    PHONE_ERR_TIP,
    PHONE_ERR_TIP2,
    PASSWORD_ERR_TIP,
    PASSWORD_ERR_TIP2,
    SMS_ERR_TIP,
};

export abstract class BaseService extends DataSource<any> {
    public $: any;

    userName;
    password;
    smsCode;
    inviteCode = '';

    userNameErr = "";
    passwordErr = "";
    smsCodeErr = "";
    otherErr = "";

    successTip = "";
    redirectToLogin:Function;

    hasSuccessTip() {
        return this.successTip != "";
    }

    clearSuccessTip() {
        if (this.successTip != "") {
            this.successTip = "";
            this.doUpdate();
        }
    }

    hasErr() {
        return this.userNameErr != ""
            || this.passwordErr != ""
            || this.smsCodeErr != "";
    }

    setValue(userName, password, smsCode ,inviteCode?) {
        this.clear();
        this.userName = userName.trim();
        this.password = password;
        if(inviteCode){
            this.inviteCode = inviteCode;
        }
        this.smsCode = smsCode.trim();
        if (this.userName == '') {
            this.userNameErr = PHONE_ERR_TIP;
        } else if (!Util.validatePhone(this.userName)) {
            this.userNameErr = PHONE_ERR_TIP2;
        }
        if (this.password == '') {
            this.passwordErr = PASSWORD_ERR_TIP;
        } else if (this.password.length < 6) {
            this.passwordErr = PASSWORD_ERR_TIP2;
        }
        if (this.smsCode == '') {
            this.smsCodeErr = SMS_ERR_TIP;
        }
    }

    clearUserNameErr() {
        if (this.userNameErr != "") {
            this.userNameErr = "";
            this.doUpdate();
        }
    }

    clearPasswordErr() {
        if (this.passwordErr != "") {
            this.passwordErr = "";
            this.doUpdate();
        }
    }

    clearSmsCodeErr() {
        if (this.smsCodeErr != "") {
            this.smsCodeErr = "";
            this.doUpdate();
        }
    }

    clearErr() {
        if (this.error) {
            this.error = null;
            this.doUpdate();
        }
    }

    clearOtherErr() {
        if (this.otherErr != "") {
            this.error = null;
            this.otherErr = "";
            this.doUpdate();
        }
    }

    clear() {
        this.passwordErr = "";
        this.otherErr = "";
        this.smsCodeErr = "";
        this.userNameErr = "";
        this.successTip = "";
        this.error = null;
    }

    protected onReset(): void {
        this.userName = "";
        this.password = "";
        this.smsCode = "";
        this.inviteCode = "";
        this.userNameErr = "";
        this.passwordErr = "";
        this.smsCodeErr = "";
        this.otherErr = "";
        this.successTip = "";
    }


    protected onSuccess(value): void {
        userDataSource.reloadUserInfo();
        //userDataSource.loginSuc(value);

    }

    request(handler = null) {
        tipManager.hidden();
        this.refresh(
            (succ, error) => {
                if (this.mount) {
                    if (!succ && error) {
                        tipManager.showTip(this.otherErr || "网络异常")
                    } else if (succ && this.successTip) {
                        tipManager.showTip(this.successTip)
                    }
                }
                if (handler) {
                    handler();
                }
            }
        );
    }

    abstract getUri();
}

class LoginService extends BaseService {
    getUri() {
        return "/login/login.do"
    }

    hasErr() {
        return this.userNameErr != "" || this.passwordErr != "";
    }

    setValue(userName, password) {
        this.clear();
        this.userName = userName.trim();
        this.password = password;
        if (this.userName == '') {
            this.userNameErr = PHONE_ERR_TIP;
        } else if (!Util.validatePhone(this.userName)) {
            this.userNameErr = PHONE_ERR_TIP2;
        }
        if (this.password == '') {
            this.passwordErr = PASSWORD_ERR_TIP;
        }
    }


    protected onSuccess(value): void {
        userDataSource.loginSuc(value);
    }

    protected onRefresh(): void {
        http.post(this.getUri(), {username: this.userName, password: this.password})
            .then(value => {
                if (value.success == false) {
                    if (value.errorField == "username") {
                        this.userNameErr = value.msg;
                    } else if (value.errorField == "password") {
                        this.passwordErr = value.msg;
                    } else {
                        this.otherErr = value.msg;
                        this.fail(this.otherErr);
                        return;
                    }
                    this.fail(null);
                } else {
                    this.success(value);
                }
            })
            .catch(err => this.fail(err));
    }


}

export let loginService = new LoginService();

class RegisterService extends BaseService {
    getUri() {
        return "/register/register.json";
    }
    protected onRefresh(): void {
        http.post(this.getUri(), {cellphoneNumber: this.userName, password: this.password,smsCode:this.smsCode,invitationCode:this.inviteCode})
            .then(value => {
                if (value.success == false) {
                    if (value.errorField == "username") {
                        this.userNameErr = value.msg;
                    } else if (value.errorField == "password") {
                        this.passwordErr = value.msg;
                    }else if (value.errorField == "smsCode") {
                        this.smsCodeErr = value.msg;
                    } else {
                        this.otherErr = value.msg;
                        this.fail(this.otherErr);
                        return;
                    }
                    this.fail(null);
                } else {
                    this.success(value);
                }
            })
            .catch(err => this.fail(err));
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        this.successTip = value.msg || "注册成功";
        //切到登录界面
        if(this.redirectToLogin){
            this.redirectToLogin();
        }
    }
}

export let registerService = new RegisterService();

export class SmsService extends ObjDataSource<any> {

    userName;
    smsCode;

    userNameErr = "";
    otherErr = "";

    timer = null;
    count = 0;
    register=true;

    hasErr() {
        return this.userNameErr != "";
    }

    setValue(userName) {
        this.clear();
        this.clearTimer();
        this.userName = userName.trim();
        if (this.userName == '') {
            this.userNameErr = PHONE_ERR_TIP;
        } else if (!Util.validatePhone(this.userName)) {
            this.userNameErr = PHONE_ERR_TIP2;
        }
    }

    clearUserNameErr() {
        if (this.userNameErr != "") {
            this.userNameErr = "";
            this.doUpdate();
        }
    }

    clearErr() {
        if (this.error) {
            this.error = null;
            this.doUpdate();
        }
    }

    clearOtherErr() {
        if (this.otherErr != "") {
            this.error = null;
            this.otherErr = "";
            this.doUpdate();
        }
    }

    clear() {
        this.otherErr = "";
        this.userNameErr = "";
        this.error = null;
    }

    protected onReset(): void {
        this.userName = "";
        this.smsCode = "";
        this.userNameErr = "";
        this.otherErr = "";
        this.count = 0;
        this.clearTimer();
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.count = 0;
    }

    doCount = () => {
        this.count--;
        if (this.count == 0) {
            this.clearTimer();
        } else {
            this.timer = setTimeout(() => {
                this.doCount()
            }, 1000);
        }
        this.doUpdate();
    };

    request() {
        tipManager.hidden();
        this.refresh(
            (succ, error) => {
                if (this.mount && !succ && error) {
                    tipManager.showTip(this.otherErr || "网络异常")
                }
            }
        );
    }

    protected onSuccess(value): void {
        this.count = 60;
        this.timer = setTimeout(
            () => {
                this.doCount();
            }, 1000
        )
        //userDataSource.loginSuc(value);
    }

    getUri() {
        return this.register?"register/postSmsCode":"reset/postSmsCode";
    }

    protected onRefresh(): void {
        http.post(this.getUri(), {cellphoneNumber: this.userName})
            .then(value => {
                if (value.success == false) {
                    if (value.errorField == "username") {
                        this.userNameErr = value.msg;
                        this.fail(null);
                    } else {
                        this.otherErr = value.msg;
                        this.fail(this.otherErr);
                    }
                } else {
                    this.success(<UserForm>value);
                }
            })
            .catch(err => this.fail(err));
    }
}

export let smsService = new SmsService();

class ResetPasswordService extends BaseService {
    getUri() {
        return '/reset/resetPassword';
    }
    protected onRefresh(): void {
        http.post(this.getUri(), {cellphoneNumber: this.userName, password: this.password,smsCode:this.smsCode})
            .then(value => {
                if (value.success == false) {
                    if (value.errorField == "username") {
                        this.userNameErr = value.msg;
                    } else if (value.errorField == "password") {
                        this.passwordErr = value.msg;
                    }else if (value.errorField == "smsCode") {
                        this.smsCodeErr = value.msg;
                    } else {
                        this.otherErr = value.msg;
                        this.fail(this.otherErr);
                        return;
                    }
                    this.fail(null);
                } else {
                    this.success(value);
                }
            })
            .catch(err => this.fail(err));
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        this.successTip = value.msg;
        //切到登录界面
        if(this.redirectToLogin){
            this.redirectToLogin();
        }
    }
}

export let resetPasswordService = new ResetPasswordService();
