import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from '../WebIndex/store';
import Routes from '../WebIndex/routes/Routes';

render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('app'));






