import axios from "axios";

const state = {
  user: {},
  status: "",
  error: null
};

const getters = {};

const actions = {
  //Add land like
  async likeLand({ commit }, landId) {
    try {
      commit("likeland_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      var likeData = { landId: landId, userId: resProfile.data.user._id };

      var res = await axios.post("/api/landLikes/likeland", likeData);

      if (res.data.success !== undefined) {
        commit("likeland_success");
      }
      return res;
    } catch (error) {
      commit("likeland_error", error);
    }
  },
  //Remove land like
  async dislikeLand({ commit }, landId) {
    try {
      commit("dislikeland_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      var likeData = { landId: landId, userId: resProfile.data.user._id };

      var res = await axios.post("/api/landLikes/dislikeland", likeData);

      if (res.data.success !== undefined) {
        commit("dislikeland_success");
      }
      return res;
    } catch (error) {
      commit("dislikeland_error", error);
    }
  },
  async getLandLikeState({ commit }, landId) {
    try {
      commit("getlandlikestate_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      var likeData = { landId: landId, userId: resProfile.data.user._id };

      var res = await axios.post("/api/landLikes/getlikestate", likeData);

      if (res.data.success !== undefined) {
        commit("getlandlikestate_success");
      }
      return res;
    } catch (error) {
      commit("getlandlikestate_error", error);
    }
  },
  async getLandLikesQuantity({ commit }, landId) {
    try {
      commit("getlandlikesquantity_request");

      var landData = { landId: landId };

      var res = await axios.post(
        "/api/landLikes/getlandlikesquantity",
        landData
      );

      if (res.data.success !== undefined) {
        commit("getlandlikesquantity_success");
      }
      return res;
    } catch (error) {
      commit("getlandlikesquantity_error", error);
    }
  }
};

const mutations = {
  likeland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  likeland_success(state) {
    state.error = null;
    state.status = "success";
  },
  likeland_error(state, error) {
    state.error = error.response.data.msg;
  },
  dislikeland_request(state) {
    state.error = null;
    state.status = "loading";
  },
  dislikeland_success(state) {
    state.error = null;
    state.status = "success";
  },
  dislikeland_error(state, error) {
    state.error = error.response.data.msg;
  },
  getlandlikestate_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getlandlikestate_success(state) {
    state.error = null;
    state.status = "success";
  },
  getlandlikestate_error(state, error) {
    state.error = error.response.data.msg;
  },
  getlandlikesquantity_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getlandlikesquantity_success(state) {
    state.error = null;
    state.status = "success";
  },
  getlandlikesquantity_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
