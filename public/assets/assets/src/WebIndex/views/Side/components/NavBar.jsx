import React, { Component } from 'react';
import 'public/iconFont/iconfont.scss';
import NavItem from './NavItem';
import '../css/index.scss';
import { connect } from 'react-redux';
import cookieUtil from '../../../../lib/cookieUtil';

const NavBarAdminMap = {
    1:{
        url:'/user',
        tag:<div>用户管理</div>,
    },
    2:{
        url:'/role',
        tag:<div>角色管理</div>,
    },
    3:{
        url:'/department',
        tag:<div>部门管理</div>,
    }
};

const NavBarCheckMap = {
    1:{
        url:'/user',
        tag:<div>用户管理</div>,
    },
    2:{
        url:'/role',
        tag:<div>角色管理</div>,
    },
    3:{
        url:'/department',
        tag:<div>部门管理</div>,
    }
};

const NavBarLogMap = {
    1:{
        url:'/log',
        tag:<div>查看日志</div>,
    },
};

class NavBar extends Component {

    render() {
        const { userPermission, sidebarClosed } = this.props;
        let permission = new Array(JSON.parse(cookieUtil.get('userInfo')).permission);
        let NavBarMap = {};
        for(let item of permission) {
            if(item.indexOf('1') !== -1) {
                NavBarMap = NavBarAdminMap;
            }else if(item.indexOf('2') !== -1) {
                NavBarMap = NavBarCheckMap;
            }else if(item.indexOf('3') !== -1) {
                NavBarMap = NavBarLogMap;
            }
        }
        return (
            <div className={`nav-bar  ${sidebarClosed ? 'close' : ''}`}>
                {Object.values(NavBarMap).map((item, index) => (
                    <li className="nav-li" key={index} >
                        <NavItem tag={item.tag} url={item.url} sidebarClosed={sidebarClosed} />
                    </li>
                ))}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        userPermission: state.userReducer.userPermission
    };
};

export default connect(mapStateToProps, null)(NavBar);