
import * as React from "react";
import ExpectValuation from "../../components/smartReport/ExpectValuation";
import HistoryValuation from "../../components/smartReport/HistoryValuation";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import {FirstLoading} from "../../components/common/Loading";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {barInteraction} from "../../components/bar/BarInteraction";
import {Util} from "../../Constants";

enum ValuationPort {
    HISTORY_VALUATION,
    EXPECT_VALUATION
}
@observer
export default class ValuationPage extends React.Component<any, null> {
    static path = '/valuation';
    static title = '估值分析';
    symbol;

    @observable first;
    @observable error;

    firstLoading = [];
    mount = true;

    setError() {
        if (this.mount) {
            tipManager.showRefresh(() => {
                window.location.reload();
            })
        }
    }

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
        this.mount = false;
        tipManager.hidden();
        fixButtonManager.hidden();
    }


    styles = {
        errorText: {
            color:'#0b0703',
            fontSize:24
        },
        paddingTop: {
            paddingTop:20
        },
        logoStyle: {
            width:100,
            height:42
        },
        imgBox: {
            display:'flex',
            justifyContent:'space-around'
        }
    };

    restore() {
        this.firstLoading = [false, false];
        runInAction(() => {
            this.first = true;
            this.error = false;
        });
    }

    componentWillMount() {
        this.restore();
        this.widthNotifier = widthListener.createWidthNotifier();
        this.symbol = window.location.hash.split('symbol=')[1];
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

    render() {

        let firstLoad = null;
        let error = null;
        if (this.first && !this.error) {
            firstLoad = <FirstLoading label="努力加载中..." mobile={true}/>;
        } else if (this.first && this.error) {
            return (
                <div className="fullScreen flexCenter">
                    <span className="center-align" style={this.styles.errorText as any}>获取估值信息失败</span>
                </div>
            );
        }
        
        return (
            <div className="mainBox">
                {firstLoad}
                {error}
                <div className={this.first ? "hidden" : "fullScreen"}>
                    <ExpectValuation
                        symbol={this.symbol}
                        small = {true}
                        notifyResult={(err) => {
                            this.onNotifyFirstLoad(ValuationPort.EXPECT_VALUATION, err)
                        }}
                    />
                    <div style={this.styles.paddingTop}>
                        <HistoryValuation
                            symbol={this.symbol}
                            small = {true}
                            notifyResult={(err) => {
                                this.onNotifyFirstLoad(ValuationPort.HISTORY_VALUATION, err)
                            }}
                        />
                    </div>
                    <div style={this.styles.imgBox as any}>
                        <img src="/images/weChat/grayLogo.png" alt="grayLogo" style={this.styles.logoStyle}/>
                    </div>
                </div>
            </div>
        )
    }
}