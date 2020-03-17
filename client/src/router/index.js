import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "pt" },
    {
      path: "/:lang",
      component: {
        render(c) {
          return c("router-view");
        }
      },
      children: [
        {
          path: "/",
          name: "home",
          component: Home
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/Profile.vue"),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "addland",
          name: "addland",
          component: () => import("../views/AddLand.vue"),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "explore",
          name: "explore",
          component: () => import("../views/Explore.vue"),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "validation",
          name: "validation",
          component: () => import("../views/Validation.vue"),
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  for (var i = 0; i < to.matched.length; i++) {
    var record = to.matched[i]; //Route

    //If route requires auth
    if (record.meta.requiresAuth) {
      if (!store.getters.isLoggedIn) {
        //Redirect to the Home page
        next("/");
      }
      //If requires guest
    } else if (record.meta.requiresGuest) {
      if (store.getters.isLoggedIn) {
        //Redirect to the profile page
        next("/profile");
      }
    }
    //Else
    next();
  }
});

export default router;
