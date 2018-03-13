import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {
    blue500,
    darkBlack,
    greenA200,
    grey400,
    grey500,
    lightBlack,
    red500,
    red600,
    transparent,
    yellow600
} from "material-ui/styles/colors";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import {List, ListItem} from "material-ui/List";
import Paper from "material-ui/Paper";
import Filter from "../../components/common/Filter";

import Divider from "material-ui/Divider";
import {default as Constants, Util} from "../../Constants";
import {barInteraction} from "../../components/bar/BarInteraction";
import FilterList from "material-ui/svg-icons/content/filter-list";

import {Button, Modal} from "react-materialize";
import ShowMore from "../../components/common/ShowMore";
import {FirstLoading, FixLoading} from "../../components/common/Loading";
import {analystIndexDataSource} from "../../model/ajax/AnalystService";
import Empty from "../../components/common/Empty";

import FilterDialog from "../../components/common/FilterDialog";

import AnalystCard from "../../components/analyst/AnalystCard";
import AnalystCardGridLayout from "../../components/analyst/AnalystCardGridLayout";
import AnalystItemMobile from "../../components/analyst/AnalystItemMobile";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";

@observer
export default class AnalystIndexPage extends React.Component<RouteComponentProps<null>, null> {
    styles = {
        container: {

            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
    };

    componentDidMount() {

        barInteraction.title = AnalystIndexPage.title;
        barInteraction.custom = true;

        if (analystIndexDataSource.first) {
            if (Util.smallAndPortrait(this.widthNotifier.device)) {
                analystIndexDataSource.isMore = true;
            }

            analystIndexDataSource.request();
        }

    }

    widthNotifier: WidthNotifier = null;

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        analystIndexDataSource.setMount(false);
        barInteraction.restore();
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        analystIndexDataSource.setMount(true);

        if (this.props.history.action == 'POP') {
            //don't restore
        } else {
            analystIndexDataSource.reset();
            analystIndexDataSource.restore();
        }

        Util.scrollTopInstant();
    }

    onValuesChange = (value) => {
        //this.filterValues[value.queryName] = value.origin;
        analystIndexDataSource.setFilter(
            value.queryName,
            value.values,
            value.origin,
        );
        analystIndexDataSource.request();
    };

    static path = '/analyst';
    static title = "财经名家";
    static primaryTitle = (
        <div className="title-margin">
            <div className="primaryTitle">财经名家</div>
            <div className="subTitle">追踪市场大咖</div>
        </div>
    );

    render() {
        //only small when mobile
        const small = Util.small(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);

        if (analystIndexDataSource.first) {
            if (analystIndexDataSource.loading) {
                return (
                    <FirstLoading label="努力加载中..." mobile={small}/>
                )
            } else {
                return null;
            }
        } else {
            const filter = small ?
                <SmallFilterView
                    values={analystIndexDataSource.filtersOrigin}
                    onValuesChange={this.onValuesChange}/> :
                <FilterView
                    values={analystIndexDataSource.filtersOrigin}
                    onValuesChange={this.onValuesChange}/>;

            return (
                <div style={this.styles.container as any}>
                    {filter}
                    <AnalystList small={small} fixDrawer={fixDrawer}/>
                </div>
            );
        }
    }
}

class SmallFilterView extends React.Component<any, any> {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    componentWillMount() {
        fixButtonManager.showDefaultMulti([{icon: <FilterList />, onTouchTap: this.handleOpen}]);
    }

    componentWillUnmount() {
        fixButtonManager.hidden();
    }

    render() {
        return (
            <div>
                <FilterDialog
                    filterItems={analystIndexDataSource.filterItems}
                    values={this.props.values}
                    onValuesChange={this.props.onValuesChange}
                    handleClose={this.handleClose}
                    title="分析师筛选器"
                    open={this.state.open}
                />
            </div>
        );
    }
}

class FilterView extends React.Component<any, any> {
    style = {
        paper: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 9,
            paddingBottom: 10,
        },
    };

    render() {
        const filters = analystIndexDataSource.filterItems.map(
            (ele, index) => {
                return (
                    <div role="filterItem" key={index}>
                        <Filter multi={true}
                                filterData={ele}
                                values={this.props.values}
                                onValuesChange={this.props.onValuesChange}
                        />
                    </div>
                );
            }
        );
        return (
            <div>
                <Paper style={this.style.paper}>
                    <div role="filter" className="flex-start">
                        {filters}
                    </div>
                </Paper>
            </div>
        );
    }
}

@observer
class AnalystList4Desktop extends React.Component<any, any> {
    styles = {
        container: {
            position: 'relative',
            paddingBottom: 24,
            flexGrow: 1,
            paddingTop: 6,
            display: 'flex',
            flexDirection: 'column',
        },
        page: {
            paddingRight: 4,
            paddingLeft: 3,
        }
    };

    onPageChange = (index) => {
        analystIndexDataSource.setRequestPageIndex(index - 1);
        analystIndexDataSource.request(() => {
            Util.scrollTop()
        });
    };

    render() {
        const loading = analystIndexDataSource.loading;
        if (!loading && analystIndexDataSource.error) {
            return null;
        } else {
            const progress = loading ? <FixLoading mobile={false} transparent/> : null;
            if (analystIndexDataSource.$.totalRowCount == 0) {
                return (
                    <div style={this.styles.container as any}>
                        <Empty mobile={false}/>
                        {progress}
                    </div>
                );
            } else {
                return (
                    <div style={this.styles.container as any}>
                        <AnalystCardGridLayout
                            dataSource={analystIndexDataSource.$.entities}
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
                                    <Paper role="pageTurner" className="center-align">
                                        <UltimatePaginationMaterialUi
                                            currentPage={analystIndexDataSource.$.pageIndex + 1}
                                            totalPages={analystIndexDataSource.$.pageCount}
                                            hideFirstAndLastPageLinks={true}
                                            onChange={this.onPageChange}/>
                                    </Paper>
                                )
                            }
                        />
                        {progress}
                    </div>
                );
            }
        }
    }
}

@observer
class AnalystList4Mobile extends React.Component<any, any> {

    styles = {
        list: {
            padding: 0,
            flexGrow: 1,
        },
        more: {},
        point: {
            fontSize: 30,
            right: 38,
            top: 18,
            height: 'none',
            width: 'none',
        }
    };

    render() {
        const loading = analystIndexDataSource.loading;
        if (analystIndexDataSource.$.totalRowCount == 0) {
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
            for (let index = 0; index < analystIndexDataSource.more.length; index++) {
                const item = analystIndexDataSource.more[index];
                items.push(
                    <Divider key={index} inset/>
                );
                items.push(
                    <AnalystItemMobile item={item}
                                       key={item.target.gtaId}
                    />
                );
            }
            let more = null;
            if (analystIndexDataSource.$.pageIndex
                < analystIndexDataSource.$.pageCount - 1) {
                more = (
                    <ShowMore loading={analystIndexDataSource.loading}
                              onTouchTap={
                                  (event) => {
                                      event.preventDefault();
                                      analystIndexDataSource.requestMore();
                                      analystIndexDataSource.request();
                                  }
                              }/>
                );
            }
            return (
                <Paper style={this.styles.list}>
                    <List>
                        {items}
                    </List>
                    {more}
                </Paper>
            )
        }
    }
}

class AnalystList extends React.Component<any, any> {
    render() {
        if (this.props.small) {
            return <AnalystList4Mobile/>;
        } else {
            return <AnalystList4Desktop fixDrawer={this.props.fixDrawer}/>;
        }
    }
}

