import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userAjax from '../ajaxOperation/userAjax';
import { Table, Popconfirm, message } from 'antd';
import cookieUtil from '../../../../lib/cookieUtil';

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
            // const { fetchLogInfor } = this.props;
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if (item.indexOf('1') !== -1) {
                    // fetchLogInfor();
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
        const { logData } = this.props;
        return (
            <Table columns={columns} dataSource={logData} pagination={pagination} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        logData: state.userReducer.logData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLogInfor: () => {
            dispatch(userAjax.fetchLogInfor());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentTable);
// export default LogTable;