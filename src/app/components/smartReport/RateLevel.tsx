import * as React from "react";
import If from "../common/If";
import {
    red300,
    red400,
    red500,
    grey300,
    orange300,
    green500,
    grey500
} from "material-ui/styles/colors";
interface Levels {
    score: number,
    small?: boolean
}

export default class RateLevel extends React.Component<Levels, null> {
    styles = {
        show: {
            display: 'inline-block',
            verticalAlign: '-4px'
        },
        rateBox: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            width: 240,
        },
        rateBoxSmall: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            width: 180,
        },
        orangeStar: {
            backgroundImage: 'url("/images/star.png")'
        },
        orangeStarSmall: {
            width: '18px',
        },
        greyStar: {
            backgroundImage: 'url("/images/star-grey.png")'
        },
        showStarBox: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
        }
    };

    addArray = (num, arr) => {
        for (let i = 0; i < 5; i++) {
            if (num != 0) {
                if (i < num) {
                    arr.push(
                        <span color={orange300} className={this.props.small ? "smallStarSize" : "starSize"}
                              style={this.styles.orangeStar} key={i}/>
                    )
                } else {
                    arr.push(
                        <span color={grey300} className={this.props.small ? "smallStarSize" : "starSize"}
                              style={this.styles.greyStar} key={i}/>
                    )
                }
            } else {
                arr.push(
                    <span color={grey300} className={this.props.small ? "smallStarSize" : "starSize"}
                          style={this.styles.greyStar} key={i}/>
                )
            }
        }
        return arr;
    };

    render() {

        let showStart = [];
        let score = 0;
        let getScore = this.props.score;

        if (getScore >= 0 && getScore < 3) {
            score = 1;
        } else if (getScore >= 3 && getScore < 7) {
            score = 2;
        } else if (getScore >= 7 && getScore < 11) {
            score = 3;
        } else if (getScore >= 11 && getScore < 15) {
            score = 4;
        } else {
            score = 5;
        }

        showStart = this.addArray(score, showStart);

        return (
            <div style={this.styles.show}>
                <div style={this.props.small ? this.styles.rateBoxSmall : this.styles.rateBox as any}>
                    {showStart}
                </div>
            </div>
        )
    }
}