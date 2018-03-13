
class WatchSearcher {
    constructor(){}
    callback:Function=null;
    register(callback) {
        this.callback=callback;
    }
    unRegister() {
        delete this.callback;
    }

    call() {
        if (this.callback){
            this.callback();
        }
    }
}
export let watchSearcher=new WatchSearcher();