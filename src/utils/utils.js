import { words, uniq, forEach, isEqual } from 'lodash';

const noop = _ => _;

export function getUrlParams() {
  let result = {};
  let params = window.location.search.substring(1).split('&');
  let param;
  for (let i = 0, iLen = params.length; i < iLen; i++) {
    param = params[i].split('=');
    if (param.length === 2) {
      result[param[0]] = decodeURIComponent(param[1]);
    }
  }
  return result;
}

/**
 * 判断浏览器是否支持localStorage
 * @returns {boolean}
 */
export function isStorageSupport() {
  try {
    return window.localStorage || false;
  } catch (e) {
    return false;
  }
}

/**
 * localStorage 方法封装，设置缓存数据带有项目前缀
 */
export let localStorage = {
  prefix: 'memory-',
  setItem: function(key, val) {
    // save
    if (isStorageSupport()) {
      window.localStorage.setItem(this.prefix + key, val);
    }
  },
  getItem: function(key) {
    if (isStorageSupport()) {
      // get
      return window.localStorage.getItem(this.prefix + key);
    }
  },
  removeItem: function(key) {
    if (isStorageSupport()) {
      // remove
      window.localStorage.removeItem(this.prefix + key);
    }
  },
  map: function() {
    if (isStorageSupport()) {
      // keys
      var map = {};
      for (var i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i).match(/^scmis-(.*)$/)[1];
        map[key] = window.localStorage.getItem(window.localStorage.key(i));
      }
      return map;
    }
    return null;
  },
  clear: function() {
    if (isStorageSupport()) {
      // clear 慎用：会影响到其它使用 storage 的地方。
      window.localStorage.clear();
    }
  }
};

/**
 * 判断浏览器是否支持sessionStorage
 * @returns {boolean}
 */
export function isSessionStorageSupport() {
  try {
    return window.sessionStorage || false;
  } catch (e) {
    return false;
  }
}

/**
 * sessionStorage 方法封装，设置缓存数据带有项目前缀
 */
export let sessionStorage = {
  prefix: 'memory-',
  setItem: function(key, val) {
    // save
    if (isSessionStorageSupport()) {
      window.sessionStorage.setItem(this.prefix + key, val);
    }
  },
  getItem: function(key) {
    if (isSessionStorageSupport()) {
      // get
      return window.sessionStorage.getItem(this.prefix + key);
    }
  },
  removeItem: function(key) {
    if (isSessionStorageSupport()) {
      // remove
      window.sessionStorage.removeItem(this.prefix + key);
    }
  },
  map: function() {
    if (isSessionStorageSupport()) {
      // keys
      let sessionMap = {};
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i).match(/^scmis-(.*)$/)[1];
        sessionMap[key] = window.sessionStorage.getItem(
          window.sessionStorage.key(i)
        );
      }
      return sessionMap;
    }
    return null;
  },
  clear: function() {
    if (isSessionStorageSupport()) {
      // clear 慎用：会影响到其它使用 storage 的地方。
      window.sessionStorage.clear();
    }
  }
};

/**
 * 去掉字符串前后空格
 * @param val 字符串
 * @returns {string} 去掉前后空格后的字符串
 */
export let trim = function(val) {
  return val.replace(/(^\s+)|(\s+$)/g, '');
};

/**
 * 返回当前日期，2017/10/11格式
 * @returns {string}
 */
export let getCurrentDate = function() {
  let date = new Date();
  let dateString =
    date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  return dateString;
};

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳(毫秒)
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export let formatDate = function(date, fmt) {
  if (isUndef(date)) {
    return ''
  }
  date = date === undefined ? new Date() : date;
  date = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  let obj = {
    y: date.getFullYear(), // 年份，注意必须用getFullYear
    M: date.getMonth() + 1, // 月份，注意是从0-11
    d: date.getDate(), // 日期
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    w: date.getDay(), // 星期，注意是0-6
    H: date.getHours(), // 24小时制
    h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    m: date.getMinutes(), // 分钟
    s: date.getSeconds(), // 秒
    S: date.getMilliseconds() // 毫秒
  };
  let week = ['天', '一', '二', '三', '四', '五', '六'];
  for (let i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
      let val = obj[i] + '';
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val];
      for (let j = 0, len = val.length; j < m.length - len; j++) {
        val = '0' + val;
      }
      return m.length === 1 ? val : val.substring(val.length - m.length);
    });
  }
  return fmt;
};

/**
 * 判断值是否是undefined或null
 * @param {any} v 判断值
 * @returns {boolean}
 */
export function isUndef(v) {
  return v === undefined || v === null;
}

/**
 * 获取对象下面所有的值
 * @param {object} target  目标对象
 * @returns {array}
 */

export function valuesAll(target) {
  const res = [];
  deepIn(target);
  function deepIn(obj) {
    if (isEmpty(obj)) {
      return false;
    }
    const arr = Object.values(obj);
    arr.forEach(item => {
      if (typeof item !== 'object' && typeof item !== 'function') {
        res.push(item);
      } else {
        deepIn(item);
      }
    });
  }
  return res;
}

/**
 * 递归对象或数组的每个值
 * @param {object} target  目标对象
 * @param {function} 节点访问回调函数
 * @returns {array}
 */
export function deepIn(target, cb = noop) {
  if (!(typeof target === 'object') || isEmpty(target)) {
    return false;
  }
  forEach(target, (val, key, self) => {
    cb(val, key, self);
    deepIn(val, cb);
  });
}

/**
 * 文件导出
 * @param {title} 导出文件的名称
 * @returns {url} 文件导出的下载地址
 */
export function linkDownload(title, url, isOrigin = false) {
  let link = document.createElement('a');
  link.href = !isOrigin ? `${window.location.origin}/${url}` : `${url}`;
  link.download = title || '文件下载';
  link.click();
}

// 递归树
export function walk(tree, cb) {
  inner(tree, null, cb)
  function inner(tree, parent, cb) {
    if (!tree) {
      return false
    }
    cb(tree, parent)
    if (tree.children) {
      tree.children.forEach(node => {
        inner(node, tree, cb)
      })
    }
  }
}

export function isContains(collection = [], target = false) {
  return !!(target && Array.isArray(collection) && collection.find(item => isEqual(item, target)));
}