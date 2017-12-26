import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/index.scss';

const NavItem = ({ url, tag, sidebarClosed }) => (
    <NavLink to={url} activeClassName={`current  ${sidebarClosed ? 'close' : ''}`}>
        <span>{tag}</span>
    </NavLink>
);
export default NavItem;