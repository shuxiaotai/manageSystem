import * as userType from '../types/userType';

const init = {
    userData: [],
    logData: [],
    roleData: [],
    departmentData: [],
    checkedUserInfor: {},
    checkedRoleInfor: {},
    checkedDepartmentInfor: {},
    userPermission: [],

    rolesInfor: [],
    departmentsInfor: [],

    roleInforData: [],
    departmentInData: []
};

const userReducer = (state = init, action) => {
    switch (action.type) {
    case userType.FETCH_USER_INFOR:
        return { ...state, userData: action.userData };
    case userType.CREATE_USER:
        return { ...state, userData: [...state.userData, action.userCreated] };
    case userType.CREATE_ROLE:
        return { ...state, roleInforData: [...state.roleInforData, action.roleInforData] };
    case userType.CREATE_DEPARTMENT:
        return { ...state, departmentInData: [...state.departmentInData, action.departmentInData] };
    case userType.FETCH_LOG_INFOR:
        return { ...state, logData: action.logData };
    case userType.FETCH_ROLES:
        return { ...state, roleData: action.roleData };
    case userType.FETCH_DEPARTMENTS:
        return { ...state, departmentData: action.departmentData };
    case userType.CHECKED_USER:
        return { ...state, checkedUserInfor: action.checkedUserInfor };
    case userType.CHECKED_ROLE:
        return { ...state, checkedRoleInfor: action.checkedRoleInfor };
    case userType.CHECKED_DEPARTMENT:
        return { ...state, checkedDepartmentInfor: action.checkedDepartmentInfor };
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
    case userType.NO_PASS_USER:
        return{
            ...state,
            userData:[
                ...state.userData.slice(0, action.noPassIndex),
                ...state.userData.slice(action.noPassIndex + 1)
            ]
        };
    case userType.PASS_ROLE:
        return{
            ...state,
            roleInforData:[
                ...state.roleInforData.slice(0, action.rolePassIndex),
                ...state.roleInforData.slice(action.rolePassIndex + 1)
            ]
        };
    case userType.NO_PASS_ROLE:
        return{
            ...state,
            roleInforData:[
                ...state.roleInforData.slice(0, action.roleNoPassIndex),
                ...state.roleInforData.slice(action.roleNoPassIndex + 1)
            ]
        };
    case userType.PASS_DEPARTMENT:
        return{
            ...state,
            departmentInData:[
                ...state.departmentInData.slice(0, action.departmentPassIndex),
                ...state.departmentInData.slice(action.departmentPassIndex + 1)
            ]
        };
    case userType.NO_PASS_DEPARTMENT:
        return{
            ...state,
            departmentInData:[
                ...state.departmentInData.slice(0, action.departmentNoPassIndex),
                ...state.departmentInData.slice(action.departmentNoPassIndex + 1)
            ]
        };
    case userType.FETCH_ROLES_INFOR:
        return { ...state, rolesInfor: action.rolesInfor };
    case userType.FETCH_DEPARTMENTS_INFOR:
        return { ...state, departmentsInfor: action.departmentsInfor };
    case userType.SET_PERMISSION:
        return { ...state, userPermission: action.userPermission };
    default:
        return state;
    }
};

export default userReducer;

