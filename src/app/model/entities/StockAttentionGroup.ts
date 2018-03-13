import {StockAttentionInfo} from "./StockAttentionInfo";
export class StockAttentionGroup {
    id: number;
    tag: string;
    stocks: Array<StockAttentionInfo>;
    dataCreated: Date;
}