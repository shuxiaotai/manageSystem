import * as userType from '../types/userType';

export const fetchUserInfor = (userData) => {
    return {
        type: userType.FETCH_USER_INFOR,
        userData: userData
    };
};

export const insertUser = (userCreated) => {
    return {
        type: userType.CREATE_USER,
        userCreated: userCreated
    };
};

export const fetchLogInfor = (logData) => {
    return {
        type: userType.FETCH_LOG_INFOR,
        logData: logData
    };
};

export const fetchRoles = (roleData) => {
    return {
        type: userType.FETCH_ROLES,
        roleData: roleData
    };
};

export const fetchDepartments = (departmentData) => {
    return {
        type: userType.FETCH_DEPARTMENTS,
        departmentData: departmentData
    };
};

export const deleteUser = (deleteIndex) => {
    return {
        type: userType.DELETE_USER,
        deleteIndex: deleteIndex
    };
};

export const getCheckUser = (checkedUserInfor) => {
    return {
        type: userType.CHECKED_USER,
        checkedUserInfor: checkedUserInfor
    };
};


export const getRolesInfor = (rolesInfor) => {
    return {
        type: userType.FETCH_ROLES_INFOR,
        rolesInfor: rolesInfor
    };
};


export const passUser = (passIndex) => {
    return {
        type: userType.DELETE_USER,
        passIndex: passIndex
    };
};
