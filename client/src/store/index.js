import Vue from "vue";
import Vuex from "vuex";

import Auth from "./Auth";
import Lands from "./Lands";
import Files from "./Files";
import Validations from "./Validations";
import LandLikes from "./LandLikes";
import User from "./User";
import Geocode from "./Geocode";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { Auth, Lands, User, Files, Validations, LandLikes, Geocode }
});
