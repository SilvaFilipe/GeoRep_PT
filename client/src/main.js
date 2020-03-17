import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

import "material-design-icons-iconfont/dist/material-design-icons.css";
import i18n from "./i18n";

export const eventBus = new Vue();

Vue.config.productionTip = false;

//Setting up default vue's http modules for api calls
Vue.prototype.$http = axios;
//Load token from the localStorage
const token = localStorage.getItem("token");
//If there is any token, append default axios authorization headers
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

//use beforeEach route guard to set the language
router.beforeEach((to, from, next) => {
  //use the language from the routing params or default language
  let language = to.params.lang;
  if (!language) {
    language = "pt";
  }

  //set the current language for i18n
  i18n.locale = language;
  next();
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
