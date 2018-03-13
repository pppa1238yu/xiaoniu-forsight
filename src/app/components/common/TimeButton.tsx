import * as React from "react";

import MenuItem from "material-ui/MenuItem";
import Menu from "material-ui/Menu";
import Popover, {PopoverAnimationVertical} from "material-ui/Popover";
import FlatButton from "material-ui/FlatButton";
import Down from "material-ui/svg-icons/hardware/keyboard-arrow-down";

interface TimeProps {
    value: any;
    values: Array<any>;
    onValueChange: (value) => void;
}

export default class TimeButton extends React.Component<TimeProps, any> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: this.props.value,
            open: false,
        };
    }

    styles = {
        text: {
            fontSize: 16,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'inline-block',
            maxWidth: 200,
        },
        clearColor: {
            color: null,
        }
    };

    notifyValuesChange = (value) => {
        if (this.props.onValueChange) {
            this.props.onValueChange(value);
        }
    };

    /*
     componentWillReceiveProps(props) {
     }
     */

    openMenu = (event) => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    itemClicked = (event, index) => {
        event.preventDefault();

        this.setState(
            (preState) => {
                if (preState.value == index) {
                    //ignore
                } else {
                    this.notifyValuesChange(index);
                    return {
                        open: false,
                        value: index,
                    }
                }
            }
        )
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        const items = this.props.values.map(
            (ele, index) => {
                return (
                    <MenuItem
                        key={index}
                        value={index}
                        primaryText={ele}
                        checked={this.state.value == index}
                        insetChildren
                        onTouchTap={
                            (event) => this.itemClicked(event, index)}
                    />
                );
            }
        );

        return (
            <div>
                <FlatButton label={this.props.values[this.state.value]}
                            labelStyle={this.styles.text}
                            icon={<Down/>}
                            labelPosition="before"
                            onTouchTap={this.openMenu}/>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu
                        desktop
                        maxHeight={300}
                        value={this.state.value}
                        selectedMenuItemStyle={this.styles.clearColor}
                    >
                        {items}
                    </Menu>
                </Popover>
            </div>
        );
    }
}
