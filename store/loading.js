export const state = () => ({
  loading: false,
})

export const getters = {
  getLoading(state) {
    return state.loading
  },
}

export const mutations = {
  toggleLoading(state) {
    state.loading = !state.loading
  },
}
