import * as hideSideTypes from '../types/hideSideType';

export const closeSideBar = (close) => {
    return{
        type: hideSideTypes.CLOSE_SIDE_BAR,
        close: close
    };
};