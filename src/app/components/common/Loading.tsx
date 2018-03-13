import * as React from "react";

import LinearProgress from "material-ui/LinearProgress";
import CircularProgress from "material-ui/CircularProgress";
import {pinkA200, transparent} from "material-ui/styles/colors";

interface Props {
    mobile?: boolean;
    label?: string;
    zIndex?: number;
    transparent?: boolean;
}
export default class Loading extends React.Component<Props, any> {
    render() {
        return this.props.mobile ?
            <Loading4Mobile {...this.props} /> :
            <Loading4Desktop {...this.props}/>;
    }
}

export class FirstLoading extends React.Component<any, any> {
    styles = {
        desktop: {
            paddingTop: 280,
        },
        mobile: {
            paddingTop: 200,
        }
    };

    render() {
        if (!this.props.mobile) {
            return (
                <div style={this.styles.desktop}>
                    <Loading4Desktop {...this.props} />
                </div>
            )
        } else {
            return (
                <div style={this.styles.mobile}>
                    <Loading4Mobile {...this.props} />
                </div>

            )
        }
    }

}
export class FixLoading extends React.Component<Props, any> {
    //简单指定，考虑 window.innerHeight

    styles = {
        progress : {
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            color: 'white',
            zIndex: 1000,
        },
        progressTransparent : {
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            color: 'white',
            zIndex: 1000,
        },
    };

    render() {
        let style = null;

        if (this.props.transparent) {
            style = this.styles.progressTransparent;
        } else {
            style = this.styles.progress;
        }
        if (this.props.zIndex > 0) {
            style.zIndex = this.props.zIndex;
        }
        return (
            <div style={style as any}>
                <LinearProgress
                    mode="indeterminate"/>
            </div>
        );

    }

}

class Loading4Mobile extends React.Component<Props, any> {
    render() {
        return (
            <div className="center-align">
                <CircularProgress />
            </div>
        );
    }
}

class Loading4Desktop extends React.Component<Props, any> {
    styles = {
        container: {
            width: 200,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        label: {
            fontSize: 16,
            color:'#fff'
        },
        progress: {
            marginTop: 8,
        }
    };

    render() {
        let text;
        if (this.props.label != null) {
            text = <span style={this.styles.label}>{this.props.label}</span>
        } else {
            text = <div/>
        }
        return (
            <div style={this.styles.container} className="center-align">
                {text}
                <LinearProgress
                    mode="indeterminate"
                    style={this.styles.progress}/>
            </div>
        );
    }

}

