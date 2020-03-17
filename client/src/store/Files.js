import axios from "axios";

const state = {
  user: {},
  status: "",
  error: null
};

const getters = {};

const actions = {
  //Add file
  async addfile({ commit }, fileData) {
    try {
      commit("addfile_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      fileData.userId = resProfile.data.user._id;

      var res = await axios.post("/api/files/addfile", fileData);

      if (res.data.success !== undefined) {
        commit("addfile_success");
      }
      return res;
    } catch (error) {
      commit("addfile_error", error);
    }
  },
  async getLandImages({ commit }, landData) {
    try {
      commit("getLandImages_request");

      var res = await axios.post("/api/files/landimages", landData);

      if (res.data.success !== undefined) {
        commit("getLandImages_success");
      }
      return res;
    } catch (error) {
      commit("getLandImages_error", error);
    }
  },
  async removeLandImages({ commit }, landData) {
    try {
      commit("removeLandImages_request");

      var res = await axios.post("/api/files/removelandimages", landData);

      if (res.data.success !== undefined) {
        commit("removeLandImages_success");
      }
      return res;
    } catch (error) {
      commit("removeLandImages_error", error);
    }
  },
  async getLandValidationFiles({ commit }, landData) {
    try {
      commit("getLandValidationFiles_request");

      var res = await axios.post("/api/files/landvalidationfiles", landData);

      if (res.data.success !== undefined) {
        commit("getLandValidationFiles_success");
      }
      return res;
    } catch (error) {
      commit("getLandValidationFiles_error", error);
    }
  },
  async getAllLandFiles({ commit }, landData) {
    try {
      commit("getAllLandFiles_request");

      var res = await axios.post("/api/files/alllandfiles", landData);

      if (res.data.success !== undefined) {
        commit("getAllLandFiles_success");
      }
      return res;
    } catch (error) {
      commit("getAllLandFiles_error", error);
    }
  }
};

const mutations = {
  addfile_request(state) {
    state.error = null;
    state.status = "loading";
  },
  addfile_success(state) {
    state.error = null;
    state.status = "success";
  },
  addfile_error(state, error) {
    state.error = error.response.data.msg;
  },
  getLandImages_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getLandImages_success(state) {
    state.error = null;
    state.status = "success";
  },
  getLandImages_error(state, error) {
    state.error = error.response.data.msg;
  },
  removeLandImages_request(state) {
    state.error = null;
    state.status = "loading";
  },
  removeLandImages_success(state) {
    state.error = null;
    state.status = "success";
  },
  removeLandImages_error(state, error) {
    state.error = error.response.data.msg;
  },
  getLandValidationFiles_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getLandValidationFiles_success(state) {
    state.error = null;
    state.status = "success";
  },
  getLandValidationFiles_error(state, error) {
    state.error = error.response.data.msg;
  },
  getAllLandFiles_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getAllLandFiles_success(state) {
    state.error = null;
    state.status = "success";
  },
  getAllLandFiles_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
