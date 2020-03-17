import axios from "axios";

const state = {
  user: {},
  status: "",
  error: null
};

const getters = {};

const actions = {
  async getGeocode({ commit }, geoData) {
    try {
      commit("getgeocode_request");

      //Authorization header needs to be removed and added again to avoid CORS error
      var token = axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.common["Authorization"];

      var res = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          crossdomain: true,
          params: {
            address: geoData.expression,
            key: "*GOOGLE_API_KEY*"
          }
        }
      );

      if (res.data.success !== undefined) {
        commit("getgeocode_success");
      }
      axios.defaults.headers.common["Authorization"] = token;
      return res;
    } catch (error) {
      axios.defaults.headers.common["Authorization"] = token;
      commit("getgeocode_error", error);
    }
  }
};

const mutations = {
  getgeocode_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getgeocode_success(state) {
    state.error = null;
    state.status = "success";
  },
  getgeocode_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
