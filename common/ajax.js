/*
 * @Description: axios工具类 基于promise用于浏览器和node.js的http客户端 
 * 优点：
    支持浏览器和node.js
    支持promise
    支持请求拦截器和响应拦截器
    能转换请求和响应数据
    能取消请求
    自动转换JSON数据
    浏览器端支持防止CSRF(跨站请求伪造)
 * 缺点：
 * 用例：
 *  import Ajax from 'ajax'  
 *  Ajax.get('xxx.com/xxx/xxx',{key1: 'value1',key2: 'value2'}).then(res => {}).catch(err => {})
 * @Author: zehao.sun 
 * @Date: 2019-02-21 11:01:49 
 * @Last Modified by: zehao.sun
 * @Last Modified time: 2019-04-08 21:28:38
 * @Email: zehao.sun@fengjr.com 
 */
import axios from 'axios';
import qs from 'qs';

const _log = console.log.bind(console);

//让ajax携带cookie;
axios.defaults.withCredentials = true;

//请求拦截器 判断登录等认证信息
axios.interceptors.request.use(config => {
  return config;
}, error => {
  _log("axios请求拦截器异常!");
  return Promise.reject(error)
})


//响应拦截器
axios.interceptors.response.use(response => {
  const method = response.config.method;
  const url = response.config.url;
  const status = response.status;
  const statusText = response.statusText;
  const params = method == "post" ? response.config.data : qs.stringify(response.config.params || {});
  const res = response.data || {};
  try {
    if (status !== 200) {
      ErrorFn({
        url,
        params,
        status,
        statusText
      });
      return;
    }

    //_log(response);
    if (res.code == 200) {
      return res;
    } else if (res.code >= 3000 && res.code < 6000) {
      ErrorFn({
        url,
        params,
        status: res.code,
        statusText: res.message
      });
    } else if (res.code == 302) {
      //登录校验失败
      window.location.href = res.data.location;
    } else {
      ErrorFn({
        url,
        params,
        status: res.code,
        statusText: "系统异常!"
      });
    }
  } catch (error) {
    ErrorFn({
      url,
      params,
      status: 999999999,
      statusText: "axios程序异常!"
    });
  }
}, error => {
  _log("axios响应拦截器异常!");
  return Promise.reject(error)
})

const ErrorFn = ({
  url,
  params,
  status,
  statusText
}) => {
  _log(`
    请求接口异常:
    请求地址:${url}
    请求参数:${params}
    错误状态码:${status}
    错误信息:${statusText}
  `);
  throw new Error(`${statusText}`);
}

//封装axios请求配置
const _request = (method, url, data) => {
	const headers = {
	};
  const configData = {
    url,
    timeout: 1000 * 60 * 2, //2分钟超时
    headers
  }
  let Data;
  if (data instanceof FormData) {
    Data = data;
  } else {
    Data = {
      ...data
    }
  }

  if (method === 'get') {
    configData.method = 'get'
    configData.params = Data
  } else if (method === 'postForm') {
    configData.method = 'post'
    if (Data instanceof FormData) {
      configData.headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
      configData.data = Data
    } else {
      configData.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      configData.data = qs.stringify(Data)
    }
  } else if (method === 'postJson') {
    configData.method = 'post'
    configData.headers['Content-Type'] = 'application/json; charset=UTF-8'
    configData.data = Data
  }

  return axios(configData)
}

class Ajax {
  get = (url, data = {}) => {
    return _request('get', url, data)
  }

  postForm = (url, data = {}) => {
    return _request('postForm', url, data)
  }

  postJson = (url, data = {}) => {
    return _request('postJson', url, data)
  }

  //默认post的Content-Type是application/json
  post = this.postJson
}

export default new Ajax();