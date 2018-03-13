import {Resolver} from "fastjson_ref_resolver";
import {userDataSource} from "./UserService";
import Constants from "../../Constants";
import * as URLSearchParams from "url-search-params";
declare let fetch;
declare let escape;
declare let encodeURIComponent;

export enum Method { Get, Post }

export class Http {

    static readonly BASE_URL: string =
        (Constants.remoteHost.indexOf("localhost") == 0 ? 'http://': 'https://') + Constants.remoteHost;

    static defaultResolver = (response) => {
        if (!response || !response.ok) {
            throw Error(response.status);
        }
        return response.text().then(data => {
            //当服务器返回空白时,用json会出错
            if(!data){
                return null;
            }
            let json = new Resolver(JSON.parse(data)).resolve();
            if (json["login"] == false) {
                userDataSource.logout();
                throw Error("not login");
            }
            if (json["bindMainAccount"] == true) {
                document.location.href=json["bindHintUrl"]+"?redirectUrl="+escape(document.location.href);
            }
            return json;
        })
    };

    request(method: Method,
            uri: string,
            paramMap: object,
            resolver: (Response) => void = Http.defaultResolver): Promise<any> {
        if (method == Method.Post) {
            return this.post(uri, paramMap, resolver);
        }
        return this.get(uri, paramMap, resolver);
    }

    get(uri: string, paramMap: object, resolver: (Response) => void = Http.defaultResolver): Promise<any> {
        let url: string = Http.BASE_URL;
        if (uri.charAt(0) != '/') {
            url += '/';
        }
        url += uri;
        if (paramMap) {
            let concat: string = "?";
            if (uri.lastIndexOf("?") != -1) {
                concat = '&';
            }
            for (let key in paramMap) {
                url += concat + key + '=' + encodeURIComponent(paramMap[key]);
                concat = '&';
            }
        }
        let options = {
            credentials: 'include',
        };
        let result = fetch(url, options);
        if (resolver) {
            return result.then(resolver);
        } else {
            return result;
        }
    }

    post(uri: string, paramMap: object, resolver: (Response) => void = Http.defaultResolver): Promise<any> {
        let url: string = Http.BASE_URL;
        if (uri.charAt(0) != '/') {
            url += '/';
        }
        url += uri;
        let formData = new URLSearchParams();
        paramMap = paramMap ? paramMap : {};
        Object.keys(paramMap).forEach(key => formData.append(key, paramMap[key]));
        let options = {
            method: 'post',
            credentials: 'include',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: formData.toString()
        };
        let result = fetch(url, options);
        if (resolver) {
            return result.then(resolver);
        } else {
            return result;
        }
    }

    postJson(uri: string, json: object, resolver: (Response) => void = Http.defaultResolver): Promise<any> {
        let url: string = Http.BASE_URL;
        if (uri.charAt(0) != '/') {
            url += '/';
        }
        url += uri;
        let options = {
            method: 'post',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        };
        let result = fetch(url, options);
        if (resolver) {
            return result.then(resolver);
        } else {
            return result;
        }
    }
}

export let http: Http = new Http();
