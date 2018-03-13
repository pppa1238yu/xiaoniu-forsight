/*
 * ======================================================================
 * WechatShareUtil.ts
 * Copyright (c) 2016 Chengdu Lanjing Data&Information Co., Ltd
 *
 * =======================================================================
 */
import {http} from "../model/ajax/Http";
declare let wx;
export class ShareData {
    constructor(public title: string,//分享标题
                public desc: string,//分享描述
                public link: string,//分享的链接，通常是window.location.href
                public imgUrl: string,//分享的图片，通常是公司的LOGO
                public success=()=>{},//成功时的回调
                public cancel=()=>{}) {//取消分享时的回调
    }
}
export class WechatShareUtil {
    static readonly jsTicketUrl = '/wechat/jsTicket.json';

    static intializeJsApi(shareData:ShareData) {
        http.post(WechatShareUtil.jsTicketUrl, {url: encodeURI(shareData.link.split('#')[0])})
            .then(data => {
                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        'onMenuShareTimeline',//分享到朋友圈
                        'onMenuShareAppMessage',//分享给朋友
                        'onMenuShareQQ',//分享到QQ
                        'onMenuShareWeibo',//分享到腾讯微博
                        'onMenuShareQZone'//分享到QQ空间
                    ]
                });

                wx.ready(function () {
                    //分享到朋友圈时因为只显示标题，将描述显示为标题
                    let shareTimeLineData:ShareData=new ShareData(shareData.desc,"",shareData.link,shareData.imgUrl);
                    wx.onMenuShareTimeline(shareTimeLineData);
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareQQ(shareData);
                    wx.onMenuShareWeibo(shareData);
                    wx.onMenuShareQZone(shareData);
                });
                wx.error(function (res) {
                    console.log(res.errMsg);
                });
            })
            .catch(err => console.log(err));
    }
}
