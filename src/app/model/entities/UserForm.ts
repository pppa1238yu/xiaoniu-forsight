
export class UserForm {
    userId: string;

    fullName: string;

    gender: string;

    telePhone?: string;

    wechatName?: string;

    inviteCode?:  string;
    get hasTelePhone(){
        return !!this.telePhone;
    }
    get hasWechat(){
        return !!this.wechatName;
    }
}
