import * as React from "react";
import * as ReactDOM from "react-dom";

import {pinkA200, red500, red200, grey400, white, transparent} from "material-ui/styles/colors";

import Paper from "material-ui/Paper";
import Search from "material-ui/svg-icons/action/search";
import Clear from "material-ui/svg-icons/content/clear";
import Constants from "../../Constants";
import Updater from "../../model/state/Updater";
import {observer} from "mobx-react";
import Popover, {PopoverAnimationVertical} from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import {List, ListItem} from "material-ui/List";
import FlatButton from "material-ui/FlatButton";
import Attention, {AttentionStyle} from "./Attention";
import {EntityType} from "../../model/entities/EntityType";
import {Tab, Tabs} from "material-ui/Tabs";
import {searchDataSource} from "../../model/ajax/SearchService";
import CircularProgress from "material-ui/CircularProgress";
import History from "../../router/History";
import StockDetailPage from "../../pages/stock/StockDetailPage";
import AnalystDetailPage from "../../pages/analyst/AnalystDetailPage";
import IndustryDetailPage from "../../pages/category/IndustryDetailPage";
import SubjectDetailPage from "../../pages/category/SubjectDetailPage";

interface Props {
    fixDrawer: boolean;
    onRequestClose: Function;
}

@observer
export default class Searcher extends React.Component<Props, any> {

    static TRANSITION_TIME = 400;
    static TIP_DELAY = 300;

    loading = false;

    update = new Updater();
    value = "";

    open = false;
    anchorEl = null;
    focusInput = true;
    more = [false, false, false, false];

    mount = true;
    styles = {
        search: {
            marginTop: 17,
            marginLeft: 'auto',
            maxWidth: '400px',
            height: Constants.barHeight - 30,
            position: 'relative',
            transition: 'opacity ' + (Searcher.TRANSITION_TIME / 1000.0) + 's',
            opacity: 0,
            borderRadius: '24px',
            backgroundColor: '#393f4f',
        },
        inputContainer: {
            position: 'relative',
            flexGrow: 1,
            height: '100%',
        },
        searchInput: {
            outline: 'none',
            border: 'none',
            position: 'absolute',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            paddingTop: 1,
            paddingBottom: 1,
            color: '#fff',
            fontSize: '14px',
            backgroundColor: '#393f4f',
        },
        iconContainer: {
            width: 50,
            height: '100%',
            position: 'relative',
        },
        icon: {
            width: 26,
            height: 26,
            left: 13,
            top: 5,
            position: 'absolute',
        },
        pointer: {
            cursor: 'pointer',
        },
        popover: {
            transform: 'translate(0, 10px)',
        },
        menu: {
            position: 'relative',
            width: '100%',
        },
        list: {
            paddingTop: 0,
            display: 'block',
            width: '100%',
        },
        itemTitle: {
            color: "#000",
            fontSize: 16
        },
        pre: {
            padding: 0,
            margin: 0,
            color: '#616161'
        },
        loading: {
            padding: '12px 0 8px',
        },
        empty: {
            padding: '12px 0 8px',
        },
    };

    searchInput = null;

    componentDidMount() {
        this.searchInput.focus();
        this.styles.search.opacity = 1;
        this.update.doUpdate();
    }

    componentWillMount() {
        searchDataSource.setMount(true);
    }

    componentWillUnmount() {
        this.clearTip();
    }

    handleChange = (event) => {
        this.value = event.target.value;
        this.triggerSearch(this.value);
        this.update.doUpdate();
    };

    clearTip = () => {
        if (this.delayTip != null) {
            clearTimeout(this.delayTip);
            this.delayTip = null;
        }
    };

    clear = () => {
        this.more = [false, false, false, false];
    };

    delayTip = null;
    triggerSearch = (value) => {
        if (value && this.delayTip == null) {
            this.delayTip = setTimeout(this.tipSearch, Searcher.TIP_DELAY);
        } else if (this.delayTip == null) {
            this.closeTip();
            this.clear();
        }
    };

    tipSearch = () => {
        if (this.loading) {

        }
        this.delayTip = null;
        if (this.value) {
            this.openTip();
        }
    };

    handleRequestClose = () => {
        this.closeTip();
        //console.log("request close");
        //TODO
    };

    constructor(props, context) {
        super(props, context);
    }

    openTip = (focusInput = true) => {
        if (this.open) {
            searchDataSource.request(true, this.value, this.more);
            return false;
        } else {
            searchDataSource.restore();
            searchDataSource.request(true, this.value, this.more);
        }
        this.open = true;
        this.anchorEl = ReactDOM.findDOMNode(this.refs.searchContainer);
        this.focusInput = focusInput;

        this.update.doUpdate();

        return true;
    };

    closeTip = () => {
        this.clearTip();
        this.open = false;
        this.update.doUpdate();
    };

    clickItem = (event, link) => {
        this.close(event);
        History.push(link);
    };

    close = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this.mount) {
            return;
        }

        this.mount = false;
        this.styles.search.opacity = 0;
        //this.update.doUpdate();
        this.closeTip();

        this.closeEvent = setTimeout(() => {
            this.props.onRequestClose();
            this.closeEvent = null;
        }, Searcher.TRANSITION_TIME);
    };

    closeEvent = null;

    render() {
        this.update.registerUpdate();
        searchDataSource.registerUpdate();

        if (this.anchorEl) {
            this.styles.popover['width'] = this.anchorEl.clientWidth;
        }
        let max = 600;
        if (!this.props.fixDrawer) {
            max = 400;
        }
        if (this.props.fixDrawer) {
            this.styles.search['width'] = 600;
        } else {
            this.styles.search['width'] = '100%';
        }

        const open = this.open;

        const items = [];
        if (open && !searchDataSource.isEmpty()) {
            const stockValue = searchDataSource.result['STOCK'];
            if (stockValue.value.length > 0) {
                items.push(
                    <MenuItem
                        key="stock"
                        primaryText="股票"
                        disabled
                        style={this.styles.itemTitle}
                    />
                );
                for (const value of stockValue.value) {
                    items.push(
                        <MenuItem
                            key={value.id}
                            primaryText={
                                <div role="SearchReult_stock" className="flex-center">
                                    <pre style={this.styles.pre}>{value.id + " " + value.name}</pre>
                                    <div role="focusButton" className="auto-right">
                                        <Attention
                                            type={EntityType.STOCK}
                                            code={value.id}
                                            fixDrawer={this.props.fixDrawer}
                                            style={AttentionStyle.ICON}
                                        />
                                    </div>
                                </div>
                            }
                            onTouchTap={(event) => this.clickItem(event, StockDetailPage.path + value.id)}
                        />
                    )
                }
                if (stockValue.more) {
                    items.push(
                        <FlatButton role="SearchReult_moreStocksButton" key="stock-more" label="更多"
                                    fullWidth
                                    onTouchTap={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        searchDataSource.request(false, this.value, [], EntityType.STOCK);
                                        this.more[2] = true;
                                        this.searchInput.focus();
                                    }}
                        />);
                }
            }
            const researcherValue = searchDataSource.result['RESEARCHER'];
            if (researcherValue.value.length > 0) {
                items.push(
                    <MenuItem
                        key="researcher"
                        primaryText="分析师"
                        disabled
                        style={this.styles.itemTitle}
                    />
                );
                for (const value of researcherValue.value) {
                    items.push(
                        <MenuItem
                            key={'researcher' + value.id}
                            primaryText={
                                <div role="SearchReult_analyst" className="flex-center">
                                    <pre
                                        style={this.styles.pre}>{value.name + " " + value.brokerageName + " " + (value.title || "证券分析师")}</pre>
                                </div>
                            }
                            onTouchTap={(event) => this.clickItem(event, AnalystDetailPage.path + value.id)}
                        />
                    )
                }
                if (researcherValue.more) {
                    items.push(
                        <FlatButton role="SearchReult_moreAnalystsButton" key="researcher-more" label="更多"
                                    fullWidth
                                    onTouchTap={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        searchDataSource.request(false, this.value, [], EntityType.RESEARCHER);
                                        this.more[0] = true;
                                        this.searchInput.focus();
                                    }}
                        />);
                }
            }

            const industryValue = searchDataSource.result['INDUSTRY'];
            if (industryValue.value.length > 0) {
                items.push(
                    <MenuItem
                        key="industry"
                        primaryText="行业"
                        disabled
                        style={this.styles.itemTitle}
                    />
                );
                for (const value of industryValue.value) {
                    items.push(
                        <MenuItem
                            key={"industry" + value.id}
                            primaryText={
                                <div role="SearchReult_industry" className="flex-center">
                                    <pre style={this.styles.pre}>{value.name}</pre>
                                </div>
                            }
                            onTouchTap={(event) => this.clickItem(event, IndustryDetailPage.PATH + value.id)}
                        />
                    )
                }
                if (industryValue.more) {
                    items.push(
                        <FlatButton role="SearchReult_moreIndustriesButton" key="industry-more" label="更多"
                                    fullWidth
                                    onTouchTap={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        searchDataSource.request(false, this.value, [], EntityType.INDUSTRY);
                                        this.more[1] = true;
                                        this.searchInput.focus();
                                    }}
                        />);
                }
            }

            const subjectValue = searchDataSource.result['SUBJECT'];
            if (subjectValue.value.length > 0) {
                items.push(
                    <MenuItem
                        key="subject"
                        primaryText="题材"
                        disabled
                        style={this.styles.itemTitle}
                    />
                );
                for (const value of subjectValue.value) {
                    items.push(
                        <MenuItem
                            key={"subject" + value.id}
                            primaryText={
                                <div role="SearchReult_subject" className="flex-center">
                                    <pre style={this.styles.pre}>{value.name}</pre>
                                </div>
                            }
                            onTouchTap={(event) => this.clickItem(event, SubjectDetailPage.PATH + value.id)}
                        />
                    )
                }
                if (subjectValue.more) {
                    items.push(
                        <FlatButton role="SearchReult_moreSubjectsButton" key="subject-more" label="更多"
                                    fullWidth
                                    onTouchTap={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        searchDataSource.request(false, this.value, [], EntityType.SUBJECT);
                                        this.more[3] = true;
                                        this.searchInput.focus();
                                    }}
                        />);
                }
            }
        } else if (open && searchDataSource.isEmpty() && searchDataSource.loading) {
            items.push(
                <div key="loading" className="center-align" style={this.styles.loading}>

                    <CircularProgress/>
                </div>
            )
        } else if (open && searchDataSource.isEmpty()) {
            items.push(
                <div role="noSearchResult" key="empty" className="center-align" style={this.styles.empty}>无结果</div>
            )
        }

        return (
            <Paper ref="searchContainer" className="flex-center" style={this.styles.search as any}>
                <div style={this.styles.iconContainer as any}>
                    <Search color={white} style={this.styles.icon as any}/>
                </div>
                <div style={this.styles.inputContainer as any}>
                    <input role="searchDataInputBox" placeholder="搜索" style={this.styles.searchInput as any}
                           ref={(input) => {
                               this.searchInput = input
                           }}
                           value={this.value}
                           onChange={this.handleChange}
                           onKeyDown={(event) => {
                               if (event.keyCode == 13) {
                                   if (this.open) {
                                       //TODO
                                   } else {
                                       this.triggerSearch(this.value);
                                   }
                               } else if (event.keyCode == 27) {
                                   this.closeTip();
                               } else if (event.keyCode == 40) {
                                   if (this.open) {
                                       this.focusInput = false;
                                       this.update.doUpdate();
                                   }
                               }
                           }}
                    />

                    {(event) => event.preventDefault()}</div>
                <div role="buttonOfHiddenSearchBox" style={this.styles.iconContainer as any}>
                    <Clear color={white}
                           style={(Object as any).assign({}, this.styles.icon as any, this.styles.pointer)}
                           onTouchTap={this.close}
                    />
                </div>
                <Popover
                    open={open}
                    anchorEl={this.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                    style={this.styles.popover}
                >
                    <Menu
                        autoWidth={false}
                        style={this.styles.menu}
                        listStyle={this.styles.list}
                        maxHeight={max}
                        disableAutoFocus={this.focusInput}
                        initiallyKeyboardFocused
                    >
                        {items}
                    </Menu>
                </Popover>

            </Paper>);
    }

}
