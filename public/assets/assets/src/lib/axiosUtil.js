import axios from 'axios';
import qs from 'qs';

const axiosUtil = (method, url, data = {}, timeout = 8000) => {
    return axios({
        url: url,
        timeout: timeout,
        data: qs.stringify(data),
        method: method,
    })
        .then((response) => {
            const code = Number(response.data.code);
            if (code) {
                switch (code) {
                case 200:
                    return response.data.data;
                case 401:
                    return 401;  //登录失败
                case 402:
                    return 402;  //没有权限
                case 403:
                    return 403;  //用户已存在
                case 500:
                    return 500;
                case 407:
                    return 407;  //等待审核
                case 408:
                    return 408;  //不能删除自己
                case 409:
                    return 409;  //审核确认添加后登录
                }
            }
        })
        .catch((error) => {
            throw error;
        });
};
export default axiosUtil;