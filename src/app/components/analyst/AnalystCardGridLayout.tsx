import {GridLayout, GridLayoutProps} from "../common/GridLayout";
import {observer} from "mobx-react";
import {Researcher} from "../../model/entities/Researcher";
import {Follow} from "../../model/entities/Follow";

@observer
export default class AnalystCardGridLayout extends GridLayout<Follow<Researcher>> {

    constructor(props: GridLayoutProps<Follow<Researcher>>, context: any) {
        super(props, context);
    }
}