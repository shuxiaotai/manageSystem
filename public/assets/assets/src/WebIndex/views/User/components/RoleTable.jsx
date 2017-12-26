import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userAjax from '../ajaxOperation/userAjax';
import { Table, Popconfirm, message } from 'antd';
import cookieUtil from '../../../../lib/cookieUtil';

const pagination = {
    defaultPageSize: 8
};

let columns = [];
class RoleTable extends Component {
    constructor() {
        super();
        this.state = {
            selectedKey: -1,
        };
    }
    componentWillMount() {
        if(cookieUtil.get('userInfor') !== '') {
            const { getRolesInfor } = this.props;
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if (item.indexOf('1') !== -1) {
                    getRolesInfor();
                    console.log('管理员');
                    columns = [{
                        title: '角色代码',
                        dataIndex: 'role_code',
                    }, {
                        title: '角色名称',
                        dataIndex: 'role_name',
                    }, {
                        title: '权限',
                        dataIndex: 'permission',
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }];
                }else {
                    message.info('您没有管理的权限!');
                }
            }
        }else {
            window.location.href = '/manageSystem/index#/login';
        }
    };
    onDeleteUser = (key) => {
        // const dataSource = [...this.state.dataSource];
        this.setState({ selectedKey: key });
    };

    render() {
        const { rolesInfor } = this.props;
        return (
            <Table columns={columns} dataSource={rolesInfor} pagination={pagination} />
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleTable);
