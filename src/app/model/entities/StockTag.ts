import {StockAttentionTagMapping} from "./StockAttentionTagMapping";
export class StockTag {

    id: number;

    attentionTags: Array<StockAttentionTagMapping>;

    tag: string;

    dateCreated: Date;

    createBy: Date;

    dateUpdated: Date;

    updateBy: Date;
}