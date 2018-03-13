import * as React from "react";

import Snackbar from "material-ui/Snackbar";
import Constants from "../../Constants";
import {tipManager} from "../../model/state/TipManager";
import {observer} from "mobx-react";

interface Props {
    open: boolean;
    fixDrawer: boolean;
    message: string;
    action: string;
    autoHide: boolean;
    callback: () => void;
    onRequestClose: Function;
}

class RefreshTip extends React.Component<Props, any> {
    static AUTO_HIDDEN_TIME = 4000;

    styles = {
        tip: {
            left: 'calc(50% + ' + (Constants.drawerWidth / 2) + 'px)',
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.open
        });
    }

    handleActionTouchTap = (callback) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose();
        }
        if (callback) {
            callback();
        }
    };

    render() {
        const timeout = this.props.autoHide ? RefreshTip.AUTO_HIDDEN_TIME : 0;
        return (
            <Snackbar
                open={this.state.open}
                message={this.props.message}
                action={this.props.action}
                autoHideDuration={timeout}
                onActionTouchTap={() => this.handleActionTouchTap(this.props.callback)}
                onRequestClose={this.props.autoHide ? this.props.onRequestClose : () => {}}
                style={this.props.fixDrawer ? this.styles.tip : {}}
            />
        )
    }
}

interface TipProps {
    fixDrawer: boolean;
}

@observer
export class Tip extends React.Component<TipProps, any> {

    render() {
        tipManager.registerUpdate();

        return <RefreshTip
            open={tipManager.show}
            fixDrawer={this.props.fixDrawer}
            message={tipManager.message}
            action={tipManager.actionMessage}
            autoHide={tipManager.autoHide}
            callback={tipManager.action}
            onRequestClose={() => tipManager.hidden()}
        />
    }
}
