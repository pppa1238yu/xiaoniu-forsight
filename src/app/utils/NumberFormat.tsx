/*
 * ======================================================================
 * numberFormat.js
 * Copyright (c) 2016 Chengdu Lanjing Data&Information Co., Ltd
 *
 * =======================================================================
 */
export class FormatNum {
    private static UNITS = {
        '1e10': {
            value: 1e10,
            unit: '百亿'
        },
        '1e8': {
            value: 1e8,
            unit: '亿'
        },
        '1e7': {
            value: 1e7,
            unit: '千万'
        },
        '1e6': {
            value: 1e6,
            unit: '百万'
        },
        '1e4': {
            value: 1e4,
            unit: '万'
        },
        '1': {
            value: 1,
            unit: ''
        }
    }
    value;
    unit;

    constructor(value: number, units: Array<string> = ['1e8', '1e6', '1e4','1']) {
        if(!value){
            this.value=0;
            this.unit="";
            return;
        }
        if(value<=1){
            this.value=value;
            this.unit="";
            return;
        }
        for (var i = 0; i < units.length; i++) {
            if ((units[i] in FormatNum.UNITS) && value > FormatNum.UNITS[units[i]].value) {
                this.value = value / FormatNum.UNITS[units[i]].value;
                this.unit = FormatNum.UNITS[units[i]].unit;
                break;
            }
        }
    }
}
export class NumberFormat {
    static getSymbol(num: number) {
        return num > 0 ? '+' : '';
    }

    static getPercentageStyle(num: number) {
        return (num * 100).toFixed(2) + '%';
    }

    static addCommas(nStr: string) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
}
