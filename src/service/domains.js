// domains.js

/**
 * axios分域设置
 */

export default {
    service: {
        baseURL: window.origin + '/'
    },
    role: {
        baseURL: window.origin + '/',
        headers: {
            'Content-Type': 'application/json'
        }
    },
    // 以api开头的url将默认作为本地mock服务(待实现)
    mock: {
        baseURL: '/api'
    }
};