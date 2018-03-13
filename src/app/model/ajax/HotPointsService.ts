import {ArrDataSource, RefDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";

export class HotPointsDataSource extends ArrDataSource<any> {


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





    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request(callback?:Function) {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error) => {
                if (!succ && error && this.mount) {
                    tipManager.showTip("热词获取失败");
                }
                if(callback){
                    callback();
                }
            }
        );
    }

    protected get uri(){
        return "/prediction/hot-keywords.json"
    }

    protected get paramMap(){
        return {

        }
    }
}

export let hotPointsDataSource=new HotPointsDataSource();