<template>
  <div id="homeDiv" style="height:100%">
    <!-- Guests -->
    <Register v-if="!isLoggedIn" />

    <!-- Logged In -->
    <template v-if="isLoggedIn ">
      <div id="divWrapperMap">
        <v-card id="map"></v-card>
        <v-card
          v-if="currentUser && selectedLand && showLandCardInfo()"
          class="mx-auto card-land-info"
          max-width="344"
        >
          <div
            @click="openLandImagesDialog()"
            style="position:relative"
            :class="{pointerCursor: landImageFiles.length > 0}"
          >
            <v-img :src="imageThumbnail" height="130px"></v-img>
            <div v-show="landImageFiles.length > 1" id="divMoreImages">
              <v-icon id="iconMultipleImages">mdi-image-multiple</v-icon>
            </div>
          </div>
          <v-progress-linear
            style="margin-bottom: -4px;"
            v-show="showProgressBar "
            indeterminate
            color="primary"
          ></v-progress-linear>
          <div style="display:flex;height:35px">
            <v-card-title>{{selectedLand.name}}</v-card-title>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  class="card-land-visibility-icon"
                  v-if="selectedLand.isPublic"
                >mdi-earth</v-icon>
              </template>
              <span>{{ $t('label.public_land') }}</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  class="card-land-visibility-icon"
                  v-if="!selectedLand.isPublic"
                >mdi-account-lock-outline</v-icon>
              </template>
              <span>{{ $t('label.private_land') }}</span>
            </v-tooltip>
          </div>
          <v-card-subtitle>{{selectedLand.userName}}</v-card-subtitle>
          <v-card-actions style="margin-top:-20px">
            <v-btn icon @click="showDetails = !showDetails">
              <v-icon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  v-show="selectedLand.isValidated"
                  style="margin-left: 5px;"
                >mdi-shield-check</v-icon>
              </template>
              <span>{{ $t('label.validated_land') }}</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <div style="margin-right: 10px;">
              <v-btn text icon @click="likeSelectedLand()">
                <v-icon v-show="selectedLandIsLiked" color="blue lighten-2">mdi-thumb-up</v-icon>
                <v-icon v-show="!selectedLandIsLiked" color="grey lighten-2">mdi-thumb-up</v-icon>
              </v-btn>
              <v-card-subtitle style="display:contents">{{selectedLandLikesQuantity}}</v-card-subtitle>
            </div>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="showDetails">
              <v-divider></v-divider>
              <v-card-text
                v-show="selectedLand.description"
                style="padding-bottom: 0;"
              >{{selectedLand.description}}</v-card-text>
              <v-chip x-small class="ma-2 area-chip-margin" color="#a6e1ef57" text-color="#1976d2">
                <td>
                  {{ getLandAreaHa()}}ha / {{getLandAreaKm()}} km
                  <sup>2</sup>
                </td>
              </v-chip>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" text icon class="copy-land-link-btn" @click="copyLandLink()">
                    <v-icon color="grey">mdi-link-variant</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('label.copy_land_link') }}</span>
              </v-tooltip>
            </div>
          </v-expand-transition>
        </v-card>
        <!-- Private land -->
        <v-card
          v-if="currentUser && selectedLand && !showLandCardInfo()"
          class="mx-auto card-land-info"
          max-width="344"
        >
          <v-icon
            style="margin-top: -14px;"
            class="card-land-visibility-icon"
          >mdi-account-lock-outline</v-icon>
          <v-card-title>{{selectedLand.name}}</v-card-title>
          <v-card-subtitle>This land information is private.</v-card-subtitle>
        </v-card>

        <!-- Map button -->
        <v-menu open-on-hover :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn
              x-large
              color="primary"
              class="map-btn"
              fab
              dark
              v-on="on"
              @mouseover="restartMap"
            >
              <v-icon style="margin-left: 23px;" dark>mdi-map-marker-radius</v-icon>
            </v-btn>
          </template>
          <v-card>
            <DistrictsMap
              :key="mapKey"
              id="districtMap"
              mapHeight="350"
              :zoomProp="6"
              :centerCoords="districtsMapCenterCoords"
              @pickedDistrictChanged="pickedDistrictChanged"
              @pickedCountyChanged="pickedCountyChanged"
            />
          </v-card>
        </v-menu>

        <v-text-field
          solo
          spellcheck="false"
          class="geocode-search"
          append-icon="search"
          v-model="geocodeSearchExpression"
        ></v-text-field>

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
              <v-icon v-show="isMapTypeSatellite">mdi-map-marker-path</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('button.change_map_type') }}</span>
        </v-tooltip>
      </div>
    </template>

    <!-- Land images dialog -->
    <v-dialog v-model="landImagesDialogVisibility" max-width="60%">
      <v-card>
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in landImageFiles"
            :key="i"
            :src="item.dataUrl"
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
  </div>
</template>

<script 
src="https://maps.googleapis.com/maps/api/js?key=*GOOGLE_API_KEY*&libraries=drawing">
</script>
<script>
import { eventBus } from "../main";
import DistrictsMap from "../components/DistrictsMap";
import Register from "../components/Register";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DistrictsMap,
    Register
  },
  data() {
    return {
      map: null,
      centerCoords: null,
      lands: null,
      selectedLand: null,
      selectedLandIsLiked: false,
      selectedLandLikesQuantity: null,
      selectedPolygon: null,
      polygons: [], //Array containing all land polygons displayed,
      showDetails: false,
      currentUser: null,
      landImageFiles: [],
      landImagesDialogVisibility: false,
      showProgressBar: false,
      bluePolygonColor: null,
      greenPolygonColor: null,
      zoom: null,
      districtsMapCenterCoords: [39.41667, -9.13333],
      mapKey: 0,
      geocodeSearchExpression: "",
      geocodeSearchTimeout: null
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    imageThumbnail() {
      if (this.landImageFiles.length > 0) {
        return this.landImageFiles[0].dataUrl;
      }
      return require("../properties").defaultThumbnail;
    },
    isMapTypeSatellite() {
      if (this.map && this.map.getMapTypeId()) {
        return "satellite" == this.map.getMapTypeId();
      }

      return false;
    }
  },
  watch: {
    currentUser() {
      //Current user retrieved
      this.centerCoords = require("../properties").homeMapCenterCoords;
      this.greenPolygonColor = require("../properties").greenPolygonColor;
      this.bluePolygonColor = require("../properties").bluePolygonColor;
      this.generateMap();
      this.generatePolygons();
    },
    selectedLand(newVal) {
      if (!this.selectedLand) return;
      //Get land images
      this.getLandImageFiles();
      this.getSelectedLandLikeState();
      this.getSelectedLandLikesQuantity();
    },
    geocodeSearchExpression(newVal) {
      if (!newVal) {
        clearTimeout(this.geocodeSearchTimeout);
        return;
      }

      var inputDelay = require("../properties").geocodeInputDelay;
      //Delay, so the value only changes when the user stops typing for 'inputDelay' ms
      if (this.geocodeSearchTimeout != null) {
        clearTimeout(this.geocodeSearchTimeout);
      }

      var _this = this;
      this.geocodeSearchTimeout = setTimeout(function() {
        this.geocodeSearchTimeout = null;
        var geoData = { expression: newVal };

        _this.getGeocode(geoData).then(res => {
          if ("OK" == res.data.status) {
            var result = res.data.results[0];

            //Check if location is in Portugal
            if (result.formatted_address.endsWith("Portugal")) {
              _this.geocodeExpressionFound(result.geometry.location);
            } else {
              eventBus.$emit("generateGrowl", {
                msg: _this.$t("msg.geocode_no_results"),
                type: "error"
              });
            }
          } else {
            eventBus.$emit("generateGrowl", {
              msg: _this.$t("msg.geocode_no_results"),
              type: "error"
            });
          }
        });
      }, inputDelay);
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      //Check if a land is passed from previous page
      if (this.$router.landToOpen) {
        //Get land to open from previous page
        this.selectedLand = this.$router.landToOpen;
        //Clean param
        this.$router.landToOpen = null;

        this.zoom = this.selectedLand ? 17 : 8;
        this.getCurrentUser();
      }
      //Check if a landId is passed as prop in the URL
      else if (this.$route.query.land) {
        var land = { _id: this.$route.query.land };

        var _this = this;
        this.getLand(land).then(res => {
          console.log(res);

          if (res.data.success) {
            _this.selectedLand = res.data.result;
            _this.zoom = _this.selectedLand ? 17 : 8;
            _this.getCurrentUser();
          } else {
            _this.zoom = _this.selectedLand ? 17 : 8;
            _this.getCurrentUser();

            eventBus.$emit("generateGrowl", {
              msg: this.$t("msg.land_link_fail"),
              type: "error"
            });
          }
        });
      } else {
        this.zoom = this.selectedLand ? 17 : 8;
        this.getCurrentUser();
      }
    }
  },
  methods: {
    ...mapActions([
      "register",
      "login",
      "getAllLands",
      "getProfile",
      "getLandImages",
      "likeLand",
      "dislikeLand",
      "getLandLikeState",
      "getLandLikesQuantity",
      "getLand",
      "getGeocode"
    ]),
    restartMap() {
      var _this = this;
      setTimeout(function() {
        _this.mapKey++;
      }, 10);
    },

    getCurrentUser() {
      this.getProfile().then(res => {
        if (res.data.success) {
          this.currentUser = res.data.user;
        }
      });
    },
    generatePolygons() {
      var _this = this;
      this.getAllLands().then(res => {
        if (res.data.success) {
          this.lands = res.data.result;
          var landsCoordinates = [];

          //Insert coordinates of each land in the array
          this.lands.forEach(function(land, i) {
            landsCoordinates[i] = [];

            //Iterate trough the coordinates
            var coords = land.coords;
            while (coords.length > 0) {
              var singleCoord = coords.substring(
                coords.indexOf("(") + 1,
                coords.indexOf(")")
              );

              //Create google coordinates
              landsCoordinates[i].push(
                new google.maps.LatLng(
                  singleCoord.split(", ")[0],
                  singleCoord.split(", ")[1]
                )
              );

              landsCoordinates[i].landId = land._id;

              coords = coords.substring(coords.indexOf(")") + 1);
            }
          });

          //For each land insert a polygon with its path
          landsCoordinates.forEach(land => {
            var polygonOptions = {
              landId: land.landId,
              path: land,
              strokeColor: this.bluePolygonColor,
              fillColor: this.bluePolygonColor
            };

            var polygon = new google.maps.Polygon(polygonOptions);
            this.polygons.push(polygon);

            if (this.selectedLand && land.landId == this.selectedLand._id) {
              //If land is the one that comes from previous page it has a different color
              polygon.setOptions({
                strokeColor: this.greenPolygonColor,
                fillColor: this.greenPolygonColor
              });
              this.selectedPolygon = polygon;
            }

            //Add click event listener to select land
            google.maps.event.addListener(polygon, "click", function(event) {
              _this.selectLand(polygon);
            });
            this.map.addListener("click", function() {
              //When user clicks directly on the map, deselect land
              _this.selectLand(null);
            });
            polygon.setMap(this.map);
          });
        }
      });
    },
    selectLand(polygon) {
      if (polygon == this.selectedPolygon) return; //If user selects polygon that already is selected do nothing

      //Turn all polygons to default color
      this.polygons.forEach(polygon => {
        polygon.setOptions({
          strokeColor: this.bluePolygonColor,
          fillColor: this.bluePolygonColor
        });
      });

      if (!polygon) {
        this.deselectLand();
        return;
      }

      //Turn selected polygon to selected color
      polygon.setOptions({
        strokeColor: this.greenPolygonColor,
        fillColor: this.greenPolygonColor
      });

      //Select land
      this.selectedPolygon = polygon;
      this.selectedLand = this.lands.find(function(land) {
        return land._id == polygon.landId;
      });
    },
    getLandImageFiles() {
      this.showProgressBar = true;
      this.getLandImages(this.selectedLand).then(res => {
        if (res.data.success) {
          this.filterImageFiles(res.data.result);
        }
      });
    },
    getSelectedLandLikeState() {
      var _this = this;
      this.getLandLikeState(this.selectedLand._id).then(res => {
        if (res.data.success) {
          _this.selectedLandIsLiked = res.data.result;
        }
      });
    },
    getSelectedLandLikesQuantity() {
      var _this = this;
      this.getLandLikesQuantity(this.selectedLand._id).then(res => {
        if (res.data.success) {
          _this.selectedLandLikesQuantity = res.data.result;
        }
      });
    },
    filterImageFiles(imageFiles) {
      if (!this.selectedLand) {
        this.showProgressBar = false;
        return;
      }

      this.landImageFiles = [];
      //If the land is private, all the images can be added to the array, since the info card only is displayed to allowed user categories
      if (!this.selectedLand.isPublic) {
        this.landImageFiles = imageFiles;
        this.showProgressBar = false;
        return;
      }

      var _this = this;
      //Show image files according to its visibility
      imageFiles.forEach(image => {
        if (
          image.isPublic ||
          //Land user is current user
          this.selectedLand.userId == this.currentUser._id ||
          //Current user is admin
          this.currentUser.category == "admin" ||
          //User has "manager" category on the land zone
          (this.currentUser.managingDistrict &&
            this.selectedLand.districtCode ==
              this.currentUser.managingDistrict) ||
          (this.currentUser.managingCounty &&
            this.selectedLand.countyCode == this.currentUser.managingCounty)
        ) {
          _this.landImageFiles.push(image);
        }
      });

      this.showProgressBar = false;
    },
    showLandCardInfo() {
      if (!this.selectedLand) return false;
      //If the land is public show info
      if (this.selectedLand.isPublic) return true;
      //Else land is private

      //If land has been added by the user show info
      if (this.selectedLand.userId == this.currentUser._id) return true;

      //If user has "admin" category can see the info of all lands
      if (this.currentUser.category == "admin") return true;

      //If user has "regular" category can't see private lands
      if (this.currentUser.category == "regular") return false;

      //If user has "manager" category can only see the land info if it is in the user zone
      if (
        this.currentUser.managingDistrict &&
        this.selectedLand.districtCode == this.currentUser.managingDistrict
      ) {
        return true;
      }
      if (
        this.currentUser.managingCounty &&
        this.selectedLand.countyCode == this.currentUser.managingCounty
      ) {
        return true;
      }

      return false;
    },
    openLandImagesDialog() {
      if (this.landImageFiles.length > 0) {
        this.landImagesDialogVisibility = true;
      }
    },
    getLandAreaHa() {
      return Math.trunc(this.selectedLand.area) / 10000;
    },
    getLandAreaKm() {
      return Math.trunc(this.selectedLand.area) / 1000000;
    },
    copyLandLink() {
      //Get the URL until the 3rd ocurrence of '/'
      var tokens = window.location.href.split("/").slice(0, 3);
      var linkToCopy = tokens.join("/");
      linkToCopy += "/" + this.$i18n.locale + "?land=" + this.selectedLand._id;

      //Copy link to clipboard
      var aux = document.createElement("input");
      aux.setAttribute("value", linkToCopy);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);

      eventBus.$emit("generateGrowl", {
        msg: this.$t("msg.land_link_copied"),
        type: "success"
      });
    },
    generateMap() {
      if (this.selectedLand) {
        this.centerCoords = this.selectedLand.centerCoords;
      }

      var mapDiv = document.getElementById("map");

      var options = require("../properties").googleMapOptions;
      options.zoom = this.zoom;
      options.center = {
        lat: parseFloat(this.centerCoords.split(", ")[0]),
        lng: parseFloat(this.centerCoords.split(", ")[1])
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
    deselectLand() {
      this.selectedPolygon = null;
      this.selectedLand = null;
      this.selectedLandIsLiked = false;
      this.selectedLandLikesQuantity = null;
    },
    pickedDistrictChanged(district) {
      if (!district) return;
      this.deselectLand();

      this.map.setZoom(9);

      var center = {
        lat: parseFloat(district.realCenterCoords[0]),
        lng: parseFloat(district.realCenterCoords[1])
      };
      this.map.setCenter(center);
    },
    pickedCountyChanged(county) {
      if (!county) return;
      this.map.setZoom(15);

      var center = {
        lat: parseFloat(county.centerCoords.split(", ")[0]),
        lng: parseFloat(county.centerCoords.split(", ")[1])
      };
      this.map.setCenter(center);
    },
    geocodeExpressionFound(coords) {
      if (!coords) return;
      this.map.setZoom(15);

      var center = {
        lat: coords.lat,
        lng: coords.lng
      };
      this.map.setCenter(center);
    },
    likeSelectedLand() {
      var _this = this;
      if (this.selectedLandIsLiked) {
        this.dislikeLand(this.selectedLand._id).then(res => {
          if (res.data.success) {
            _this.selectedLandIsLiked = false;
            _this.selectedLandLikesQuantity--;
          }
        });
      } else {
        this.likeLand(this.selectedLand._id).then(res => {
          if (res.data.success) {
            _this.selectedLandIsLiked = true;
            _this.selectedLandLikesQuantity++;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
}

#divWrapperMap {
  position: relative;
  height: 100%;
}

.card-land-info {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 99;
}

.card-land-visibility-icon {
  float: right;
  margin-left: auto;
  padding-right: 12px;
  padding-top: 35px;
}

#divMoreImages {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  height: 130px;
  width: 30%;
  color: #fff;
  bottom: 0px;
  z-index: 1;
  margin-left: 70%;
  display: grid;
}

#iconMultipleImages {
  color: white;
  font-size: 45px;
  opacity: 0.75;
}

.pointerCursor {
  cursor: pointer;
}

#districtMap {
  min-height: 300px;
  width: 300px;
}

.map-btn {
  margin-top: 25%;
  margin-left: -29px;
}

.map-type-btn {
  position: absolute;
  top: 8px;
  right: 10px;
}

.geocode-search {
  position: absolute;
  top: 95px;
  right: 12px;
  background-color: white;
  height: 1%;
}

.copy-land-link-btn {
  float: right;
  margin-right: 5px;
}

.area-chip-margin.v-chip {
  margin-top: 10px !important;
}
</style>