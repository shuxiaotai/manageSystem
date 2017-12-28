import React, { Component } from 'react';
import '../css/index.scss';
import UserTable from "./UserTable";
class Admin extends Component {
    constructor() {
        super();
    }
    componentWillMount() {
        console.log('user_will_mount');
    }
    render() {
        return (
            <div className="userContainer">
                <div className="userRight">
                    <div className="userInforTable">
                        <UserTable />
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;
