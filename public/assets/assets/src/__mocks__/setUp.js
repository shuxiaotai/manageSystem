import React from 'react'
// import store from '../WebIndex/store'
import PropTypes from 'prop-types'
// import { Provider } from 'react-redux'

import { shim } from 'promise.prototype.finally'

jest.unmock('react-redux')
// support redux store
const wrapProvider = (Cmpt, props = {}, mstore = store) => {
    return <Provider store={mstore} >
        <Cmpt {...props} />
    </Provider>
}

shim()

window.React = React
window.PropTypes = PropTypes
window.wrapProvider = wrapProvider