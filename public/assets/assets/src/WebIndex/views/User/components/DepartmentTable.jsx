import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userAjax from '../ajaxOperation/userAjax';
import { Table, Popconfirm, message } from 'antd';
import cookieUtil from '../../../../lib/cookieUtil';
import CreateDepartment from './CreateDepartment';

const pagination = {
    defaultPageSize: 8
};

let columns = [];
class DepartmentTable extends Component {
    constructor() {
        super();
        this.state = {
            selectedKey: -1,
        };
    }
    componentWillMount() {
        if(cookieUtil.get('userInfor') !== '') {
            const { getDepartmentsInfor } = this.props;
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if (item.indexOf('1') !== -1) {
                    getDepartmentsInfor();
                    console.log('管理员');
                    columns = [{
                        title: '部门代码',
                        dataIndex: 'department_code',
                    }, {
                        title: '部门名称',
                        dataIndex: 'department_name',
                    }, {
                        title: '联系电话',
                        dataIndex: 'department_tel',
                    }, {
                        title: '父部门',
                        dataIndex: 'parent_name',
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }, {
                        title: '操作',
                        dataIndex: 'oper',
                        render:(text, record) => (
                            <span>
                                <Popconfirm title="确认删除?" onConfirm={() => {
                                    this.onDeleteDepartment(record.key, record.index);
                                }}>
                                    <a href="#">删除</a>
                                </Popconfirm>
                                <Popconfirm title="确认修改?" onConfirm={() => {
                                    this.onUpdateDepartment(record.key, record.index);
                                }}>
                                    <a href="#" style={{ paddingLeft: 10, paddingRight: 10 }}>修改</a>
                                </Popconfirm>
                            </span>
                        )
                    }];
                }else if(item.indexOf('2') !== -1) {
                    getDepartmentsInfor();
                    columns = [{
                        title: '部门代码',
                        dataIndex: 'department_code',
                    }, {
                        title: '部门名称',
                        dataIndex: 'department_name',
                    }, {
                        title: '联系电话',
                        dataIndex: 'department_tel',
                    }, {
                        title: '父部门',
                        dataIndex: 'parent_name',
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }, {
                        title: '操作',
                        dataIndex: 'oper',
                        render:(text, record) => (
                            <span>
                                <Popconfirm title="确认通过?" onConfirm={() => {
                                    this.onPassDepartment(record.key, record.index);
                                }}>
                                    <a href="#">通过</a>
                                </Popconfirm>
                                <Popconfirm title="确认不通过?" onConfirm={() => {
                                    this.onNoPassDepartment(record.key, record.index);
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
    };
    onPassDepartment = (key, index) => {
        const { passDepartment } = this.props;
        // this.setState({ selectedKey: key });
        // this.setState({ selectedIndex: index });
        passDepartment(key, index);
    };
    onNoPassDepartment = (key, index) => {
        const { noPassDepartment } = this.props;
        // const dataSource = [...this.state.dataSource];
        // this.setState({ selectedKey: key });
        // this.setState({ selectedIndex: index });
        // console.log('delete');

        noPassDepartment(key, index);
        // console.log(key);
        // console.log(index);
    };
    onDeleteDepartment = (key, index) => {
        const { deleteDepartment } = this.props;
        // const dataSource = [...this.state.dataSource];
        // this.setState({ selectedKey: key });
        // console.log('delete');
        deleteDepartment(key, index);
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    onUpdateDepartment = (key, index) => {
        const　{ getCheckDepartment, fetchRoles, fetchDepartments } = this.props;
        this.setState({ visible: true });
        this.setState({ selectedKey: key });
        // this.setState({ selectedIndex: index });
        getCheckDepartment(key);
        // fetchRoles();
        fetchDepartments();
        // console.log('update');
        // console.log(key);
        // console.log(index);
    };
    handleCreate = () => {
        const { checkedDepartmentInfor, updateDepartment, fetchUserInfor } = this.props;
        const { selectedKey, selectedIndex } = this.state;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            // console.log(checkedUserInfor);
            // console.log(selectedKey);
            updateDepartment(checkedDepartmentInfor, selectedKey, selectedIndex, values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        const { departmentsInfor, checkedDepartmentInfor, departmentData } = this.props;
        return (
            <div>
                <Table columns={columns} dataSource={departmentsInfor} pagination={pagination} />
                <CreateDepartment
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    // roleData={roleData}
                    departmentData={departmentData}
                    title="修改部门"
                    checkedDepartmentInfor={checkedDepartmentInfor}
                    okText="修改"
                    disable={true}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        departmentsInfor: state.userReducer.departmentsInfor,
        checkedDepartmentInfor: state.userReducer.checkedDepartmentInfor,
        departmentData: state.userReducer.departmentData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDepartmentsInfor: () => {
            dispatch(userAjax.getDepartmentsInfor());
        },
        passDepartment: (key, index) => {
            dispatch(userAjax.passDepartment(key, index));
        },
        noPassDepartment: (key, index) => {
            dispatch(userAjax.noPassDepartment(key, index));
        },
        deleteDepartment: (key, index) => {
            dispatch(userAjax.deleteDepartment(key, index));
        },
        getCheckDepartment: (id) => {
            dispatch(userAjax.getCheckDepartment(id));
        },
        fetchDepartments: () => {
            dispatch(userAjax.fetchDepartments());
        },
        updateDepartment: (checkDepartmentInfor, key, index, departmentUpdated) => {
            dispatch(userAjax.updateDepartment(checkDepartmentInfor, key, index, departmentUpdated));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentTable);
