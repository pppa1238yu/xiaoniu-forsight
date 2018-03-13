import "babel-polyfill";
import "whatwg-fetch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {HashRouter, Redirect, Route} from "react-router-dom";
import NotFound from "./pages/NotFound";
import {Switch} from "react-router";
import SmartReportPage from "./pages/smartReport/SmartReportPage";
import {observer} from "mobx-react";
import {amberA700, cyan600, lightBlue500, red400, red500} from "material-ui/styles/colors";
import "whatwg-fetch";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import SmartReportPdfPage from "./pages/smartReport/SmartReportPdfPage";
import {FixFloatingButton} from "./components/common/FloatingButton";
import {widthListener, WidthNotifier} from "./model/state/WidthNotifier";

interface AppState {
    width: number;
}
@observer
export default class SmartReport extends React.Component<null, AppState> {

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

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }


    public render() {
        const content = (
            <div>
                <div>
                    <Switch>
                        <Route exact path={SmartReportPage.path} component={SmartReportPage}/>
                        <Route exact path={SmartReportPdfPage.path} component={SmartReportPdfPage}/>
                        <Route exact path={NotFound.path} component={NotFound}/>
                        <Route exact path='/' render={
                            props => (
                                <Redirect to={
                                    {
                                        pathname: SmartReportPage.path,
                                        state: {from: props.location}
                                    }
                                }/>
                            )
                        }/>
                    </Switch>
                </div>
            </div>
        );
        return (
            <HashRouter>
                <MuiThemeProvider muiTheme={this.muiTheme}>
                    <div>
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

ReactDOM.render(
    <SmartReport/>,
    document.getElementById('smartReport')
);
