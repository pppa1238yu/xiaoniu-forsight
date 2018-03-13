import * as React from "react";
import {Util} from "../../Constants";
import Header from "../../components/common/Header";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";

export default class AboutUs extends React.Component<any, null> {
    static path = "/aboutUs";

    pop = false;

    widthNotifier: WidthNotifier = null;

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        if (this.props.history.action == 'POP') {
            this.pop = true;
            //don't restore
        }
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
    }

    styles = {
        imgStyle: {
            position:'relative',
            width:'100%',
            overflow:'hidden',
            paddingTop:53,
            backgroundColor:'#141519'

        },
        imgMobileStyle: {
            width:'100%',
            overflow:'hidden',
        }
    };
    render () {
        let fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        if (fixDrawer) {
            return (
                <div style={this.styles.imgStyle as any}>
                    <Header index="1"/>
                    <img src="/images/aboutUs.png?123456" style={{position:'relative',left:'50%',marginLeft:'-960px'}}/>
                </div>
            )
        }else {
            return (
                <div style={this.styles.imgMobileStyle as any}>
                    <Header index="1"/>
                    <img src="/images/aboutUsMobile.png?123445" style={{width:'100%'}}/>

                </div>
            )
        }
    }
}