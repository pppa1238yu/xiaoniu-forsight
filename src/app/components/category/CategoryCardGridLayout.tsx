import {GridLayout, GridLayoutProps} from "../common/GridLayout";
import {CategorySummary} from "../../model/entities/category/CategorySummary";
import {observer} from "mobx-react";

@observer
export default class CategoryCardGridLayout extends GridLayout<CategorySummary> {

    constructor(props: GridLayoutProps<CategorySummary>, context?: any) {
        super(props, context);
    }
}