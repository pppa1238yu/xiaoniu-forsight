import {http, Method} from "./Http";
import {observable} from "mobx";

export abstract class Operator {

    @observable
    public executing: boolean;

    protected execute(method: Method, uri: string, paramMap: object): Promise<null> {
        this.executing = true;
        return http
            .request(method, uri, paramMap)
            .then(response => {
                this.executing = false;
                return response;
            })
            .catch(reason => {
                this.executing = false;
            });
    }
}