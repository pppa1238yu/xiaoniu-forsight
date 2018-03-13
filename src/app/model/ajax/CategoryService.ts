import {observable, runInAction} from "mobx";
import {PageDataSource, RefDataSource} from "./DataSource";
import {http} from "./Http";
import {TimeWindowUnit} from "../entities/TimeWindowUnit";
import {CategorySummary} from "../entities/category/CategorySummary";
import CategoryTendency from "../entities/category/CategoryTendency";
import TimeWindow from "../entities/TimeWindow";
import {IndustryInfo} from "../entities/category/IndustryInfo";
import {CategoryInfo} from "../entities/category/CategoryInfo";
import {CategorySortedType} from "../entities/category/CategorySortedType";
import {Objects} from "../Objects";
import {industryFollowedState, subjectFollowedState} from "../state/States";
import {tipManager} from "../state/TipManager";
import {StockAssociated} from "../entities/category/StockAssociated";

const TIME_WINDOW = 'timeWindow';

export abstract class CategorySummaryDataSource extends PageDataSource<CategorySummary> {
    filters = {};
    sort: CategorySortedType;
    time: number;
    requestPageIndex = 0;
    clearMore: boolean = false;
    isMore: boolean = false;
    more: Array<CategorySummary> = [];

    @observable first = true;

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

                this.processFollowed(this.$.entities);
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

    protected abstract processFollowed(categories);

    protected onReset(): void {
        super.onReset();
    }

    restore() {
        this.filters = {};
        this.sort = CategorySortedType.ReportCount;

        this.first = true;
        this.more = [];
        this.requestPageIndex = 0;
        this.clearMore = false;
        this.time = 2;
        this.setTime(this.time);
    }

    setSort(value) {
        this.sort = value;

        this.requestPageIndex = 0;
        this.clearMore = true;
    }

    public setTime(value) {
        this.time = value;
        switch (this.time) {
            case 0:
                this.filters[TIME_WINDOW] = new TimeWindow(0, TimeWindowUnit.Day);
                break;
            case 1:
                this.filters[TIME_WINDOW] = new TimeWindow(5, TimeWindowUnit.Day);
                break;
            case 2:
                this.filters[TIME_WINDOW] = new TimeWindow(10, TimeWindowUnit.Day);
                break;
            default:
                this.filters[TIME_WINDOW] = new TimeWindow(20, TimeWindowUnit.Day);
                break;
        }
        this.requestPageIndex = 0;
        this.clearMore = true;
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

    private requestCategory(): Promise<any> {
        const paramMap = {
            timeWindowValue: this.filters[TIME_WINDOW].value,
            timeWindowUnit: TimeWindowUnit[this.filters[TIME_WINDOW].unit].toUpperCase(),
            pageIndex: this.requestPageIndex,
            pageSize: 36,
            sortedType: Objects.javaConstantName(CategorySortedType[this.sort]),
        };
        return http.get(this.uri, paramMap);
    }

    protected onRefresh(): void {
        this.requestCategory()
            .then(value => {
                runInAction(() => {
                    this.success(value);
                    if (this.first) {
                        this.first = false;
                    }
                });

            }).catch(err => this.fail(err));
    }

    protected abstract get uri(): string;

}

class IndustrySummaryDataSource extends CategorySummaryDataSource {

    protected get uri(): string {
        return '/industry/summary-page.json';
    }

    protected processFollowed(categories) {
        industryFollowedState.processMulti(categories);
    }
}

export let industrySummaryDataSource = new IndustrySummaryDataSource();

class SubjectSummaryDataSource extends CategorySummaryDataSource {

    protected get uri(): string {
        return '/subject/summary-page.json';
    }

    protected processFollowed(categories) {
        subjectFollowedState.processMulti(categories);
    }
}

export let subjectSummaryDataSource = new SubjectSummaryDataSource();

export abstract class CategoryTendencyRefDataSource extends RefDataSource<CategoryTendency> {

    @observable identifier: string;

    @observable timeWindowValue: number;

    @observable timeWindowUnit: TimeWindowUnit;

    constructor(timeWindow: TimeWindow = new TimeWindow(1, TimeWindowUnit.Year)) {
        super({
            dates: [],
            indexes: [],
            sh300Indexes: [],
            marketValues:[]
        });
        this.timeWindowValue = timeWindow.value;
        this.timeWindowUnit = timeWindow.unit;
    }

    protected onRefresh(): void {
        let paramMap = {
            timeWindowValue: this.timeWindowValue,
            timeWindowUnit: TimeWindowUnit[this.timeWindowUnit].toUpperCase()
        };
        paramMap[this.identifierName] = this.identifier;
        http
            .get(this.uri, paramMap)
            .then(value => {
                this.proc(value);
                this.success(value);
            })
            .catch(err => this.fail(err));
    }

    protected abstract get uri(): string;

    protected abstract get identifierName(): string;

    private proc(tendency: CategoryTendency): void {
        if (tendency && tendency.dates) {
            let dates: Array<any> = tendency.dates;
            for (let i: number = dates.length - 1; i >= 0; --i) {
                dates[i] = new Date(dates[i]);
            }
        }
    }
}

export class SubjectTendencyRefDataSource extends CategoryTendencyRefDataSource {

    protected get uri(): string {
        return "/subject/tendency.json";
    }

    protected get identifierName(): string {
        return "subjectCode";
    }
}

export class IndustryTendencyRefDataSource extends CategoryTendencyRefDataSource {

    protected get uri(): string {
        return "/industry/tendency.json";
    }

    protected get identifierName(): string {
        return "industryCode";
    }
}

export class SubjectInfoRefDataSource extends RefDataSource<CategoryInfo> {

    code: string;
    resultNotify = null;

    setResultNotify(resultNotify) {
        this.resultNotify = resultNotify;
    }

    constructor(code: string) {
        super({
            code: code, //Very important to set the code before ajax response
            followed: false,
            name: "",
            index: 0,
            indexIncrementValue: 0,
            indexIncrementRate: 0,
            productNames: [],
            stockIncrements: [],
            positiveStockCount: 0,
            stableStockCount: 0,
            negativeStockCount: 0
        });
        this.code = code;
    }


    protected onRefresh(): void {
        let paramMap = {subjectCode: this.code};
        http
            .get("/subject/info.json", paramMap)
            .then(value => {
                this.success(value);
                if (this.resultNotify != null) {
                    this.resultNotify(false);
                    this.resultNotify = null;
                }
            })
            .catch(err => {
                this.fail(err);
                if (this.resultNotify != null) {
                    this.resultNotify(true);
                    this.resultNotify = null;
                }
            });
    }

    onSuccess(value) {
        super.onSuccess(value)
        subjectFollowedState.process(value);
    }

    protected onReset(): void {
        super.onReset();
        this.$.code = this.code;
    }
}

export class IndustryInfoRefDataSource extends RefDataSource<IndustryInfo> {
    code: string;
    resultNotify = null;

    setResultNotify(resultNotify) {
        this.resultNotify = resultNotify;
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        industryFollowedState.process(value);
    }

    constructor(code: string) {
        super({
            code: code, //Very important to set the code before ajax response
            name: "",
            followed: false,
            index: 0,
            indexIncrementValue: 0,
            indexIncrementRate: 0,
            productNames: [],
            stockIncrements: [],
            positiveStockCount: 0,
            stableStockCount: 0,
            negativeStockCount: 0,
            grossProfitRate: 0,
            financingResidualAmount: 0,
            financingResidualAmountDayIncrement: 0,
            priceEarningRatio: 0,
            liftingMarketValue: 0,
            liftingMarketValueQuarterIncrement: 0
        });
        this.code = code;
    }

    protected onRefresh(): void {
        let paramMap = {industryCode: this.code};
        http
            .get("/industry/info.json", paramMap)
            .then(value => {
                this.success(value);
                if (this.resultNotify != null) {
                    this.resultNotify(false);
                    this.resultNotify = null;
                }
            })
            .catch(err => {
                this.fail(err);
                if (this.resultNotify != null) {
                    this.resultNotify(true);
                    this.resultNotify = null;
                }
            });
    }

    protected onReset(): void {
        super.onReset();
        this.$.code = this.code;
    }
}


export class StockAssociatedDataSource extends PageDataSource<StockAssociated> {

    @observable more = [];
    first = true;
    symbol: string;
    requestPageIndex = 0;
    resultNotify = null;
    type: string;

    setResultNotify(resultNotify) {
        this.resultNotify = resultNotify;
    }

    setRequestId(symbol) {
        this.symbol = symbol;
    }

    setRequestPageIndex(value) {
        this.requestPageIndex = value;
        //clear
        //考虑大屏幕手机横竖切换
        this.more = [];
    }

    requestMore() {
        this.requestPageIndex = this.$.pageIndex + 1;
    }

    protected onReset(): void {
        super.onReset();
    }

    restore() {
        this.more = [];
        this.requestPageIndex = 0;
        this.first = true;
    }

    request(): Promise<any> {
        return http.post(this.uri, this.params)
    }

    protected onRefresh(): void {
        tipManager.hidden();
        if (this.first) {
            this.request()
                .then(value => {
                    runInAction(() => {
                        this.success(value);
                        this.first = false;
                        this.more.push(...this.$.entities);
                        if (this.resultNotify != null) {
                            this.resultNotify(false);
                            this.resultNotify = null;
                        }
                    });
                }).catch(err => {
                this.fail(err);
                if (this.resultNotify != null) {
                    this.resultNotify(true);
                    this.resultNotify = null;
                }
            });
        } else {
            this.request()
                .then(value => {
                    runInAction(() => {
                        this.success(value);
                        this.more.push(...this.$.entities);
                    });
                }).catch(err => {
                this.fail(err);
                tipManager.showTip("获取个股关联信息失败！");
            });
        }

    }

    protected get uri() {
        if (this.type == "subject") {
            return "/subject/subjectDetails.json"
        } else {
            return "/industry/industryDetails.json"
        }
    }

    protected get params() {
        if (this.type == "subject") {
            return {subjectCode: this.symbol, pageIndex: this.requestPageIndex}
        } else {
            return {industryCode: this.symbol, pageIndex: this.requestPageIndex}
        }
    }
}

export let stockAssociatedDataSource = new StockAssociatedDataSource();



