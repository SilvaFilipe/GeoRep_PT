<template>
  <div>
    <v-toolbar id="navbar" color="primary" dark>
      <v-img
        src="../../public/georep_white_logo.png"
        style="height: 35px;max-width: 190px;"
        contain
        class="pointerCursor"
        @click="redirectToHome"
      ></v-img>

      <v-spacer></v-spacer>

      <template v-if="!isLoggedIn">
        <LanguageSwitcher class="lang-switch-margin" />
        <v-text-field
          spellcheck="false"
          type="text"
          v-model="email"
          v-on:keyup.enter="loginUser"
          prepend-inner-icon="mdi-at"
          :placeholder="$t('label.email')"
          outlined
          single-line
          dense
          class="login-margins"
        />
        <v-text-field
          type="password"
          v-model="password"
          v-on:keyup.enter="loginUser"
          prepend-inner-icon="mdi-lock-outline"
          :placeholder="$t('label.password')"
          outlined
          single-line
          dense
          class="login-margins"
        />
        <v-btn
          color="#87cefa"
          @click="loginUser"
          :disabled="!isLoginEnabled"
        >{{ $t('button.login') }}</v-btn>
      </template>

      <template v-if="isLoggedIn">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div>
              <v-btn
                v-on="on"
                v-if="isCurrentUserAdminOrManager"
                icon
                :to="`/${$i18n.locale}/validation`"
              >
                <v-icon>mdi-shield-check-outline</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{ $t('button.validations') }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div>
              <v-btn v-on="on" icon :to="`/${$i18n.locale}/explore`">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{ $t('button.explore') }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div>
              <v-btn v-on="on" icon :to="`/${$i18n.locale}/addland`">
                <v-icon>mdi-map-plus</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{ $t('button.addland') }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div>
              <v-btn v-on="on" icon :to="`/${$i18n.locale}/profile`">
                <v-icon>mdi-account</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{ $t('button.profile') }}</span>
        </v-tooltip>

        <p class="navbar-separator">|</p>
        <LanguageSwitcher class="lang-switch-margin" />
        <p icon id="pUserName">{{userName}}</p>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div>
              <v-btn v-on="on" icon @click="logoutUser">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{ $t('button.logout') }}</span>
        </v-tooltip>
      </template>
    </v-toolbar>
  </div>
</template>

<script>
import { eventBus } from "../main";
import { mapGetters, mapActions } from "vuex";
import LanguageSwitcher from "../components/LanguageSwitcher";
export default {
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      email: "",
      password: "",
      userName: null,
      currentUser: null
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),

    isLoginEnabled() {
      return this.email.length > 0 && this.password.length > 0; //Email and password need to be filled
    },
    isCurrentUserAdminOrManager() {
      if (!this.currentUser || !this.isLoggedIn) return false;

      return (
        this.currentUser.category == "admin" ||
        this.currentUser.category == "manager"
      );
    }
  },
  mounted() {
    this.getCurrentUser();
  },
  beforeUpdate() {
    this.getCurrentUser();
  },
  methods: {
    ...mapActions(["logout", "login", "getProfile"]),

    getCurrentUser() {
      if (!this.isLoggedIn) return;

      this.getProfile().then(res => {
        if (res.data.success) {
          this.currentUser = res.data.user;
          this.userName = res.data.user.name;
        }
      });
    },
    logoutUser() {
      this.logout();
    },
    redirectToHome() {
      this.$router.push("/" + this.$i18n.locale);
    },
    loginUser() {
      if (!this.isLoginEnabled) {
        return;
      }

      let user = {
        email: this.email,
        password: this.password
      };

      this.login(user)
        .then(res => {
          if (res && res.data.success) {
            this.$router.push("/" + this.$i18n.locale + "/profile");
          } else {
            eventBus.$emit("generateGrowl", {
              msg: this.$t(res.data.msg),
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>



<style scoped>
.navbar-separator {
  margin-top: 1%;
  color: lightgray;
  margin-right: 7px;
}

#pUserName {
  font-size: small;
  display: contents;
}

.login-margins.v-input {
  margin-top: 28px;
  margin-right: 10px;
}

.lang-switch-margin {
  margin-right: 8px;
}

.pointerCursor {
  cursor: pointer;
}
</style>
