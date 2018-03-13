import {runInAction} from "mobx";
export class Objects {

    static assign<T>(left: T, right: T): void {
        runInAction(() => {
            if (left instanceof Array) {
                Objects.assignArray<any>(<any>left, <any>right);
            } else if (typeof left == 'object') {
                Objects.assignObject(<any>left, <any>right);
            }
        });
    }

    private static assignObject(left: object, right: object): void {
        for (let member in left) {
            let leftValue: any = left[member];
            let rightValue: any = right ? right[member] : null;
            if (leftValue === rightValue) {
                continue;
            }
            if (leftValue instanceof Array) {
                Objects.assignArray(leftValue, rightValue);
            } else if (typeof leftValue == 'object') {
                Objects.assignObject(leftValue, rightValue);
            } else {
                left[member] = rightValue;
            }
        }
    }

    private static assignArray<E>(left: Array<E>, right: Array<E>): void {
        left.splice(0, left.length);
        if (right instanceof Array) {
            left.push(...right);
        }
    }

    static top<E>(array: Array<E>, limit: number): Array<E> {
        if (limit <= 0) {
            return [];
        }
        if (limit >= array.length) {
            return array;
        }
        return array.slice(0, limit);
    }

    static javaConstantName(name: string) {
        let result = "";
        let prevIsUpper = true;
        for (let c of name) {
            let upper = c.toUpperCase();
            let isUpper = c == upper;
            if (isUpper && !prevIsUpper) {
                result += '_';
            }
            result += upper;
            prevIsUpper = isUpper;
        }
        return result;
    }

    private Objects() {}
}
