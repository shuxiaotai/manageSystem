import React, { Component } from 'react';
import { connect } from 'react-redux';
import DepartmentTable from './DepartmentTable';
import * as userAjax from '../ajaxOperation/userAjax';


class Department extends Component {
    render() {
        return(
            <div style={{ paddingLeft:29, marginRight: 25, marginTop: 5 }}>
                <DepartmentTable
                />
            </div>
        );
    }
}
export default Department;