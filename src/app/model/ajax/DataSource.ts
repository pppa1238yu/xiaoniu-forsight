import {observable, runInAction} from "mobx";
import {Page} from "../entities/Page";
import Updater from "../state/Updater";
import {tipManager} from "../state/TipManager";

export abstract class DataSource<T> extends Updater {

    private static readonly EMPTY_HANDLER: () => void = () => {};

    @observable loading: boolean = false;

    @observable error?: string = null;

    isSucc: boolean = true;

    protected pendingHandler: (succ?:boolean, error?:any, value?:any) => void;

    protected currentHandler: (succ?:boolean, error?:any, value?:any) => void;

    mount = false;

    setMount(mount) {
        this.mount = mount;
        if (!this.mount) {
            tipManager.hidden();
        }
    }

    refresh(handler: (succ?:boolean, error?:any, value?: any) => void = null): void {
        runInAction(() => {
            this.error = null;
            this.isSucc = true;
            if (!handler) {
                handler = DataSource.EMPTY_HANDLER;
            }
            if (this.loading) {
                this.pendingHandler = handler;
            } else {
                this.currentHandler = handler;
                this.loading = true;
                this.onRefresh();
            }
        });
    }

    protected success(value: T): void {
        runInAction(() => {
            if (!this.loading) {
                //ignore
                console.error("当前DataSource并不处于loading状态");
                return;
                //throw new Error("当前DataSource并不处于loading状态");
            }
            if (value && ((value as any).success != false)) {
                this.onSuccess(value);
                this.doUpdate();
            } else {
                //fail or onReset ?
                //this.onReset();
                throw new Error("需要数据");
            }

            //remove finally
            //only success
            try {
                this.currentHandler(true, null, value);
            } catch (error) {
                console.error("success & deal handler fail.", error);
                //ignore this error
            } finally {
                let ph: () => void = this.pendingHandler;
                if (ph) {
                    this.pendingHandler = null;
                    this.currentHandler = ph;
                    this.onRefresh();
                } else {
                    this.loading = false;
                }
            }
        });
    }

    protected fail(err: string): void {
        runInAction(() => {
            console.warn(err);
            try {
                this.isSucc = false;
                this.error = err;
                this.onFail(this.error);
                this.doUpdate();
            } catch (error) {
                console.error("fail & deal handler fail.", error);
            } finally {
                try {
                    this.currentHandler(false, this.error);
                } finally {
                    let ph: () => void = this.pendingHandler;
                    if (ph) {
                        this.pendingHandler = null;
                        this.currentHandler = ph;
                        this.onRefresh();
                    } else {
                        this.loading = false;
                    }
                }
            }
        });
    }

    reset(): void {
        runInAction(() => {
            this.error = null;
            this.loading = false;
            this.onReset();
        });
    }

    protected onFail(err): void {}

    protected abstract onRefresh(): void;

    protected abstract onSuccess(value: T): void;

    protected abstract onReset(): void;

    public abstract get $():T;
}

export abstract class ReloadableDataSource<T> extends DataSource<T>{

    protected params:object;

    public reloadData(params:object){
        if(params){
            this.params=params
        }
        this.refresh();
    }
}

export abstract class ArrDataSource<E> extends ReloadableDataSource<Array<E>> {

    readonly $: Array<E> = [];

    protected onSuccess(value: Array<E>): void {
        this.$.splice(0, this.$.length);
        this.$.push(...value);
    }

    protected onReset(): void {
        this.$.splice(0, this.$.length);
    }
}

export abstract class AppendableDataSource<E> extends ReloadableDataSource<Array<E>> {

    readonly $: Array<E> = [];

    protected onSuccess(value: Array<E>): void {
        this.$.push(...value);
    }

    protected onReset(): void {
        this.$.splice(0, this.$.length);
    }
}

export abstract class PageDataSource<E> extends ReloadableDataSource<Page<E>> {

    readonly $: Page<E> = {
        pageIndex: 0,
        pageSize: 0,
        pageCount: 0,
        totalRowCount: 0,
        entities: []
    };

    protected onSuccess(value: Page<E>): void {
        this.$.pageIndex = value.pageIndex;
        this.$.pageCount = value.pageCount;
        this.$.totalRowCount = value.totalRowCount;
        this.$.entities.splice(0, this.$.entities.length);
        if (value.entities) {
            this.$.entities.push(...value.entities);
        }
    }

    protected onReset(): void {
        this.$.pageIndex = 0;
        this.$.pageCount = 0;
        this.$.totalRowCount = 0;
        this.$.entities.splice(0, this.$.entities.length);
    }
}

export abstract class RefDataSource<E> extends ReloadableDataSource<E> {

    @observable readonly $: E;

    private defaultValue: E;

    constructor(defaultValue: E, initValue?: E) {
        super();
        this.defaultValue = defaultValue;
        if (initValue) {
            let value: E = (<any>Object).assign({}, initValue);
            this.$ = observable(value);
        } else {
            let value: E = (<any>Object).assign({}, defaultValue);
            this.$ = observable(value);
        }
    }

    protected onSuccess(value: E): void {
        RefDataSource.assign(this.$, value);
    }

    protected onReset(): void {
        RefDataSource.assign(this.$, this.defaultValue);
    }

    private static assign(target, source) {
        for (let member in target) {
            let targetValue: any = target[member];
            let sourceValue: any = source[member];
            if (targetValue === sourceValue) {
                continue;
            }
            if (targetValue instanceof Array) {
                targetValue.splice(0, targetValue.length);
                if (sourceValue != null) {
                    targetValue.push(...<Array<any>>sourceValue);
                }
            } else if (typeof targetValue == 'object') {
                RefDataSource.assign(targetValue, sourceValue || {});
            } else {
                target[member] = sourceValue;
            }
        }
    }
}
export abstract class ObjDataSource<E> extends ReloadableDataSource<E> {
    $: E;
    protected onSuccess(value: E): void {
        this.$=value;
    }

    protected onReset(): void {
        this.$=null;
    }
}
