import axios from "axios";
import router from "../router/index";

const state = {
  //If the user is logged in the token will be available in the local storage
  token: localStorage.getItem("token") || "",
  user: {},
  status: "",
  error: null
};

const getters = {
  isLoggedIn: state => !!state.token,
  authState: state => state.status,
  user: state => state.user,
  error: state => state.error
};

const actions = {
  //Login action
  async login({ commit }, user) {
    commit("auth_request");
    try {
      let res = await axios.post("/api/users/login", user);
      if (res.data.success) {
        const token = res.data.token;
        const user = res.data.user;
        //Store the token into the localstorage
        localStorage.setItem("token", token);
        //Set the axios defaults
        axios.defaults.headers.common["Authorization"] = token;
        commit("auth_success", token, user);
      }
      return res;
    } catch (error) {
      commit("auth_error", error);
    }
  },

  //Register user
  async register({ commit }, userData) {
    try {
      commit("register_request");
      let res = await axios.post("/api/users/register", userData);
      if (res.data.success !== undefined) {
        commit("register_success");
      }
      return res;
    } catch (error) {
      commit("register_error", error);
    }
  },

  //Get user profile
  async getProfile({ commit }) {
    commit("profile_request");

    let res = await axios.get("/api/users/profile");
    commit("user_profile", res.data.user);
    return res;
  },

  //Logout
  async logout({ commit }) {
    await localStorage.removeItem("token");
    commit("logout");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/").catch(err => {
      console.log("logout_" + err.length); //Avoid navigation duplicated error
    });
    return;
  },

  //Get all user
  async getAllUsers({ commit }) {
    try {
      commit("getallusers_request");
      var res = await axios.get("/api/users/allusers");

      if (res.data.success !== undefined) {
        commit("getallusers_success");
      }
      return res;
    } catch (error) {
      commit("getallusers_error", error);
    }
  },
  //Remove current user account
  async removeCurrentUserAccount({ commit }, deleteUserLands) {
    try {
      commit("removecurrentuseraccount_request");

      //Get user ID
      var resProfile = await axios.get("/api/users/profile");

      var userData = {
        userId: resProfile.data.user._id,
        deleteUserLands: deleteUserLands
      };

      var res = await axios.post("/api/users/removeuseraccount", userData);

      if (res.data.success !== undefined) {
        commit("removecurrentuseraccount_success");
      }
      return res;
    } catch (error) {
      commit("removecurrentuseraccount_error", error);
    }
  },
  //Remove user account by admin
  async removeUserAccount({ commit }, userData) {
    try {
      commit("removeuseraccount_request");

      var res = await axios.post("/api/users/removeuseraccount", userData);

      if (res.data.success !== undefined) {
        commit("removeuseraccount_success");
      }
      return res;
    } catch (error) {
      commit("removeuseraccount_error", error);
    }
  }
};

const mutations = {
  auth_request(state) {
    state.error = null;
    state.status = "loading";
  },
  auth_success(state, token, user) {
    state.token = token;
    state.user = user;
    state.status = "success";
    state.error = null;
  },
  auth_error(state, error) {
    state.error = error.response.data.msg;
  },
  register_request(state) {
    state.error = null;
    state.status = "loading";
  },
  register_success(state) {
    state.error = null;
    state.status = "success";
  },
  register_error(state, error) {
    state.error = error.response.data.msg;
  },
  logout(state) {
    state.error = null;
    state.status = "";
    state.token = "";
    state.user = "";
  },
  profile_request(state) {
    state.status = "loading";
  },
  user_profile(state, user) {
    state.user = user;
  },
  getallusers_request(state) {
    state.error = null;
    state.status = "loading";
  },
  getallusers_success(state) {
    state.error = null;
    state.status = "success";
  },
  getallusers_error(state, error) {
    state.error = error.response.data.msg;
  },
  removecurrentuseraccount_request(state) {
    state.error = null;
    state.status = "loading";
  },
  removecurrentuseraccount_success(state) {
    state.error = null;
    state.status = "success";
  },
  removecurrentuseraccount_error(state, error) {
    state.error = error.response.data.msg;
  },
  removeuseraccount_request(state) {
    state.error = null;
    state.status = "loading";
  },
  removeuseraccount_success(state) {
    state.error = null;
    state.status = "success";
  },
  removeuseraccount_error(state, error) {
    state.error = error.response.data.msg;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
