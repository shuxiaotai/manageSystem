import * as userType from '../types/userType';

const init = {
    userData: [],
    logData: [],
    roleData: [],
    departmentData: [],
    checkedUserInfor: {},

    rolesInfor: []
};

const userReducer = (state = init, action) => {
    switch (action.type) {
    case userType.FETCH_USER_INFOR:
        return { ...state, userData: action.userData };
    case userType.CREATE_USER:
        return { ...state, userData: [...state.userData, action.userCreated] };
    case userType.FETCH_LOG_INFOR:
        return { ...state, logData: action.logData };
    case userType.FETCH_ROLES:
        return { ...state, roleData: action.roleData };
    case userType.FETCH_DEPARTMENTS:
        return { ...state, departmentData: action.departmentData };
    case userType.CHECKED_USER:
        return { ...state, checkedUserInfor: action.checkedUserInfor };
    case userType.DELETE_USER:
        return{
            ...state,
            userData:[
                ...state.userData.slice(0, action.deleteIndex),
                ...state.userData.slice(action.deleteIndex + 1)
            ]
        };
    case userType.PASS_USER:
        return{
            ...state,
            userData:[
                ...state.userData.slice(0, action.passIndex),
                ...state.userData.slice(action.passIndex + 1)
            ]
        };
    case userType.FETCH_ROLES_INFOR:
        return { ...state, rolesInfor: action.rolesInfor };
    default:
        return state;
    }
};

export default userReducer;

