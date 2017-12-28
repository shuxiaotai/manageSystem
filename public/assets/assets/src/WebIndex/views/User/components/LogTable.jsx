import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userAjax from '../ajaxOperation/userAjax';
import { Table, Popconfirm, message } from 'antd';
import cookieUtil from '../../../../lib/cookieUtil';

const pagination = {
    defaultPageSize: 11
};

let columns = [];
class LogTable extends Component {
    constructor() {
        super();
        this.state = {
            selectedKey: -1,
        };
    }
    componentWillMount() {
        if(cookieUtil.get('userInfor') !== '') {
            const { fetchLogInfor } = this.props;
            let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
            for(let item of permission) {
                if (item.indexOf('3') !== -1) {
                    fetchLogInfor();
                    console.log('日志员');
                    columns = [{
                        title: '人物',
                        dataIndex: 'person',
                    }, {
                        title: 'ip地址',
                        dataIndex: 'ip_address',
                    }, {
                        title: '操作内容',
                        dataIndex: 'operation',
                    }, {
                        title: '时间',
                        dataIndex: 'created_at',
                    }];
                }else {
                    message.info('您没有查看日志的权限!');
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

export default connect(mapStateToProps, mapDispatchToProps)(LogTable);
// export default LogTable;