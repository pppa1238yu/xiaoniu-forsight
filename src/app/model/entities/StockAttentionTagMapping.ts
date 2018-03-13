import {StockAttention} from "./StockAttention";
import {StockTag} from "./StockTag";
export class StockAttentionTagMapping {
    id: number;

    stockTag: StockTag;

    stockAttention: StockAttention;

    delete: number;

    dateCreated: Date;

    dateDeleted: Date;
}