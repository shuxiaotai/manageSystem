import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateUser from './CreateUser';
import { message } from 'antd';
import * as userAjax from '../ajaxOperation/userAjax';
import { Table, Popconfirm } from 'antd';
import cookieUtil from '../../../../lib/cookieUtil';

// const data = [];
// for (let i = 0; i < 20; i++) {
//     data.push({
//         key: i,
//         staff_code: `s00000${i}`,
//         username: 'shuxiaotai',
//         department: '技术部',
//         education: '大学',
//         major: '软件工程',
//         age: 21,
//         address: '浙江省杭州市拱墅区丰登街56号',
//         role: '管理员',
//         email: '760684681@qq.com',
//         is_check: '已审核'
//     });
// }

const pagination = {
    defaultPageSize: 12
};

let columns = [];
class UserTable extends Component {
    constructor() {
        super();
        this.state = {
            selectedKey: -1,
            selectedIndex: -1,
            visible: false
        };
    }
    componentWillMount() {
        if(cookieUtil.get('userInfor') !== '') {
            const { fetchUserInfor } = this.props;
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if(item.indexOf('1') !== -1) {
                    fetchUserInfor();
                    console.log('user_table_will_mount');
                    console.log('管理员');
                    columns = [{
                        title: '员工代码',
                        dataIndex: 'staff_code',
                    }, {
                        title: '用户',
                        dataIndex: 'username',
                    }, {
                        title: '部门',
                        dataIndex: 'department_name',
                    },  {
                        title: '学历',
                        dataIndex: 'education',
                    }, {
                        title: '专业',
                        dataIndex: 'major',
                    }, {
                        title: '年龄',
                        dataIndex: 'age',
                    }, {
                        title: '地址',
                        dataIndex: 'address',
                    }, {
                        title: '角色',
                        dataIndex: 'role_name',
                    }, {
                        title: '邮箱',
                        dataIndex: 'email',
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }, {
                        title: '操作',
                        dataIndex: 'oper',
                        render:(text, record) => (
                            <span>
                                <Popconfirm title="确认删除?" onConfirm={() => {
                                    this.onDeleteUser(record.key, record.index);
                                }}>
                                    <a href="#">删除</a>
                                </Popconfirm>
                                <Popconfirm title="确认修改?" onConfirm={() => {
                                    this.onUpdateUser(record.key, record.index);
                                }}>
                                    <a href="#" style={{ paddingLeft: 10, paddingRight: 10 }}>修改</a>
                                </Popconfirm>
                            </span>
                        )
                    }];
                }else if(item.indexOf('2') !== -1) {
                    fetchUserInfor();
                    console.log('user_tabel_will_mount');
                    console.log('审核员');
                    columns = [{
                        title: '员工代码',
                        dataIndex: 'staff_code',
                    }, {
                        title: '用户',
                        dataIndex: 'username',
                    }, {
                        title: '部门',
                        dataIndex: 'department_name',
                    },  {
                        title: '学历',
                        dataIndex: 'education',
                    }, {
                        title: '专业',
                        dataIndex: 'major',
                    }, {
                        title: '年龄',
                        dataIndex: 'age',
                    }, {
                        title: '地址',
                        dataIndex: 'address',
                    }, {
                        title: '角色',
                        dataIndex: 'role_name',
                    }, {
                        title: '邮箱',
                        dataIndex: 'email',
                    }, {
                        title: '状态',
                        dataIndex: 'is_check',
                    }, {
                        title: '操作',
                        dataIndex: 'oper',
                        render:(text, record) => (
                            <span>
                                <Popconfirm title="确认通过?" onConfirm={() => {
                                    this.onPassUser(record.key, record.index);
                                }}>
                                    <a href="#">通过</a>
                                </Popconfirm>
                                <Popconfirm title="确认不通过?" onConfirm={() => {
                                    this.onNoPassUser(record.key, record.index);
                                }}>
                                    <a href="#" style={{ paddingLeft: 10, paddingRight: 10 }}>不通过</a>
                                </Popconfirm>
                            </span>
                        )
                    }];
                }else {
                    console.log('user_table_will_mount');
                    message.info('您没有权限!');
                }
            }
        }else {
            window.location.href = '/manageSystem/index#/login';
        }
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCreate = () => {
        const { checkedUserInfor, updateUser, fetchUserInfor } = this.props;
        const { selectedKey, selectedIndex } = this.state;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            // console.log(checkedUserInfor);
            // console.log(selectedKey);
            updateUser(checkedUserInfor, selectedKey, selectedIndex, values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    saveFormRef = (form) => {
        this.form = form;
    };
    onDeleteUser = (key, index) => {
        const { deleteUser } = this.props;
        // const dataSource = [...this.state.dataSource];
        this.setState({ selectedKey: key });
        this.setState({ selectedIndex: index });
        // console.log('delete');
        deleteUser(key, index);
    };
    onPassUser = (key, index) => {
        const { passUser } = this.props;
        this.setState({ selectedKey: key });
        this.setState({ selectedIndex: index });
        passUser(key, index);
    };
    onNoPassUser = (key, index) => {
        const { noPassUser } = this.props;
        // const dataSource = [...this.state.dataSource];
        this.setState({ selectedKey: key });
        this.setState({ selectedIndex: index });
        // console.log('delete');

        noPassUser(key, index);
        // console.log(key);
        // console.log(index);
    };
    onUpdateUser = (key, index) => {
        const　{ getCheckUser, fetchRoles, fetchDepartments } = this.props;
        this.setState({ visible: true });
        this.setState({ selectedKey: key });
        this.setState({ selectedIndex: index });
        getCheckUser(key);
        fetchRoles();
        fetchDepartments();
        // console.log('update');
        // console.log(key);
        // console.log(index);
    };

    render() {
        const { userData, roleData, departmentData, checkedUserInfor } = this.props;
        {
            userData.forEach(function (item, index) {
                item.index = index;
                item.rowKey = index;
            });
        }
        return (
            <div>
                <Table columns={columns} dataSource={userData} pagination={pagination} />
                <CreateUser
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    roleData={roleData}
                    departmentData={departmentData}
                    title="修改用户"
                    checkedUserInfor={checkedUserInfor}
                    okText="修改"
                    disable={true}
                />
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer.userData,
        roleData: state.userReducer.roleData,
        departmentData: state.userReducer.departmentData,
        checkedUserInfor: state.userReducer.checkedUserInfor
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserInfor: () => {
            dispatch(userAjax.fetchUserInfor());
        },
        deleteUser: (key, index) => {
            dispatch(userAjax.deleteUser(key, index));
        },
        getCheckUser: (id) => {
            dispatch(userAjax.getCheckUser(id));
        },
        updateUser: (checkUserInfor, key, index, userUpdated) => {
            dispatch(userAjax.updateUser(checkUserInfor, key, index, userUpdated));
        },
        passUser: (key, index) => {
            dispatch(userAjax.passUser(key, index));
        },
        noPassUser: (key, index) => {
            dispatch(userAjax.noPassUser(key, index));
        },
        fetchRoles: () => {
            dispatch(userAjax.fetchRoles());
        },
        fetchDepartments: () => {
            dispatch(userAjax.fetchDepartments());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
// export default UserTable;