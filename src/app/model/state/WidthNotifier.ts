import Updater from "./Updater";
import {DeviceType, Util} from "../../Constants";
import {runInAction} from "mobx";

export enum WidthChangeState {
    TO_PORTRAIT,
    TO_LANDSCAPE,
    TO_DESKTOP,
    TO_MOBILE,
    NONE,
}

export class WidthNotifier extends Updater {
    currentWidth = window.innerWidth;
    device = Util.device(this.currentWidth);
    change = WidthChangeState.NONE;

    id;
    callback: Function = null;

    constructor(id, callback: Function = null) {
       super();
       this.id = id;
       this.callback = callback;
    }
}

class WidthListener {
    id = 0;
    notifiers = {};

    currentWidth = -1;
    broadcastWidth = -1;
    delay = null;

    listen() {
        window.addEventListener('resize', this.resizeHandler);
    }

    private broadcast() {
        if (this.broadcastWidth == this.currentWidth) {
            return;
        }
        const device = Util.device(this.currentWidth);
        let change = WidthChangeState.NONE;

        if (this.broadcastWidth >= 0) {
            const lastDevice = Util.device(this.broadcastWidth);
            if (lastDevice != device) {
                switch (device) {
                    case DeviceType.MOBILE:
                        change = WidthChangeState.TO_MOBILE;
                        break;
                    case DeviceType.DESKTOP:
                        change = WidthChangeState.TO_DESKTOP;
                        break;
                    case DeviceType.TABLET_PORTRAIT:
                        change = WidthChangeState.TO_PORTRAIT;
                        break;
                    case DeviceType.TABLET_LANDSCAPE:
                        change = WidthChangeState.TO_LANDSCAPE;
                        break;
                }
            }
        }

        this.broadcastWidth = this.currentWidth;

       // console.log(this.broadcastWidth, device, change);
        runInAction(() => {
            for (const id in this.notifiers) {
                const notifier = this.notifiers[id];
                notifier.device = device;
                notifier.currentWidth = this.currentWidth;
                notifier.change = change;
                if (notifier.callback) {
                    notifier.callback();
                }
                notifier.doUpdate();
            }
        });
    }

    register(notifier) {
        this.notifiers[notifier.id] = notifier;
    }

    unRegister(notifier) {
        delete this.notifiers[notifier.id];
    }

    createWidthNotifier(callback: Function = null) {
        const notifier = new WidthNotifier(this.id++, callback);
        this.register(notifier);
        return notifier;
    }


    private static DELAY_TIME = 40;
    private delayBroadcast() {
        if (this.delay != null) {
            return;
        }
        this.delay = setTimeout(() => {
            this.broadcast();
            this.delay = null;
        }, WidthListener.DELAY_TIME);
    }

    private resizeHandler: () => void = () => {
        const width = window.innerWidth;
        if (width != this.currentWidth) {
            this.currentWidth = width;
            this.delayBroadcast();
        }
    };
}

export let widthListener = new WidthListener();
widthListener.listen();