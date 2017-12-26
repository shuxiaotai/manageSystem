import React from 'react';
import './css/index.scss';
import HeaderComponent from 'publicComponent/HeaderComponent/HeaderComponent';

const MainContainer = (props) => {
    const { render, sidebarClosed = false, closeSideBar } = props;
    return(
        <div className={`main-content ${sidebarClosed ? 'close' : ''}`}>
            <HeaderComponent sidebarClosed={ sidebarClosed } closeSideBar={ closeSideBar } />
            <div className={`show-content ${sidebarClosed ? 'close' : ''}`}>
                { render() }
            </div>
        </div>
    );
};
export default MainContainer;