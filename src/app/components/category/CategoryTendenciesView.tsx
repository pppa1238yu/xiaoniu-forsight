import * as React from "react";
import {observable} from "mobx";
import {Tab, Tabs} from "material-ui/Tabs";
import SwipeableViews from "react-swipeable-views";
import {observer} from "mobx-react";
import {CategoryTendencyView} from "./CategoryTendencyView";
import {TimeWindowUnit} from "../../model/entities/TimeWindowUnit";
import TimeWindow from "../../model/entities/TimeWindow";
import {CategoryInfo} from "../../model/entities/category/CategoryInfo";
import {CategoryType} from "../../model/entities/category/CategoryType";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    red300,
    red500,
    yellow600
} from "material-ui/styles/colors";
import Explain from "../common/Explain";
interface CategoryTendenciesProps {
    categoryType: CategoryType;
    categoryInfo: CategoryInfo;
    small?:boolean;
}

enum PeriodType {
    ONE_YEAR,
    TWO_YEARS,
    FIVE_YEARS,
}

@observer
export default class CategoryTendenciesView extends React.Component<CategoryTendenciesProps, null> {

    @observable private periodType: PeriodType;

    styles = {
        labelColor: {
            color:'#616161',
            borderBottom:'1px solid #ccc',
            height:36
        },
        buttonStyle: {
            height:36
        },
        inkBarStyle: {
            backgroundColor:red500
        }
    };
    render() {
        return (
            <div className="card-panel" style={{padding:"0px"}}>
                <Tabs
                    style = {{paddingBottom:15}}
                    inkBarStyle = {this.styles.inkBarStyle}
                    tabItemContainerStyle={{backgroundColor:'#fff'}}
                    onChange={(periodType) => {
                        this.periodType = periodType;}}
                    value={this.periodType}>
                    <Tab
                        role="oneYearButton"
                        buttonStyle = {this.styles.buttonStyle}
                        style={this.styles.labelColor}
                        label="一年走势" value={PeriodType.ONE_YEAR}/>
                    <Tab
                        role="twoYearsButton"
                        buttonStyle = {this.styles.buttonStyle}
                        style={this.styles.labelColor}
                        label="两年走势" value={PeriodType.TWO_YEARS}/>
                </Tabs>
                <SwipeableViews
                    index={this.periodType}
                    onChangeIndex={(index) => {
                        this.periodType = index;
                    }}>
                    <div>
                        <CategoryTendencyView
                            categoryType={this.props.categoryType}
                            categoryInfo={this.props.categoryInfo}
                            small = {this.props.small}
                            timeWindow={new TimeWindow(1, TimeWindowUnit.Year)}/>
                    </div>
                    <div>
                        <CategoryTendencyView
                            categoryType={this.props.categoryType}
                            categoryInfo={this.props.categoryInfo}
                            small = {this.props.small}
                            timeWindow={new TimeWindow(2, TimeWindowUnit.Year)}/>
                    </div>
                </SwipeableViews>
            </div>
        );
    }
}