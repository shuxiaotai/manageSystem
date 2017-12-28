import axiosUtil from '../../../../lib/axiosUtil';
import { message } from 'antd';
import * as userAction from '../../User/actions/userAction';

const fetchUserAddress = 'http://localhost/manageSystem/fetchUserInfor';
export const fetchUserInfor = () => (dispatch) => axiosUtil('post', fetchUserAddress, {})
    .then((value) => {
        dispatch(userAction.fetchUserInfor(value));
    });

const createUserAddress = 'http://localhost/manageSystem/insertUser';
export const createUser = (userCreated) => (dispatch) => axiosUtil('post', createUserAddress, {
    staff_code: userCreated.staff_code,
    username: userCreated.username,
    department_name: userCreated['department_name'],
    education: userCreated.education,
    major: userCreated.major,
    age: userCreated.age,
    email: userCreated.email,
    role_name: userCreated['role_name'],
    address: userCreated.address
}).then((value) => {
    if(value === 403) {
        message.info('用户已存在!');
    }else {
        message.info('创建用户成功!');
        const userTotalCreated = {
            key: value,
            staff_code: userCreated.staff_code,
            username: userCreated.username,
            department_name: userCreated['department_name'],
            education: userCreated.education,
            major: userCreated.major,
            age: userCreated.age,
            email: userCreated.email,
            role_name: userCreated['role_name'],
            is_check: '待审核',
            address: userCreated.address
        };
        // console.log('ajax');
        // console.log(value);
        // console.log(userTotalCreated);
        dispatch(userAction.insertUser(userTotalCreated));
    }
});

const createRoleAddress = 'http://localhost/manageSystem/insertRole';
export const createRole = (roleCreated) => (dispatch) => axiosUtil('post', createRoleAddress, {
    role_code: roleCreated['role_code'],
    role_name: roleCreated['role_name'],
    permission: roleCreated.permission,

}).then((value) => {
    if(value === 403) {
        message.info('角色已存在!');
    }else {
        // const roleTotalCreated = {
        //     key: value,
        //     role_code: roleCreated['role_code'],
        //     role_name: roleCreated['role_name'],
        //     permission: roleCreated.permission,
        //     is_check: '待审核',
        // };
        // console.log('ajax');
        // console.log(value);
        // console.log(userTotalCreated);
        // dispatch(userAction.insertRole(roleTotalCreated));
        getRolesInfor()(dispatch)
            .then(() => {
                message.info('创建角色成功!');
            });
    }
});


const createDepartmentAddress = 'http://localhost/manageSystem/insertDepartment';
export const createDepartment = (departmentCreated) => (dispatch) => axiosUtil('post', createDepartmentAddress, {
    department_code: departmentCreated['department_code'],
    department_name: departmentCreated['department_name'],
    parent_name: departmentCreated['parent_name'],
    department_tel:departmentCreated['department_tel']

}).then((value) => {
    if(value === 403) {
        message.info('部门已存在!');
    }else {
        getDepartmentsInfor()(dispatch)
            .then(() => {
                message.info('创建部门成功!');
            });
    }
});



const fetchLogAddress = 'http://localhost/manageSystem/fetchLogInfor';
export const fetchLogInfor = () => (dispatch) => axiosUtil('post', fetchLogAddress, {})
    .then((value) => {
        dispatch(userAction.fetchLogInfor(value));
    });


const fetchRolesAddress = 'http://localhost/manageSystem/fetchRoles';
export const fetchRoles = () => (dispatch) => axiosUtil('post', fetchRolesAddress, {})
    .then((value) => {
        // console.log('ajax');
        // console.log(value);
        dispatch(userAction.fetchRoles(value));
    });

const fetchDepartmentsAddress = 'http://localhost/manageSystem/fetchDepartments';
export const fetchDepartments = () => (dispatch) => axiosUtil('post', fetchDepartmentsAddress, {})
    .then((value) => {
        dispatch(userAction.fetchDepartments(value));
    });


const deleteUserAddress = 'http://localhost/manageSystem/deleteUser';
export const deleteUser = (key, index) => (dispatch) => axiosUtil('post', deleteUserAddress, {
    id: key
})
    .then((value) => {
        if(value === 408) {
            message.info('不能删除自己!');
        }else if(value === 407) {
            message.info('请等待审核通过再做其他操作 !');
        } else if(value === 500) {
            message.info('删除失败!');
        }else {
            // dispatch(userAction.deleteUser(index));
            fetchUserInfor()(dispatch)
                .then(() => {
                    message.info('删除成功!');
                });
        }
    });

const deleteRoleAddress = 'http://localhost/manageSystem/deleteRole';
export const deleteRole = (key, index) => (dispatch) => axiosUtil('post', deleteRoleAddress, {
    id: key
})
    .then((value) => {
        if(value === 407) {
            message.info('请等待审核通过再做其他操作 !');
        } else if(value === 500) {
            message.info('删除失败!');
        }else {
            getRolesInfor()(dispatch)
                .then(() => {
                    message.info('删除成功!');
                });
        }
    });


const deleteDepartmentAddress = 'http://localhost/manageSystem/deleteDepartment';
export const deleteDepartment = (key, index) => (dispatch) => axiosUtil('post', deleteDepartmentAddress, {
    id: key
})
    .then((value) => {
        if(value === 407) {
            message.info('请等待审核通过再做其他操作 !');
        } else if(value === 500) {
            message.info('删除失败!');
        }else {
            getDepartmentsInfor()(dispatch)
                .then(() => {
                    message.info('删除成功!');
                });
        }
    });


const getCheckUserAddress = 'http://localhost/manageSystem/getCheckUserInfor';
export const getCheckUser = (key) => (dispatch) => axiosUtil('post', getCheckUserAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.getCheckUser(value[0]));
        }
    });


const getCheckRoleAddress = 'http://localhost/manageSystem/getCheckRoleInfor';
export const getCheckRole = (key) => (dispatch) => axiosUtil('post', getCheckRoleAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.getCheckRole(value[0]));
        }
    });


const getCheckDepartmentAddress = 'http://localhost/manageSystem/getCheckDepartmentInfor';
export const getCheckDepartment = (key) => (dispatch) => axiosUtil('post', getCheckDepartmentAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.getCheckDepartment(value));
        }
    });

const updateUserAddress = 'http://localhost/manageSystem/updateUser';
export const updateUser = (checkUserInfor = {}, key, index, userUpdated) => (dispatch) => axiosUtil('post', updateUserAddress, {
    checkUserStaffCode: checkUserInfor['staff_code'],
    checkUserUsername: checkUserInfor['username'],
    checkUserDepartmentName: checkUserInfor['department_name'],
    checkUserEducation: checkUserInfor['education'],
    checkUserMajor: checkUserInfor['major'],
    checkUserAge: checkUserInfor['age'],
    checkUserEmail: checkUserInfor['email'],
    checkUserRoleName: checkUserInfor['role_name'],
    checkUserAddress: checkUserInfor['address'],
    id: key,
    staff_code: userUpdated.staff_code,
    username: userUpdated.username,
    department_name: userUpdated['department_name'],
    education: userUpdated.education,
    major: userUpdated.major,
    age: userUpdated.age,
    email: userUpdated.email,
    role_name: userUpdated['role_name'],
    address: userUpdated.address
}).then((value) => {
    if(value === 407) {
        message.info('请等待审核通过再做其他操作 !');
    }else if(value === '') {
        // console.log('ajax');
        fetchUserInfor()(dispatch)
            .then((value) => {
                if(value === []) {
                    message.info('修改失败!');
                }else {
                    message.info('修改成功!');
                }

            });
    }
});

const updateRoleAddress = 'http://localhost/manageSystem/updateRole';
export const updateRole = (checkRoleInfor = {}, key, index, roleUpdated) => (dispatch) => axiosUtil('post', updateRoleAddress, {
    checkRoleCode: checkRoleInfor['role_code'],
    checkRoleName: checkRoleInfor['role_name'],
    checkPermission: checkRoleInfor['permission'],

    id: key,
    role_code: roleUpdated['role_code'],
    role_name: roleUpdated['role_name'],
    permission:roleUpdated.permission

}).then((value) => {
    if(value === 407) {
        message.info('请等待审核通过再做其他操作 !');
    }else if(value === '') {
        // console.log('ajax');
        getRolesInfor()(dispatch)
            .then((value) => {
                if(value === []) {
                    message.info('修改失败!');
                }else {
                    message.info('修改成功!');
                }

            });
    }
});


const updateDepartmentAddress = 'http://localhost/manageSystem/updateDepartment';
export const updateDepartment = (checkDepartmentInfor = {}, key, index, departmentUpdated) => (dispatch) => axiosUtil('post', updateDepartmentAddress, {
    checkDepartmentCode: checkDepartmentInfor['department_code'],
    checkDepartmentName: checkDepartmentInfor['department_name'],
    checkDepartmentTel: checkDepartmentInfor['department_tel'],
    checkParentId: checkDepartmentInfor['parent_id'],

    id: key,
    department_code: departmentUpdated['department_code'],
    department_name: departmentUpdated['department_name'],
    department_tel: departmentUpdated['department_tel'],
    parent_name: departmentUpdated['parent_name']
}).then((value) => {
    if(value === 407) {
        message.info('请等待审核通过再做其他操作 !');
    }else if(value === '') {
        // console.log('ajax');
        getDepartmentsInfor()(dispatch)
            .then((value) => {
                if(value === []) {
                    message.info('修改失败!');
                }else {
                    message.info('修改成功!');
                }

            });
    }
});



const getRolesInforAddress = 'http://localhost/manageSystem/getRolesInfor';
export const getRolesInfor = () => (dispatch) => axiosUtil('post', getRolesInforAddress, {})
    .then((value) => {
        dispatch(userAction.getRolesInfor(value));
    });

const getDepartmentsInforAddress = 'http://localhost/manageSystem/getDepartmentsInfor';
export const getDepartmentsInfor = () => (dispatch) => axiosUtil('post', getDepartmentsInforAddress, {})
    .then((value) => {
        dispatch(userAction.getDepartmentsInfor(value));
    });

const passUserAddress = 'http://localhost/manageSystem/pass';
export const passUser = (key, index) => (dispatch) => axiosUtil('post', passUserAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.passUser(index));
            message.info('审核成功!');
        }else {
            message.info('审核失败!');
        }
    });

const noPassUserAddress = 'http://localhost/manageSystem/noPass';
export const noPassUser = (key, index) => (dispatch) => axiosUtil('post', noPassUserAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.noPassUser(index));
            message.info('审核成功!');
        }else {
            message.info('审核失败!');
        }
    });

const passRoleAddress = 'http://localhost/manageSystem/rolePass';
export const passRole = (key, index) => (dispatch) => axiosUtil('post', passRoleAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.passRole(index));
            message.info('审核成功!');
        }else {
            message.info('审核失败!');
        }
    });

const noPassRoleAddress = 'http://localhost/manageSystem/roleNoPass';
export const noPassRole = (key, index) => (dispatch) => axiosUtil('post', noPassRoleAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.noPassRole(index));
            message.info('审核成功!');
        }else {
            message.info('审核失败!');
        }
    });

const passDepartmentAddress = 'http://localhost/manageSystem/rolePass';
export const passDepartment = (key, index) => (dispatch) => axiosUtil('post', passDepartmentAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.passDepartment(index));
            message.info('审核成功!');
        }else {
            message.info('审核失败!');
        }
    });

const noPassDepartmentAddress = 'http://localhost/manageSystem/roleNoPass';
export const noPassDepartment = (key, index) => (dispatch) => axiosUtil('post', noPassDepartmentAddress, {
    id: key
})
    .then((value) => {
        if(value !== 500) {
            dispatch(userAction.noPassDepartment(index));
            message.info('审核成功!');
        }else {
            message.info('审核失败!');
        }
    });