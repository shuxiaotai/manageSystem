import * as hideSideTypes from '../types/hideSideType';

const initLayout = {
    sidebarClosed: false,
};

const hideSideReducer = (state = initLayout, action) => {
    switch (action.type) {
    case hideSideTypes.CLOSE_SIDE_BAR:
        return { ...state, sidebarClosed: action.close };
    default:
        return state;
    }
};

export default hideSideReducer;
