import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import {userDataSource} from "../model/ajax/UserService";
//import { observer } from 'mobx-react';

export default class RouterWithAuth extends React.Component<any, null> {

    render() {
        const login = userDataSource.login;
        const {
            component : Component, ...rest
        } = this.props;
        return (
             <Route {...rest} render={
                 props => (
                     login ? (
                         <Component {...props} />
                     ) : (
                         <Redirect to={
                             {
                                 pathname: "/",
                                 state: {from: props.location}
                             }
                         }/>
                     )
                 )
             }/>

        );
    }
}

