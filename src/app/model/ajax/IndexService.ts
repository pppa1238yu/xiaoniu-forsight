import {ArrDataSource, RefDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {HotOpportunity} from "../entities/hotOpportunity/HotOpportunity";


class HotOpportunityDataSource extends ArrDataSource<HotOpportunity> {

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
                            this.notifyResult(false);
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

    protected get uri() {
        return "/hotPlat/summaries.json"
    }

    protected get paramMap() {
        return {}
    }
}

export let hotOpportunityDataSource = new HotOpportunityDataSource();