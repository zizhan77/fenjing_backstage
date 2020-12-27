/**
 * axios服务配置
 */

import Axios from 'axios';
import Qs from 'qs';
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import Domains from './domains';
import { getToken, removeToken } from '@utils/auth'
import Message from '@utils/message'
import Router from '../router'

const isPro = process.env.NODE_ENV === 'production';

// 默认配置
const baseConfig = {
  responseType: 'json',
  withCredentials: true,
  transformRequest: [
    function(data, req) {
      if (req['Content-Type'] && req['Content-Type'].indexOf("application/json") > -1) {
        return JSON.stringify(data);
      }
      data = Qs.stringify(data);
      return data;
    }
  ]
};

// 全局baseUrl
if (process.env.VUE_APP_BASEURL) {
  // baseConfig.baseURL = 'http://47.92.115.105:8088'
  baseConfig.baseURL = process.env.VUE_APP_BASEURL;
}

// baseConfig.baseURL = 'http://47.92.115.105:8088'


// 手动种cookie
const cookies = {

};

// 重写axios挂载的静态方法
const methodsToAxios = ['get', 'post', 'delete', 'put', 'head', 'patch'];

class Service {
  constructor(domains) {
    this.instances = this.instanceCreator(domains);
  }

  instanceCreator(domains) {
    let result = {};
    let config = {};
    result.$service = this.bindServiceEvent(Axios.create(baseConfig));
    if (!isOwnEmpty(domains)) {
      for (const key in domains) {
        config = merge(domains[key], baseConfig);
        // 开发环境请求代理
        if (process.env.VUE_APP_PROXY_API && !isPro) {
          const url = config.baseURL
          config.baseURL = url ? url + process.env.VUE_APP_PROXY_API : window.origin
        }
        let instance = Axios.create(config);
        let domainName = `$${key}`;
        instance.all = promises => {
          return Axios.all(promises);
        };
        instance.spread = cb => {
          return Axios.spread(cb);
        };
        instance.Cancel = () => {
          return Axios.Cancel;
        };
        instance.CancelToken = () => {
          return Axios.CancelToken;
        };
        instance.isCancel = () => {
          return Axios.isCancel;
        };
        result[domainName] = this.bindServiceEvent(instance);
      }
    }
    return result;
  }

  bindServiceEvent(instance) {
    let originMethod;
    let options;
    methodsToAxios.forEach(method => {
      if (instance[method]) {
        instance[method] = (url, data, config = { isAllParams: false }) => {
          // 是否返回所有响应体
          const isAllParams =
            typeof config === 'boolean' ? config : !!config.isAllParams;
          switch (method) {
            case 'get':
              options = {
                method: 'get',
                params: data,
                paramsSerializer: function(params) {
                  return Qs.stringify(params, {
                    arrayFormat: 'brackets'
                  });
                }
              };
              break;
            case 'post':

              options = {
                method: 'post',
                data
              };
            default:
              break;
          }
          return instance({
            url,
            isAllParams,
            ...options,
            ...config
          });
        };
      }
    });
    instance.interceptors.request.use(requestInterceptor, requestError);
    instance.interceptors.response.use(responseInterceptor, responseError);
    return instance;
  }
}

/**
 * 请求拦截器
 */

function requestInterceptor(config) {
  // config.baseURL= 'http://47.92.115.105:8088'
  console.log(
    `当前请求地址：%c ${config.baseURL || ''}`,
    'color:#42c57a !important;font-weight:bold;'
  );
  let tokens = getToken();
  // 添加tokens（cookie模式下可去掉）

  if (tokens && typeof tokens === 'string') {
    config.headers.token = tokens;
  }
  // 请求进度条
  NProgress.start();
  return config;
}

/**
 * 请求错误处理
 */

function requestError(error) {
  return Promise.reject(error);
}

/**
 * 响应拦截器
 */
function responseInterceptor(response = { config: {}, data: {} }) {
  const { isAllParams = false } = response.config;

  //  处理错误码
  const { code = 1 } = response.data || {}
  let res = response.data

  if (!isAllParams) {
    switch (code) {
      case 0:
        res = response.data.data || {}
        break;
      case 1:
        Message.error(`${response.data.message || '请求错误'}`)
        return false;
        break;
      case 3:
        removeToken()
        Router.replace({
          path: '/login'
        })
        return false;
      default:
        return false;
        break;
    }
  }
  NProgress.done();
  // 响应过滤
  return res;
}

/**
 * 响应错误处理
 */
function responseError(error) {
  return Promise.reject(error);
}

/**
 * 深度合并对象
 */
function merge(...objs) {
  let result = {};

  for (const obj of objs) {
    for (const key in obj) {
      assignValue(obj[key], key);
    }
  }

  function assignValue(val, key) {
    if (typeof val === 'object' && typeof result[key] === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

/**
 * 判断当前对象是否为null或者{}
 */
function isOwnEmpty(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
    return true;
  }
}

const service = new Service(Domains);

const ServicePlugin = {
  install(Vue) {
    Vue.prototype.$axios = Axios;
    if (service && !isOwnEmpty(service.instances)) {
      for (const key in service.instances) {
        Vue.prototype[key] = service.instances[key];
      }
    }
  }
};

if (service && !isOwnEmpty(service.instances)) {
  for (const key in service.instances) {
    ServicePlugin[key] = service.instances[key];
  }
}

export default ServicePlugin;