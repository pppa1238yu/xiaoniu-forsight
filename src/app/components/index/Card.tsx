/*
 * ======================================================================
 * card.MarketIndexChart.jsx
 *
 * Copyright (c) 2016 Chengdu Lanjing Data&Information Co., Ltd
 *
 * =======================================================================
 */

import * as React from "react";
import {green500, grey500, red500} from "material-ui/styles/colors";
import {Util,Collections} from "../../Constants";
class CardTypes {
    indexObj: any;
    exchange: string;
    small: boolean;
}

export default class MyCard extends React.Component<CardTypes, null> {

    styles = {
        big: {
            fontSize: 14,
            color: '#616161',
            paddingTop: '10px'
        },
        small: {
            fontSize: 14,
            color: '#616161'
        },
        bigMobile: {
            fontSize: 12,
            height:20,
            verticalAlign:'middle'
        },
        smallMobile: {
            fontSize: 10,
        }
    };

    numberColor(value) {
        return value>=0?red500:green500
    }

    render() {
        let indexObj = this.props.indexObj;
        let change: number;
        let value: number;
        let changeRatio: any;

        if (this.props.exchange === "") {
            change = indexObj.change.toFixed(2);
            value = indexObj.value.toFixed(2);
        } else {
            change = indexObj.change.toFixed(4);
            value = indexObj.value.toFixed(4);
        }
        const small = this.props.small ? this.styles.smallMobile : this.styles.small;
        const big = this.props.small ? this.styles.bigMobile : this.styles.big;
        const style = (Object as any).assign({}, small, {
            fontSize: 14,
            float: 'right',
            color:Collections.numberColor(indexObj.changeRatio)
        });
        const pcStyle = (Object as any).assign({}, small, {
            fontSize: 16,
            float: 'right',
            color:Collections.numberColor(indexObj.changeRatio)
        });

        const bigStyle = (Object as any).assign({}, big);
        return (
            <div role="indexThumbnail">
                <div
                    role="indexName" style={small}>{indexObj.shortName || "美元/人民币"}
                    <div style={this.props.small?style:pcStyle}>
                        <span role="indexChangeRatio">{Util.precisionRate2(indexObj.changeRatio,2,true)}</span>
                    </div>
                </div>
                <div
                    style={{color: this.numberColor(change), display: "none"}}>{change}</div>
                <div
                    role="indexValue" style={bigStyle}>{value}</div>

            </div>
        );
    }
}
