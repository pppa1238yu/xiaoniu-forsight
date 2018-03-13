import "babel-polyfill";
import "whatwg-fetch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {HashRouter, Redirect, Route} from "react-router-dom";
import NotFound from "./pages/NotFound";
import {Switch} from "react-router";
import SearchPage from "./pages/weChat/SearchPage";
import ValuationPage from "./pages/weChat/ValuationPage";
import HotPointsPage from "./pages/weChat/HotPointsPage";
import {observer} from "mobx-react";
import {Util} from "./Constants";
import {amberA700, cyan600, lightBlue500, red400, red500} from "material-ui/styles/colors";
import "whatwg-fetch";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import SmartReportEntry from "./pages/weChat/SmartReportEntry";
import BindingPage from "./pages/weChat/BindingPage";

interface AppState {
    width: number;
}

@observer
export default class WeChat extends React.Component<null, AppState> {

    private resizeHandler: () => void = () => {
        let oldWidth = this.state.width;
        const width = window.innerWidth;
        if (oldWidth != width) {
            this.setState({width: width});
        }
    };

    muiTheme = getMuiTheme({
        palette: {
            primary1Color: red400,
            accent1Color: amberA700
        },
    });

    constructor(props, context) {
        super(props, context);
        let width = window.innerWidth;
        this.state = {width: width};
    }

    public render() {
        return (
            <HashRouter>
                <MuiThemeProvider muiTheme={this.muiTheme}>
                    <div>
                        <div>
                            <div>
                                <Switch>
                                    <Route exact path={SearchPage.path} component={SearchPage}/>
                                    <Route exact path={ValuationPage.path} component={ValuationPage}/>
                                    <Route exact path={HotPointsPage.path} component={HotPointsPage}/>
                                    <Route exact path={BindingPage.path} component={BindingPage}/>
                                    <Route exact path={SmartReportEntry.path} component={SmartReportEntry}/>
                                    <Route exact path={NotFound.path} component={NotFound}/>
                                    <Route exact path='/' render={
                                        props => (
                                            <Redirect to={
                                                {
                                                    pathname: SearchPage.path,
                                                    state: {from: props.location}
                                                }
                                            }/>
                                        )
                                    }/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </MuiThemeProvider>
            </HashRouter>
        );
    }
}

injectTapEventPlugin();
ReactDOM.render(
    <WeChat/>,
    document.getElementById('weChat')
);
