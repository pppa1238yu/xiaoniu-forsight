import {GridLayout} from "../common/GridLayout";
import {FocusEntity} from "../../model/entities/focus/FocusEntity";
import {observer} from "mobx-react";
@observer
export default class FocusAnalystCardGridLayout extends GridLayout<FocusEntity> {
    constructor(props, context?: any) {
        super(props, context);
    }
}