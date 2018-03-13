import {Simulate} from "react-dom/test-utils";
import mouseUp = Simulate.mouseUp;
import {green500, grey500, red500, grey700} from "material-ui/styles/colors";
export enum DeviceType {
    MOBILE,
    TABLET_PORTRAIT,
    TABLET_LANDSCAPE,
    DESKTOP,
}

export default class Constants {
    static readonly devices = {
        s: {
            maxWidth: 600,
        },
        m_p: {
            maxWidth: 840,
        },
        m_l: {
            maxWidth: 1050,
        },
        l: {
            maxWidth: 1200,
        }
    };
    static readonly title = '小牛数据';

    static readonly drawerWidth = 256;

    static readonly barHeight = 64;

    static readonly remoteHost = "foresight.dev.com";

    static readonly mWechatLoginRequestUrl = window.location.protocol + '//' + Constants.remoteHost + "/login/mWechatLoginRequest.do";

    static readonly noDataImage = "/images/nodata.png";

    static readonly cardWidth = 320;

    static readonly listPadding = 15;

    static readonly imageBaseUrl = window.location.protocol + "//common.calfdata.com/attach/";

    static readonly noDataHeadImg = "/images/avatar_analyst.png";

    static NotifyBoxShow = true;

    static messageChangeIndex = 0;

    static smartTotalScore = 0;

    static readonly colors = {
        red: '#F04B5B',
        green: '#2BBE65',
        lines: ['#FFC132', '#90DCF6', '#FC5FC8', '#1160A8']
    };

    static extraPrefix = 'extra.html#';

}

declare let $;

export class Util {
    static emailRe = new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    static phoneRe = new RegExp('^1[0-9]{10}$|^[569][0-9]{7}$/');

    static date() {
        const d = new Date();

        let month = "" + (d.getMonth() + 1);
        if (month.length < 2) {
            month = "0" + month;
        }
        let day = "" + d.getDate();
        if (day.length < 2) {
            day = "0" + day;
        }

        let hours = "" + d.getHours();
        if (hours.length < 2) {
            hours = "0" + hours;
        }

        let minutes = "" + d.getMinutes();
        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }

        let seconds = "" + d.getSeconds();
        if (seconds.length < 2) {
            seconds = "0" + seconds;
        }

        return [d.getFullYear(), month, day].join('-') + ' ' +
            [hours, minutes, seconds].join(':');

    }

    /*
     static moneyFormatter = new Intl.NumberFormat('en-US',
     {minimumFractionDigits: 2});
     */


    static validateEmail(email) {
        return Util.emailRe.test(email);
    }

    static validatePhone(phone) {
        return Util.phoneRe.test(phone);
    }

    static formatMoney2(money) {
        return money.toFixed(2);
    }

    static precisionIncrement(value) {
        value = value.toFixed(2);
        const prefixAdd = !(value < 0);
        if (prefixAdd) {
            value = "+" + value;
        }
        return value;
    }

    static precisionRate(value, number) {
        const prefixAdd = !(value < 0);
        let result: any = value * 100;
        result = result.toFixed(number) + "%";
        if (prefixAdd) {
            result = "+" + result;
        }
        return result;

    }

    static precisionRate2(value, number, type?) {
        const prefixAdd = !(value < 0);
        let result: any = value;
        if (type) {
            result = result * 100;
        }
        result = result.toFixed(number) + "%";
        if (prefixAdd) {
            result = "+" + result;
        }
        return result;

    }

    static device(width: number): DeviceType {
        if (width <= Constants.devices.s.maxWidth) {
            return DeviceType.MOBILE;
        } else if (width <= Constants.devices.m_p.maxWidth) {
            return DeviceType.TABLET_PORTRAIT;
        } else if (width <= Constants.devices.m_l.maxWidth) {
            return DeviceType.TABLET_LANDSCAPE;
        }
        return DeviceType.DESKTOP;
    }

    static middleDown(type) {
        return !(type == DeviceType.DESKTOP);
    }

    static fixDrawer(type) {
        return type == DeviceType.DESKTOP;
    }

    static small(type) {
        return type == DeviceType.MOBILE;
    }

    static portrait(type) {
        return type == DeviceType.TABLET_PORTRAIT;
    }

    static smallAndPortrait(type) {
        return type == DeviceType.TABLET_PORTRAIT
            || type == DeviceType.MOBILE;
    }

    static contentWidth(width: number) {
        let deviceType = Util.device(width);
        if (Util.fixDrawer(deviceType)) {
            return width - Constants.drawerWidth;
        } else {
            return width;
        }
    }

    static scrollTop() {
        $('html, body').animate({scrollTop: 0}, {duration: 400, queue: false, easing: 'easeOutCubic'});
    }


    static scrollTopInstant() {
        window.scrollTo(0, 0);
    }

    static isIE() {
        const ua = window.navigator.userAgent;
        const msie = ua.indexOf("MSIE ");

        if (msie > 0) {
            return true;
        } else {
            return false;
        }

    }
}
export class Collections {

    static distinct<T>(arr: Array<T>, fieldExtract: (T: T) => any): Array<T> {

        let symbols = arr.map(fieldExtract);
        let symbolsUnique = Collections.unique(symbols);
        let indexesUnique = symbolsUnique.map(uniqueEle => {
            return symbols.indexOf(uniqueEle)
        });

        return indexesUnique.map(e => {
            return arr[e]
        });

    }

    static unique(data) {
        let res = [];
        let json = {};
        for (let i = 0; i < data.length; i++) {
            if (!json[data[i]]) {
                res.push(data[i]);
                json[data[i]] = 1;
            }
        }
        return res;
    }

    static numberColor(num) {
        if (num > 0) {
            return red500
        } else if (num < 0) {
            return green500
        } else {
            return grey700
        }
    }

    static getPercentage(num) {
        let result;
        if (num) {
            result = (num * 100).toFixed(2) + "%";
        } else if(num===0){
            result = 0;
        }else{
            result="-"
        }

        return result;
    }

}




