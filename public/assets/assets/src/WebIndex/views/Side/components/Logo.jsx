import React from 'react';
import "../css/index.scss";

const logo = 'public/assets/assets/public/img/logo.jpg';
const Logo = ({ sidebarClosed }) => {
    return (
        <div className={`logo-wrap  ${sidebarClosed ? 'close' : ''}`}>
            <div className={`logo  ${sidebarClosed ? 'close' : ''}`}>
                <img src={logo} />
                <span className={`userText  ${sidebarClosed ? 'close' : ''}`}>舒小台</span>
            </div>
        </div>
    );
};

export default Logo;