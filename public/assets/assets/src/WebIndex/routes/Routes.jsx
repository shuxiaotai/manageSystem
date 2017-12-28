import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import User from '../views/User/components/User';
import Log from '../views/User/components/Log';
import Role from '../views/User/components/Role';
import Login from '../views/Login/components/Login';
import ControlTotalComponent from '../views/ControlTotalComponent/ControlTotalComponent';
import Department from "../views/User/components/Department";


const consoleWrap = Content => class ConsoleWrap extends Component {
    render() {
        return <ControlTotalComponent { ...this.props } Content={ Content } />;
    }
};

class RoutesComponent extends Component {
    render() {
        return(
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/user" exact component={ consoleWrap(User) } />
                <Route path="/log" exact component={ consoleWrap(Log) } />
                <Route path="/role" exact component={ consoleWrap(Role) } />
                <Route path="/department" component={ consoleWrap(Department) } />
                <Redirect to={ '/user' } />
            </Switch>
        );
    }
}

const Routes = () => <HashRouter>
    <Route path="/" component={ RoutesComponent } />
</HashRouter>;
export default Routes;