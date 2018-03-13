import * as React from "react";
import {barInteraction} from "../components/bar/BarInteraction";
import {Util} from "../Constants";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import {blue400, greenA200, grey500, grey600, red500, yellow600} from "material-ui/styles/colors";
import {Link} from "react-router-dom";
import {widthListener, WidthNotifier} from "../model/state/WidthNotifier";

export default class NotFound extends React.Component<any, null> {
    static path = '/lost';
    static title = '页面迷路了';

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
            backgroundColor: 'white',
        },
        before: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        imageContainer: {
            width: 450,
            margin: '0 auto',
            textAlign: 'center',
        },
        imageContainerSmall: {
            textAlign: 'center',
            margin: '0 auto',
        },
        image: {
            height: 330,
            width: 330,
        },
        imageSmall: {
            height: 230,
            width: 230,
        },
        textContainer: {
            paddingTop: 24,
        },
        text: {
            fontSize: 28,
            color: grey500,
        },

        textContainerSmall: {
            paddingTop: 16,
            paddingLeft: 24,
            paddingRight: 24,
        },
        textSmall: {
            fontSize: 22,
            color: grey500,
        },
        buttonContainer: {

        },
        button: {
            height: 64,
        },
        buttonText: {
            color: grey500,
            fontSize: 22,
        },
    };

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = NotFound.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        barInteraction.restore();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
    }

    render() {

        const small = Util.small(this.widthNotifier.device);
        let img = null;
        let button = null;
        let extraAfter = null;
        if (small) {
            img = (
                <div style={this.styles.imageContainerSmall}>
                    <img src="/images/404.png" style={this.styles.imageSmall as any}/>
                    <div style={this.styles.textContainerSmall}>
                        <span style={this.styles.textSmall}>您访问的页面不存在</span>
                    </div>
                </div>
            );
            button = (
                <div style={this.styles.buttonContainer}>
                    <Divider/>
                    <Link to="/">
                        <FlatButton label="返回首页"
                                    labelStyle={this.styles.buttonText}
                                    style={this.styles.button}
                                    fullWidth/>
                    </Link>
                </div>
            );
        } else {
            extraAfter = <div style={this.styles.after}/>;
            img = (
                <div style={this.styles.imageContainer}>
                    <img src="/images/404.png" style={this.styles.image as any}/>
                    <div style={this.styles.textContainer}>
                        <span style={this.styles.text}>您访问的页面不存在，请检查输入的网址</span>
                    </div>
                </div>
            );
        }
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                {img}
                <div style={this.styles.after}/>
                {extraAfter}
                {button}
            </div>
        )
    }
}
