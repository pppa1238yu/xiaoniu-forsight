/*
 * ======================================================================
 * card.MarketIndexChart.jsx
 *
 * Copyright (c) 2016 Chengdu Lanjing Data&Information Co., Ltd
 *
 * =======================================================================
 */

import * as React from "react";
import ToggleStar from "material-ui/svg-icons/toggle/star";
import ToggleStarHalf from "material-ui/svg-icons/toggle/star-half";
import {blue500, orange300, red200} from "material-ui/styles/colors";
export default class Rate extends React.Component<any, any> {
    styles = {
        starSize:{
            width:"18px",
            height:"18px"
        },
        starBoxPosition:{
            position: "absolute",
            right: "26px"
        }
    };
    private starDom;

    createStars(starCounts, halfStartCounts) {
        let starArr = [];
        if (starCounts) {
            for (let i = 0; i < starCounts; i++) {
                starArr.push(<ToggleStar color={orange300} style={this.styles.starSize} key={i}/>)
            }
        }
        if (halfStartCounts) {
            for (let i = 0; i < halfStartCounts; i++) {
                starArr.push(<ToggleStarHalf color={orange300} style={this.styles.starSize} key={i + 6}/>)
            }
        }
        this.starDom = starArr
    }

    render() {
        let score = this.props.score;
        switch (true) {
            case score <0.5:
                this.createStars(0, 1);
                break;
            case score <1:
                this.createStars(1, 0);
                break;
            case score <1.5:
                this.createStars(1, 1);
                break;
            case score <2:
                this.createStars(2, 0);
                break;
            case score <2.5:
                this.createStars(2, 1);
                break;
            case score <3:
                this.createStars(3, 0);
                break;
            case score <3.5:
                this.createStars(3, 1);
                break;
            case score <4:
                this.createStars(4, 0);
                break;
            case score <4.5:
                this.createStars(4, 1);
                break;
            case score <= 5:
                this.createStars(5, 0);
                break;
            default:
                console.log("评星出错");
        }
        return (
            <div style={this.styles.starBoxPosition as any}>
                {this.starDom}
            </div>
        );
    }
}
