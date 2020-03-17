<template>
  <v-app>
    <Navbar />
    <div id="containerDiv" style="height:100%" class="container">
      <v-snackbar
        style="margin-top: 65px;"
        v-model="snackbar"
        :color="snackbarType"
        :right="true"
        :timeout="snackbarTimeout"
        :top="true"
      >
        <div style="display: initial;">
          <v-icon color="white" class="snackbar-icon-margin">{{snackbarIcon}}</v-icon>
          <p style="display: contents;">{{ snackbarText }}</p>
        </div>
      </v-snackbar>
      <router-view />
    </div>
  </v-app>
</template>

<script>
import { eventBus } from "./main";
import Navbar from "./components/Navbar";

export default {
  name: "App",
  data() {
    return {
      snackbar: false,
      snackbarText: null,
      snackbarType: null,
      snackbarTimeout: null
    };
  },
  created() {
    this.snackbarTimeout = require("./properties").growlTimeout;
    eventBus.$on("generateGrowl", growl => {
      this.generateGrowl(growl);
    });
  },
  mounted() {
    this.checkContainerClasses();
  },
  beforeUpdate() {
    this.checkContainerClasses();
  },
  components: {
    Navbar
  },
  computed: {
    snackbarIcon() {
      switch (this.snackbarType) {
        case "success":
          return "mdi-check-bold";
        case "error":
          return "mdi-alert-circle";
        default:
          return null;
      }
    }
  },
  methods: {
    checkContainerClasses() {
      //Remove padding and margins if current view is Home
      let containerDivClasses = document.getElementById("containerDiv")
        .classList;

      if ("home" == this.$router.currentRoute.name) {
        containerDivClasses.remove("container");
      } else {
        containerDivClasses.add("container");
      }
    },
    generateGrowl(growl) {
      this.snackbarText = growl.msg;
      this.snackbarType = growl.type;
      this.snackbar = true;
    }
  }
};
</script>

<style>
/*.container {
  width: 100%;
  align-self: center;
  margin: 0;
}*/

.snackbar-icon-margin {
  margin-right: 10px;
}
</style>


