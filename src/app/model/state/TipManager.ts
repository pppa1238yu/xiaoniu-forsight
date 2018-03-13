import Updater from "./Updater";

class TipManager extends Updater {
    show: boolean = false;
    message: string = "";
    action = () => {};
    actionMessage: string;
    autoHide = false;

    hidden() {
        this.show = false;
        this.doUpdate();
    }

    showTip(message, action = null, actionMessage = "", autoHide = true) {
        this.message = message;
        this.action = action;
        this.actionMessage = actionMessage;
        this.autoHide = autoHide;
        this.show = true;
        this.doUpdate();
    }

    showRefresh(action) {
        this.showTip("加载失败", action, "刷新", false);
    }
}

export let tipManager = new TipManager();