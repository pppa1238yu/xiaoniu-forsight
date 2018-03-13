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
import MyPrizesView from "../../components/activity/MyPrizesView";
import MyPrizesMobileView from "../../components/activity/MyPrizesMobileView";
import InvitationRecordView from "../../components/activity/InvitationRecordView";
import InvitationRecordMobileView from "../../components/activity/InvitationRecordMobileView";

enum MyPrize{
    INVITE_COUNT,
    INVITE_RECORD
}

@observer
export default class MyPrizesPage extends React.Component<any, any> {

    static path = "/myPrizes";
    static title = '奖品';

    @observable first;
    @observable error;
    firstLoading = [];
    mount = true;

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = MyPrizesPage.title;
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
        this.firstLoading = [false, false];
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
        hidden: {
            display: "none"
        },
        bottom: {
            textAlign: "center",
            marginTop: "150px"
        },
        erweima: {
            width: "100%"
        }
    };
    mobileStyles = {
        content: {
            backgroundColor: "#171B39",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            padding: "5px"
        },
        fullWidth: {
            width: "100%"
        },
        bannerBox: {
            backgroundImage: "url(/images/activity/sun.png)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat"
        },
        bottom: {
            marginTop: "100px"
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
                <div style={this.first ? this.styles.hidden : {}}>
                    <If condition={small === false} block={true}>
                        <div style={this.styles.content}>
                            <div style={this.styles.bannerBg as any}>
                                <img src="/images/activity/sun.png" alt="" style={this.styles.banner1 as any}/>
                                <img src="/images/activity/banner.png" alt="" style={this.styles.banner2 as any}/>
                                <img src="/images/activity/shitou.png" alt="" style={this.styles.stone as any}/>
                            </div>
                            <MyPrizesView
                                onNotifyFirstLoad1={ (err) => this.onNotifyFirstLoad(MyPrize.INVITE_COUNT, err)}
                            />
                            <InvitationRecordView
                                onNotifyFirstLoad3={ (err) => this.onNotifyFirstLoad(MyPrize.INVITE_RECORD, err)}
                            />
                            <div style={this.styles.bottom}>
                                <img src="/images/activity/erweimaPC.png" alt="" style={this.styles.erweima}/>
                            </div>
                        </div>
                    </If>
                    <If condition={small === true} block={true}>
                        <div style={this.mobileStyles.content}>
                            <div style={this.mobileStyles.bannerBox}>
                                <img src="/images/activity/mobileActivity/banner.png" alt=""
                                     style={this.mobileStyles.fullWidth}/>
                            </div>
                            <MyPrizesMobileView
                                onNotifyFirstLoad1={ (err) => this.onNotifyFirstLoad(MyPrize.INVITE_COUNT, err)}
                            />
                            <InvitationRecordMobileView
                                onNotifyFirstLoad3={ (err) => this.onNotifyFirstLoad(MyPrize.INVITE_RECORD, err)}
                            />
                            <div style={this.mobileStyles.bottom}>
                                <img src="/images/activity/mobileActivity/erweima.png" alt=""
                                     style={this.mobileStyles.fullWidth}/>
                            </div>
                        </div>
                    </If>
                </div>
            </div>
        );
    }
}