import axios from "axios"
import Config from "../config/config"
import cookie from "../utils/cookie"
import qs from "qs"

const baseUrl = "http://127.0.0.1:5000"

axios.defaults.baseURL = baseUrl

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    /*设置token*/
    Object.assign(config.headers, {'weToken':"JWT "+ cookie.getCookie(Config.token_name)})
    /*传form data 必须增加此配置*/
    config.data    = qs.stringify(config.data);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


export function post(url, data={}) {
    return new Promise(function (resolve, reject) {
        axios.post(url,data).then(res=>{
            resolve(res.data)
        }).catch(error=>{
            reject(error)
        })
    })
}



export function get(url, params) {
    return new Promise(function (resolve, reject) {
        axios.get(url,{
            params,
        }).then(res=>{
            resolve(res.data)
        }).catch(error=>{
            reject(error)
        })
    })
}


export function getUrl(api) {
    return api["url"]
}