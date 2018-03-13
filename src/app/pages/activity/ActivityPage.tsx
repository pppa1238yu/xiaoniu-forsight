import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import {FirstLoading} from "../../components/common/Loading";
import Paper from "material-ui/Paper";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";
import If from "../../components/common/If";
import InvitationView from "../../components/activity/InvitationView";
import LuckDrawView from "../../components/activity/LuckDrawView";
import InvitationMobileView from "../../components/activity/InvitationMobileView";
import LuckDrawMobileView from "../../components/activity/LuckDrawMobileView";


enum Activity{
    REGISTER_SUM,
    RANKLIST,
    UNUSED_PRIZES,
    DRAW_TIME
}

@observer
export default class ActivityPage extends React.Component<any, any> {

    static path = "/activity";
    static title = '抽奖活动';

    @observable first;
    @observable error;
    firstLoading = [];
    mount = true;

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = ActivityPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
        this.mount = false;
        tipManager.hidden();
        fixButtonManager.hidden();
    }

    restore() {
        this.firstLoading = [false, false, false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        })
    }

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
        }
    }

    componentWillMount() {
        this.restore();
        this.widthNotifier = widthListener.createWidthNotifier();
        Util.scrollTopInstant();
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

    styles = {
        content: {
            backgroundImage: "url(/images/activity/bei1.png)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            minWidth: "1328px"

        },
        bannerBg: {
            position: "relative",
            display: "flex",
            justifyContent: "center"
        },
        banner1: {
            position: "absolute",
            zIndex: 1
        },
        banner2: {
            position: "absolute",
            zIndex: 2,
            width: "1328px",
            top: "30px"
        },
        stone: {
            width: "100%",
            height: "450px"
        },
        center: {
            textAlign: "center"
        },
        erweima: {
            width: "100%"
        },
        bottom: {
            textAlign: "center",
            marginTop: "150px"
        },
        hidden: {
            display: "none"
        }
    };

    mobileStyles = {
        content: {
            backgroundImage: "url(/images/activity/mobileActivity/bg.png)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            padding: "5px"
        },
        fullWidth: {
            width: "100%"
        },
        bannerBox: {
            paddingTop: "50px"
        }
    };

    public render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const middleDown = Util.middleDown(this.widthNotifier.device);
        let firstLoad = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={small}/>;
        } else if (this.first && this.error) {
            return null;
        }

        return (
            <div>
                {firstLoad}
                <If condition={small === false} block={true}>
                    <div style={this.first ? this.styles.hidden : {}}>
                        <div style={this.styles.content}>
                            <div style={this.styles.bannerBg as any}>
                                <img src="/images/activity/sun.png" alt="" style={this.styles.banner1 as any}/>
                                <img src="/images/activity/banner.png" alt="" style={this.styles.banner2 as any}/>
                                <img src="/images/activity/shitou.png" alt="" style={this.styles.stone as any}/>
                            </div>
                            <InvitationView
                                notifyResult1={(err) => this.onNotifyFirstLoad(Activity.REGISTER_SUM, err)}
                                notifyResult2={(err) => this.onNotifyFirstLoad(Activity.RANKLIST, err)}
                            />
                            <LuckDrawView
                                notifyResult={(err) => this.onNotifyFirstLoad(Activity.UNUSED_PRIZES, err)}
                                notifyResult1={(err) => this.onNotifyFirstLoad(Activity.DRAW_TIME, err)}
                            />
                            <div style={this.styles.bottom}>
                                <img src="/images/activity/erweimaPC.png" alt="" style={this.styles.erweima}/>
                            </div>
                        </div>
                    </div>
                </If>
                <If condition={small === true} block={true}>
                    <div style={this.first ? this.styles.hidden : {}}>
                        <div style={this.mobileStyles.content}>
                            <div style={this.mobileStyles.bannerBox}>
                                <img src="/images/activity/mobileActivity/banner.png" alt=""
                                     style={this.mobileStyles.fullWidth}/>
                            </div>
                            <InvitationMobileView
                                notifyResult1={(err) => this.onNotifyFirstLoad(Activity.REGISTER_SUM, err)}
                                notifyResult2={(err) => this.onNotifyFirstLoad(Activity.RANKLIST, err)}
                            />
                            <LuckDrawMobileView
                                notifyResult={(err) => this.onNotifyFirstLoad(Activity.UNUSED_PRIZES, err)}
                                notifyResult1={(err) => this.onNotifyFirstLoad(Activity.DRAW_TIME, err)}
                            />
                        </div>
                    </div>
                </If>
            </div>
        );
    }
}