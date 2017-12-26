import React from 'react';
import 'public/iconFont/iconfont.scss';
import NavItem from './NavItem';
import '../css/index.scss';



const NavBarMap = {
    1:{
        url:'/user',
        tag:<div>用户管理</div>,
    },
    2:{
        url:'/role',
        tag:<div>角色管理</div>,
    },
    3:{
        url:'/log',
        tag:<div>查看日志</div>,
    },
};

const NavBar = ({ sidebarClosed }) => {
    return (
        <div className={`nav-bar  ${sidebarClosed ? 'close' : ''}`}>
            {Object.values(NavBarMap).map((item, index) => (
                <li className="nav-li" key={index} >
                    <NavItem tag={item.tag} url={item.url} sidebarClosed={sidebarClosed} />
                </li>
            ))}
        </div>
    );
};

export default NavBar;