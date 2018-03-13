import * as React from "react";
import {Util} from "../../Constants";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import AnalystViewPointList, {ViewPointListSource} from "../../components/analyst/AnalystViewPointList";


export default  class CollectViewList extends React.Component<any, any> {

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
            minHeight:'calc(100vh - 114px)'
        },
    };



    render() {

        let content = null;
        if (this.props.small || this.props.portrait) {
            content = (
                <div style={this.styles.containerSmall}>
                    <AnalystViewPointList viewPointSource={ViewPointListSource.MY_FAVOURITE}
                                          notifyResult={(err) => {this.props.onNotifyFirstLoad(err)}}
                                          small={this.props.small}
                                          portrait={this.props.portrait}
                                          showNoDataPic
                    />
                </div>
            );

        } else  {
            content = (
                <div className="fix-stocks-width" style={this.styles.container}>
                    <AnalystViewPointList viewPointSource={ViewPointListSource.MY_FAVOURITE}
                                          notifyResult={(err) => {this.props.onNotifyFirstLoad(err)}}
                                          fixDrawer={!this.props.middleDown}
                                          showNoDataPic
                    />
                </div>
            );

        }
        return (
            <div style={this.styles.root  as any}>
                {content}
            </div>
        )
    }
}