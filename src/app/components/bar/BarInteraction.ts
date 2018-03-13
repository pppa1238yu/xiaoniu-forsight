import {observable, runInAction} from "mobx";

class BarInteraction {
    @observable custom = false;

    title = null;

    restore() {
        this.title = null;
        this.custom = false;
    }

    doUpdate() {
        runInAction(() => {
            this.custom = false;
            this.custom = true;
        });
    }
}

export let barInteraction: BarInteraction = new BarInteraction();
