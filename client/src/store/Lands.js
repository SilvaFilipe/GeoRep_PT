import axios from "axios";

const state = {
  user: {},
  status: "",
  error: null
};

const getters = {};

const actions = {
  //Add land
  async addland({ commit }, landData) {
    try {
      commit("addland_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      landData.userId = resProfile.data.user._id;

      landData.userName = resProfile.data.user.name;

      var res = await axios.post("/api/lands/addland", landData);

      if (res.data.success !== undefined) {
        commit("addland_success");
      }
      return res;
    } catch (error) {
      commit("addland_error", error);
    }
  },
  async getCurrentUserLands({ commit }) {
    try {
      commit("getuserland_request");
      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      var userId = resProfile.data.user._id;
      var user = { userId: userId };

      var res = await axios.post("/api/lands/userlands", user);

      if (res.data.success !== undefined) {
        commit("getuserland_success");
      }
      return res;
    } catch (error) {
      commit("getuserland_error", error);
    }
  },
  async getAllLands({ commit }) {
    try {
      commit("getalllands_request");
      var res = await axios.get("/api/lands/alllands");

      if (res.data.success !== undefined) {
        commit("getalllands_success");
      }
      return res;
    } catch (error) {
      commit("getalllands_error", error);
    }
  },
  async deleteLand({ commit }, land) {
    try {
      commit("deleteland_request");
      var res = await axios.post("/api/lands/deleteland", land);

      if (res.data.success !== undefined) {
        commit("deleteland_success");
      }
      return res;
    } catch (error) {
      commit("deleteland_error", error);
    }
  },
  async getLand({ commit }, land) {
    try {
      commit("getland_request");
      var res = await axios.post("/api/lands/getland", land);

      if (res.data.success !== undefined) {
        commit("getland_success");
      }
      return res;
    } catch (error) {
      commit("getland_error", error);
    }
  },
  async editLand({ commit }, land) {
    try {
      commit("editland_request");
      var res = await axios.post("/api/lands/editland", land);

      if (res.data.success !== undefined) {
        commit("editland_success");
      }
      return res;
    } catch (error) {
      commit("editland_error", error);
    }
  }
};

const mutations = {
  addland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  addland_success(state) {
    state.error = null;
    state.status = "success";
  },
  addland_error(state, error) {
    state.error = error.response.data.msg;
  },
  getuserland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getuserland_success(state) {
    state.error = null;
    state.status = "success";
  },
  getuserland_error(state, error) {
    state.error = error.response.data.msg;
  },
  getalllands_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getalllands_success(state) {
    state.error = null;
    state.status = "success";
  },
  getalllands_error(state, error) {
    state.error = error.response.data.msg;
  },
  deleteland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  deleteland_success(state) {
    state.error = null;
    state.status = "success";
  },
  deleteland_error(state, error) {
    state.error = error.response.data.msg;
  },
  getland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getland_success(state) {
    state.error = null;
    state.status = "success";
  },
  getland_error(state, error) {
    state.error = error.response.data.msg;
  },
  editland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  editland_success(state) {
    state.error = null;
    state.status = "success";
  },
  editland_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
