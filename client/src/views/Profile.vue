<template>
  <div v-if="user">
    <div style="display:flex;margin-bottom: 5px;">
      <h3>{{ $t('profile.welcome') }} {{user.name}}</h3>
      <div id="divIcon">
        <v-icon :color="getUserIconColor()">mdi-account</v-icon>
        <p class="zone-indicator">{{getUserZoneIndicator()}}</p>
      </div>
    </div>

    <!-- <v-btn depressed small color="primary" :to="`/${$i18n.locale}/addland`">
      <v-icon>mdi-map-plus</v-icon>
      {{ $t('button.addland') }}
    </v-btn>-->

    <h2>{{ $t('profile.addedlands') }}</h2>
    <div style="width: 100%; overflow: hidden;">
      <div style="width: 74%; float: left;">
        <v-data-table
          :key="landTableKey"
          id="tableLands"
          :no-data-text="$t('label.nodata')"
          :headers="landsTableHeaders"
          :items="userLands"
          :footer-props="{
        itemsPerPageText:$t('label.rows_per_page'),
        itemsPerPageAllText: $t('label.rows_per_page_all')}"
        >
          <template v-slot:item.description="{ item }">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <td class="td-overflow" v-on="on" v-if="item.description">{{item.description}}</td>
              </template>
              <span>{{item.description}}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.visibility="{ item }">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" v-if="item.isPublic">mdi-earth</v-icon>
              </template>
              <span>{{ $t('label.public_land') }}</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" v-if="!item.isPublic">mdi-account-lock-outline</v-icon>
              </template>
              <span>{{ $t('label.private_land') }}</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" v-if="item.isValidated">mdi-shield-check</v-icon>
              </template>
              <span>{{ $t('label.validated_land') }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  fab
                  x-small
                  v-on="on"
                  dark
                  outlined
                  @click="editSelectedLand(item)"
                >
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('button.edit_land') }}</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn color="primary" fab x-small v-on="on" dark outlined @click="openLand(item)">
                  <v-icon>mdi-map-search-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('button.open_land') }}</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="red"
                  fab
                  x-small
                  dark
                  outlined
                  v-on="on"
                  @click="showDeleteDialog(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('button.delete_land') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
      <div style="margin-left: 74%;">
        <ChoroplethDistrictsMap
          style="width: 330px;"
          mapHeight="450"
          :lands="totalLands"
          :centerCoords="districtsMapCenterCoords"
          :zoomProp="6.3"
          @pickedDistrictChanged="pickedDistrictChanged"
          @pickedCountyChanged="pickedCountyChanged"
          @districtsMapBack="resetLands"
        />
      </div>
    </div>
    <br />
    <v-btn depressed small color="error" @click="deleteAccountDialogVisibility=true">
      <v-icon>mdi-account-remove</v-icon>
      {{ $t('button.deleteaccount') }}
    </v-btn>

    <!-- Delete land dialog-->
    <v-dialog v-model="deleteDialogVisibility" max-width="450">
      <v-card>
        <v-card-title class="headline">{{ $t('land.confirm_deleteland') }}</v-card-title>
        <v-card-text
          v-if="selectedLand"
        >{{ $t('land.sub_confirm_deleteland1') }} "{{selectedLand.name}}" {{ $t('land.sub_confirm_deleteland2') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialogVisibility = false">{{ $t('button.cancel') }}</v-btn>
          <v-btn
            text
            color="error"
            @click="deleteDialogVisibility = false;deleteLandClick()"
          >{{ $t('button.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete account dialog-->
    <v-dialog v-model="deleteAccountDialogVisibility" max-width="600" v-if="currentUser">
      <v-card>
        <v-card-title class="headline">{{ $t('profile.confirm_deleteaccount') }}</v-card-title>
        <v-card-text>{{ $t('profile.sub_confirm_deleteaccount') }}</v-card-text>
        <v-text-field
          spellcheck="false"
          style="margin-right: 25px;
    margin-left: 25px;"
          v-model="deleteAccountEmailInput"
          :placeholder="currentUser.email"
          solo
        ></v-text-field>
        <v-checkbox
          v-if="totalLands.length>0"
          class="checkbox-delete-user-lands"
          v-model="deleteUserLands"
          :label="$t('profile.delete_user_lands')"
        ></v-checkbox>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteAccountDialogVisibility = false">{{ $t('button.cancel') }}</v-btn>
          <v-btn
            color="error"
            @click="deleteAccount()"
            :disabled="deleteAccountEmailInput != currentUser.email"
          >{{ $t('button.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit land dialog -->
    <v-dialog v-model="editLandDialogVisibility" max-width="80%">
      <v-card v-if="selectedLand">
        <div style="display:-webkit-box;">
          <v-card-title class="headline">{{ $t('button.edit_land') }}</v-card-title>
          <div class="div-btn-toggle">
            <v-btn-toggle class="sidePadding" mandatory v-model="isSelectedLandPrivate">
              <v-btn value="0">
                <span class="hidden-sm-and-down">{{ $t('button.public') }}</span>
                <v-icon right>mdi-earth</v-icon>
              </v-btn>
              <v-btn value="1">
                <span class="hidden-sm-and-down">{{ $t('button.private') }}</span>
                <v-icon right>mdi-account-lock-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon style="margin-top: -20px;" color="grey" dark v-on="on">mdi-help-circle</v-icon>
              </template>
              <span>{{ $t('land.public_private_help') }}</span>
            </v-tooltip>
          </div>
        </div>

        <v-card>
          <v-text-field
            style="margin-bottom:-10px"
            spellcheck="false"
            outlined
            class="sidePadding"
            maxlength="100"
            v-model="editLandName"
            :label="$t('land.landname')"
          ></v-text-field>
          <v-textarea
            spellcheck="false"
            style="margin-bottom:-20px"
            outlined
            auto-grow
            class="sidePadding"
            maxlength="800"
            v-model="editLandDescription"
            :label="$t('land.landdescription')"
          ></v-textarea>
          <div>
            <div style=" width:50%;float:right;" v-if="selectedLandImageFiles.length > 0">
              <v-carousel style="height:250px">
                <v-carousel-item
                  v-for="(item,i) in selectedLandImageFiles"
                  :key="i"
                  :src="item.dataUrl"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                ></v-carousel-item>
              </v-carousel>
            </div>
            <div style=" width:auto; height:200px;overflow:hidden;">
              <v-card id="mapPreviewEditLand" />
              <!-- Map type button -->
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    class="map-type-btn"
                    x-large
                    color="primary"
                    fab
                    dark
                    @click="changeMapType()"
                  >
                    <v-icon v-show="!isMapTypeSatellite" color="#75ce2e">mdi-earth-box</v-icon>
                    <v-icon v-show="isMapTypeSatellite" color="#f9df9a">mdi-map-marker-path</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('button.change_map_type') }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-card>
        <div style="margin-top:10px" class="text-center" v-show="showProgressBar">
          <v-progress-circular indeterminate color="primary" :size="70" :width="7" />
        </div>
        <FileInput
          v-show="!showProgressBar"
          style="width: 40%;"
          @filesChanged="imageFilesChanged"
          :btnLabel="$t('button.attach_pictures')"
          type="image"
          :initialFiles="selectedLandImageFiles"
          :maxFilesQtty="20"
        />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="editLandDialogVisibility = false" color="error">{{ $t('button.cancel') }}</v-btn>
          <v-btn @click="saveEditLand()" color="success">{{ $t('button.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script async defer
src="https://maps.googleapis.com/maps/api/js?key=*GOOGLE_API_KEY*&libraries=drawing">
</script>
<script>
import { eventBus } from "../main";
import { mapActions, mapGetters } from "vuex";
import ChoroplethDistrictsMap from "../components/ChoroplethDistrictsMap";
import FileInput from "../components/FileInput";
export default {
  components: {
    FileInput,
    ChoroplethDistrictsMap
  },
  data() {
    return {
      districtsMapCenterCoords: [39.41667, -9.113333],
      selectedLand: null,
      deleteDialogVisibility: false,
      deleteAccountDialogVisibility: false,
      editLandDialogVisibility: false,
      userLands: [],
      totalLands: [],
      selectedLandImageFiles: [],
      currentUser: null,
      deleteAccountEmailInput: null,
      showProgressBar: false,
      mapPreview: null,
      editLandDescription: "",
      editLandName: "",
      isSelectedLandPrivate: null,
      landTableKey: 0,
      deleteUserLands: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    landsTableHeaders() {
      return [
        {
          text: this.$t("label.name"),
          align: "left",
          value: "name"
        },
        { text: this.$t("label.description"), value: "description" },
        { text: this.$t("label.district"), value: "districtName" },
        { text: this.$t("label.county"), value: "countyName" },
        { text: "", value: "visibility", sortable: false },
        { text: "", value: "action", sortable: false }
      ];
    },
    isMapTypeSatellite() {
      if (this.mapPreview && this.mapPreview.getMapTypeId()) {
        return "satellite" == this.mapPreview.getMapTypeId();
      }
      return false;
    }
  },
  created() {
    this.getProfile().then(res => {
      if (res.data.success) {
        this.currentUser = res.data.user;
      }
    });
  },
  mounted() {
    this.getUserLands();
  },
  watch: {
    deleteAccountDialogVisibility() {
      this.deleteAccountEmailInput = "";
    },
    editLandDialogVisibility(newVal) {
      if (!newVal) return;

      this.selectedLandImageFiles = [];
    }
  },
  methods: {
    ...mapActions([
      "getProfile",
      "getCurrentUserLands",
      "deleteLand",
      "logout",
      "removeCurrentUserAccount",
      "getLandImages",
      "editLand",
      "removeLandImages",
      "addfile"
    ]),

    openLand(land) {
      //Set param
      this.$router.landToOpen = land;
      //Go to home view
      this.$router.push("/" + this.$i18n.locale);
    },
    editSelectedLand(land) {
      this.selectedLand = land;
      this.getLandImageFiles();

      this.editLandName = land.name;
      this.editLandDescription = land.description;
      this.editLandDialogVisibility = true;
      this.isSelectedLandPrivate = land.isPublic ? "0" : "1";

      var _this = this;
      setTimeout(function() {
        _this.generatePreviewMap(land.centerCoords);
        _this.generateLandPolygon();
      }, 50);
    },
    saveEditLand() {
      this.selectedLand.name = this.editLandName;
      this.selectedLand.description = this.editLandDescription;
      this.selectedLand.isPublic = this.isSelectedLandPrivate == "0";
      this.selectedLand.updateDate = new Date();

      this.editLand(this.selectedLand).then(res => {
        if (res.data.success) {
          this.editLandDialogVisibility = false;
          eventBus.$emit("generateGrowl", {
            msg: this.$t(res.data.msg),
            type: "success"
          });
          this.landTableKey++;
          this.removeEditLandImageFiles();
        }
      });
    },
    removeEditLandImageFiles() {
      this.removeLandImages(this.selectedLand).then(res => {
        if (res.data.success) {
          this.selectedLandImageFiles.forEach(file => {
            file.relatedId = this.selectedLand._id;
            file.relatedTable = "land";

            //Save file
            this.addfile(file);
          });
        }
      });
    },
    imageFilesChanged(images) {
      this.selectedLandImageFiles = images;
    },
    getLandImageFiles() {
      this.showProgressBar = true;
      this.getLandImages(this.selectedLand).then(res => {
        this.showProgressBar = false;
        if (res.data.success) {
          this.selectedLandImageFiles = res.data.result;
        }
      });
    },
    generatePreviewMap(centerCoords) {
      var mapDiv = document.getElementById("mapPreviewEditLand");

      var options = require("../properties").googleMapOptions;
      options.zoom = 17;
      options.center = {
        lat: parseFloat(centerCoords.split(", ")[0]),
        lng: parseFloat(centerCoords.split(", ")[1])
      };

      this.mapPreview = new google.maps.Map(mapDiv, options);
    },
    changeMapType() {
      if (this.isMapTypeSatellite) {
        this.mapPreview.setMapTypeId("roadmap");
      } else {
        this.mapPreview.setMapTypeId("satellite");
      }
    },
    generateLandPolygon() {
      let landCoordinates = [];

      //Iterate trough the coordinates
      var coords = this.selectedLand.coords;
      while (coords.length > 0) {
        var singleCoord = coords.substring(
          coords.indexOf("(") + 1,
          coords.indexOf(")")
        );

        //Create google coordinates
        landCoordinates.push(
          new google.maps.LatLng(
            singleCoord.split(", ")[0],
            singleCoord.split(", ")[1]
          )
        );
        coords = coords.substring(coords.indexOf(")") + 1);
      }

      var bluePolygonColor = require("../properties").bluePolygonColor;

      var polygonOptions = {
        path: landCoordinates,
        strokeColor: bluePolygonColor,
        fillColor: bluePolygonColor
      };
      var polygon = new google.maps.Polygon(polygonOptions);
      polygon.setMap(this.mapPreview);
    },
    showDeleteDialog(land) {
      this.selectedLand = land;
      this.deleteDialogVisibility = true;
    },
    deleteLandClick() {
      if (!this.selectedLand) {
        return;
      }

      this.deleteLand(this.selectedLand).then(res => {
        if (res.data.success) {
          //Remove land from table
          this.userLands = this.userLands.filter(
            land => land != this.selectedLand
          );
          //Remove land from total lands
          this.totalLands = this.totalLands.filter(
            land => land._id != this.selectedLand._id
          );

          this.selectedLand = null;
          eventBus.$emit("generateGrowl", {
            msg: this.$t(res.data.msg),
            type: "success"
          });
        }
      });
    },
    getUserLands() {
      this.getCurrentUserLands().then(res => {
        if (res.data.success) {
          this.totalLands = res.data.result;
          this.userLands = JSON.parse(JSON.stringify(this.totalLands)); //Deep clone

          //Get district name from district code
          this.getDistrictNames();
          //Get county name from county code
          this.getCountysNames();
        }
      });
    },
    getDistrictNames() {
      var geojsonDistricts = require("../properties").geojsonDistricts;
      this.userLands.forEach(land => {
        for (let i = 0; i < geojsonDistricts.features.length; i++) {
          var district = geojsonDistricts.features[i];

          if (district.properties.id == land.districtCode) {
            land.districtName = district.properties.name;
            break;
          }
        }
      });
    },
    getCountysNames() {
      var countysCoords = require("../properties").countysCoords;

      this.userLands.forEach(land => {
        for (let i = 0; i < countysCoords.length; i++) {
          var district = countysCoords[i];

          //Get district
          if (district.properties.districtID == land.districtCode) {
            //Get county
            for (let j = 0; j < district.features.length; j++) {
              var county = district.features[j];
              if (county.properties.code == land.countyCode) {
                land.countyName = county.properties.name;
                break;
              }
            }
            break;
          }
        }
      });
    },
    pickedDistrictChanged(district) {
      if (!district) return;

      this.resetLands();
      this.userLands = this.userLands.filter(function(land) {
        return land.districtCode == district.districtCode;
      });
    },
    pickedCountyChanged(county) {
      if (!county) return;

      this.resetLands();
      this.userLands = this.userLands.filter(function(land) {
        return land.countyCode == county.countyCode;
      });
    },
    resetLands() {
      this.userLands = this.totalLands;
      //Get district name from district code
      this.getDistrictNames();
      //Get county name from county code
      this.getCountysNames();
    },
    getUserIconColor() {
      if (this.user.category == "admin") {
        return "green";
      }
      if (this.user.category == "manager") {
        if (this.user.managingDistrict) {
          return "blue";
        }
        if (this.user.managingCounty) {
          return "purple";
        }
      }
    },
    getUserZoneIndicator() {
      if (this.user.category == "manager") {
        if (this.user.managingDistrict) {
          return this.user.managingDistrict;
        }
        if (this.user.managingCounty) {
          return this.user.managingCounty;
        }
      }
    },
    deleteAccount() {
      if (this.currentUser.email != this.deleteAccountEmailInput) return;

      this.logout();
      this.deleteAccountDialogVisibility = false;
      this.removeCurrentUserAccount(this.deleteUserLands);
    }
  }
};
</script>

<style scoped>
#tableLands v-data-footer__select {
  display: none;
}

.td-overflow {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#divIcon {
  display: flex;
  margin-top: -8px;
}

#mapPreviewEditLand {
  width: 100%;
  min-height: 200px;
}

.map-type-btn {
  position: absolute;
  top: 54%;
  left: 7px;
}

.sidePadding {
  padding-left: 8px;
  padding-right: 8px;
}

.checkbox-delete-user-lands {
  margin-left: 25px;
  margin-bottom: -10px;
  margin-top: -10px;
}

.div-btn-toggle {
  margin-top: 8px;
  margin-top: 8px;
  position: absolute;
  right: 10px;
}
</style>