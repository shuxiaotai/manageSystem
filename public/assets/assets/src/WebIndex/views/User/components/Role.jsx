import React, { Component } from 'react';
import RoleTable from './RoleTable';
import { connect } from 'react-redux';
import * as userAjax from '../ajaxOperation/userAjax';
import * as userAction from '../actions/userAction';



class Role extends Component {
    componentWillMount() {
        console.log('role_will_mount');
    };
    render() {
        const { rolesInfor, getRolesInfor } = this.props;
        return(
            <div style={{ paddingLeft:29, marginRight: 25, marginTop: 5 }}>
                <RoleTable
                    rolesInfor={rolesInfor}
                    getRolesInfor={getRolesInfor}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rolesInfor: state.userReducer.rolesInfor
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRolesInfor: () => {
            dispatch(userAjax.getRolesInfor());
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Role);