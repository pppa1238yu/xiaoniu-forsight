import {UserForm} from "../entities/UserForm";
import {observable} from "mobx";
import {http} from "./Http";
import Updater from "../state/Updater";

//未登录只能看未登录首页
export class UserDataSource extends Updater {

    $: UserForm;

    @observable
    login: boolean = false;

    constructor(initValue: UserForm) {
        super();

        this.$ = initValue;
        this.login = !!initValue;
    }

    static uri = "/login/login.do";

    replaceInfo(value: UserForm) {
        let userForm = new UserForm();
        (Object as any).assign(userForm, value);
        this.$ = userForm;
        this.doUpdate();
    }

    loginSuc(value: UserForm) {
        let userForm = new UserForm();
        (Object as any).assign(userForm, value);
        this.$ = userForm;
        this.login = true;
    }


    logout(): void {
        if (!this.login) {
            return;
        }
        this.login = false;
        //history.push("/");
    }

    reloadUserInfo() {
        http.post(UserDataSource.uri, {})
            .then(value => {
                if (value.success == false) {

                } else {
                    this.replaceInfo(value);
                }
            })
    }

    reloadLogin() {
        http.post(UserDataSource.uri, {})
            .then(value => {
                if (value) {
                    this.replaceInfo(value);
                }
            })
    }

}

export let userDataSource: UserDataSource = new UserDataSource(
    null
);
declare let $;
declare let __user_info__;

/*$(function () {//页面加载完判断登录状态
    if (__user_info__) {
        userDataSource.loginSuc(__user_info__);
    } else {
        userDataSource.reloadLogin();
    }
});*/

if (__user_info__) {
    userDataSource.loginSuc(__user_info__);
}


/*

 userDataSource.loginSuc({
 userId: '胸口',
 fullName: '胸口',
 gender: 'M',
 telePhone: '123213',
 wechatName: '胸口该',
 } as any);
 */


