import * as React from "react";
import {observer} from "mobx-react";
import {FirstLoading} from "../common/Loading";
import Empty from "../common/Empty";
import CategoryMobileCard from "./CategoryMobileCard";
import ShowMore from "../common/ShowMore";
import Divider from "material-ui/Divider";
import List from "material-ui/List";
import {CategorySummaryDataSource} from "../../model/ajax/CategoryService";
import {CategoryType} from "../../model/entities/category/CategoryType";
import Paper from "material-ui/Paper";

interface Props {
    categoryType: CategoryType;
    service: CategorySummaryDataSource;
}

@observer
export default class CategoryMobileListView extends React.Component<Props, null> {
    service;
    constructor(props) {
        super(props);
        this.service = this.props.service;
    }

    styles = {
        list: {
            padding: 0,
            flexGrow: 1,
        },
        itemsContainer: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        more: {
        },
        point: {
            fontSize: 30,
            right: 38,
            top: 18,
            height: 'none',
            width: 'none',
        }
    };

    render() {
        let netTip = null;
        const loading = this.service.loading;
        if (this.service.$.totalRowCount == 0) {
            if (loading) {
                return (
                    <FirstLoading label="努力加载中..." mobile={true}/>
                );
            }
            return (
                <div>
                    <Empty mobile/>
                </div>
            );
        } else {
            const items = [];
            for (let index = 0; index < this.service.more.length; index++) {
                const item = this.service.more[index];
                // items.push(
                //     <Divider key={index} inset/>
                // );
                if(index==0){
                    items.push(
                        <CategoryMobileCard type={this.props.categoryType}
                                            key={item.code}
                                            first={true}
                                            value={item}
                                            small={true}
                        />
                    );
                }else{
                    items.push(
                        <CategoryMobileCard type={this.props.categoryType}
                                            key={item.code}

                                            value={item}
                                            small={true}
                        />
                    );
                }
            }
            let more = null;
            if (this.service.$.pageIndex
                < this.service.$.pageCount - 1) {
                more = (
                    <Paper>
                    <ShowMore loading={loading}
                              onTouchTap={
                                  (event) => {
                                      event.preventDefault();
                                      this.service.requestMore();
                                      this.service.request();
                                  }
                              }/>
                    </Paper>
                );
            }
            //<Empty mobile={true} label="No Result"/>
            return (
                <div style={this.styles.list}>
                    <List style={this.styles.itemsContainer}>
                        {items}
                    </List>
                    {more}
                    {netTip}
                </div>
            )
        }
    }
}