import * as React from "react";
import {observer} from "mobx-react";

import {RouteComponentProps} from "react-router";
import {CategoryType} from "../../model/entities/category/CategoryType";
import CategorySummaryView from "../../components/category/CategorySummaryView";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";

@observer
export default class IndustryIndexPage extends React.Component<RouteComponentProps<null>, null> {

    static path = '/industry';
    static title = '行业研究';
    static primaryTitle = (
        <div className="title-margin">
            <div className="primaryTitle">行业研究</div>
            <div className="subTitle">把握行业脉搏</div>
        </div>
    );
    pop = false;

    widthNotifier: WidthNotifier = null;

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        if (this.props.history.action == 'POP') {
            this.pop = true;
            //don't restore
        }

        Util.scrollTopInstant();
    }

    componentDidMount() {
        barInteraction.title = IndustryIndexPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
    }

    render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);

        return (
            <CategorySummaryView categoryType={CategoryType.Industry}
                                 small={small}
                                 portrait={portrait}
                                 fixDrawer={fixDrawer}
                                 pop={this.pop}
                />
        );
    }
}

