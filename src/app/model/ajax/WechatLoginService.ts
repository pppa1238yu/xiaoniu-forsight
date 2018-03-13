import {ObjDataSource, RefDataSource} from "./DataSource";
import {http} from "./Http";
import {WechatScanResult} from "../entities/wechat/WechatScanResult";
import {UserForm} from "../entities/UserForm";
import {userDataSource} from "./UserService";
import {tipManager} from "../state/TipManager";

export class WechatQrcodeService extends ObjDataSource<string> {
    uri = "/qrcode/qrcode.json";

    protected onRefresh(): void {
        http.post(this.uri, {})
            .then(value => {
                if (value.success != true || !value.ticket) {
                    this.fail(value.msg || "error");
                } else {
                    this.success(value.ticket);
                }
            })
            .catch(err => this.fail(err));
    }
}

export let wechatQrcodeService: WechatQrcodeService = new WechatQrcodeService();

export class WechatSubmitLoginService extends ObjDataSource<UserForm> {
    uri = "/login/wechatLogin.do";
    openId;
    ticket;

    protected onRefresh(): void {
        http.post(this.uri, {openId: this.openId,ticket:this.ticket})
            .then(value => {
                if (value.success == false ) {
                    tipManager.showTip(value.msg || "登录失败");
                    this.fail(value.msg || "登录失败");
                } else {
                    this.success(<UserForm>value);
                    userDataSource.loginSuc(value);
                }
            })
            .catch(err => this.fail(err));
    }
}
export let wechatSubmitLoginService: WechatSubmitLoginService = new WechatSubmitLoginService();

export class WechatBindSubmitService extends ObjDataSource<UserForm> {
    uri = "/user/bindWechat.json";
    openId;

    protected onRefresh(): void {
        http.post(this.uri, {openId: this.openId,ticket:wechatQrcodeService.$})
            .then(value => {
                if (value.success != true ) {
                    tipManager.showTip(value.msg || "绑定微信失败");
                    this.fail(value.msg || "绑定微信失败");
                } else {
                    tipManager.showTip("绑定微信成功");
                    this.success(<UserForm>value);
                    userDataSource.reloadUserInfo();
                }
            })
            .catch(err => this.fail(err));
    }
}

export let wechatBindSubmitService: WechatBindSubmitService = new WechatBindSubmitService();

export class WechatScanResultService extends RefDataSource<WechatScanResult> {
    uri = "/qrcode/checkResult.json";
    private continueRefresh = true;
    private processService;
    private callback;
    constructor() {
        super({appId: "", openId: "", nickName: "", headImage: ""})
    }

    protected onRefresh(): void {
        if (wechatQrcodeService.$) {
            http.post(this.uri, {ticket:wechatQrcodeService.$})
                .then(value => {
                    if (value.success == false) {
                        this.fail("");
                        this.next();
                    } else {
                        this.success(<WechatScanResult>value);
                        this.processService=this.processService||wechatSubmitLoginService;
                        this.processService.openId = value.openId;
                        this.processService.ticket = wechatQrcodeService.$;
                        this.processService.refresh((success) => {
                            if(success==false){
                                this.next();
                            }else if (this.callback) {
                                this.callback();
                            }
                            //this.error = this.processService.error;
                        });
                        //this.error=null;
                    }
                    return value;
                }).catch(err => this.next());
        } else {
            this.next();
        }
    }
    startFresh(callback?:Function, processService?) {
        this.callback = callback;
        this.processService = processService || wechatSubmitLoginService;
        this.continueRefresh = true;
        this.next();
    }
    private next() {
        //m每2秒扫一次
        if (this.continueRefresh) {
            setTimeout(() => {
                this.refresh();
            }, 2000)
        }
    }

    stopFresh() {
        this.processService=null;
        this.continueRefresh = false;
    }
}

export let wechatScanResultService: WechatScanResultService = new WechatScanResultService();

