import * as React from "react";
import {observer} from "mobx-react";
import {CategoryType} from "../../model/entities/category/CategoryType";
import {
    CategorySummaryDataSource,
    industrySummaryDataSource,
    subjectSummaryDataSource
} from "../../model/ajax/CategoryService";
import {FirstLoading} from "../common/Loading";
import {List, ListItem} from "material-ui/List";

import {blue500, greenA200, grey500, red500, yellow600} from "material-ui/styles/colors";

import {CategorySortedType} from "../../model/entities/category/CategorySortedType";
import ComputerFilterView from "./ComputerFilterView";
import MobileFilterView from "./MobileFilterView";
import CategoryComputerListView from "./CategoryComputerListView";
import CategoryMobileListView from "./CategoryMobileListView";
import If from "../common/If";

const TIME_VALUES = ['今日', '最近 5 日', '最近 10 日', '最近 20 日'];
const SORT_VALUES = ['观点数', '资金净流入', '区间涨跌幅'];

interface Props {
    categoryType: CategoryType;
    small: boolean;
    fixDrawer: boolean;
    portrait: boolean;
    pop: boolean;
}

@observer
export default class CategorySummaryView extends React.Component<Props, null> {

    private service: CategorySummaryDataSource;

    constructor(props) {
        super(props);
        this.service = this.props.categoryType == CategoryType.Industry ?
            industrySummaryDataSource : subjectSummaryDataSource;
    }

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
    };

    onTimeChange = (value: number) => {
        this.service.setTime(value);
        this.service.request();
    };

    onSortChange = (value: CategorySortedType) => {
        if (this.service.sort != value) {
            this.service.setSort(value);
            this.service.request();
        }
    };

    componentDidMount() {
        if (this.service.first) {
            if (this.props.portrait || this.props.small) {
                this.service.isMore = true;
            }
            this.service.request();
        }
    }

    componentWillUnmount() {
        this.service.setMount(false);
    }

    componentWillMount() {
        this.service.setMount(true);

        if (!this.props.pop) {
            this.service.reset();
            this.service.restore();
        }
    }

    render() {
        if (this.service.first) {
            if (this.service.loading) {
                return (
                    <FirstLoading label="努力加载中..." mobile={this.props.small}/>
                );
            } else {
                return null;
            }
        } else {
            let filter = null;
            let content = null;
            if (this.props.small) {

                content = <CategoryMobileListView
                    service={this.service}
                    categoryType={this.props.categoryType}/>;
                filter =
                    <MobileFilterView
                        times={TIME_VALUES}
                        sorts={SORT_VALUES}
                        service={this.service}
                        onTimeChange={this.onTimeChange}
                        onSortChange={this.onSortChange}
                    />;
            } else {
                content = <CategoryComputerListView categoryType={this.props.categoryType}
                                              service={this.service}
                                              fixDrawer={this.props.fixDrawer}/>
                filter =
                    <ComputerFilterView
                        times={TIME_VALUES}
                        sorts={SORT_VALUES}
                        service={this.service}
                        onTimeChange={this.onTimeChange}
                        onSortChange={this.onSortChange}
                    />;
            }
            return (
                <div style={this.styles.container as any}>
                    {filter}
                    {content}
                </div>
            );
        }
    }
}

