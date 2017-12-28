import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import cookieUtil from '../../../../lib/cookieUtil';
import { message } from 'antd';
import { connect } from 'react-redux';
import * as userAjax from '../ajaxOperation/userAjax';
import * as userAction from '../actions/userAction';
import CreateRole from './CreateRole';

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
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            const { getRolesInfor } = this.props;
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
                        render:(text, record) => this.getPermissionName(record.permission)
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }, {
                        title: '操作',
                        dataIndex: 'oper',
                        render:(text, record) => (
                            <span>
                                <Popconfirm title="确认删除?" onConfirm={() => {
                                    this.onDeleteRole(record.key, record.index);
                                }}>
                                    <a href="#">删除</a>
                                </Popconfirm>
                                <Popconfirm title="确认修改?" onConfirm={() => {
                                    this.onUpdateRole(record.key, record.index);
                                }}>
                                    <a href="#" style={{ paddingLeft: 10, paddingRight: 10 }}>修改</a>
                                </Popconfirm>
                            </span>
                        )
                    }];
                }else if(item.indexOf('2') !== -1) {
                    getRolesInfor();
                    columns = [{
                        title: '角色代码',
                        dataIndex: 'role_code',
                    }, {
                        title: '角色名称',
                        dataIndex: 'role_name',
                    }, {
                        title: '权限',
                        dataIndex: 'permission',
                        render:(text, record) => this.getPermissionName(record.permission)
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }, {
                        title: '操作',
                        dataIndex: 'oper',
                        render:(text, record) => (
                            <span>
                                <Popconfirm title="确认通过?" onConfirm={() => {
                                    this.onPassRole(record.key, record.index);
                                }}>
                                    <a href="#">通过</a>
                                </Popconfirm>
                                <Popconfirm title="确认不通过?" onConfirm={() => {
                                    this.onNoPassRole(record.key, record.index);
                                }}>
                                    <a href="#" style={{ paddingLeft: 10, paddingRight: 10 }}>不通过</a>
                                </Popconfirm>
                            </span>
                        )
                    }];
                }else {
                    message.info('您没有管理的权限!');
                }
            }
        }else {
            window.location.href = '/manageSystem/index#/login';
        }
    }
    onPassRole = (key, index) => {
        const { passRole } = this.props;
        // this.setState({ selectedKey: key });
        // this.setState({ selectedIndex: index });
        passRole(key, index);
    };
    onNoPassRole = (key, index) => {
        const { noPassRole } = this.props;
        // const dataSource = [...this.state.dataSource];
        // this.setState({ selectedKey: key });
        // this.setState({ selectedIndex: index });
        // console.log('delete');

        noPassRole(key, index);
        // console.log(key);
        // console.log(index);
    };
    onDeleteRole = (key, index) => {
        const { deleteRole } = this.props;
        // const dataSource = [...this.state.dataSource];
        // this.setState({ selectedKey: key });
        // console.log('delete');
        deleteRole(key, index);
    };
    onUpdateRole = (key, index) => {
        const　{ getCheckRole, fetchRoles, fetchDepartments } = this.props;
        this.setState({ visible: true });
        this.setState({ selectedKey: key });
        // this.setState({ selectedIndex: index });
        getCheckRole(key);
        // fetchRoles();
        // fetchDepartments();
        // console.log('update');
        // console.log(key);
        // console.log(index);
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCreate = () => {
        const { checkedRoleInfor, updateRole, fetchUserInfor } = this.props;
        const { selectedKey, selectedIndex } = this.state;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', JSON.stringify(values));
            // console.log(checkedUserInfor);
            let permissionArr = this.getPermission(values.permission);
            console.log(values.permission);
            console.log('----');
            console.log(permissionArr);
            values.permission = permissionArr;
            // console.log(selectedKey);
            updateRole(checkedRoleInfor, selectedKey, selectedIndex, values);
            console.log(values.permission);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    getPermission = (permission) => {
        let permissionArr = '[';
        permission.forEach((item, index) => {
            permissionArr += item.key;
            if(index != permission.length - 1) {
                permissionArr += ',';
            }
        });
        permissionArr += ']';
        return permissionArr;
    };
    getPermissionName = (permission) => {
        let permissionArr = [];
        for(let item of permission) {
            if(item.indexOf('1') !== -1) {
                permissionArr.push('管理权限 ');
            }else if(item.indexOf('2') !== -1) {
                permissionArr.push('审核权限 ');
            }else if(item.indexOf('3') !== -1) {
                permissionArr.push('日志权限 ');
            }
        }
        return permissionArr;
    };
    saveFormRef = (form) => {
        this.form = form;
    };
    render() {
        const { rolesInfor, checkedRoleInfor } = this.props;
        return (
            <div>
                <Table columns={columns} dataSource={rolesInfor} pagination={pagination} />
                <CreateRole
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    // roleData={roleData}
                    // departmentData={departmentData}
                    title="修改角色"
                    checkedRoleInfor={checkedRoleInfor}
                    okText="修改"
                    disable={true}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rolesInfor: state.userReducer.rolesInfor,
        checkedRoleInfor: state.userReducer.checkedRoleInfor
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        passRole: (key, index) => {
            dispatch(userAjax.passRole(key, index));
        },
        noPassRole: (key, index) => {
            dispatch(userAjax.noPassRole(key, index));
        },
        deleteRole: (key, index) => {
            dispatch(userAjax.deleteRole(key, index));
        },
        getCheckRole: (id) => {
            dispatch(userAjax.getCheckRole(id));
        },
        updateRole: (checkRoleInfor, key, index, roleUpdated) => {
            dispatch(userAjax.updateRole(checkRoleInfor, key, index, roleUpdated));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleTable);
