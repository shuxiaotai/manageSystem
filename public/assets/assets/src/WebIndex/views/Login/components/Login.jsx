import React, { Component } from 'react';
import { message, Button } from 'antd';
import * as loginAjax from '../ajaxOperation/loginAjax';
import '../css/login.scss';
import cookieUtil from '../../../../lib/cookieUtil';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };
    }
    componentWillMount() {

    };
    changeUsernameValue = (event) => {
        this.setState({
            username:event.target.value
        });
    };
    changePasswordValue = (event) => {
        this.setState({
            password:event.target.value
        });
    };
    submitUserInfo = () => {
        const { username, password } = this.state;
        loginAjax.login({ username, password })
            .then((value) => {
                console.log('登录');
                console.log(value);
                if(value === 401) {
                    message.info('登录失败!');
                }else {
                    message.info('登录成功!');
                    let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
                    for(let item of permission) {
                        if(item.indexOf('1') !== -1 && item.indexOf('2') !== -1 && item.indexOf('3') !== -1) {
                            console.log('超级管理员');
                            setTimeout(function () {
                                window.location.href = '/manageSystem/index#/user';
                            }, 1500);
                        }else if(item.indexOf('1') !== -1) {
                            console.log('管理员');
                            setTimeout(function () {
                                window.location.href = '/manageSystem/index#/user';
                            }, 1500);
                        }else if(item.indexOf('2') !== -1) {
                            console.log('审核员');
                            setTimeout(function () {
                                window.location.href = '/manageSystem/index#/user';
                            }, 1500);
                        }else if (item.indexOf('3') !== -1) {
                            console.log('日志员');
                            setTimeout(function () {
                                window.location.href = '/manageSystem/index#/log';
                            }, 1500);
                        }
                    }
                }
            });

    };
    render() {
        return(
            <div className="main">
                <div className="welcome">
                    <span>welcome</span>
                </div>
                <div className="login">
                    <input
                        className="inputInfor"
                        onChange={this.changeUsernameValue}
                    />
                    <input
                        className="inputInfor"
                        type="password"
                        onChange={this.changePasswordValue}
                    />
                    <input type="button" value="登录" className="loginBtn" onClick={this.submitUserInfo} />
                </div>
            </div>
        );
    }
}

export default Login;