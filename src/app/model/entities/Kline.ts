export class Kline {

    constructor(public date: Date,
                public open: number,
                public close: number,
                public low: number,
                public high: number,
                public volume: number,
                public amount: number,
                public change: number,
                public changeRatio: number,
                public trunRate: number,
                public macd: number,
                public dea: number,
                public dif: number,
                public k: number,
                public d: number,
                public j: number,
                public rsi6: number,
                public rsi12: number,
                public rsi24: number) {
    }
}