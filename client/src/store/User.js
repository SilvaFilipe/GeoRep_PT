import axios from "axios";

const state = {
  user: {},
  status: "",
  error: null
};

const getters = {};

const actions = {
  //Set user category
  async setUserCategory({ commit }, userData) {
    try {
      commit("setusercategory_request");

      var res = await axios.post("/api/users/setusercategory", userData);

      if (res.data.success !== undefined) {
        commit("setusercategory_success");
      }
      return res;
    } catch (error) {
      commit("setusercategory_error", error);
    }
  }
};

const mutations = {
  setusercategory_request(state) {
    state.error = null;
    state.status = "loading";
  },
  setusercategory_success(state) {
    state.error = null;
    state.status = "success";
  },
  setusercategory_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
