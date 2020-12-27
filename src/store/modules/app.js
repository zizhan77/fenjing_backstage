export default {
  namespaced: true,
  state: {
    siderStatus: false
  },
  mutations: {
    TOGGLE_SIDER(state, status) {
      state.siderStatus = status
    }
  }
}