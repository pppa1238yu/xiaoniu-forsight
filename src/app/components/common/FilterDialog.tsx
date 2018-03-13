import * as React from "react";

import FlatButton from "material-ui/FlatButton";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {blue500, greenA200, grey500, red500, yellow600} from "material-ui/styles/colors";
import {List, ListItem} from "material-ui/List";

import Dialog from "material-ui/Dialog";

import Filter from "./Filter";

export default class FilterDialog extends React.Component<any, any> {
    styles = {
        dialog: {
            width: '100%',
            maxWith: 'none',
        },
        bodyStyle: {
            padding: 6,
        },
        root: {
            paddingTop: 0,
        },
        list: {
            minHeight: 600,
        },
    };

    render() {

        const actions = [
            <FlatButton
                label="确认"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.props.handleClose}
            />,
        ];

        const filters = this.props.filterItems.map(
            (ele, index) => {
                if (ele.labelName == '总市值' || ele.labelName == '风险' || ele.labelName == '综合观点') {
                    return (
                        <Filter multi={true}
                                mobile={true}
                                filterData={ele}
                                single={true}
                                values={this.props.values}
                                onValuesChange={this.props.onValuesChange}
                                key={index}
                        />
                    );
                } else {
                    return (
                        <Filter multi={true}
                                mobile={true}
                                filterData={ele}
                                values={this.props.values}
                                onValuesChange={this.props.onValuesChange}
                                key={index}
                        />
                    );
                }
            }
        );

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                contentStyle={this.styles.dialog}
                style={this.styles.root}
                autoScrollBodyContent={true}
                bodyStyle={this.styles.bodyStyle}
                autoDetectWindowHeight
            >
                <List style={this.styles.list}>
                    {filters}
                </List>
            </Dialog>
        );
    }
}
