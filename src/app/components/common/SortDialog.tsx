import * as React from "react";

import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {blue500, greenA200, grey500, red500, yellow600} from "material-ui/styles/colors";
import {List, ListItem} from "material-ui/List";

import Dialog from "material-ui/Dialog";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";

interface Props {
    title: string;
    open: boolean;
    labels?: Array<string>;
    values: Array<string>;
    value: number;
    onValueChange: (int) => void;
    handleClose: () => void;
}
export default class SortDialog extends React.Component<Props, any> {
    styles = {
        dialog: {
        },
        bodyStyle: {
        },
        root: {
            paddingTop: 0,
        },
        list: {
            minHeight: 600,
        },
        radioButton: {
            paddingTop: 16,
        },
    };

    render() {

        const radios = [];
        for (let i = 0; i < this.props.values.length; i++) {
            radios.push(
                <RadioButton
                    key={i}
                    value={i}
                    label={this.props.values[i]}
                    style={this.styles.radioButton}
                />
            );
        }

        return (
            <Dialog
                title={this.props.title}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                contentStyle={this.styles.dialog}
                style={this.styles.root}
                autoScrollBodyContent={true}
                bodyStyle={this.styles.bodyStyle}
                autoDetectWindowHeight
            >
                <RadioButtonGroup name="sort"
                                  defaultSelected={this.props.value}
                                  onChange={(event, index) =>
                                      {
                                          this.props.onValueChange(index);
                                          this.props.handleClose();
                                      }
                                  }
                >
                    {radios}
                </RadioButtonGroup>
            </Dialog>
        );
    }
}
