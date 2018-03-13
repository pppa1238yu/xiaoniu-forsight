import * as React from "react";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import FlatButton from "material-ui/FlatButton";
import {List} from "material-ui/List";
import Paper from "material-ui/Paper";
import {Link} from "react-router-dom";
import IconButton from "material-ui/IconButton";
import Down from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import Up from "material-ui/svg-icons/hardware/keyboard-arrow-up";
import If from "./If";
interface Props {
    initialOpen: boolean;
    maxHeight?: number;
    needMore?: boolean;
    moreLabel?: string;
    onMoreClicked?: (TouchEvent) => void;
    title: string | JSX.Element;
    disableExpandable: boolean;
    content?: JSX.Element | Array<JSX.Element>;
    linkMore?:string;
    backgroundColor?:string;
    noPadding?:boolean;
    bgStyle?:any;
}

export default class ExpandableList extends React.Component<Props, any> {

    styles = {
        headerNoExpand: {
            position: 'relative',
        },
        header: {
            cursor: 'pointer',
            position: 'relative',
        },
        expand: {
            transition: 'max-height 800ms ease-in-out 0ms',
            overflow: 'auto',
            padding: 0,
        },

        hidden: {
            maxHeight: 0,
        },
        visible: {
            maxHeight: 800,
        },
        more: {
            position: "absolute",
            right: 0,
            height: "48px"
        },
    };


    constructor(props, context) {
        super(props, context);

        const initialOpen = this.props.initialOpen || false;
        this.state = {
            open: initialOpen
        };

        if (this.props.maxHeight != undefined) {
            this.styles.visible.maxHeight = this.props.maxHeight;
        }
    }

    render() {
        let moreButton = null;
        if (this.props.needMore && this.props.linkMore && this.props.moreLabel) {
            moreButton = (
                <FlatButton
                    label={this.props.moreLabel} style={this.styles.more}
                    containerElement={<Link role="moreButton" to={this.props.linkMore} className="index-link-more"/>}
                />
            );
        } else if (!this.props.disableExpandable) {
            if (this.state.open) {
                moreButton = (
                    <IconButton style={this.styles.more}>
                        <Up/>
                    </IconButton>
                );
            } else {
                moreButton = (
                    <IconButton style={this.styles.more}>
                        <Down/>
                    </IconButton>
                );

            }
        }

        let style = null;
        let header = null;
        if (this.props.disableExpandable) {
            if(this.props.noPadding){
                style = {padding:0};
            }else {
                style = {};
            }


            header = (
                <Subheader style={this.props.backgroundColor?{position:'relative',backgroundColor:this.props.backgroundColor}:this.styles.headerNoExpand}>
                    {this.props.title}
                    {moreButton}
                </Subheader>
            );
        } else {
            style = this.state.open ? (Object as any).assign({}, this.styles.expand, this.styles.visible)
                : (Object as any).assign({}, this.styles.expand, this.styles.hidden);
            if(this.props.backgroundColor){
                style = (Object as any).assign(style,{backgroundColor:this.props.backgroundColor});
            }
            header = (
                <Subheader style={this.styles.header}
                           onTouchTap={() => {
                               this.setState((prev) => {
                                   return {
                                       open: !prev.open,
                                   }
                               });
                           }}>
                    {this.props.title}
                    {moreButton}
                </Subheader>
            );
        }

        return (
            <Paper>
                <div style={this.props.bgStyle as any}>
                    {header}
                    <Divider />
                    <List style={style}>
                        {this.props.content || this.props.children}
                    </List>
                </div>
            </Paper>
        )
    }
}
