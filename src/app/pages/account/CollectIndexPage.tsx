import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Tab, Tabs} from "material-ui/Tabs";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import AnalystViewPointList, {ViewPointListSource} from "../../components/analyst/AnalystViewPointList";
import {observable,runInAction} from "mobx";
import {FirstLoading, FixLoading} from "../../components/common/Loading";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import CollectViewList from "../../components/acount/CollectViewList";
import {
    red500,
    white,
} from "material-ui/styles/colors";

import {
    myFavouriteViewPointList,
} from "../../model/ajax/ViewPointListService";
import {RecommendedSystemView, RecommendedListSource} from "../../components/index/RecommendedSystemView";
import AnnounceViewList  from "../../components/acount/AnnounceViewList";
enum IndexComponent {
    ANNNOUNCE,
    RESEARCH
}

@observer
export default  class CollectIndexPage extends React.Component<RouteComponentProps<null>, null> {
    static path = '/collect';
    static title = '我的收藏';

    styles = {
        hidden: {
            visibility: 'hidden',
        },
        root: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        tabs: {
            position: 'relative',
            zIndex: 0,
            width: '100%',
            fontSize: '14px',
            borderBottom: '1px solid #393f4f'
        },
        inkBarStyle: {
            backgroundColor: red500
        },
        containerStyle: {
            backgroundColor: white
        },
        labelColor: {
            color: '#616161',
        },
        paddingTop:  {
            paddingTop:6
        },
        morePadding: {
            paddingTop:'1px',
            minHeight:'calc(100vh - 114px)'
        },
        calcMinHeight:{
            minHeight:'calc(100vh - 114px)'
        }
    };

    mount = true;

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = CollectIndexPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        this.mount = false;
        barInteraction.restore();
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    firstLoading = [];

    restore() {
        this.firstLoading = [false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
        }
    }

    onNotifyFirstLoad = (index, err) => {
        if (!this.first || this.error) {
            return;
        }
        if (this.firstLoading[index]) {
            return;
        }
        if (err) {
            this.error = true;
            this.setError();
        } else {
            this.firstLoading[index] = true;
            let all = true;
            for (const value of this.firstLoading) {
                if (!value) {
                    all = false;
                    break;
                }
            }
            if (all) {
                this.first = false;
                fixButtonManager.showOnlyUp();
            } else {
                //continue wait
            }

        }
    };

    @observable first = true;
    @observable error = false;

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        this.restore();
        Util.scrollTopInstant();
    }

    render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const middleDown = Util.middleDown(this.widthNotifier.device);

        // 判断加载状态
        let firstLoad = null;

        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        }

        return (
            <div style={this.styles.root as any}>
                {firstLoad}
                <div style={this.first ? this.styles.hidden : {}}>
                    <Tabs
                        style={this.styles.tabs as any}
                        inkBarStyle={this.styles.inkBarStyle}
                        tabItemContainerStyle={this.styles.containerStyle}
                    >
                        <Tab
                            role="noticeTab"
                            label="公告"
                            style={this.styles.labelColor}
                        >
                            <div className={small?"":"fix-stocks-width"}>
                                <div style={small?{}:this.styles.morePadding as any}>
                                    <RecommendedSystemView recommendedSource={RecommendedListSource.MY_FAVOURITE}
                                                           notifyResult={(err) => {
                                                               this.onNotifyFirstLoad(IndexComponent.ANNNOUNCE, err)
                                                           }}
                                                           small={small}
                                                           fixDrawer={!middleDown}
                                                           showNoDataPic
                                    />
                                </div>
                            </div>
                        </Tab>
                        <Tab
                            role="reportTab"
                            label="研报"
                            style={this.styles.labelColor}
                        >
                            <div style={small?{}:this.styles.calcMinHeight as any}>
                                <CollectViewList
                                    small={small}
                                    portrait={portrait}
                                    middleDown={middleDown}
                                    onNotifyFirstLoad={(err) => {
                                        this.onNotifyFirstLoad(IndexComponent.RESEARCH, err)
                                    }}
                                />
                            </div>
                        </Tab>
                    </Tabs>

                </div>
            </div>
        );
    }

}
