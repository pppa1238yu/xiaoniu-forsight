import {observable, runInAction} from "mobx";
import {PageDataSource} from "./DataSource";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";
import {Message}  from "../entities/message/Message";


export class MessageService extends PageDataSource<Message<any>> {

    uri = "/messages/getMessages";

    requestPageIndex = 0;
    clearMore = false;
    isMore = false;
    message = false;
    more = [];
    @observable first = true;
    firstValue = null;

    request(callback: Function = null) {
        tipManager.hidden();
        this.refresh(
            (succ) => {
                if (!succ && this.mount) {
                    tipManager.showRefresh(() => {
                        this.request();
                    });
                } else if (succ && this.mount && callback) {
                    callback();
                }
            }
        );
    }

    constructor() {
        super();
        this.restore();
    }

    protected onSuccess(value): void {
        runInAction(() => {
                super.onSuccess(value);
                if (this.isMore) {
                    if (this.clearMore) {
                        this.more = [];
                    }
                    for (const entity of this.$.entities) {
                        this.more.push(entity);
                    }
                }
            }
        );
    }

    protected onReset(): void {
        super.onReset();
    }

    restore() {
        this.first = true;
        this.firstValue = null;
        this.more = [];
        this.requestPageIndex = 0;
        this.clearMore = false;
    }

    setRequestPageIndex(value) {
        this.requestPageIndex = value;
        //clear
        //考虑大屏幕手机横竖切换
        this.more = [];
    }

    requestMore() {
        this.requestPageIndex = this.$.pageIndex + 1;
        this.clearMore = false;
    }

    onLoad(err, value = null) {
        if (this.error || !this.first) {
            return;
        }
        if (err) {
            this.fail(err);
        } else {
            try {
                this.success(value);
                this.first = false;
            } catch (err) {
                this.fail(err);
            }
        }
    }

    private requestMessages(): Promise<any> {
        const paramMap = {
            pageIndex: this.requestPageIndex,
            pageSize: 20,
        };
        return http.post(this.uri, paramMap);
    }

    protected onRefresh(): void {
        let result = this.requestMessages();
        if (this.first) {
            result.then(value => {
                if (value) {
                } else {
                    throw new Error("common filter fail.")
                }
                this.onLoad(false, value);
            }).catch(err => this.onLoad(err));
        } else {
            result.then(value => {
                this.success(value);
            }).catch(err => this.fail(err));
        }
    }
}

export let messageDatasource: MessageService = new MessageService();
