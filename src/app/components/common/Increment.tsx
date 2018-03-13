import * as React from "react";

import {green500, red500} from "material-ui/styles/colors";

interface Props {
    value: number;
    rate?: boolean;
    alreadyMultipled?: boolean;
    style?: any;
}

export default class Increment extends React.Component<Props, null> {

    styles = {
        up : {
            color: red500,
        },
        down: {
            color: green500,
        }
    };

    render() {
        let v = this.props.value || 0;
        if (this.props.rate && !this.props.alreadyMultipled) {
            v *= 100;
        }
        let text = v.toFixed(2);
        let css;
        if (v < 0) {
            css = this.styles.down;
        } else {
            text = '+' + text;
            css = this.styles.up;
        }
        if (this.props.rate) {
            text += '%';
        }
        if (this.props.style) {
            css = (Object as any).assign({}, css, this.props.style);
        }
        return <span style={css}>{text}</span>
    }
}