import "babel-polyfill";
import "whatwg-fetch";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";

import * as injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import IndexPage from "./pages/home/IndexPage";
import AnalystIndexPage from "./pages/analyst/AnalystIndexPage";
import StockDetailPage from "./pages/stock/StockDetailPage";
import IndustryIndexPage from "./pages/category/IndustryIndexPage";
import SubjectIndexPage from "./pages/category/SubjectIndexPage";
import {HashRouter, Redirect, Route} from "react-router-dom";
import BarAndDrawerView from "./components/bar/BarAndDrawerView";
import IndustryDetailPage from "./pages/category/IndustryDetailPage";
import SubjectDetailPage from "./pages/category/SubjectDetailPage";
import StockIndexPage from "./pages/stock/StockIndexPage";
import SmartAccountPage from  "./pages/smartAccount/SmartAccountPage";
import SmartReportPage from  "./pages/smartReport/SmartReportPage";
import MessagePage from "./pages/message/MessagePage";
import HomePage from "./pages/home/HomePage";

import {userDataSource} from "./model/ajax/UserService";
import AnalystDetailPage from "./pages/analyst/AnalystDetailPage";
import Constants, {Util} from "./Constants";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {amberA700, cyan600, lightBlue500, red400, red500} from "material-ui/styles/colors";

import CollectIndexPage from "./pages/account/CollectIndexPage";
import FocusIndexPage from "./pages/account/FocusIndexPage";
import NotFound from "./pages/NotFound";
import {Switch} from "react-router";
import MoreNewsPage from "./pages/home/MoreNewsPage";
import AccountSettingPage from "./pages/account/AcountSettingPage";
import IdxDetailPage from "./pages/idx/IdxDetailPage";
import {Tip} from "./components/common/Tip";
import {FixFloatingButton} from "./components/common/FloatingButton";
import {widthListener, WidthNotifier} from "./model/state/WidthNotifier";
import IETip from "./pages/IETip";
import {Simulate} from "react-dom/test-utils";
import ActivityPage from "./pages/activity/ActivityPage";
import MyPrizesPage from "./pages/activity/MyPrizesPage";
declare let escape;
class RouterWithNoLogin extends React.Component<any, null> {
    render() {
        return (
            <Redirect to={
                {
                    pathname: HomePage.path,
                }
            }/>
        );
    }
}

class RouterWithLogin extends React.Component<any, null> {
    render() {
        return (
            <Redirect to={
                {
                    pathname: NotFound.path,
                }
            }/>
        );
    }
}

@observer
export default class App extends React.Component<null, null> {

    styles = {
        content: {
            paddingTop: Constants.barHeight,
            paddingLeft: Constants.drawerWidth,
            display: 'flex',
            flexFlow: 'column',
            minHeight: '100vh',
            backgroundColor: '#393f4f'
        },
        contentSmall: {
            paddingTop: Constants.barHeight,
            display: 'flex',
            flexFlow: 'column',
            minHeight: '100vh',
            backgroundColor: '#393f4f'
        },
    };

    constructor(props, context) {
        super(props, context);
    }

    muiTheme = getMuiTheme({
        palette: {
            primary1Color: red400,
            accent1Color: amberA700
        },
    });

    widthNotifier: WidthNotifier = null;

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
    }

    public render() {
        this.widthNotifier.registerUpdate();

        const type = this.widthNotifier.device;
        const name = userDataSource.$ && userDataSource.$.fullName;
        const fixDrawer = Util.fixDrawer(type);
        const small=Util.small(type);
        const content = userDataSource.login ? (
            <div>
                <BarAndDrawerView login={true} loginName={name} fixDrawer={fixDrawer} small={small}/>
                <div style={!fixDrawer ?
                    this.styles.contentSmall : this.styles.content}>
                    <Switch>
                        <Route exact path={IndexPage.path} component={IndexPage}/>
                        <Route exact path={StockIndexPage.path} component={StockIndexPage}/>
                        <Route exact path={StockDetailPage.linkPath} component={StockDetailPage}/>
                        <Route path={IdxDetailPage.linkPath} component={IdxDetailPage}/>
                        <Route exact path={IndustryIndexPage.path} component={IndustryIndexPage}/>
                        <Route path={IndustryDetailPage.LINK_PATH} component={IndustryDetailPage}/>
                        <Route exact path={SubjectIndexPage.path} component={SubjectIndexPage}/>
                        <Route path={SubjectDetailPage.LINK_PATH} component={SubjectDetailPage}/>
                        <Route path={AnalystDetailPage.linkPath} component={AnalystDetailPage}/>
                        <Route exact path={AnalystIndexPage.path} component={AnalystIndexPage}/>
                        <Route exact path={CollectIndexPage.path} component={CollectIndexPage}/>
                        <Route exact path={MessagePage.path} component={MessagePage}/>
                        <Route exact path={FocusIndexPage.path} component={FocusIndexPage}/>
                        <Route exact path={AccountSettingPage.path} component={AccountSettingPage}/>
                        <Route exact path={MoreNewsPage.path} component={MoreNewsPage}/>
                        <Route exact path={SmartAccountPage.path} component={SmartAccountPage}/>
                        <Route exact path={NotFound.path} component={NotFound}/>
                        <Route exact path='/' render={
                            props => (
                                <Redirect to={
                                    {
                                        pathname: IndexPage.path,
                                        state: {from: props.location}
                                    }
                                }/>
                            )
                        }/>
                        <Route exact path={HomePage.path} render={
                            props => (
                                <Redirect to={
                                    {
                                        pathname: IndexPage.path,
                                        state: {from: props.location}
                                    }
                                }/>
                            )
                        }/>
                        <Route component={RouterWithLogin}/>

                    </Switch>
                </div>
            </div>
        ) : (
            <Switch>
                <Route exact path={HomePage.path} component={HomePage}/>
                <Route component={RouterWithNoLogin}/>
            </Switch>
        );
        return (
            <HashRouter>
                <MuiThemeProvider muiTheme={this.muiTheme}>
                    <div>
                        <Tip fixDrawer={fixDrawer && userDataSource.login}/>
                        <FixFloatingButton/>
                        {content}
                    </div>
                </MuiThemeProvider>
            </HashRouter>
        );
    }
}

injectTapEventPlugin({
    shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
        //console.log(lastTouchEventTimestamp, clickEventTimestamp);
        return lastTouchEventTimestamp != null;
    }
});

if (Util.isIE()) {
    ReactDOM.render(
        <IETip/>,
        document.getElementById('app')
    );
} else {
    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );

}
