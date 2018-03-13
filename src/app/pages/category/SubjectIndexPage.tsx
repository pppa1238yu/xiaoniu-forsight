import * as React from "react";
import {observer} from "mobx-react";

import CategorySummaryView from "../../components/category/CategorySummaryView";
import {RouteComponentProps} from "react-router";
import {CategoryType} from "../../model/entities/category/CategoryType";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";

@observer
export default class SubjectSummaryPage extends React.Component<RouteComponentProps<null>, null> {

    static path = '/subject';
    static title = '题材机会';
    static primaryTitle = (
        <div className="title-margin">
            <div className="primaryTitle">题材机会</div>
            <div className="subTitle">市场热点聚焦</div>
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
        barInteraction.title = SubjectSummaryPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
    }

    render() {
        const small = Util.small(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        return (
            <CategorySummaryView categoryType={CategoryType.Subject}
                                 small={small}
                                 fixDrawer={fixDrawer}
                                 portrait={portrait}
                                 pop={this.pop}
            />
        );
    }
}

