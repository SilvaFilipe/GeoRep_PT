<template>
  <div style="width: 100%; overflow: hidden;">
    <div style="width: 50%; float: left;">
      <v-img
        style="position: relative;left: 21%;"
        src="../../public/map_pt_register.png"
        aspect-ratio="1.2"
        contain
      ></v-img>
      <div class="register-table">
        <table id="tblRegister">
          <tbody>
            <tr>
              <td colspan="2">
                <h1>{{ $t('georep.name_pt') }}</h1>
              </td>
            </tr>
            <tr>
              <td>
                <v-icon large>mdi-map-marker-distance</v-icon>
              </td>
              <td>
                <h4>{{ $t('home.easy_tool') }}</h4>
              </td>
            </tr>
            <tr>
              <td>
                <v-icon large>mdi-image-multiple</v-icon>
              </td>
              <td>
                <h4>{{ $t('home.store_docs') }}</h4>
              </td>
            </tr>
            <tr>
              <td>
                <v-icon large>mdi-currency-eur-off</v-icon>
              </td>
              <td>
                <h4>{{ $t('home.free') }}</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style="margin-left: 50%;color:#737373">
      <h1>{{ $t('home.signup') }}</h1>
      <p>{{ $t('home.quickeasy') }}</p>
      <v-form>
        <v-text-field
          spellcheck="false"
          id="name"
          type="text"
          :label="$t('label.name')"
          v-model="name"
        />
        <v-text-field
          spellcheck="false"
          id="email"
          type="text"
          :label="$t('label.email')"
          v-model="email"
        />
        <v-text-field
          id="password"
          type="password"
          :label="$t('label.password')"
          v-model="password"
        />
        <v-slide-y-transition>
          <v-text-field
            id="confirmPassword"
            type="password"
            :label="$t('label.confirm_password')"
            v-model="confirmPassword"
            v-show="confirmPasswordVisibility"
          />
        </v-slide-y-transition>
        <v-menu
          v-model="birthDateVisibility"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              spellcheck="false"
              v-model="birthDate"
              :label="$t('label.birthdate')"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            id="birthDate"
            name="birthDate"
            v-model="birthDate"
            @input="birthDateVisibility = false"
            no-title
            :locale="$i18n.locale"
          />
        </v-menu>
        <v-btn depressed large color="primary" @click="registerUser">{{ $t('button.signup') }}</v-btn>
      </v-form>

      <table id="tblContacts">
        <tbody>
          <tr>
            <td>
              <v-icon>mdi-linkedin-box</v-icon>
            </td>
            <td>
              <h6>filipefsilva</h6>
            </td>
          </tr>
          <tr>
            <td>
              <v-icon>mdi-email-outline</v-icon>
            </td>
            <td>
              <h6>silva.filipef@gmail.com</h6>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="code-version">
        <v-icon small>mdi-code-braces-box</v-icon>
        <p style="font-size: x-small;margin-top: 1px;">{{codeVersion}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      birthDate: null,
      birthDateVisibility: false
    };
  },
  computed: {
    confirmPasswordVisibility() {
      return this.password && this.password.length >= 6;
    },
    codeVersion() {
      return "v. " + require("../properties").codeVersion;
    }
  },
  methods: {
    ...mapActions(["register", "login"]),
    registerUser() {
      let user = {
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        name: this.name,
        birthDate: this.birthDate
      };

      var _this = this;
      this.register(user).then(res => {
        if (res.data.success) {
          //Login new user and redirect to profile page
          var lc = this.$i18n.locale;
          _this
            .login(user)
            .then(res => {
              if (res && res.data.success) {
                _this.$router.push("/" + lc + "/profile");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          eventBus.$emit("generateGrowl", {
            msg: this.$t(res.data.msg),
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#tblRegister {
  color: #737373;
  margin: 9%;
  border-collapse: separate;
  border-spacing: 2em;
}

#tblContacts {
  color: #868484;
  position: absolute;
  bottom: 3px;
  right: 7px;
}

.register-table {
  left: 0%;
  position: absolute;
  top: 6%;
}

.code-version {
  display: flex;
  align-items: end;
  position: absolute;
  bottom: 2px;
  left: 10px;
}
</style>