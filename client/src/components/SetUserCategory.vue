<template>
  <v-card>
    <v-card-title
      class="headline"
      v-if="user"
    >{{ $t('category.set_category1') }} {{user.name}} {{ $t('category.set_category2') }}</v-card-title>
    <v-card-text>{{ $t('category.please_set_user_role') }}</v-card-text>

    <div style="text-align:center">
      <v-btn-toggle mandatory id="btnToggleOptions" v-model="radioOption">
        <v-btn value="0">
          <span class="hidden-sm-and-down">{{ $t('category.pick_managing_zone') }}</span>
          <v-icon right>mdi-account-star</v-icon>
        </v-btn>
        <v-btn value="1">
          <span class="hidden-sm-and-down">{{ $t('category.remove_managing_role') }}</span>
          <v-icon right>mdi-account-off-outline</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="radioOption==0" style="display:flex">
      <DistrictsMap
        style="width: 310px;"
        id="districtMapUserCat"
        mapHeight="350"
        :zoomProp="6"
        :centerCoords="districtsMapCenterCoords"
        @pickedDistrictChanged="pickedDistrictChanged"
        @pickedCountyChanged="pickedCountyChanged"
      />
      <div style="width: 41%; text-align: center;">
        <div style="display: -webkit-inline-box; margin-top: 45%;">
          <v-icon style="font-size: 100px;margin-left: 45px;" :color="indicatorColor">mdi-account</v-icon>
          <p>{{zoneIndicator}}</p>
        </div>
        <v-alert dense type="info" id="zoneAlert">
          {{zoneType}}
          <br />
          <strong>{{zone}}</strong>
        </v-alert>
      </div>
    </div>

    <div v-if="radioOption==1">
      <v-card-text style="padding-left: 27px;">{{ $t('category.become_regular_user') }}</v-card-text>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="closeThis">Cancel</v-btn>
      <v-btn text color="primary" @click="closeThis(), applyUserCategory()">{{ $t('button.apply') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { eventBus } from "../main";
import { mapActions } from "vuex";
import DistrictsMap from "./DistrictsMap";
export default {
  components: {
    DistrictsMap
  },
  props: ["user"],
  data() {
    return {
      districtsMapCenterCoords: [39.41667, -9.13333],
      zoneIndicator: null,
      indicatorColor: "green",
      radioOption: "0",
      zoneType: this.$t("category.admin_role"),
      zone: "",
      pickedCategory: "admin",
      pickedDistrict: null,
      pickedCounty: null
    };
  },
  methods: {
    ...mapActions(["setUserCategory"]),
    pickedDistrictChanged(district) {
      if (district) {
        this.zoneIndicator = district.districtCode;
        this.indicatorColor = "blue";
        this.zoneType = this.$t("category.managed_district");
        this.zone = district.districtName;

        //Data to be saved
        this.pickedCategory = "manager";
        this.pickedDistrict = district.districtCode;
        this.pickedCounty = null;
      } else {
        this.zoneIndicator = null;
        this.indicatorColor = "green";
        this.zoneType = this.$t("category.admin_role");
        this.zone = "";

        //Data to be saved
        this.pickedCategory = "admin";
        this.pickedDistrict = null;
        this.pickedCounty = null;
      }
    },
    pickedCountyChanged(county) {
      this.zoneIndicator = county.countyCode;
      this.indicatorColor = "purple";
      this.zoneType = this.$t("category.managed_county");
      this.zone = county.countyName;

      //Data to be saved
      this.pickedCategory = "manager";
      this.pickedDistrict = null;
      this.pickedCounty = county.countyCode;
    },
    closeThis() {
      this.$emit("close");
    },
    applyUserCategory() {
      var userData = {};
      if (this.radioOption == 0) {
        userData = {
          userId: this.user._id,
          category: this.pickedCategory,
          managingDistrict: this.pickedDistrict,
          managingCounty: this.pickedCounty
        };
      } else {
        userData = {
          userId: this.user._id,
          category: "regular",
          managingDistrict: null,
          managingCounty: null
        };
      }

      this.setUserCategory(userData).then(res => {
        if (res.data.success) {
          //Update user object to get visual feedback in the table
          this.user.category = userData.category;
          this.user.managingDistrict = userData.managingDistrict;
          this.user.managingCounty = userData.managingCounty;

          eventBus.$emit("generateGrowl", {
            msg: res.data.msg,
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#districtMapUserCat {
  min-height: 300px;
  width: 300px;
  padding-left: 24px;
}

#btnToggleOptions {
  margin-bottom: 10px;
  margin-top: -10px;
  padding-left: 24px;
}

#zoneAlert {
  padding: 3px;
  font-size: small;
  margin-left: 6px;
}
</style>