import {DataSource} from "./DataSource";
import {BaseService, SmsService, TIPS} from "./Login";
import {userDataSource} from "./UserService";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";

const OLD_PASSWORD_ERR_TIP = '请输入原密码';
const CONFIRM_PASSWORD_ERR_TIP = "两次输入密码不相符";
const CONFIRM_PASSWORD_ERR_TIP2 = "请确认密码";

class ModifyPasswordService extends DataSource<any> {
    public $: any;

    oldPassword;
    password;
    confirmPassword;

    oldPasswordErr = "";
    passwordErr = "";
    confirmPasswordErr = "";
    successTip = "";
    otherErr = "";

    hasErr() {
        return this.oldPasswordErr != ""
            || this.passwordErr != ""
            || this.confirmPasswordErr != "";
    }

    hasSuccessTip() {
        return this.successTip != "";
    }

    clearSuccessTip() {
        if (this.successTip != "") {
            this.successTip = "";
            this.doUpdate();
        }
    }


    setValue(oldPassword, password, confirmPassword) {
        this.clear();
        this.oldPassword = oldPassword;
        this.password = password;
        this.confirmPassword = confirmPassword;
        if (this.oldPassword == '') {
            this.oldPasswordErr = OLD_PASSWORD_ERR_TIP;
        }

        if (this.password == '') {
            this.passwordErr = TIPS.PASSWORD_ERR_TIP;
        } else if (this.password.length < 6) {
            this.passwordErr = TIPS.PASSWORD_ERR_TIP2;
        }

        if (this.confirmPassword == '') {
            this.confirmPasswordErr = CONFIRM_PASSWORD_ERR_TIP2;
        } else if (this.confirmPassword != this.password) {
            this.confirmPasswordErr = CONFIRM_PASSWORD_ERR_TIP;
        }
    }

    clearOldPasswordErr() {
        if (this.oldPasswordErr != "") {
            this.oldPasswordErr = "";
            this.doUpdate();
        }
    }

    clearPasswordErr() {
        if (this.passwordErr != "") {
            this.passwordErr = "";
            this.doUpdate();
        }
    }

    clearConfirmPasswordErr() {
        if (this.confirmPasswordErr != "") {
            this.confirmPasswordErr = "";
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

    clearErr() {
        if (this.error) {
            this.error = null;
            this.doUpdate();
        }
    }

    clear() {
        this.passwordErr = "";
        this.otherErr = "";
        this.oldPasswordErr = "";
        this.confirmPasswordErr = "";
        this.error = null;
        this.successTip = "";
    }

    protected onReset(): void {
        this.oldPassword = "";
        this.password = "";
        this.confirmPassword = "";
        this.oldPasswordErr = "";
        this.passwordErr = "";
        this.confirmPasswordErr = "";
        this.otherErr = "";
        this.successTip = "";
    }

    protected onSuccess(value): void {
        this.successTip = value.msg || "修改密码成功";
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

    protected onRefresh(): void {
        http.post("/reset/updatePassword", {oldPassword: this.oldPassword, password: this.password})
            .then(value => {
                if (value.success == false) {
                    if (value.errorField == "oldPassword") {
                        this.oldPasswordErr = value.msg;
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

export let modifyPasswordService = new ModifyPasswordService();

class BindPhoneService extends BaseService {

    getUri() {
        return "user/bindTelephone.json";
    }

    protected onRefresh(): void {
        http.post(this.getUri(), {cellphoneNumber:this.userName,smsCode:this.smsCode})
            .then(value => {
                if (value.success == false) {
                    this.otherErr = value.msg || "绑定手机失败";
                    if (this.otherErr == '该手机号码已被注册') {
                        this.otherErr = '该手机号码已被绑定';
                    }
                    this.fail(this.otherErr);
                } else {
                    this.success(value);
                }
            })
            .catch(err => this.fail(err));
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        this.successTip = value.msg || "绑定手机成功";
    }
}

export let bindPhoneService = new BindPhoneService();

abstract class UnbindService extends DataSource<any> {

    otherErr = "";
    successTip = "";

    hasSuccessTip() {
        return this.successTip != "";
    }

    clearSuccessTip() {
        if (this.successTip != "") {
            this.successTip = "";
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

    clearErr() {
        if (this.error) {
            this.error = null;
            this.doUpdate();
        }
    }

    clear() {
        this.otherErr = "";
        this.error = null;
        this.successTip = '';
    }

    protected onRefresh(): void {
        setTimeout(() => {
            this.success({
                success: true,
            })
        }, 3000);
    }

    protected onSuccess(value: any): void {
        userDataSource.reloadUserInfo();
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

    protected onReset(): void {
        this.clear();
    }

    public $: any;

}

class UnbindPhoneService extends UnbindService {
    protected onRefresh(): void {
        http.post("user/unbindTelephone.json", {})
            .then(value => {
                if (value.success == false) {
                    this.otherErr = value.msg || "解绑手机失败";
                    this.fail(this.otherErr);
                } else {
                    this.success(value);
                }
            })
            .catch(err => this.fail(err));
    }

    protected onSuccess(value: any): void {
        super.onSuccess(value);
        this.successTip = value.msg || "解绑手机成功";
    }
}

export let unbindPhoneService = new UnbindPhoneService();

class UnbindWechatService extends UnbindService {

    protected onRefresh(): void {
        http.post("user/unbindWechat.json", {})
            .then(value => {
                if (value.success == false) {
                    this.otherErr = value.msg || "解绑微信号失败";
                    this.fail(this.otherErr);
                } else {
                    this.success(value);
                }
            })
            .catch(err => this.fail(err));
    }

    protected onSuccess(value: any): void {
        super.onSuccess(value);
        this.successTip = value.msg || "绑定微信号成功";
    }
}

export let unbindWechatService = new UnbindWechatService();

export let bindPhoneSmsService = new SmsService();

class ChangePhoneService extends BaseService {

    getUri() {
        return "user/changeTelephone.json";
    }

    protected onRefresh(): void {
        http.post(this.getUri(), {cellphoneNumber:this.userName,password: this.password,smsCode:this.smsCode})
            .then(value => {
                if (value.success == false) {
                    if (value.errorField == "username") {
                        this.userNameErr = value.msg;
                    } else if (value.errorField == "password") {
                        this.passwordErr = value.msg;
                    }else if (value.errorField == "smsCode") {
                        this.smsCodeErr = value.msg;
                    } else {
                        this.otherErr = value.msg || "更换手机失败";
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
        this.successTip = value.msg || "更换手机成功";
        userDataSource.reloadUserInfo();
    }
}

export let changePhoneService = new ChangePhoneService();

export let changePhoneSmsService = new SmsService();

