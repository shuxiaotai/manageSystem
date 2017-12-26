import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateUser from '../../WebIndex/views/User/components/CreateUser';
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
            visible: false,
            showAddBtn: false
        };
    }
    componentWillMount() {
        const { fetchRoles, fetchDepartments } = this.props;
        if(cookieUtil.get('userInfor') !== '') {
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if (item.indexOf('1') !== -1) {
                    this.setState({
                        showAddBtn: true
                    });
                    fetchRoles();
                    fetchDepartments();
                }
            }
        }else {
            // console.log('header');
            // console.log(cookieUtil.get('userInfor'));
            window.location.href = '/manageSystem/index#/login';
        }
    }
    showModal = () => {
        this.setState({ visible: true });
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCreate = () => {
        const form = this.form;
        const { createUser } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // console.log('Received values of form: ', values);
            createUser(values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    saveFormRef = (form) => {
        this.form = form;
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
                            <Button type="primary" onClick={this.showModal}>新增用户</Button>
                            <CreateUser
                                ref={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                roleData={roleData}
                                departmentData={departmentData}
                                title="新增用户"
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
        fetchRoles: () => {
            dispatch(userAjax.fetchRoles());
        },
        fetchDepartments: () => {
            dispatch(userAjax.fetchDepartments());
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);