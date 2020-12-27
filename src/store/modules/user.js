import { getToken, setToken, removeToken } from '@/utils/auth'
import { localStorage } from '@utils/utils'
import Service from '../../service'
import API from '@api/login'
import Message from '@utils/message'
import { resetRouter } from '../../router'

export default {
  namespaced: true,
  state: {
    userInfo: null,
    token: getToken()
  },
  getters: {
    isLogin: state => {
      return !!state.userInfo
    }
  },
  mutations: {
    SET_USER(state, userInfo) {
      state.userInfo = userInfo;
    },
    REMOVE_USER(state) {
      state.userInfo = null
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    REMOVE_TOKEN(state) {
      state.token = null
    },
    SET_MENU(state, menuList) {

    }
  },
  actions: {
    async lognIn({ commit }, { phoneNumber, password }) {
      const res = await Service.$service.post(API.login, { phoneNumber, password }, true)
      if (res && res.code === 0) {
        setToken(res.data)
        commit('SET_TOKEN', res.data)
        return true
      } else {
        Message.error(`${res.message || '登陆失败！'}`)
      }
      return false;
    },
    async loginOut({ commit }) {
      removeToken();
      commit('REMOVE_USER')
      commit('REMOVE_TOKEN')
      return true
    },
    async getUserInfo({ commit, state }) {
      if (!state.userInfo) {
        const res = await Service.$service.post(API.getInfo)//这里获取了用户菜单ID列表     
        if (res) {
          const { menuList = [], role = {}, user = {} } = res
          const userInfo = {
            menuList,
            role: user.role,
            phone: user.phoneNumber
          }
          resetRouter()
          // 保存管理员信息
          commit('SET_USER', userInfo)
          return menuList
        }
      }
      return []
    }
  }
}