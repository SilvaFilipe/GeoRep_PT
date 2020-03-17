<template>
  <div style="display:flex">
    <div>
      <DistrictsMap
        id="districtMap"
        mapHeight="350"
        :zoomProp="6"
        :centerCoords="districtsMapCenterCoords"
        @pickedDistrictChanged="pickedDistrictChanged"
        @pickedCountyChanged="pickedCountyChanged"
        @districtsMapBack="resetValidationsTable"
      />
      <table style="width:100%">
        <tr>
          <td>
            <v-icon
              v-show="showInitialized"
              @click="showInitialized = !showInitialized"
              color="grey"
            >mdi-eye</v-icon>
            <v-icon
              v-show="!showInitialized"
              @click="showInitialized = !showInitialized"
              color="grey"
            >mdi-eye-off</v-icon>
          </td>
          <td>{{ $t('validation.initialized') }}</td>
          <td>
            <v-chip small class="ma-2 chip-quantity">
              <td>{{initializedQuantity}}</td>
            </v-chip>
          </td>
          <td>
            <v-icon
              v-show="showValidated"
              @click="showValidated = !showValidated"
              color="grey"
            >mdi-eye</v-icon>
            <v-icon
              v-show="!showValidated"
              @click="showValidated = !showValidated"
              color="grey"
            >mdi-eye-off</v-icon>
          </td>
          <td>{{ $t('validation.validated') }}</td>
          <td>
            <v-chip small class="ma-2" color="#a6e1ef57" text-color="#1976d2">
              <td>{{validatedQuantity}}</td>
            </v-chip>
          </td>
        </tr>
      </table>
    </div>
    <!-- Validations Table -->
    <v-data-table
      :no-data-text="$t('label.nodata')"
      :key="validations.length"
      style="display: inline-block"
      v-if="validations"
      id="tableValidations"
      :custom-sort="customSort"
      :headers="validationsTableHeaders"
      :items="validations"
      :footer-props="{
        itemsPerPageText:$t('label.rows_per_page'),
        itemsPerPageAllText: $t('label.rows_per_page_all')}"
    >
      <template v-slot:item.state="{ item }">
        <v-chip class="ma-2" :color="getStateColor(item.state)">{{getStateName(item.state)}}</v-chip>
      </template>
      <template v-slot:item.requestDate="{ item }">
        <td class="td-style">{{getFormatedDate(item.requestDate)}}</td>
      </template>
      <template v-slot:item.action="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="primary"
              v-if="item.state != 'validated'"
              fab
              x-small
              dark
              outlined
              @click="openValidation(item)"
            >
              <v-icon>mdi-file-document-box-search-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('button.open_validation') }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="validationDialog" max-width="80%">
      <v-card>
        <v-card-title class="headline">{{ $t('land.land_validation') }}</v-card-title>
        <v-card-text v-if="selectedLand">{{ $t('land.check_land_details') }}</v-card-text>
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
                  <td>{{selectedValidation.districtName}}</td>
                  <td class="table-headers-font">{{ $t('label.county') }}</td>
                  <td>{{selectedValidation.countyName}}</td>
                  <td class="table-headers-font">{{ $t('label.area') }}</td>
                  <td>
                    {{ getLandAreaHa()}}ha / {{getLandAreaKm()}} km
                    <sup>2</sup>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
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
            <div style=" width:auto; height:250px;overflow:hidden;">
              <v-card id="mapPreview" />
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

        <v-data-table
          :no-data-text="$t('label.nodata')"
          style="width:50%"
          v-if="selectedLandValidationFiles.length > 0"
          hide-default-footer
          dense
          hide-default-header
          :headers="validationFilesTableHeaders"
          :items="selectedLandValidationFiles"
          item-key="name"
          class="elevation-1"
        >
          <template v-slot:item.name="{ item }">
            <div style="display:initial">
              <td class="td-style" id="tdItemRow">{{item.name}}</td>

              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    @click="downloadFile(item)"
                    class="tdRowIcon pointerCursor downloadIcon"
                  >mdi-download</v-icon>
                </template>
                <span>{{ $t('label.download_file') }}</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
        <v-btn
          v-if="selectedLandValidationFiles.length > 1"
          style="width:50%"
          depressed
          small
          color="primary"
          @click="downloadAll()"
        >
          <v-icon>mdi-download</v-icon>
          {{ $t('button.downloadall') }}
        </v-btn>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="validationDialog = false"
            color="error"
          >{{ $t('button.cancel_validation') }}</v-btn>
          <v-btn @click="validateChosenLand()" color="success">{{ $t('button.validate_land') }}</v-btn>
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
import { mapActions } from "vuex";
import DistrictsMap from "../components/DistrictsMap";
export default {
  components: {
    DistrictsMap
  },
  data() {
    return {
      validationFilesTableHeaders: [
        {
          text: "",
          align: "left",
          value: "name",
          sortable: false
        }
      ],
      validationDialog: false,
      validations: null,
      initializedValidations: null,
      finishedValidations: null,
      totalValidations: [],
      currentUser: null,
      districtsMapCenterCoords: [39.41667, -9.13333],
      selectedLandValidationFiles: [],
      selectedLandImageFiles: [],
      selectedLand: null,
      selectedValidation: null,
      showProgressBar: false,
      map: null,
      showValidated: false,
      showInitialized: true
    };
  },
  computed: {
    initializedQuantity() {
      return this.totalValidations.filter(val => val.state == "initialized")
        .length;
    },
    validatedQuantity() {
      return this.totalValidations.filter(val => val.state == "validated")
        .length;
    },
    validationsTableHeaders() {
      return [
        { text: this.$t("label.state"), value: "state", width: "1px" },
        { text: this.$t("label.land"), value: "landName" },
        { text: this.$t("label.district"), value: "districtName" },
        { text: this.$t("label.county"), value: "countyName" },
        { text: this.$t("label.request"), value: "requestDate" },
        { text: "", value: "action", sortable: false }
      ];
    },
    isMapTypeSatellite() {
      if (this.map && this.map.getMapTypeId()) {
        return "satellite" == this.map.getMapTypeId();
      }
    },
    isUserAdminOrManager() {
      return (
        this.currentUser &&
        (this.currentUser.category == "admin" ||
          this.currentUser.category == "manager")
      );
    }
  },
  watch: {
    validationDialog(newVal) {
      //Reset arrays when validation dialog is closed
      if (!newVal) {
        this.selectedLandValidationFiles = [];
        this.selectedLandImageFiles = [];
        this.selectedLand = null;
        this.selectedValidation = null;
      }
    },
    currentUser() {
      //Current user retrieved
      this.getValidations();
    },
    totalValidations() {
      //Get district name from district code
      this.getDistrictNames();
      //Get county name from county code
      this.getCountysNames();
      //Total validations retrieved
      this.validations = JSON.parse(JSON.stringify(this.totalValidations)); //Deep clone
      this.resetValidationsTable();
    },
    showInitialized(newVal) {
      if (newVal) {
        //Add initialized validations to validations table
        this.validations = this.validations.concat(this.initializedValidations);
        return;
      }
      //Remove initialized validations from validations table
      this.validations = this.validations.filter(
        validation => validation.state != "initialized"
      );
    },
    showValidated(newVal) {
      if (newVal) {
        //Add finished validations to validations table
        this.validations = this.validations.concat(this.finishedValidations);
        return;
      }
      //Remove finished validations from validations table
      this.validations = this.validations.filter(
        validation => validation.state != "validated"
      );
    }
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    ...mapActions([
      "getAllValidations",
      "getProfile",
      "getAllLandFiles",
      "getLand",
      "validateLand"
    ]),

    getValidations() {
      //If user is not an admin or a manager don't retrieve validations
      if (!this.isUserAdminOrManager) {
        return;
      }

      this.getAllValidations().then(res => {
        if (res.data.success) {
          this.totalValidations = res.data.result;
        }
      });
    },
    getCurrentUser() {
      this.getProfile().then(res => {
        if (res.data.success) {
          this.currentUser = res.data.user;

          if (!this.isUserAdminOrManager)
            this.$router.push("/" + this.$i18n.locale + "/profile");  //Go to profile view
        }
      });
    },
    pickedDistrictChanged(district) {
      if (!district) {
        return;
      }
      this.resetValidationsTable();
      this.validations = this.validations.filter(function(validation) {
        return validation.districtCode == district.districtCode;
      });
    },
    pickedCountyChanged(county) {
      if (!county) {
        return;
      }
      this.resetValidationsTable();
      this.validations = this.validations.filter(function(validation) {
        return validation.countyCode == county.countyCode;
      });
    },
    resetValidationsTable() {
      this.validations = this.filterValidationsByCategory();
      this.filterValidationsByState();
    },
    filterValidationsByCategory() {
      if (!this.currentUser) return;
      var totalValidations = JSON.parse(JSON.stringify(this.totalValidations)); //Deep clone;

      //Used to filter validations depending on the category of the user
      if (this.currentUser.category == "admin") {
        return totalValidations;
      }

      var validations = [];

      for (let i = 0; i < totalValidations.length; i++) {
        var validation = totalValidations[i];

        //Check if validation area is according to current user if manager
        if (this.currentUser.category != "manager") {
          continue;
        } else if (
          validation.districtCode == this.currentUser.managingDistrict
        ) {
          validations.push(validation);
        } else if (validation.countyCode == this.currentUser.managingCounty) {
          validations.push(validation);
        }
      }

      return validations;
    },
    filterValidationsByState() {
      this.initializedValidations = [];
      this.finishedValidations = [];

      if (!this.currentUser) return;

      //Used to filter validations depending on its state
      for (let i = 0; i < this.validations.length; i++) {
        var validation = this.validations[i];

        switch (validation.state) {
          case "initialized":
            this.initializedValidations.push(validation);

            if (!this.showInitialized) {
              //Remove validation from validations list
              this.validations.splice(i, 1);
              i--;
            }
            break;
          case "validated":
            this.finishedValidations.push(validation);

            if (!this.showValidated) {
              //Remove validation from validations list
              this.validations.splice(i, 1);
              i--;
            }
            break;
        }
      }
    },
    getDistrictNames() {
      var geojsonDistricts = require("../properties").geojsonDistricts;
      this.totalValidations.forEach(validation => {
        for (let i = 0; i < geojsonDistricts.features.length; i++) {
          var district = geojsonDistricts.features[i];
          if (district.properties.id == validation.districtCode) {
            validation.districtName = district.properties.name;
            break;
          }
        }
      });
    },
    getCountysNames() {
      var countysCoords = require("../properties").countysCoords;
      this.totalValidations.forEach(validation => {
        for (let i = 0; i < countysCoords.length; i++) {
          var district = countysCoords[i];
          //Get district
          if (district.properties.districtID == validation.districtCode) {
            //Get county
            for (let j = 0; j < district.features.length; j++) {
              var county = district.features[j];
              if (county.properties.code == validation.countyCode) {
                validation.countyName = county.properties.name;
                break;
              }
            }
            break;
          }
        }
      });
    },
    getFormatedDate(date) {
      return date.substring(0, 10);
    },
    getStateName(state) {
      switch (state) {
        case "initialized":
          return this.$t("validation.initialized");
        case "validated":
          return this.$t("validation.validated");
      }
    },
    getStateColor(state) {
      switch (state) {
        case "initialized":
          return "primary";
        case "validated":
          return "success";
      }
    },
    openValidation(validation) {
      this.selectedValidation = validation;
      this.validationDialog = true;

      //Get validation files from land
      var land = { _id: validation.landId };
      this.showProgressBar = true;

      //Get land related files
      this.getAllLandFiles(land).then(res => {
        if (res.data.success) {
          this.arrangeFiles(res.data.result);
        }
      });

      //Get land
      this.getLand(land).then(res => {
        if (res.data.success) {
          this.selectedLand = res.data.result;
          this.generateSubmitMap(this.selectedLand.centerCoords);
          this.generateLandPolygon();
        }
      });
    },
    arrangeFiles(files) {
      this.selectedLandValidationFiles = [];
      this.selectedLandImageFiles = [];

      //Separate image files from validation files
      files.forEach(file => {
        if (file.type == "validation") {
          this.selectedLandValidationFiles.push(file);
        } else {
          this.selectedLandImageFiles.push(file);
        }
      });
      this.showProgressBar = false;
    },
    downloadAll() {
      //Download all validation files
      this.selectedLandValidationFiles.forEach(file => {
        this.downloadFile(file);
      });
    },
    downloadFile(file) {
      //Create temporary download link and click it
      var link = document.createElement("a");
      link.download = file.name;
      link.href = file.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    getLandAreaHa() {
      return Math.trunc(this.selectedLand.area) / 10000;
    },
    getLandAreaKm() {
      return Math.trunc(this.selectedLand.area) / 1000000;
    },
    generateSubmitMap(centerCoords) {
      var mapDiv = document.getElementById("mapPreview");

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
    validateChosenLand() {
      var _this = this;
      this.validateLand(this.selectedValidation).then(res => {
        if (res.data.success) {
          _this.validationDialog = false;
          _this.selectedLand = null;
          _this.selectedValidation = null;
          _this.getValidations();

          eventBus.$emit("generateGrowl", {
            msg: this.$t(res.data.msg),
            type: "success"
          });
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
#tdItemRow {
  padding: 0;
  font-size: x-small;
  border: 0;
  height: 17px;
}

.tdRowIcon {
  font-size: 15px;
  margin-left: auto;
  float: right;
  margin-top: 5px;
}

.downloadIcon:hover {
  color: #66a3ff;
}

.pointerCursor {
  cursor: pointer;
}

#districtMap {
  min-height: 300px;
  width: 300px;
}

#tableValidations {
  width: 75%;
}

.td-style {
  display: contents;
}

#mapPreview {
  width: 100%;
  min-height: 250px;
}

.filterOptionsMargins {
  margin-top: 10px;
  margin-left: 15px;
}

.filterOptionsLeftMargin {
  margin-left: 40px;
}

.chip-quantity {
  color: #1976d2;
}

.chip-quantity.v-chip {
  background: #a6e1ef57;
}

.map-type-btn {
  position: absolute;
  top: 105px;
  left: 7px;
}
</style>