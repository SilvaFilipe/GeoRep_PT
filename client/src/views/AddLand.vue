<template>
  <div id="addLand">
    <h4>{{ $t('land.addland') }}</h4>
    <p>{{ $t('land.fillfields') }}</p>

    <v-card>
      <v-tabs vertical v-model="activeTab">
        <v-tab>
          <v-icon left>mdi-format-list-bulleted</v-icon>
          {{ $t('label.info') }}
        </v-tab>
        <v-tab>
          <v-icon left>mdi-file-check-outline</v-icon>
          {{ $t('label.validation') }}
        </v-tab>
        <v-tab>
          <v-icon left>mdi-map-marker-multiple</v-icon>
          {{ $t('label.map') }}
        </v-tab>
        <p
          v-if="pickedCounty"
          class="font-weight-light county-name-font"
        >{{pickedCounty.countyName}}</p>
        <v-tab :disabled="!submitTabEnability">
          <v-icon left>mdi-send</v-icon>
          {{ $t('button.submit') }}
        </v-tab>

        <!-- Info tab -->
        <v-tab-item>
          <v-card>
            <v-text-field
              spellcheck="false"
              class="sidePadding"
              maxlength="100"
              v-model="name"
              :label="$t('land.landname')"
            ></v-text-field>
            <v-textarea
              spellcheck="false"
              class="sidePadding"
              maxlength="800"
              auto-grow
              v-model="description"
              :label="$t('land.landdescription')"
            ></v-textarea>
            <v-btn-toggle class="sidePadding" mandatory v-model="isPrivate">
              <v-btn value="0">
                <span class="hidden-sm-and-down">{{ $t('button.public') }}</span>
                <v-icon right>mdi-earth</v-icon>
              </v-btn>
              <v-btn value="1">
                <span class="hidden-sm-and-down">{{ $t('button.private') }}</span>
                <v-icon right>mdi-account-lock-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon style="margin-top: -20px;" color="grey" dark v-on="on">mdi-help-circle</v-icon>
              </template>
              <span>{{ $t('land.public_private_help') }}</span>
            </v-tooltip>
            <div style="display:flex;max-width: 1160px;">
              <FileInput
                id="fileInputImages"
                style="width: 40%;"
                @filesChanged="imageFilesChanged"
                :btnLabel="$t('button.attach_pictures')"
                type="image"
                :maxFilesQtty="20"
              />
              <v-carousel id="carouselImageFiles" v-if="imageFiles.length > 0">
                <v-carousel-item
                  style="height:300px"
                  v-for="(item,i) in imageFiles"
                  :key="i"
                  :src="item.dataUrl"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                ></v-carousel-item>
              </v-carousel>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card style="min-height: 192px;">
            <p class="sidePadding">{{ $t('land.land_validation_info') }}</p>
            <!-- <p class="sidePadding">{{ $t('land.land_validation_info1') }}</p> -->
            <FileInput
              id="fileInputValidation"
              style="width: 40%;"
              @filesChanged="validationFilesChanged"
              :btnLabel="$t('button.attach_files')"
              type="validation"
              :maxFilesQtty="20"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <DistrictsMap
            mapHeight="635"
            v-if="!pickedCounty"
            @pickedCountyChanged="pickedCountyChanged"
          />
          <PickAreaMap
            v-if="pickedCounty"
            v-on:back="pickedCountyChanged(null)"
            :pickedCounty="pickedCounty"
            @landFinished="landCoordsSet"
          />
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td class="table-headers-font">{{ $t('label.name') }}</td>
                    <td>{{ name }}</td>
                    <td class="table-headers-font">{{ $t('label.description') }}</td>
                    <td colspan="3">{{description}}</td>
                  </tr>
                  <tr>
                    <td class="table-headers-font">{{ $t('label.district') }}</td>
                    <td>{{getDistrictName()}}</td>
                    <td class="table-headers-font">{{ $t('label.county') }}</td>
                    <td>{{getCountyName()}}</td>
                    <td class="table-headers-font">{{ $t('label.area') }}</td>
                    <td>
                      {{ landAreaHa}}ha / {{landAreaKm}} km
                      <sup>2</sup>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-card id="mapSubmit" />
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
                  v-on="on"
                  :disabled="!submitTabEnability"
                  @click="submitLand"
                  id="btnSubmitLand"
                  fab
                  x-large
                >
                  <v-icon>mdi-map-plus</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('button.submit_land') }}</span>
            </v-tooltip>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script async defer
src="https://maps.googleapis.com/maps/api/js?key=*GOOGLE_API_KEY*&libraries=drawing">
</script>
<script>
import { eventBus } from "../main";
import { mapActions } from "vuex";
import DistrictsMap from "../components/DistrictsMap";
import PickAreaMap from "../components/PickAreaMap";
import FileInput from "../components/FileInput";
export default {
  components: {
    DistrictsMap,
    PickAreaMap,
    FileInput
  },
  data() {
    return {
      name: "",
      description: "",
      isPrivate: "0",
      pickedCounty: null,
      land: null,
      centerCoords: null,
      landArea: null,
      landAreaKm: null, //Land area in square km
      landAreaHa: null, //Land area in hectares
      countyName: null,
      activeTab: 0,
      map: null,
      imageFiles: [],
      validationFiles: []
    };
  },
  watch: {
    activeTab(newVal) {
      if (newVal == 3) {
        var _this = this;
        //Generate map after one second (so the component can render)
        setTimeout(function() {
          _this.generateSubmitMap(_this.centerCoords);
          _this.generateNewPolygon();
        }, 500);
      }
    }
  },
  computed: {
    submitTabEnability() {
      //Submit enabled if all mandatory data is filled
      return this.name && this.land;
    },
    isMapTypeSatellite() {
      if (this.map && this.map.getMapTypeId()) {
        return "satellite" == this.map.getMapTypeId();
      }
    }
  },
  methods: {
    ...mapActions(["addland", "addfile", "addvalidation"]),
    generateSubmitMap(centerCoords) {
      var mapDiv = document.getElementById("mapSubmit");

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
    generateNewPolygon() {
      var bluePolygonColor = require("../properties").bluePolygonColor;
      var polygonOptions = {
        path: this.land.getPath(),
        strokeColor: bluePolygonColor,
        fillColor: bluePolygonColor
      };
      var polygon = new google.maps.Polygon(polygonOptions);
      polygon.setMap(this.map);
    },
    pickedCountyChanged(county) {
      this.pickedCounty = county;

      //If county is null set land coords to null
      if (!county) {
        this.land = null;
      }
    },
    landCoordsSet(polyline) {
      this.land = polyline;
      var landCoords = this.land
        .getPath()
        .getArray()
        .toString();
      this.centerCoords = landCoords.substring(
        //Saving center coords as the land first coordinate
        landCoords.indexOf("(") + 1,
        landCoords.indexOf(")")
      );
      this.landArea = polyline.computedArea;
      this.landAreaKm = Math.trunc(polyline.computedArea) / 1000000;
      this.landAreaHa = Math.trunc(polyline.computedArea) / 10000;

      //If all data is filled change to submit tab
      if (this.name.length >= 3) {
        this.activeTab = 3;
      } else {
        this.activeTab = 0;
      }
    },
    getDistrictName() {
      var geojsonDistricts = require("../properties").geojsonDistricts;
      for (let i = 0; i < geojsonDistricts.features.length; i++) {
        var district = geojsonDistricts.features[i];
        if (district.properties.id == this.pickedCounty.districtCode) {
          return district.properties.name;
        }
      }
    },
    getCountyName() {
      var countysCoords = require("../properties").countysCoords;
      for (let i = 0; i < countysCoords.length; i++) {
        var district = countysCoords[i];
        //Get district
        if (district.properties.districtID == this.pickedCounty.districtCode) {
          //Get county
          for (let j = 0; j < district.features.length; j++) {
            var county = district.features[j];
            if (county.properties.code == this.pickedCounty.countyCode) {
              return county.properties.name;
            }
          }
        }
      }
    },
    submitLand() {
      let land = {
        name: this.name,
        description: this.description,
        coords: this.land
          .getPath()
          .getArray()
          .toString(),
        districtCode: this.pickedCounty.districtCode,
        countyCode: this.pickedCounty.countyCode,
        area: this.landArea,
        centerCoords: this.centerCoords,
        isPublic: this.isPrivate != "1",
        requiringValidation: this.validationFiles.length > 0
      };

      var _this = this;
      //Add land
      this.addland(land).then(res => {
        //Land is saved
        if (res.data.success) {
          eventBus.$emit("generateGrowl", {
            msg: this.$t(res.data.msg),
            type: "success"
          });
          _this.saveFiles(res.data.id, land.name);
        } else {
          eventBus.$emit("generateGrowl", {
            msg: this.$t(res.data.msg),
            type: "error"
          });
        }
      });
    },
    saveFiles(landId, landName) {
      //Add files to land
      //Join image files and validation files
      var allFiles = this.imageFiles.concat(this.validationFiles);
      var _this = this;
      if (allFiles.length > 0) {
        allFiles.forEach(function(file, i) {
          //Save land info in the files
          file.relatedId = landId;
          file.relatedTable = "land";
          //Save file
          _this.addfile(file).then(res => {
            //When last file is saved create validation record if there are validation files, else redirect to profile page
            if (res.data.success && allFiles.length - 1 == i) {
              if (_this.validationFiles.length > 0) {
                _this.openValidationProcess(landId, landName);
              } else {
                _this.$router.push("/" + _this.$i18n.locale + "/profile");
              }
            }
          });
        });

        return;
      }

      //If there are no files to save, redirect to profile page
      _this.$router.push("/" + _this.$i18n.locale + "/profile");
    },
    openValidationProcess(landId, landName) {
      let validation = {
        state: "initialized",
        landId: landId,
        landName: landName,
        countyCode: this.pickedCounty.countyCode,
        districtCode: this.pickedCounty.districtCode
      };

      var _this = this;
      //Add validation
      this.addvalidation(validation).then(res => {
        //Validation is saved
        if (res.data.success) {
          _this.$router.push("/" + _this.$i18n.locale + "/profile");
        }
      });
    },
    imageFilesChanged(images) {
      this.imageFiles = images;
    },
    validationFilesChanged(files) {
      this.validationFiles = files;
    }
  }
};
</script >

<style scoped>
.county-name-font {
  text-align: center;
  font-size: xx-small;
  margin-bottom: 0px;
  margin-top: -13px;
  color: lightgrey;
}

.table-headers-font {
  font-size: small;
  font-weight: bold;
}

#mapSubmit {
  width: 100%;
  min-height: 400px;
}

#btnSubmitLand {
  float: right;
  margin-top: -9%;
  right: 10px;
}

#carouselImageFiles {
  max-width: 60%;
}

.sidePadding {
  padding-left: 8px;
  padding-right: 8px;
}

.map-type-btn {
  position: absolute;
  top: 105px;
  right: 10px;
}
</style>