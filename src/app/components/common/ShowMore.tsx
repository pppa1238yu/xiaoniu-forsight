import * as React from "react";

import {PopoverAnimationVertical} from "material-ui/Popover";
import CircularProgress from "material-ui/CircularProgress";
import FlatButton from "material-ui/FlatButton";
import {pinkA200, transparent} from "material-ui/styles/colors";

const LOADING_SIZE = 40;
const HEIGHT = (LOADING_SIZE + 16) + 'px';

interface Props {
    loading: boolean;
    onTouchTap: (TouchEvent) => void;
}

export default class ShowMore extends React.Component<Props, null> {
    styles = {
        container: {
            margin: 'auto',
            width: 40,
            height: HEIGHT,
            paddingTop: 8,
        },
        refresh: {
            display: 'inline-block',
            position: 'relative',
        },
        button: {
            height: HEIGHT,
        }
    };

    render() {
        const loading = this.props.loading ? (
            <div style={this.styles.container as any}>
                <CircularProgress size={LOADING_SIZE}/>
            </div>
        ) : (
            <div className="center-align">
                <FlatButton
                    role="showMoreButton"
                    label="更多"
                    style={this.styles.button}
                    onTouchTap={this.props.onTouchTap}
                    fullWidth={true}
                    primary={true}
                />
            </div>
        );

        return (
            <div>
                {loading}
            </div>
        )
    }
}
