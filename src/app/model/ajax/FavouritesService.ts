import {Operator} from "./Operator";
import {Method} from "./Http";

export default class FavouritesOperator extends Operator {

    followSubject(subjectCode: string | number): Promise<null> {
        return this.execute(
            Method.Post,
            "/favourites/followSubject.json",
            { subjectCode: subjectCode }
        );
    }

    unfollowSubject(subjectCode: string | number): Promise<null> {
        return this.execute(
            Method.Post,
            "/favourites/unfollowSubject.json",
            { subjectCode: subjectCode }
        );
    }
}