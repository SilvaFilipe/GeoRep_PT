<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-avatar size="25" v-on="on" class="pointerCursor">
          <img :src="currentLanguageFlag"  />
        </v-avatar>
      </template>
      <v-list>
        <v-list-item
          v-for="(language, index) in languages"
          :key="index"
          class="pointerCursor"
          @click="setLocale(language.code)"
        >
          <v-list-item-avatar>
            <v-img :src="language.imageLink"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>{{language.language}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      languages: []
    };
  },
  mounted() {
    this.languages = require("../properties").languages;
  },
  computed: {
    currentLanguageFlag() {
      //Set default flag as portuguese
      var locale = this.$i18n.locale || "pt";

      var imageLink = null;
      this.languages.forEach(language => {
        if (language.code == locale) imageLink = language.imageLink;
      });
      return imageLink;
    }
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
      this.$router.push({
        params: { lang: locale }
      });
    }
  }
};
</script>

<style scoped>
.pointerCursor {
  cursor: pointer;
}
</style>