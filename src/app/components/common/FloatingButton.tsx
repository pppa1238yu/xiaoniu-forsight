import * as React from "react";

import Popover, {PopoverAnimationVertical} from "material-ui/Popover";
import FloatingActionButton from "material-ui/FloatingActionButton";
import {pinkA200, transparent} from "material-ui/styles/colors";
import {Expand, fixButtonManager, FixButtonType} from "../../model/state/FixButtonManager";
import {observer} from "mobx-react";

interface Props {
    root: JSX.Element;
    expands: Array<Expand>;
}

export default class FloatingButton extends React.Component<Props, any> {

    styles = {
        position: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
        popover: {
            backgroundColor: transparent,
            zIndex: 5,
        },
        button: {
            marginTop: 8,
        },
        list: {
            paddingBottom: 24,
            width: 56,
        }
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
        };
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    onTouchChildren = (event, childOnTouch) => {
        event.preventDefault();
        event.stopPropagation();

        this.handleRequestClose();

        if (childOnTouch) {
            childOnTouch();
        }
    };

    open = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    render() {
        const {
            root, expands
        } = this.props;
        const children = expands.map(
            (ele, index) => {
                return (
                    <div style={this.styles.button} key={index}>
                        {ele.float ?
                            ele.icon
                            :
                            <FloatingActionButton mini onTouchTap={
                                (event) => {
                                    this.onTouchChildren(event, ele.onTouchTap)
                                }
                            }>
                                {ele.icon}
                            </FloatingActionButton>
                        }
                    </div>
                );
            }
        );

        return (
           <div>
               <FloatingActionButton style={this.styles.position}
                                     onTouchTap={this.open}
                                     >
                   {root}
               </FloatingActionButton>

               <Popover
                   open={this.state.open}
                   anchorEl={this.state.anchorEl}
                   anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                   targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                   onRequestClose={this.handleRequestClose}
                   animation={PopoverAnimationVertical}
                   style={this.styles.popover}
                   zDepth={0}
               >
                   <div className="flex-vertical-center" style={this.styles.list}>
                       {...children}
                   </div>
               </Popover>
           </div>
        ) ;
    }
}

@observer
export class FixFloatingButton extends React.Component<null, null> {

    styles = {
        position: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
    };

    render() {
        fixButtonManager.registerUpdate();

        if (fixButtonManager.show) {
            if (fixButtonManager.type == FixButtonType.SINGLE) {
                return <FloatingActionButton
                    role="backToTop"
                    style={this.styles.position}
                    onTouchTap={
                        (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            fixButtonManager.rootAction();
                        }
                    }>
                    {fixButtonManager.root}
                </FloatingActionButton>
            } else {
                return <FloatingButton
                    root={fixButtonManager.root}
                    expands={fixButtonManager.rootAndActions}
                />
            }
        } else {
            return null;
        }
    }
}

