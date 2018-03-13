import {TimeWindowUnit} from "./TimeWindowUnit";

export  default class TimeWindow {

    private static readonly SEPARATOR: string = '-';

    constructor(public readonly value: number, public readonly unit: TimeWindowUnit) {}
    toString(): string {
        return this.value + TimeWindow.SEPARATOR + TimeWindowUnit[this.unit];
    }

    static fromString(str: string): TimeWindow {
        let index: number = str.indexOf(TimeWindow.SEPARATOR);
        let value: number = parseInt(str.substring(0, index));
        let unit: TimeWindowUnit;
        switch (str.substr(index + 1)) {
            case "Hour":
                unit = TimeWindowUnit.Hour;
                break;
            case "Day":
                unit = TimeWindowUnit.Day;
                break;
            case "Week":
                unit = TimeWindowUnit.Week;
                break;
            case "Month":
                unit = TimeWindowUnit.Month;
                break;
            case "Quarter":
                unit = TimeWindowUnit.Quarter;
                break;
            case "Year":
                unit = TimeWindowUnit.Year;
                break;
            default:
                throw new Error("Illegal argument");
        }
        return new TimeWindow(value, unit);
    }
}