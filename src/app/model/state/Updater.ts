import {observable} from "mobx";

export default class Updater {
    @observable update: boolean = false;

    registerUpdate() {
        return this.update;
    }

    doUpdate() {
        this.update = !this.update;
    }
}
