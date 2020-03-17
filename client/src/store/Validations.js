import axios from "axios";

const state = {
  user: {},
  status: "",
  error: null
};

const getters = {};

const actions = {
  //Add validation
  async addvalidation({ commit }, validationData) {
    try {
      commit("addvalidation_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      validationData.userId = resProfile.data.user._id;

      var res = await axios.post(
        "/api/validations/addvalidation",
        validationData
      );

      if (res.data.success !== undefined) {
        commit("addvalidation_success");
      }
      return res;
    } catch (error) {
      commit("addvalidation_error", error);
    }
  },
  async getAllValidations({ commit }) {
    try {
      commit("getallvalidations_request");
      var res = await axios.get("/api/validations/allvalidations");

      if (res.data.success !== undefined) {
        commit("getallvalidations_success");
      }
      return res;
    } catch (error) {
      commit("getallvalidations_error", error);
    }
  },
  async validateLand({ commit }, validation) {
    try {
      commit("validateland_request");
      var res = await axios.post("/api/validations/validateland", validation);

      if (res.data.success !== undefined) {
        commit("validateland_success");
      }
      return res;
    } catch (error) {
      commit("validateland_error", error);
    }
  }
};

const mutations = {
  addvalidation_request(state) {
    state.error = null;
    state.status = "loading";
  },
  addvalidation_success(state) {
    state.error = null;
    state.status = "success";
  },
  addvalidation_error(state, error) {
    state.error = error.response.data.msg;
  },
  getallvalidations_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getallvalidations_success(state) {
    state.error = null;
    state.status = "success";
  },
  getallvalidations_error(state, error) {
    state.error = error.response.data.msg;
  },
  validateland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  validateland_success(state) {
    state.error = null;
    state.status = "success";
  },
  validateland_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
