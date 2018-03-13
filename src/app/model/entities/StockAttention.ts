import {Stock} from "./Stock";
import {StockAttentionTagMapping} from "./StockAttentionTagMapping";
export class StockAttention {

    id: number;

    userId: number;

    stock: Stock;

    price: number;

    priceDate: Date;

    delete: number;

    attentionTags: Array<StockAttentionTagMapping>;

    dateCreated: Date;

    dateDeleted: Date;
}