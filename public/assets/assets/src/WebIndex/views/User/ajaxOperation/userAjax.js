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
        if(value !== 500) {
            dispatch(userAction.deleteUser(index));
            message.info('删除成功!');
        }else {
            message.info('删除失败!');
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
    if(value === '') {
        // console.log('ajax');
        fetchUserInfor()(dispatch)
            .then((value) => {
                if(value !== []) {
                    message.info('修改成功!');
                }else {
                    message.info('修改失败!');
                }
            });
    }
});


const getRolesInforAddress = 'http://localhost/manageSystem/getRolesInfor';
export const getRolesInfor = () => (dispatch) => axiosUtil('post', getRolesInforAddress, {})
    .then((value) => {
        dispatch(userAction.getRolesInfor(value));
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