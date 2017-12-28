import React from 'react';
import "../css/index.scss";
import cookieUtil from '../../../../lib/cookieUtil';


const logo = 'public/assets/assets/public/img/logo.jpg';
const Logo = ({ sidebarClosed }) => {
    let username = new Array(JSON.parse(cookieUtil.get('userInfo')).username);
    return (
        <div className={`logo-wrap  ${sidebarClosed ? 'close' : ''}`}>
            <div className={`logo  ${sidebarClosed ? 'close' : ''}`}>
                <img src={logo} />
                <span className={`userText  ${sidebarClosed ? 'close' : ''}`}>{username}</span>
            </div>
        </div>
    );
};

export default Logo;