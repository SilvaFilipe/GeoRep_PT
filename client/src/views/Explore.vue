<template>
  <div>
    <v-tabs vertical v-model="activeTab">
      <v-tab>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" left>mdi-map</v-icon>
          </template>
          <span>{{ $t('button.lands') }}</span>
        </v-tooltip>
      </v-tab>
      <v-tab v-if="isCurrentUserAdminOrManager">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" left>mdi-account-multiple</v-icon>
          </template>
          <span>{{ $t('button.users') }}</span>
        </v-tooltip>
      </v-tab>
      <v-tab-item>
        <div style="display: flex;">
          <div>
            <DistrictsMap
              id="districtMap"
              mapHeight="350"
              :zoomProp="6"
              :centerCoords="districtsMapCenterCoords"
              @pickedDistrictChanged="pickedDistrictChanged"
              @pickedCountyChanged="pickedCountyChanged"
              @districtsMapBack="resetLandsTable"
            />
            <v-checkbox
              v-model="hideCurrentUserLands"
              :label="$t('label.hide_user_lands')"
              style="margin-bottom: -12px;"
            ></v-checkbox>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <div style="width: 45%;" v-on="on">
                  <v-btn-toggle v-model="btnValidatedVisibility" dense>
                    <v-btn>
                      <v-icon>mdi-shield-off-outline</v-icon>
                    </v-btn>
                    <v-btn>
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </template>
              <span>{{ $t('button.filter_validated') }}</span>
            </v-tooltip>
          </div>
          <!-- Lands Table -->
          <div style="width:100%">
            <v-text-field
              spellcheck="false"
              style="padding-left: 5px;"
              v-model="landSearchWord"
              prepend-icon="search"
              :label="$t('label.land_search')"
              single-line
              hide-details
              clearable
            ></v-text-field>
            <v-data-table
              :search="landSearchWord"
              :no-data-text="$t('label.nodata')"
              :key="lands.length"
              style="display: inline-block"
              v-if="lands"
              id="tableLands"
              :headers="landsTableHeaders"
              :items="lands"
              :custom-sort="customSort"
              :footer-props="{
        itemsPerPageText:$t('label.rows_per_page'),
        itemsPerPageAllText: $t('label.rows_per_page_all')}"
            >
              <template v-slot:item.createDate="{ item }">
                <td class="td-style">{{getLandCreateDate(item)}}</td>
              </template>
              <template v-slot:item.validated="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="item.isValidated">mdi-shield-check</v-icon>
                  </template>
                  <span>{{ $t('label.validated_land') }}</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="!item.isValidated">mdi-shield-off-outline</v-icon>
                  </template>
                  <span>{{ $t('label.non_validated_land') }}</span>
                </v-tooltip>
              </template>
              <template v-if="isCurrentUserAdminOrManager" v-slot:item.visibility="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="item.isPublic">mdi-earth</v-icon>
                  </template>
                  <span>{{ $t('label.public_land') }}</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="!item.isPublic">mdi-account-lock-outline</v-icon>
                  </template>
                  <span>{{ $t('label.private_land') }}</span>
                </v-tooltip>
              </template>
              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      color="primary"
                      fab
                      x-small
                      dark
                      outlined
                      @click="openLandPreview(item)"
                    >
                      <v-icon>mdi-file-document-box-search-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('button.open_land_preview') }}</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      color="primary"
                      fab
                      x-small
                      dark
                      outlined
                      @click="openLand(item)"
                    >
                      <v-icon>mdi-map-search-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('button.open_land') }}</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <!-- Users table -->
        <v-text-field
          spellcheck="false"
          style="padding-left: 5px;"
          v-model="userSearchWord"
          prepend-icon="search"
          :label="$t('label.user_search')"
          single-line
          hide-details
          clearable
        ></v-text-field>
        <v-data-table
          :no-data-text="$t('label.nodata')"
          v-if="users"
          id="tableUsers"
          :headers="usersTableHeaders"
          :items="users"
          :search="userSearchWord"
          :footer-props="{
        itemsPerPageText:$t('label.rows_per_page'),
        itemsPerPageAllText: $t('label.rows_per_page_all')}"
        >
          <template v-slot:item.icon="{ item }">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <td id="tdIcon" v-on="on">
                  <div
                    @click="setUserCategory(item)"
                    class="div-icon"
                    v-bind:class="{ divIconColor: isUserCurrent(item) , pointerCursor:isCurrentUserAdmin && !isUserCurrent(item) }"
                  >
                    <v-icon :color="getUserIconColor(item)">mdi-account</v-icon>
                    <p class="zone-indicator">{{getUserZoneIndicator(item)}}</p>
                  </div>
                </td>
              </template>
              <span>{{getUserIconTooltip(item) }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.landsQuantity="{ item }">
            <td class="td-style">{{getLandsQuantityByUser(item)}}</td>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  color="primary"
                  fab
                  x-small
                  dark
                  outlined
                  @click="filterLandsByUser(item)"
                  :disabled="getLandsQuantityByUser(item) == 0"
                >
                  <v-icon>mdi-map-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('button.user_lands_list') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  v-if="isCurrentUserAdmin"
                  color="error"
                  fab
                  x-small
                  dark
                  outlined
                  @click="deleteAccountClick(item)"
                  :disabled="isUserCurrent(item)"
                >
                  <v-icon>mdi-account-remove</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('button.deleteaccount') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>

    <!-- Return confirmation dialog -->
    <v-dialog v-model="setUserCategoryDialogVisibility" max-width="565">
      <SetUserCategory
        v-if="setUserCategoryDialogVisibility"
        :user="userCategoryEdit"
        @close="closeUserCategoryDialog"
      />
    </v-dialog>

    <!-- Land preview dialog -->
    <v-dialog v-model="landPreviewDialogVisibility" max-width="80%">
      <v-card>
        <v-simple-table v-if="selectedLand">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="table-headers-font">{{ $t('label.name') }}</td>
                <td>{{ selectedLand.name }}</td>
                <td class="table-headers-font">{{ $t('label.description') }}</td>
                <td colspan="3">{{selectedLand.description}}</td>
              </tr>
              <tr>
                <td class="table-headers-font">{{ $t('label.district') }}</td>
                <td>{{getDistrictName()}}</td>
                <td class="table-headers-font">{{ $t('label.county') }}</td>
                <td>{{getCountyName()}}</td>
                <td class="table-headers-font">{{ $t('label.area') }}</td>
                <td>
                  {{ getLandAreaHa()}}ha / {{getLandAreaKm()}} km
                  <sup>2</sup>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div style=" width:auto; height:250px;overflow:hidden;">
          <v-card id="mapLandPreview" />
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

          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="openLand(selectedLand)"
                v-on="on"
                class="open-land-dialog-btn"
                color="primary"
                fab
              >
                <v-icon>mdi-map-search-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.open_land') }}</span>
          </v-tooltip>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete account dialog-->
    <v-dialog v-model="deleteAccountDialogVisibility" max-width="600">
      <v-card v-if="userToDelete">
        <v-card-title class="headline">{{ $t('label.confirm_deleteaccount') }}</v-card-title>
        <v-card-text>{{ $t('label.sub_confirm_deleteaccount') }}</v-card-text>
        <v-text-field
          spellcheck="false"
          style="margin-right: 25px;
    margin-left: 25px;"
          v-model="deleteAccountEmailInput"
          :placeholder="userToDelete.email"
          solo
        ></v-text-field>
        <v-checkbox
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
            :disabled="deleteAccountEmailInput != userToDelete.email"
          >{{ $t('button.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script async defer
src="https://maps.googleapis.com/maps/api/js?key=*GOOGLE_API_KEY*&libraries=drawing">
</script>
<script>
import { mapActions } from "vuex";
import DistrictsMap from "../components/DistrictsMap";
import SetUserCategory from "../components/SetUserCategory";
export default {
  components: {
    DistrictsMap,
    SetUserCategory
  },
  data() {
    return {
      activeTab: 0,
      btnValidatedVisibility: null,
      landPreviewDialogVisibility: false,
      selectedLand: null,
      map: null,
      setUserCategoryDialogVisibility: false,
      userCategoryEdit: null, //User that is opened in the dialog to change category
      currentUser: null,
      districtsMapCenterCoords: [39.41667, -9.13333],
      totalLands: null,
      lands: [],
      landsAddedByCurrentUser: [],
      landsValidated: [],
      landsNotValidated: [],
      users: null,
      hideCurrentUserLands: false,
      landSearchWord: "",
      userSearchWord: "",
      deleteAccountDialogVisibility: false,
      deleteAccountEmailInput: "",
      deleteUserLands: false,
      userToDelete: null
    };
  },
  watch: {
    btnValidatedVisibility() {
      this.filterLandsByInterfaceFilters();
    },
    hideCurrentUserLands() {
      this.filterLandsByInterfaceFilters();
    },
    landPreviewDialogVisibility(newVal) {
      if (!newVal) {
        this.selectedLand = null;
      }
    },
    currentUser() {
      //Current user retrieved
      this.getLands();
      this.getUsers();

      //Hide tabs list if current user is regular
      if (!this.isCurrentUserAdminOrManager) {
        $("div.v-tabs-bar__content").remove();
      }
    },
    totalLands() {
      //Total lands retrieved
      this.lands = this.totalLands;

      //Filter lands to be used in the visibility filters
      this.landsAddedByCurrentUser = this.lands.filter(land => {
        return land.userId == this.currentUser._id;
      });
      this.landsValidated = this.lands.filter(land => {
        return land.isValidated;
      });
      this.landsNotValidated = this.lands.filter(land => {
        return !land.isValidated;
      });

      this.resetLandsTable();
      //Get district name from district code
      this.getDistrictNames();
      //Get county name from county code
      this.getCountysNames();
    }
  },
  computed: {
    isCurrentUserAdminOrManager() {
      if (!this.currentUser) return false;
      return (
        "admin" == this.currentUser.category ||
        "manager" == this.currentUser.category
      );
    },
    isCurrentUserAdmin() {
      if (!this.currentUser) return false;
      return "admin" == this.currentUser.category;
    },
    landsTableHeaders() {
      return [
        {
          text: this.$t("label.name"),
          align: "left",
          value: "name"
        },
        { text: this.$t("label.district"), value: "districtName" },
        { text: this.$t("label.county"), value: "countyName" },
        { text: this.$t("label.date"), value: "createDate" },
        { text: "", value: "validated", sortable: false },
        { text: "", value: "visibility", sortable: false },
        { text: "", value: "action", sortable: false }
      ];
    },
    usersTableHeaders() {
      return [
        {
          text: this.$t("label.category"),
          value: "icon",
          sortable: false,
          width: "1px"
        },
        {
          text: this.$t("label.name"),
          align: "left",
          value: "name"
        },
        { text: this.$t("label.email"), value: "email" },
        { text: this.$t("land.lands_quantity"), value: "landsQuantity" },
        { text: "", value: "action", sortable: false }
      ];
    },
    isMapTypeSatellite() {
      if (this.map && this.map.getMapTypeId()) {
        return "satellite" == this.map.getMapTypeId();
      }
    }
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    ...mapActions([
      "getAllLands",
      "getAllUsers",
      "getProfile",
      "removeUserAccount"
    ]),

    getCurrentUser() {
      this.getProfile().then(res => {
        if (res.data.success) {
          this.currentUser = res.data.user;
        }
      });
    },
    resetLandsTable() {
      this.lands = this.filterLandsByCategory();
      this.filterLandsByInterfaceFilters();
    },
    filterLandsByInterfaceFilters() {
      this.lands = [];

      if (
        this.btnValidatedVisibility == null ||
        this.btnValidatedVisibility == 0
      ) {
        //Add not validated
        this.lands = this.lands.concat(this.landsNotValidated);
      }
      if (
        this.btnValidatedVisibility == null ||
        this.btnValidatedVisibility == 1
      ) {
        //Add validated
        this.lands = this.lands.concat(this.landsValidated);
      }

      if (this.hideCurrentUserLands) {
        //Remove current user lands
        this.lands = this.lands.filter(land => {
          return land.userId != this.currentUser._id;
        });
      }
    },
    openLand(land) {
      //Set param
      this.$router.landToOpen = land;
      //Go to home view
      this.$router.push("/" + this.$i18n.locale);
    },
    openLandPreview(land) {
      this.landPreviewDialogVisibility = true;
      this.selectedLand = land;

      var _this = this;
      setTimeout(function() {
        //Add time delay so the dialog can render
        _this.generateLandPreviewMap(_this.selectedLand.centerCoords);
        _this.generateLandPolygon();
      }, 100);
    },
    generateLandPreviewMap(centerCoords) {
      var mapDiv = document.getElementById("mapLandPreview");

      var options = require("../properties").googleMapOptions;
      options.zoom = 17;
      options.center = {
        lat: parseFloat(centerCoords.split(", ")[0]),
        lng: parseFloat(centerCoords.split(", ")[1])
      };

      this.map = new google.maps.Map(mapDiv, options);
    },
    changeMapType() {
      if (this.isMapTypeSatellite) {
        this.map.setMapTypeId("roadmap");
      } else {
        this.map.setMapTypeId("satellite");
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
      polygon.setMap(this.map);
    },
    getDistrictName() {
      var geojsonDistricts = require("../properties").geojsonDistricts;
      for (let i = 0; i < geojsonDistricts.features.length; i++) {
        var district = geojsonDistricts.features[i];
        if (district.properties.id == this.selectedLand.districtCode) {
          return district.properties.name;
        }
      }
    },
    getCountyName() {
      var countysCoords = require("../properties").countysCoords;
      for (let i = 0; i < countysCoords.length; i++) {
        var district = countysCoords[i];
        //Get district
        if (district.properties.districtID == this.selectedLand.districtCode) {
          //Get county
          for (let j = 0; j < district.features.length; j++) {
            var county = district.features[j];
            if (county.properties.code == this.selectedLand.countyCode) {
              return county.properties.name;
            }
          }
        }
      }
    },
    getLandAreaHa() {
      return Math.trunc(this.selectedLand.area) / 10000;
    },
    getLandAreaKm() {
      return Math.trunc(this.selectedLand.area) / 1000000;
    },
    pickedDistrictChanged(district) {
      if (!district) {
        return;
      }
      this.resetLandsTable();
      this.lands = this.lands.filter(function(land) {
        return land.districtCode == district.districtCode;
      });
    },
    pickedCountyChanged(county) {
      if (!county) {
        return;
      }
      this.resetLandsTable();
      this.lands = this.lands.filter(function(land) {
        return land.countyCode == county.countyCode;
      });
    },

    getLands() {
      this.getAllLands().then(res => {
        if (res.data.success) {
          this.totalLands = res.data.result;
        }
      });
    },

    getUsers() {
      this.getAllUsers().then(res => {
        if (res.data.success) {
          this.users = res.data.result;

          if (this.currentUser && this.currentUser.category == "manager") {
            this.filterUsers();
          }
        }
      });
    },
    filterUsers() {
      //Filter users for the managers, manager only has access to users that have lands in their area
      if (
        (this.currentUser.managingDistrict ||
          this.currentUser.managingCounty) &&
        this.totalLands
      ) {
        var _this = this;
        //Iterate trough users
        this.users = this.users.filter(function(user) {
          if (_this.isUserCurrent(user)) {
            return true;
          }

          //Iterate trough the lands and check if district/county code is the same as the manager and the user
          for (let i = 0; i < _this.totalLands.length; i++) {
            var land = _this.totalLands[i];
            if (
              _this.currentUser.managingDistrict &&
              land.districtCode == _this.currentUser.managingDistrict &&
              land.userId == user._id
            ) {
              return true;
            }
            if (
              _this.currentUser.managingCounty &&
              land.countyCode == _this.currentUser.managingCounty &&
              land.userId == user._id
            ) {
              return true;
            }
          }
        });
      }
    },
    filterLandsByUser(user) {
      this.resetLandsTable();
      this.lands = this.lands.filter(function(land) {
        return land.userId == user._id;
      });
      this.activeTab = 0;
    },
    filterLandsByCategory() {
      if (!this.currentUser) return;

      //(From total lands) Used to filter private lands depending on the category of the user
      if (this.currentUser.category == "admin") {
        return this.totalLands;
      }

      var lands = [];

      for (let i = 0; i < this.totalLands.length; i++) {
        var land = this.totalLands[i];

        //If land is public add to array
        if (land.isPublic) {
          lands.push(land);
        }
        //Else land is private
        //If land was added by the current user add to array
        if (land.userId == this.currentUser._id) {
          lands.push(land);
        }
        //Check if land area is according to current user if manager
        else if (this.currentUser.category != "manager") {
          continue;
        } else if (land.districtCode == this.currentUser.managingDistrict) {
          lands.push(land);
        } else if (land.countyCode == this.currentUser.managingCounty) {
          lands.push(land);
        }
      }

      return lands;
    },
    getDistrictNames() {
      var geojsonDistricts = require("../properties").geojsonDistricts;
      this.totalLands.forEach(land => {
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
      this.totalLands.forEach(land => {
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
    getLandsQuantityByUser(user) {
      var counter = 0;
      for (let i = 0; i < this.totalLands.length; i++) {
        var land = this.totalLands[i];
        if (land.userId == user._id) {
          counter++;
        }
      }

      return counter;
    },
    setUserCategory(user) {
      if (!this.isCurrentUserAdmin || this.isUserCurrent(user)) return;

      this.userCategoryEdit = user;
      this.setUserCategoryDialogVisibility = true;
    },
    closeUserCategoryDialog() {
      this.userCategoryEdit = null;
      this.setUserCategoryDialogVisibility = false;
    },
    getLandCreateDate(land) {
      return land.createDate.substring(0, 10);
    },
    getUserIconColor(user) {
      if (user.category == "admin") {
        return "green";
      }
      if (user.category == "manager") {
        if (user.managingDistrict) {
          return "blue";
        }
        if (user.managingCounty) {
          return "purple";
        }
      }
    },
    getUserIconTooltip(user) {
      if (user.category == "admin") {
        return this.$t("label.admin");
      }
      if (user.category == "manager") {
        if (user.managingDistrict) {
          var geojsonDistricts = require("../properties").geojsonDistricts;
          var userZone = geojsonDistricts.features.find(
            d => d.properties.id == user.managingDistrict
          ).properties.name;

          return `${this.$t("label.district_manager")}: ${userZone}`;
        }
        if (user.managingCounty) {
          var countysCoords = require("../properties").countysCoords;
          var userZone;

          for (let i = 0; i < countysCoords.length; i++) {
            const district = countysCoords[i];

            for (let i = 0; i < district.features.length; i++) {
              const d = district.features[i];
              if (d.properties.code == user.managingCounty) {
                userZone = d.properties.name;
                break;
              }
            }

            if (userZone) break;
          }

          return `${this.$t("label.county_manager")}: ${userZone}`;
        }
      }
      return this.$t("label.regular_user");
    },
    getUserZoneIndicator(user) {
      if (user.category == "manager") {
        if (user.managingDistrict) {
          return user.managingDistrict;
        }
        if (user.managingCounty) {
          return user.managingCounty;
        }
      }
    },
    isUserCurrent(user) {
      return user._id == this.currentUser._id;
    },
    deleteAccountClick(user) {
      this.deleteAccountDialogVisibility = true;
      this.userToDelete = user;
    },
    deleteAccount() {
      if (this.deleteAccountEmailInput != this.userToDelete.email) return;

      this.deleteAccountDialogVisibility = false;

      this.removeUserAccount({
        userId: this.userToDelete._id,
        deleteUserLands: this.deleteUserLands
      }).then(res => {
        if (res.data.success) {
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i]._id == this.userToDelete._id) {
              this.users.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (isDesc[0]) {
          return a[index] + "" < b[index] + "" ? -1 : 1;
        } else {
          return b[index] + "" < a[index] + "" ? -1 : 1;
        }
      });
      return items;
    }
  }
};
</script>

<style scoped>
#districtMap {
  min-height: 300px;
  width: 300px;
}

#tableLands {
  width: 100%;
}

.td-style {
  display: contents;
}

.zone-indicator {
  display: contents;
  font-size: xx-small;
}

.div-icon {
  display: flex;
}

.divIconColor {
  background: #3bcaf536;
  border-radius: 7px;
}

.pointerCursor {
  cursor: pointer;
}

#tdIcon {
  width: 80px;
  border: 0;
}

#mapLandPreview {
  width: 100%;
  min-height: 250px;
}

.map-type-btn {
  position: absolute;
  top: 105px;
  right: 10px;
}

.open-land-dialog-btn {
  position: absolute;
  top: 185px;
  right: 15px;
}

.checkbox-delete-user-lands {
  margin-left: 25px;
  margin-bottom: -10px;
  margin-top: -10px;
}
</style>