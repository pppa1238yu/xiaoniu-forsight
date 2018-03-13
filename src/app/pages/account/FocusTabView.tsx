import * as React from "react";
import {observer} from "mobx-react";
import {Tab, Tabs} from "material-ui/Tabs";
import Paper from "material-ui/Paper";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import FocusAnalystCardGridLayout from "../../components/focus/FocusAnalystCardGridLayout";
import AnalystCard from "../../components/analyst/AnalystCard";
import CategoryCard from "../../components/category/CategoryCard";
import CategoryMobileCard from  "../../components/category/CategoryMobileCard";
import {CategoryType} from "../../model/entities/category/CategoryType";
import FocusSubjectCardLayout from "../../components/focus/FocusSubjectCardLayout";
import FocusIndustryCardLayout from "../../components/focus/FocusIndustryCardLayout";
import AnalystItemMobile from "../../components/analyst/AnalystItemMobile";
import Empty from "../../components/common/Empty";
import Constants from "../../Constants";

class FocusAnalystMobile extends React.Component<any, any>{
    render(){
        if (this.props.page.totalRowCount == 0) {
            return (
                <div>
                    <Empty mobile />
                </div>
            );
        } else {
            const items = [];
            for (let index = 0; index < this.props.page.entities.length; index++) {
                const item = this.props.page.entities[index];
                items.push(
                    <AnalystItemMobile item={item}
                                       key = {item.target.gtaId}
                    />
                );
            }
            return(
                <Paper>
                    {items}
                </Paper>
            )
        }
    }
}

class FocusCategoryMobile extends React.Component<any, any>{
    render(){
        if (this.props.page.totalRowCount == 0) {
            let error = null;
            return (
                <div>
                    <Empty mobile/>
                    {error}
                </div>
            );
        }else {
            const items = [];
            for (let index = 0; index < this.props.page.entities.length; index++) {
                let item;
                item = this.props.page.entities[index];
                items.push(
                    <CategoryMobileCard type={this.props.categoryType}
                                        key={item.code}
                                        value={item}
                                        small={true}
                    />
                );
            }
            return(
                <div>
                    {items}
                </div>
            )
        }
    }
}
@observer
export default class FocusTabView extends React.Component<any, any>{
    style = {
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
    };

    render() {
        if (!this.props.small) {
            if (this.props.loadIndex == 0) {
                return (
                    <div style={this.style.container as any}>
                        {
                            this.props.empty ? null:
                            <FocusAnalystCardGridLayout
                                dataSource={this.props.page.entities}
                                keyExtractor={item => item.target.gtaId}
                                itemBasis={Constants.cardWidth}
                                itemPaddingVertical={Constants.listPadding}
                                itemPaddingHorizontal={Constants.listPadding}
                                itemRender={
                                    item =>
                                        <AnalystCard
                                            value={item.target}
                                            fixDrawer={this.props.fixDrawer}/>
                                }
                                footerRender={
                                    () => (
                                        <Paper className="center-align">
                                            <UltimatePaginationMaterialUi
                                                currentPage={this.props.page.pageIndex + 1}
                                                totalPages={this.props.page.pageCount}
                                                hideFirstAndLastPageLinks={true}
                                                onChange={this.props.pageChange}/>
                                        </Paper>
                                    )
                                }
                            />
                        }
                    </div>
                )
            } else if (this.props.loadIndex == 1) {
                return (
                    <div style={this.style.container as any}>
                            {  this.props.empty ? null:
                                <FocusIndustryCardLayout
                                    dataSource={this.props.page.entities}
                                    keyExtractor={CategorySummary => CategorySummary.code}
                                    itemBasis={Constants.cardWidth}
                                    itemPaddingVertical={Constants.listPadding}
                                    itemPaddingHorizontal={Constants.listPadding}
                                    itemRender={
                                        CategorySummary =>
                                            <CategoryCard
                                                type={CategoryType.Industry}
                                                value={CategorySummary}
                                                fixDrawer={this.props.fixDrawer}/>
                                    }
                                    footerRender={
                                        () => (
                                            <Paper className="center-align">
                                                <UltimatePaginationMaterialUi
                                                    currentPage={this.props.page.pageIndex + 1}
                                                    totalPages={this.props.page.pageCount}
                                                    hideFirstAndLastPageLinks={true}
                                                    onChange={this.props.pageChange}/>
                                            </Paper>
                                        )
                                    }
                                />
                            }
                    </div>
                )
            } else {
                return (
                    <div style={this.style.container as any}>
                            {  this.props.empty ? null:
                                <FocusSubjectCardLayout
                                    dataSource={this.props.page.entities}
                                    keyExtractor={CategorySummary => CategorySummary.code}
                                    itemBasis={Constants.cardWidth}
                                    itemPaddingVertical={Constants.listPadding}
                                    itemPaddingHorizontal={Constants.listPadding}
                                    itemRender={
                                        CategorySummary =>
                                            <CategoryCard
                                                type={CategoryType.Subject}
                                                value={CategorySummary}
                                                fixDrawer={this.props.fixDrawer}/>
                                    }
                                    footerRender={
                                        () => (
                                            <Paper className="center-align">
                                                <UltimatePaginationMaterialUi
                                                    currentPage={this.props.page.pageIndex + 1}
                                                    totalPages={this.props.page.pageCount}
                                                    hideFirstAndLastPageLinks={true}
                                                    onChange={this.props.pageChange}/>
                                            </Paper>
                                        )
                                    }
                                />
                            }
                    </div>
                )
            }
        } else {
            if(this.props.loadIndex == 0){
                return <FocusAnalystMobile loadIndex = {0} page={this.props.page}/>
            } else if(this.props.loadIndex == 1){
                return <FocusCategoryMobile
                    loadIndex = {1}
                    categoryType = {CategoryType.Industry}
                    page={this.props.page}/>
            } else {
                return <FocusCategoryMobile
                    loadIndex = {2}
                    categoryType = {CategoryType.Subject}
                    page={this.props.page}/>
            }
        }
    }
}