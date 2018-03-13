import * as React from "react";

import Up from "material-ui/svg-icons/navigation/arrow-upward";
import Open from "material-ui/svg-icons/hardware/keyboard-arrow-up";

import Updater from "./Updater";
import {Util} from "../../Constants";

export enum FixButtonType {
    SINGLE,
    MULTI,
}

export interface Expand {
    icon: JSX.Element;
    onTouchTap?: () => void;
    float?: boolean;
}


declare let $;

class FixButtonManager extends Updater {
    show: boolean = false;
    type: FixButtonType;
    root;
    rootAction;
    rootAndActions: Array<Expand>;

    hidden() {
        this.show = false;
        this.doUpdate();
    }

    showMulti(rootIcon, iconAndActions: Array<Expand>) {
        this.type = FixButtonType.MULTI;
        this.root = rootIcon;
        this.rootAndActions = iconAndActions;

        this.show = true;

        this.doUpdate();
    }

    showDefaultMulti(iconAndActions: Array<Expand>) {
        iconAndActions.push({
            icon: <Up />,
            onTouchTap: () => {
                Util.scrollTop();
            }
        } as Expand);
        this.showMulti(<Open />, iconAndActions);
    }

    showSingle(icon, action) {
        this.type = FixButtonType.SINGLE;
        this.root = icon;
        this.rootAction = action;

        this.show = true;

        this.doUpdate();
    }

    showOnlyUp() {
        this.showSingle(<Up/>, () => {
            Util.scrollTop();
        })
    }
}

export let fixButtonManager = new FixButtonManager();
