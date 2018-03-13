import * as React from "react";
import * as ReactDOM from "react-dom";
import {HashRouter, Redirect, Route} from "react-router-dom";
import NotFound from "./pages/NotFound";
import {Switch} from "react-router";
import Report from "./pages/extra/Report";
import ContactUs from "./pages/extra/ContactUs";
import AboutUs from "./pages/extra/AboutUs";
import Helps from "./pages/extra/Helps";
import JoinUs from "./pages/extra/JoinUs";
import {observer} from "mobx-react";
import {Util} from "./Constants";
import {amberA700, cyan600, lightBlue500, red400, red500} from "material-ui/styles/colors";
import "whatwg-fetch";
interface AppState {
    width: number;
}
interface AppState {
    width: number;
}
@observer
export default class Extra extends React.Component<null, AppState> {

    private resizeHandler: () => void = () => {
        let oldWidth = this.state.width;
        const width = window.innerWidth;
        if (oldWidth != width) {
            this.setState({width: width});
        }
    };

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
        const type = Util.device(this.state.width);
        const content = (
            <div>
                <div>
                    <Switch>
                        <Route exact path={Report.path} component={Report}/>
                        <Route exact path={ContactUs.path} component={ContactUs}/>
                        <Route exact path={AboutUs.path} component={AboutUs}/>
                        <Route exact path={Helps.path} component={Helps}/>
                        <Route exact path={JoinUs.path} component={JoinUs}/>
                        <Route exact path={NotFound.path} component={NotFound}/>
                        <Route exact path='/' render={
                            props => (
                                <Redirect to={
                                    {
                                        pathname: Report.path,
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
                <div>
                    {content}
                </div>
            </HashRouter>
        );
    }
}
ReactDOM.render(
    <Extra/>,
    document.getElementById('extra')
);
