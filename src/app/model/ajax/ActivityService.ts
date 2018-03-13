import {ArrDataSource, RefDataSource, ObjDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";
import {messageDatasource} from  "./MessageService";
declare let $;

export abstract class ActivityArrDataSource<E> extends ArrDataSource<E> {
    id: any;

    notifyResult: (err?) => {};

    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(true);
                            this.notifyResult = null;
                        } else {
                            this.fail(err)
                        }
                    });
                }
            );
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }


    public resetWithId(id?: any): void {
        this.id = id;
        this.reset();
    }


    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request(callback?: (data?: E) => void) {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error,value) => {
                if (!succ && error) {
                    tipManager.showTip("网络出错");
                }else{
                    if(callback){
                        callback(value);
                    }
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}

export abstract class ActivityRefDataSource<E> extends RefDataSource<E> {
    id: any;

    notifyResult: (err?) => {};

    latestNum = 0;

    messagePage = false;

    firstMessageCount = true;

    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(true);
                            this.notifyResult = null;
                        } else {
                            this.fail(err)
                        }
                    });
                }
            );
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        if (value.count !== undefined) {
            if (this.firstMessageCount) {
                this.firstMessageCount = false;
                this.latestNum = value.count;
            } else {
                if (value.count > 0) {
                    if (value.count > this.latestNum) {
                        messageDatasource.request(() => {
                            if(this.messagePage){
                                $('.normalTr').attr('data-open', false);
                                $('.normalTr').eq(0).children('td').addClass('important');
                                $('.mailImg').eq(0).attr('src', '/images/mail.png');
                                $('.mailImage').eq(0).attr('src', '/images/mail.png');
                                $('.messageContent').eq(0).children().addClass('messageNormalP');
                                $('.messageContent').eq(0).children().children().addClass('messageNormalP');
                                $('.messageExpandTr').css({
                                    height: '0',
                                    padding: '0'
                                });
                                $('.messageExpandBox').css({
                                    height: 0,
                                    borderBottom: 'none'
                                })
                            }else {
                                return;
                            }
                        });
                    }
                    this.latestNum = value.count;
                } else {
                    this.latestNum = 0;
                }
            }
        }
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }


    public resetWithId(id?: any): void {
        this.id = id;
        this.reset();
    }

    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request(callback?: (data?: E) => void) {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error, value) => {
                if (!succ && error) {
                    tipManager.showTip("网络出错");
                }else{
                    if(callback){
                        callback(value);
                    }
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}

//----------------------------------------------------------------------------------------------成功注册人数
class RegistratersDataSource extends ActivityArrDataSource<any> {
    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/invitedCount';
    }
}
export let registratersDataSource = new RegistratersDataSource();

//----------------------------------------------------------------------------------------------邀请排行榜

class InvitationRankDataSource extends ActivityArrDataSource<any> {
    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/rankList';
    }
}

export let invitationRankDataSource = new InvitationRankDataSource();

//----------------------------------------------------------------------------------------------抽奖活动是否过期
class DrawTimeLimitDataSource extends ActivityArrDataSource<any>{
    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/activityLimit';
    }
}

export let drawTimeLimitDataSource=new DrawTimeLimitDataSource();


//----------------------------------------------------------------------------------------------获得抽奖机会次数

class DrawChanceNumDataSource extends ActivityArrDataSource<any>{

    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/unusedPrizes';
    }
}


export let drawChanceNumDataSource=new DrawChanceNumDataSource();

//----------------------------------------------------------------------------------------------抽奖接口
class DrawResultDataSource extends ActivityArrDataSource<any>{

    protected get paramMap() {
        return {unusedPrizeId:this.id};
    }

    protected get uri(): string {
        return '/prize/prizeOrder';
    }
}


export let drawResultDataSource=new DrawResultDataSource();

//----------------------------------------------------------------------------------------------中奖名单
class LuckyUsersDataSource extends ActivityArrDataSource<any> {
    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/luckyUsers';
    }
}
export let luckyUsersDataSource=new LuckyUsersDataSource();

//----------------------------------------------------------------------------------------------获取爱奇艺卡号密码
class GetAQYCode extends ActivityRefDataSource<any> {
    protected get paramMap() {
        return {prizeId:this.id};
    }
    protected get uri(): string {
        return '/prize/prize';
    }
}

export let getAQYCode = new GetAQYCode({cardAccount:"",cardPassword:""});


//----------------------------------------------------------------------------------------------获得的奖品列表
class PrizeListDataSource extends ActivityArrDataSource<any> {
    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/allPrize';
    }
}

export let prizeListDataSource = new PrizeListDataSource();

//----------------------------------------------------------------------------------------------获得京东E卡明细
class JdeDataSource extends ActivityRefDataSource<any> {
    protected get paramMap() {
        return {prizeId:this.id};
    }

    protected get uri(): string {
        return '/prize/prize';
    }
}

export let jdeDataSource = new JdeDataSource({cardAccount:"",cardPassword:""});

//----------------------------------------------------------------------------------------------邀请记录
class InvitationRecordDataSource extends ActivityArrDataSource<any> {
    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/prize/invitedUsers';
    }
}

export let invitationRecordDataSource = new InvitationRecordDataSource();


//----------------------------------------------------------------------------------------------消息提示
class MessageTipDataSource extends ActivityRefDataSource<any> {

    protected get paramMap() {
        return {};
    }

    protected get uri(): string {
        return '/messages/getCount';
    }

}

export let messageTipDataSource = new MessageTipDataSource({
    count: 0
});
