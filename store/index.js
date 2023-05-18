export const state = () => ({
  searchText: '', // คำค้นหา
  restaurants: [], // ข้อมูลร้านอาหาร
  indexActive: 0, // ลำดับการคลิกร้านค้า
})

export const getters = {
  getSearchText(state) {
    return state.searchText
  },
  getRestaurants(state) {
    return state.restaurants
  },
  getIndexActive(state) {
    return state.indexActive
  },
}

export const mutations = {
  setSearchText(state, text) {
    state.searchText = text
  },
  setRestaurants(state, arr) {
    state.restaurants = arr
  },
  toggleRestaurants(state, payload) {
    state.restaurants[payload.from].isActive =
      !state.restaurants[payload.from].isActive
    state.restaurants[payload.to].isActive =
      !state.restaurants[payload.to].isActive
  },
  setIndexActive(state, index) {
    state.indexActive = index
  },
}

export const actions = {
  async fetchPlace({ commit }, payload) {
    let isErr = false

    const res = await this.$axios
      .$post(process.env.apiUrl + '/api/v0.1/place', payload)
      .catch((error) => {
        console.log(error.toJSON())
        isErr = true
      })

    if (isErr === true) {
      return {
        data: [],
        err: 1,
      }
    }

    return {
      data: res.data,
      err: 0,
    }
  },
}
