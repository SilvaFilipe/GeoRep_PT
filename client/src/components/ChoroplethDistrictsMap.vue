<template>
  <div>
    <v-card id="choroplethDistrictsMap" :min-height="mapHeight">
      <v-btn v-if="mapBackBtnVisibility" class="map-back-btn" @click="backView" large fab>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
  integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
  crossorigin=""></script>
<script>
export default {
  props: ["zoomProp", "centerCoords", "mapSize", "mapHeight", "lands"],
  data() {
    return {
      map: null,
      zoom: null,
      defaultCoords: null,
      mapBackBtnVisibility: false,
      layersStyleIslandsLimits: {
        weight: 2,
        color: "black",
        fillOpacity: 0
      },
      geojson: null,
      geojsonDistrict: null, //countys from currently picked district
      pickedCounty: null,
      pickedDistrict: null,
      countysCoords: null
    };
  },
  mounted() {
    this.zoom = this.zoomProp;

    if (this.centerCoords) {
      this.defaultCoords = this.centerCoords;
    } else {
      this.defaultCoords = require("../properties").defaultDistrictsMapCoords;
    }

    this.generatePortugalMap();

    var geojsonIslandsLimits = require("../properties").geojsonIslandsLimits;
    this.countysCoords = require("../properties").countysCoords;

    geojsonIslandsLimits = L.geoJSON(geojsonIslandsLimits, {
      style: this.layersStyleIslandsLimits
    }).addTo(this.map);
  },
  watch: {
    pickedCounty(newVal) {
      this.$emit("pickedCountyChanged", newVal);
    },
    pickedDistrict(newVal) {
      this.$emit("pickedDistrictChanged", newVal);
    },
    lands(newVal) {
      this.geojson = L.geoJSON(this.geojsonDistricts, {
        style: this.getDistrictColor,
        onEachFeature: this.onEachFeature
      }).addTo(this.map);

      var _this = this;
      setTimeout(function() {
        //Used to refresh map, in case its not loaded yet
        _this.map.invalidateSize();
      }, 50);
    }
  },
  computed: {
    geojsonDistricts() {
      return require("../properties").geojsonDistricts;
    }
  },
  methods: {
    generatePortugalMap() {
      this.map = L.map("choroplethDistrictsMap", {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.1
      }).setView(this.defaultCoords, this.zoom);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
          accessToken: "*MAPBOX_TOKEN*"
        }
      ).addTo(this.map);
      //Disable all zoom options and dragging
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
      this.map.dragging.disable();
    },
    highlightFeature(e) {
      var layer = e.target;
      //Shoow tooltip with layer's name
      layer
        .bindTooltip(layer.feature.properties.name, {
          className: "leaflet-tooltip-country"
        })
        .openTooltip();

      layer.setStyle({
        weight: 5,
        color: "white",
        fillOpacity: 1
      });
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.onClick
      });
    },
    resetHighlight(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 3,
        color: "white",
        fillOpacity: 1
      });
    },
    onClick(e) {
      var layer = e.target;

      if (layer.feature.properties.type == "district") {
        this.pickedDistrict = {
          districtCode: layer.feature.properties.id,
          districtName: layer.feature.properties.name,
          centerCoords: layer.feature.properties.centerCoords
        };

        this.mapBackBtnVisibility = true;
        //Hide available countys
        if (this.geojsonDistrict != null) {
          this.map.removeLayer(this.geojsonDistrict);
          this.geojsonDistrict = null;
        }

        this.map.setView(
          L.latLng(layer.feature.properties.centerCoords),
          this.zoomProp
            ? layer.feature.properties.zoom - (7 - this.zoomProp)
            : layer.feature.properties.zoom
        );

        this.geojsonDistrict = L.geoJSON(
          this.countysCoords.find(
            d => d.properties.districtID == layer.feature.properties.id
          ),
          { style: this.getCountyColor, onEachFeature: this.onEachFeature }
        ).addTo(this.map);
      } else if (layer.feature.properties.type == "county") {
        this.pickedCounty = {
          countyCode: layer.feature.properties.code,
          districtCode: layer.feature.properties.districtID,
          countyName: layer.feature.properties.name,
          centerCoords: layer.feature.properties.coords
        };
      }
    },
    backView() {
      //Go back to initial map view
      this.mapBackBtnVisibility = false;
      this.map.setView(this.defaultCoords, this.zoom);
      this.pickedDistrict = null;

      //Hide available countys
      if (this.geojsonDistrict != null) {
        this.map.removeLayer(this.geojsonDistrict);
        this.geojsonDistrict = null;
      }

      this.$emit("districtsMapBack");
    },
    getDistrictColor(district) {
      //Get district ID
      var districtID = district.properties.id;

      //Get quantity of lands in total lands from the district
      var districtCount = this.lands.filter(
        land => land.districtCode == districtID
      ).length;

      //Calculate percentage
      var percentage = districtCount / this.lands.length;

      var fillColor =
        percentage > 0.8
          ? require("../properties").districtColor80
          : percentage > 0.6
          ? require("../properties").districtColor60
          : percentage > 0.4
          ? require("../properties").districtColor40
          : percentage > 0.2
          ? require("../properties").districtColor20
          : percentage > 0
          ? require("../properties").districtColor0
          : require("../properties").districtColorNull;

      return {
        fillColor: fillColor,
        weight: 3,
        color: "white",
        fillOpacity: 1
      };
    },
    getCountyColor(county) {
      //Get district and county ID
      var districtID = county.properties.districtID;
      var countyID = county.properties.code;

      //Get quantity of lands in total lands from the district and county
      var districtCount = this.lands.filter(
        land => land.districtCode == districtID
      ).length;

      var countyCount = this.lands.filter(land => land.countyCode == countyID)
        .length;

      //Calculate percentage
      var percentage = countyCount / districtCount;

      var fillColor =
        percentage > 0.8
          ? require("../properties").countyColor80
          : percentage > 0.6
          ? require("../properties").countyColor60
          : percentage > 0.4
          ? require("../properties").countyColor40
          : percentage > 0.2
          ? require("../properties").countyColor20
          : percentage > 0
          ? require("../properties").countyColor0
          : require("../properties").countyColorNull;

      return {
        fillColor: fillColor,
        weight: 3,
        color: "white",
        fillOpacity: 1
      };
    }
  }
};
</script>


<style lang="scss" scoped>
.map-back-btn {
  z-index: 401;
  margin: 3%;
}

#choroplethDistrictsMap {
  z-index: 0;
}
</style>