import * as React from "react";
import {observer} from "mobx-react";
import {FixLoading} from "../common/Loading";
import Empty from "../common/Empty";
import Paper from "material-ui/Paper";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import CategoryCard from "./CategoryCard";
import {CategoryType} from "../../model/entities/category/CategoryType";
import {CategorySummaryDataSource} from "../../model/ajax/CategoryService";
import CategoryCardGridLayout from "./CategoryCardGridLayout";
import Constants, {Util} from "../../Constants";

interface Props {
    categoryType: CategoryType;
    fixDrawer: boolean;
    service: CategorySummaryDataSource;
}
@observer
export default class CategoryComputerListView extends React.Component<Props, null> {

    styles = {
        container: {
            position: 'relative',
            paddingBottom: 24,
            flexGrow: 1,
            display: 'flex',
            flexFlow: 'column',
            paddingTop: 6,
        }
    };

    constructor(props) {
        super(props);
    }

    onPageChange = (index) => {
        this.props.service.setRequestPageIndex(index - 1);
        this.props.service.request(() => Util.scrollTop());
    };

    render() {
        const loading = this.props.service.loading;
        if (!loading && this.props.service.error) {
            return null;
        } else {
            const progress = loading ? <FixLoading mobile={false} transparent/> : null;
            if (this.props.service.$.totalRowCount == 0) {
                return (
                    <div style={this.styles.container as any}>
                        <Empty mobile={false}/>
                        {progress}
                    </div>
                );
            } else {
                return (
                    <div style={this.styles.container as any}>
                        <CategoryCardGridLayout
                            dataSource={this.props.service.$.entities}
                            keyExtractor={categorySummary => categorySummary.code}
                            itemBasis={Constants.cardWidth}
                            itemPaddingVertical={Constants.listPadding}
                            itemPaddingHorizontal={Constants.listPadding}
                            itemRender={
                                (categorySummary, index) =>
                                    index == 0 ? <CategoryCard
                                        type={this.props.categoryType}
                                        value={categorySummary}
                                        fixDrawer={this.props.fixDrawer}
                                        first={true}
                                    /> : <CategoryCard
                                        type={this.props.categoryType}
                                        value={categorySummary}
                                        fixDrawer={this.props.fixDrawer}
                                    />
                            }
                            footerRender={
                                () =>
                                    <Paper role="pageTurner" className="center-align">
                                        <UltimatePaginationMaterialUi
                                            currentPage={this.props.service.$.pageIndex + 1}
                                            totalPages={this.props.service.$.pageCount}
                                            hideFirstAndLastPageLinks={true}
                                            onChange={this.onPageChange}/>
                                    </Paper>
                            }/>
                        {progress}
                    </div>
                );
            }
        }
    }
}