import axiosUtil from '../../../../lib/axiosUtil';

const address = 'http://localhost/manageSystem/login';
export const login = ({ username, password }) => axiosUtil('post', address, {
    username: username,
    password: password,
});

