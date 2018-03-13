import {GridLayout} from "../common/GridLayout";
import {CategorySummary} from "../../model/entities/category/CategorySummary";
import {observer} from "mobx-react";
@observer
export default class FocusIndustryCardLayout extends GridLayout<CategorySummary> {
    constructor(props, context?: any) {
        super(props, context);
    }
}