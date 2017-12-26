import React from 'react';
import Logo from './Logo';
import NavBar from "./NavBar";
import "../css/index.scss";

const SideBar = (props) => {
    const { sidebarClosed = false } = props;
    return (
        <div>
            <div className={`side  ${sidebarClosed ? 'close' : ''}`}>
                <Logo sidebarClosed={sidebarClosed} />
                <NavBar sidebarClosed={sidebarClosed} />
            </div>
        </div>

    );
};
export default SideBar;








