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

export const insertRole = (roleCreated) => {
    return {
        type: userType.CREATE_ROLE,
        roleCreated: roleCreated
    };
};

export const insertDepartment = (departmentCreated) => {
    return {
        type: userType.CREATE_DEPARTMENT,
        departmentCreated: departmentCreated
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

export const getCheckRole = (checkedRoleInfor) => {
    return {
        type: userType.CHECKED_ROLE,
        checkedRoleInfor: checkedRoleInfor
    };
};


export const getCheckDepartment = (checkedDepartmentInfor) => {
    return {
        type: userType.CHECKED_DEPARTMENT,
        checkedDepartmentInfor: checkedDepartmentInfor
    };
};



export const getRolesInfor = (rolesInfor) => {
    return {
        type: userType.FETCH_ROLES_INFOR,
        rolesInfor: rolesInfor
    };
};

export const getDepartmentsInfor = (departmentsInfor) => {
    return {
        type: userType.FETCH_DEPARTMENTS_INFOR,
        departmentsInfor: departmentsInfor
    };
};



export const passUser = (passIndex) => {
    return {
        type: userType.PASS_USER,
        passIndex: passIndex
    };
};

export const noPassUser = (noPassIndex) => {
    return {
        type: userType.NO_PASS_USER,
        noPassIndex: noPassIndex
    };
};

export const passRole = (rolePassIndex) => {
    return {
        type: userType.PASS_ROLE,
        rolePassIndex: rolePassIndex
    };
};

export const noPassRole = (roleNoPassIndex) => {
    return {
        type: userType.NO_PASS_ROLE,
        roleNoPassIndex: roleNoPassIndex
    };
};

export const passDepartment = (departmentPassIndex) => {
    return {
        type: userType.PASS_DEPARTMENT,
        departmentPassIndex: departmentPassIndex
    };
};

export const noPassDepartment = (departmentNoPassIndex) => {
    return {
        type: userType.NO_PASS_DEPARTMENT,
        departmentNoPassIndex: departmentNoPassIndex
    };
};

export const setPerssion = (userPermission) => {
    return {
        type: userType.SET_PERMISSION,
        userPermission: userPermission
    };
};
