import {RefDataSource} from "./DataSource";
import {http} from "./Http";
import {tipManager} from "../state/TipManager";
import {EntityType} from "../entities/EntityType";
import {stockFollowedState} from "../state/States";

export class SearchDataSource extends RefDataSource<any> {

    static ALL_SUGGEST = '/suggestion_all';
    static SINGLE_SUGGEST = '/suggestion_alone';

    all = false;
    key = '';
    type;
    mores = [];
    version = 0;
    empty = true;

    result = {};

    constructor() {
        super({});
    }

    restore() {
        this.version ++;
        this.result = {};
        this.result['STOCK'] = {value: [], more: false};
        this.result['RESEARCHER'] = {value: [], more: false};
        this.result['INDUSTRY'] = {value: [], more: false};
        this.result['SUBJECT'] = {value: [], more: false};

        this.empty = true;
    }

    isEmpty() {
        return this.result['STOCK'].value.length == 0 && this.result['RESEARCHER'].value.length == 0
            && this.result['INDUSTRY'].value == 0 && this.result['SUBJECT'].value.length == 0;
    }

    getMores = (mores) => {
        const result = {};
        result['RESEARCHER'] = mores[0];
        result['INDUSTRY'] = mores[1];
        result['STOCK'] = mores[2];
        result['SUBJECT'] = mores[3];
        return result;
    };

    static DEFAULT_SEARCH_LEN = 4;
    getSearchParam4All = (key, mores) => {
        const param = [];
        for (const index of mores) {
            if (index) {
                param.push(-1);
            } else {
                param.push(SearchDataSource.DEFAULT_SEARCH_LEN + 1);
            }
        }
        return {
            key: key,
            limit: param,
        }
    };

    getTypeValue = (type) => {
        let typeValue = "";
        switch (type) {
            case EntityType.STOCK:
                typeValue = "STOCK";
                break;
            case EntityType.RESEARCHER:
                typeValue = "RESEARCHER";
                break;
            case EntityType.SUBJECT:
                typeValue = "SUBJECT";
                break;
            case EntityType.INDUSTRY:
                typeValue = "INDUSTRY";
                break;
        }
        return typeValue;
    };

    getSearchParam4Single = (key, type) => {
        let typeValue = this.getTypeValue(type);
        return {
            key: key,
            type: typeValue,
            limit: -1,
        }
    };

    setResult(type, value, more) {
        let typeValue = this.getTypeValue(type);
        if (type == EntityType.STOCK) {
            stockFollowedState.processMultiWithSearch(value);
        }
        this.result[typeValue].value = value;
        this.result[typeValue].more = more;
    }

    request(all, key, mores = null, type = null, callback:Function = null) {
        if (!this.isSucc) {
            tipManager.hidden();
        }

        if (all) {
            this.version ++;
        }
        const version = this.version;
        const currentAll = all;
        const currentType = type;
        const currentMores = this.getMores(mores);
        this.all = all;
        this.key = key;
        this.mores = mores;
        this.type = type;

        this.refresh(
            (succ, error, value) => {
                if (!this.mount) {
                    return;
                }
                if (this.version != version) {
                    return;
                }

                if (!succ) {
                    tipManager.showTip("网络异常");
                } else if (succ) {
                    if (!currentAll) {
                        this.setResult(currentType, value, false);
                    } else {
                        for (const v of value) {
                            if (v.suggestionType == 'STOCK') {
                                stockFollowedState.processMultiWithSearch(v.queryResult);
                            }
                            this.result[v.suggestionType].value = v.queryResult;
                            if (currentMores[v.suggestionType]) {
                                this.result[v.suggestionType].more = false;
                            } else {
                                this.result[v.suggestionType].more = v.queryResult.length > SearchDataSource.DEFAULT_SEARCH_LEN;
                                if (this.result[v.suggestionType]) {
                                    this.result[v.suggestionType].value = v.queryResult.slice(0, SearchDataSource.DEFAULT_SEARCH_LEN);
                                }
                            }
                        }
                    }

                    if (callback) {
                        callback();
                    }
                }
            }
        );
    }

    protected onRefresh(): void {
        let result = null;
        if (this.all) {
            result = http.get(SearchDataSource.ALL_SUGGEST,
                this.getSearchParam4All(this.key, this.mores));
        } else {
            result = http.get(SearchDataSource.SINGLE_SUGGEST,
                this.getSearchParam4Single(this.key, this.type));
        }

        result.then(value => {
            this.success(value);
        }).catch(err => this.fail(err));
    }
}

export let searchDataSource: SearchDataSource = new SearchDataSource();
