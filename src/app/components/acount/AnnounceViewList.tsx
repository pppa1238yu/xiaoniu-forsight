import * as React from "react";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {RecommendedSystemView, RecommendedListSource} from "../../components/index/RecommendedSystemView";

export default  class AnnounceViewList extends React.Component<any, any> {
    widthNotifier: WidthNotifier = null;
    styles = {
        hidden: {
            visibility: 'hidden',
        },
        floatButton: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
        containerSmall: {
        },
        container: {
            paddingTop:1,
            paddingBottom: 48,
        },
        root: {
            position: 'relative',
            minHeight:'100vh',
            top:1
        },
    };

    render() {
        let content = null;

        content = (
            <div className="fix-stocks-width" style={this.styles.container}>
                <RecommendedSystemView recommendedSource={RecommendedListSource.MY_FAVOURITE}
                                       notifyResult={(err) => {
                                           this.props.onNotifyFirstLoad(err)
                                       }}
                                       small={this.props.small}
                                       fixDrawer={!this.props.middleDown}
                                       showNoDataPic
                />
            </div>
        );


        return (
            <div style={this.styles.root  as any}>
                {content}
            </div>
        )
    }
}