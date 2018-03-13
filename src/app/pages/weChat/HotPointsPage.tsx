
import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import {tipManager} from "../../model/state/TipManager";
import {FirstLoading} from "../../components/common/Loading";

import HotPointsList from "../../components/weChat/HotPointsList";
enum HotPointsComponent{
    HOT_POINTS
}

@observer
export default class HotPointsPage extends React.Component<any, null> {
    static path = '/hot_points';
    static title = '热点';
    @observable first;
    @observable error;
    firstLoading = [];
    mount = true;
    styles = {
        errorText: {
            color:'#0b0703',
            fontSize:24
        }
    };
    componentDidMount() {

    }

    componentWillUnmount() {
        this.mount = false;
        fixButtonManager.hidden();
    }

    restore() {
        this.firstLoading = [false];
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

    componentWillMount() {
        this.restore();
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
                    <span className="center-align" style={this.styles.errorText as any}>热点获取失败</span>
                </div>
            );
        }

        return (
            <div className="mainBox">
                {firstLoad}
                {error}
                
                <div className={this.first?"hidden":""}>
                    <HotPointsList notifyResult={(err)=>{
                        this.onNotifyFirstLoad(HotPointsComponent.HOT_POINTS,err);
                    }}/>
                </div>
            </div>
        )
    }
}