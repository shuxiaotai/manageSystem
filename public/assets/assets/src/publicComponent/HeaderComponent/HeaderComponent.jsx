import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateUser from '../../WebIndex/views/User/components/CreateUser';
import CreateRole from '../../WebIndex/views/User/components/CreateRole';
import CreateDepartment from '../../WebIndex/views/User/components/CreateDepartment';
import cookieUtil from '../../lib/cookieUtil';
import { Button, message } from 'antd';
import './css/headerComponent.scss';
import { Input } from 'antd';
import * as userAjax  from '../../WebIndex/views/User/ajaxOperation/userAjax';
const Search = Input.Search;

class HeaderComponent extends Component {
    constructor() {
        super();
        this.state = {
            userVisible: false,
            showAddBtn: false,
            roleVisible: false,
            departmentVisible: false
        };
    }
    componentWillMount() {
        if(cookieUtil.get('userInfor') !== '') {
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if (item.indexOf('1') !== -1) {
                    this.setState({
                        showAddBtn: true
                    });
                }
            }
        }else {
            // console.log('header');
            // console.log(cookieUtil.get('userInfor'));
            window.location.href = '/manageSystem/index#/login';
        }
    }
    showUserModal = () => {
        const { fetchRoles, fetchDepartments } = this.props;
        this.setState({ userVisible: true });
        fetchRoles();
        fetchDepartments();
    };
    showRoleModal = () => {
        // const { fetchRoles, fetchDepartments } = this.props;
        this.setState({ roleVisible: true });
        // fetchRoles();
        // fetchDepartments();
    };
    showDepartmentModal = () => {
        const { fetchDepartments } = this.props;
        this.setState({ departmentVisible: true });
        // fetchRoles();
        fetchDepartments();
    };
    saveUserFormRef = (form) => {
        this.form = form;
    };
    handleUserCancel = () => {
        this.setState({ userVisible: false });
    };
    handleUserCreate = () => {
        const form = this.form;
        const { createUser } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('user_: ', values);
            createUser(values);
            form.resetFields();
            this.setState({ userVisible: false });
        });
    };

    saveRoleFormRef = (form) => {
        this.roleForm = form;
    };

    handleRoleCancel = () => {
        this.setState({ roleVisible: false });
    };
    handleRoleCreate = () => {
        const form = this.roleForm;
        const { createRole } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('role_: ', values);
            let permissionArr = this.getPermission(values.permission);
            console.log('----');
            console.log(permissionArr);
            values.permission = permissionArr;
            createRole(values);
            // console.log(permissionArr.length);
            form.resetFields();
            this.setState({ roleVisible: false });
        });
    };

    getPermission = (permission) => {
        let permissionArr = '[';
        permission.forEach((item, index) => {
            permissionArr += item;
            if(index != permission.length - 1) {
                permissionArr += ',';
            }
        });
        permissionArr += ']';
        return permissionArr;
    };
    saveDepartFormRef = (form) => {
        this.departForm = form;
    };

    handleDepartCancel = () => {
        this.setState({ departmentVisible: false });
    };
    handleDepartCreate = () => {
        const form = this.departForm;
        const { createDepartment } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('department_ ', values);
            createDepartment(values);
            form.resetFields();
            this.setState({ departmentVisible: false });
        });
    };


    render() {
        const { sidebarClosed = false, closeSideBar, roleData, departmentData } = this.props;
        const { showAddBtn } = this.state;
        return(
            <div className={`header  ${sidebarClosed ? 'close' : ''}`}>
                <div className="sideButton" onClick={ () => closeSideBar(!sidebarClosed) }>
                    <i className="iconfont close-icon">{ sidebarClosed ? '\ue646' : '\ue645' }</i>
                </div>
                {
                    showAddBtn === true ? (
                        <div className="addUser">
                            <Button type="primary" onClick={this.showUserModal}>新增用户</Button>
                            <CreateUser
                                ref={this.saveUserFormRef}
                                visible={this.state.userVisible}
                                onCancel={this.handleUserCancel}
                                onCreate={this.handleUserCreate}
                                roleData={roleData}
                                departmentData={departmentData}
                                title="新增用户"
                                okText="创建"
                                disable={false}
                            />
                            <Button type="primary" onClick={this.showRoleModal} style={{ marginLeft: 10, marginRight:10 }}>新增角色</Button>
                            <CreateRole
                                ref={this.saveRoleFormRef}
                                visible={this.state.roleVisible}
                                onCancel={this.handleRoleCancel}
                                onCreate={this.handleRoleCreate}
                                // roleData={roleData}
                                // departmentData={departmentData}
                                title="新增角色"
                                okText="创建"
                                disable={false}
                            />
                            <Button type="primary" onClick={this.showDepartmentModal}>新增部门</Button>
                            <CreateDepartment
                                ref={this.saveDepartFormRef}
                                visible={this.state.departmentVisible}
                                onCancel={this.handleDepartCancel}
                                onCreate={this.handleDepartCreate}
                                // roleData={roleData}
                                departmentData={departmentData}
                                title="新增部门"
                                okText="创建"
                                disable={false}
                            />
                        </div>) : (null)
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer.userData,
        roleData: state.userReducer.roleData,
        departmentData: state.userReducer.departmentData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (userCreated) => {
            dispatch(userAjax.createUser(userCreated));
        },
        createRole: (roleCreated) => {
            dispatch(userAjax.createRole(roleCreated));
        },
        createDepartment: (departmentCreated) => {
            dispatch(userAjax.createDepartment(departmentCreated));
        },
        fetchRoles: () => {
            dispatch(userAjax.fetchRoles());
        },
        fetchDepartments: () => {
            dispatch(userAjax.fetchDepartments());
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);