import React  from 'react';
import { connect } from 'react-redux';
import SideBar from '../Side/components/SideBar';
import MainContent from './MainContent';
import * as hideSideAction from '../../views/Side/actions/hideSideAction';
import './css/index.scss';

const ControlTotalComponent = (props) => {
    const{ Content = '', sidebarClosed = false, closeSideBar, ...otherProps } = props;
    return(
        <div className="container-index">
            <SideBar sidebarClosed={ sidebarClosed } />
            <MainContent render={ () => <Content { ...otherProps } /> } sidebarClosed={ sidebarClosed } closeSideBar={ closeSideBar } />
        </div>
    );
};

const mapStateToProps = (state) => {
    return{
        sidebarClosed: state.hideSideReducer.sidebarClosed
    };
};

const mapDispatchToProps = (dispatch) => {
    return{
        closeSideBar:(closed) => {
            dispatch(hideSideAction.closeSideBar(closed));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlTotalComponent);