<template>
  <div id="divWrapperMap">
    <v-card id="map" />
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

    <v-text-field
      solo
      spellcheck="false"
      class="geocode-search"
      append-icon="search"
      v-model="geocodeSearchExpression"
    ></v-text-field>

    <div id="mapBtns" key="end" :class="`d-flex justify-end mb-6`" flat tile>
      <v-col>
        <div class="pa-2" tile>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="confirmBack" fab x-large>
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.back') }}</span>
          </v-tooltip>
        </div>
        <div class="pa-2" tile>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                fab
                x-large
                @click="undoLastSpot"
                color="primary"
                :disabled="!undoLastSpotEnability"
              >
                <v-icon>mdi-undo-variant</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.undo') }}</span>
          </v-tooltip>
        </div>
        <div class="pa-2" tile>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" fab @click="redoMove" color="primary" :disabled="!redoMoveEnability">
                <v-icon>mdi-redo-variant</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.redo') }}</span>
          </v-tooltip>
        </div>
        <div class="pa-2" tile>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                fab
                x-large
                @click="setLand"
                color="green"
                :disabled="!setLandEnability"
              >
                <v-icon color="white">mdi-map-check</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('button.end_land') }}</span>
          </v-tooltip>
        </div>
        <!-- TODO fix holes <div class="pa-2" tile>
          <v-btn  fab x-large @click="makeHoleInLand" v-if="makeHoleEnability">Hole</v-btn>
        </div>
        <div class="pa-2" tile>
          <v-btn
            
            fab
            x-large
            @click="finishHoleInLand"
            :disabled="makeHoleEnability"
          >Finish hole</v-btn>
        </div>-->
        <!-- <div class="pa-2" tile>
          <v-btn  fab x-large @click="finish">Finish land</v-btn>
        </div>-->
      </v-col>
    </div>

    <!-- Return confirmation dialog -->
    <v-dialog v-model="returnDialog" max-width="480">
      <v-card>
        <v-card-title class="headline">{{ $t('land.confirm_return') }}</v-card-title>
        <v-card-text>{{ $t('land.sub_confirm_return') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="returnDialog = false">{{ $t('button.cancel') }}</v-btn>
          <v-btn text @click="returnDialog = false;back()">{{ $t('button.return') }}</v-btn>
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
export default {
  props: ["pickedCounty"],
  data() {
    return {
      map: null,
      userPolyline: null,
      pathsQuantity: 0,
      userPolylinePathsArray: [],
      mapWasClicked: false, //variavel que verifica se o ponto adicionado já foi contado, para nao entrar no listener de inserção de inner points
      maxDistance: null, //Max distance allowed from first spot in meters
      undonePathsArray: [], //Array with paths that were undone, in case of redo
      polygonsPathsArray: [], //Array that includes all polygons, first is the main area, remaining are holes
      landSet: false, //variavel que indica se area ja foi definida, para listener de holes
      geodata: "", //variavel para verificar localizacao do ultimo ponto
      userPolygonFinal: null,
      marker: null,
      redoMoveEnability: false,
      makeHoleEnability: false,
      returnDialog: false,
      outerPolygon: null,
      geocodeSearchExpression: "",
      geocodeSearchTimeout: null,
      pickedDistrictName: null
    };
  },
  mounted() {
    var countysCoords = require("../properties").countysCoords;
    var districtData = countysCoords.find(
      d => d.properties.districtID == this.pickedCounty.districtCode
    ).features;

    var centerCoords = districtData.find(
      d => d.properties.code == this.pickedCounty.countyCode
    ).properties.coords;

    //Get county coordinates to make hole in outer polygon
    var countyCoords = districtData.find(
      d => d.properties.code == this.pickedCounty.countyCode
    ).geometry.coordinates[0];

    var geojsonDistricts = require("../properties").geojsonDistricts;
    this.pickedDistrictName = geojsonDistricts.features.find(
      d => d.properties.id == this.pickedCounty.districtCode
    ).properties.name;

    this.generateMap(centerCoords);
    this.generateOuterPolygon(countyCoords);
    this.generateOtherPolygons();
    this.generateUserPolyline();
    this.startKeyboardShorcutsListener();
    this.startClickListener(this.map); //Add new spot when map is clicked
    this.startPathListeners();
    this.startFirstVertexListener();
    this.maxDistance = require("../properties").maxDistance;
  },
  computed: {
    undoLastSpotEnability() {
      return this.pathsQuantity > 0;
    },
    setLandEnability() {
      return this.pathsQuantity >= 3;
    },
    isMapTypeSatellite() {
      if (this.map && this.map.getMapTypeId()) {
        return "satellite" == this.map.getMapTypeId();
      }
    }
  },
  watch: {
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

            //Check if location is in the picked district
            //The district name is always the antepenultimate or penultimate element in 'address_components'
            var apAdressComponent =
              result.address_components[result.address_components.length - 3]
                .long_name; //antepenultimate
            var pnAdressComponent =
              result.address_components[result.address_components.length - 2]
                .long_name; //penultimate

            if (
              apAdressComponent == _this.pickedDistrictName ||
              pnAdressComponent == _this.pickedDistrictName
            ) {
              _this.geocodeExpressionFound(result.geometry.location);
            } else {
              eventBus.$emit("generateGrowl", {
                msg:
                  _this.$t("msg.geocode_no_results_district") +
                  _this.pickedDistrictName +
                  ".",
                type: "error"
              });
            }
          } else {
            eventBus.$emit("generateGrowl", {
              msg:
                _this.$t("msg.geocode_no_results_district") +
                _this.pickedDistrictName +
                ".",
              type: "error"
            });
          }
        });
      }, inputDelay);
    }
  },
  methods: {
    ...mapActions(["getAllLands", "getGeocode"]),

    generateMap(centerCoords) {
      var mapDiv = document.getElementById("map");

      var options = require("../properties").googleMapOptions;
      options.zoom = 17;
      options.center = {
        lat: parseFloat(centerCoords.split(", ")[0]),
        lng: parseFloat(centerCoords.split(", ")[1])
      };

      this.map = new google.maps.Map(mapDiv, options);
      this.map.setOptions({ draggableCursor: "crosshair" });
    },
    changeMapType() {
      if (this.isMapTypeSatellite) {
        this.map.setMapTypeId("roadmap");
      } else {
        this.map.setMapTypeId("satellite");
      }
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
    startKeyboardShorcutsListener() {
      document.addEventListener("keydown", event => {
        //ctrl+z
        if (
          event.keyCode == 90 &&
          event.ctrlKey &&
          this.undoLastSpotEnability
        ) {
          this.undoLastSpot();
        }

        //ctrl+y
        if (event.keyCode == 89 && event.ctrlKey && this.redoMoveEnability) {
          this.redoMove();
        }
      });
    },
    generateOuterPolygon(countyCoords) {
      return; //provisory

      var outerPolygonCoordinates = [
        new google.maps.LatLng(-85.1054596961173, -180),
        new google.maps.LatLng(85.1054596961173, -180),
        new google.maps.LatLng(85.1054596961173, 180),
        new google.maps.LatLng(-85.1054596961173, 180),
        new google.maps.LatLng(-85.1054596961173, 0)
      ];

      //Hole coordinates
      var outerPolygonInnerCoordinates = [];
      countyCoords.forEach(coord => {
        outerPolygonInnerCoordinates.push(
          new google.maps.LatLng(coord[1], coord[0])
        );
      });

      var outerPolygonColor = require("../properties").outerPolygonColor;
      var polygonOptions = {
        paths: [outerPolygonCoordinates, outerPolygonInnerCoordinates],
        strokeColor: outerPolygonColor,
        fillColor: outerPolygonColor
      };
      this.outerPolygon = new google.maps.Polygon(polygonOptions);
      this.outerPolygon.setMap(this.map);
    },
    generateOtherPolygons() {
      this.getAllLands().then(res => {
        if (res.data.success) {
          var lands = res.data.result;
          var landsCoordinates = [];

          //Insert coordinates of each land in the array
          lands.forEach(function(land, i) {
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

              coords = coords.substring(coords.indexOf(")") + 1);
            }
          });

          var bluePolygonColor = require("../properties").bluePolygonColor;

          //For each land insert a polygon with its path
          landsCoordinates.forEach(land => {
            var polygonOptions = {
              path: land,
              strokeColor: bluePolygonColor,
              fillColor: bluePolygonColor
            };
            var otherPolygon = new google.maps.Polygon(polygonOptions);
            otherPolygon.setMap(this.map);
          });
        }
      });
    },
    generateUserPolyline() {
      var spots = new google.maps.MVCArray();
      var userPolylineOptions = {
        path: spots,
        editable: true,
        suppressUndo: true
      };
      this.userPolyline = new google.maps.Polyline(userPolylineOptions);
      this.userPolyline.setMap(this.map);
    },
    startClickListener(clickableItem) {
      var _this = this;
      google.maps.event.addListener(clickableItem, "click", function(e) {
        if (_this.landSet) {
          //If land is set do nothing when clicked
          return;
        }

        //variavel para verificar se houve alteracoes na quantidade de paths, para resetar array de redos
        var pathsQuantityTemp = _this.pathsQuantity;

        _this.mapWasClicked = true;

        if (_this.verifyDistance(e)) {
          _this.addSpot(e);
        } else {
          return;
        }

        if (!_this.verifyPathSelfIntersects(_this.userPolyline.getPath())) {
          _this.undoLastSpot();
          return;
        }

        if (!_this.verifyPortugueseTerritory(e.latLng)) {
          _this.undoLastSpot();
          return;
        }

        if (_this.landSet) {
          if (!_this.verifySpotInsidePolygon(e.latLng)) {
            return;
          }
        }

        if (_this.pathsQuantityTemp != _this.pathsQuantity) {
          _this.undonePathsArray = [];
          _this.redoMoveEnability = false;
        }
      });
    },
    startPathListeners() {
      var _this = this;
      //inner spot added
      google.maps.event.addListener(
        this.userPolyline.getPath(),
        "insert_at",
        function(e) {
          if (_this.mapWasClicked) {
            _this.mapWasClicked = false;
            return;
          }
          var pathsQuantityTemp = _this.pathsQuantity;

          _this.addInnerSpot(e);

          if (
            !_this.verifyDistance(_this.getNthSpotCoords(e)) ||
            !_this.verifyPathSelfIntersects(_this.userPolyline.getPath()) ||
            !_this.verifyPortugueseTerritory(_this.getNthSpotCoords(e))
          ) {
            _this.undoLastSpot();
            return;
          }

          if (_this.landSet) {
            if (!_this.verifySpotInsidePolygon(_this.getNthSpotCoords(e))) {
              return;
            }
          }

          if (pathsQuantityTemp != _this.pathsQuantity) {
            _this.undonePathsArray = [];
            _this.redoMoveEnability = false;
          }
        }
      );
      //spot changed position
      google.maps.event.addListener(
        this.userPolyline.getPath(),
        "set_at",
        function(e) {
          var pathsQuantityTemp = _this.pathsQuantity;

          _this.setNewSpotPosition();

          if (!_this.landSet && e == 0) {
            _this.correctMarkerPosition(e);
            //iguala-se 'e' a 1 para a distancia ser verificada em relacao ao segundo ponto
            e = 1;
          }

          if (
            _this.pathsQuantity > 1 &&
            (!_this.verifyDistance(_this.getNthSpotCoords(e)) ||
              !_this.verifyPathSelfIntersects(_this.userPolyline.getPath()) ||
              !_this.verifyPortugueseTerritory(_this.getNthSpotCoords(e)))
          ) {
            //timeout de 1 milisegundo antes de fazer undo para evitar bug de persistent pathline
            setTimeout(function() {
              _this.undoLastSpot();
              return;
            }, 1);
          }

          if (_this.landSet) {
            if (!_this.verifySpotInsidePolygon(_this.getNthSpotCoords(e))) {
              return;
            }
          }

          if (pathsQuantityTemp != _this.pathsQuantity) {
            _this.undonePathsArray = [];
            _this.redoMoveEnability = false;
          }
        }
      );
    },
    startFirstVertexListener() {
      var _this = this;
      //Click on the first vertex
      google.maps.event.addListener(this.userPolyline, "click", function(e) {
        if (e.vertex != 0) {
          return;
        }

        if (_this.userPolyline.getPath().length >= 3) {
          if (_this.landSet) {
            _this.finishHoleInLand();
          } else {
            _this.setLand();
          }
        } else {
          eventBus.$emit("generateGrowl", {
            msg: this.$t("land.insufficient_points"),
            type: "error"
          });
        }
      });
    },
    verifySpotInsidePolygon(spotCoords) {
      if (
        !google.maps.geometry.poly.containsLocation(
          spotCoords,
          this.userPolygonFinal
        )
      ) {
        //timeout de 1 milisegundo antes de fazer undo para evitar bug de persistent pathline
        setTimeout(function() {
          this.undoLastSpot();
        }, 1);
        eventBus.$emit("generateGrowl", {
          msg: this.$t("land.hole_inside_land"),
          type: "error"
        });
        return false;
      }
      return true;
    },
    verifyPathSelfIntersects(path) {
      if (this.pathsQuantity < 4) {
        return true;
      }

      var coordinates = this.googleMaps2JTS(path);
      var geometryFactory = new jsts.geom.GeometryFactory();

      if (geometryFactory.createLineString(coordinates).isSimple()) {
        return true;
      }

      eventBus.$emit("generateGrowl", {
        msg: this.$t("land.land_intersect"),
        type: "error"
      });
      return false;
    },
    verifyDistance(e) {
      if (this.pathsQuantity < 1) {
        return true;
      }

      e.latLng == undefined ? (e.latLng = e) : "";

      var distance = google.maps.geometry.spherical.computeDistanceBetween(
        e.latLng,
        this.getNthSpotCoords(0)
      );

      if (distance < this.maxDistance) {
        return true;
      }

      eventBus.$emit("generateGrowl", {
        msg: this.$t("land.distance_initial_point"),
        type: "error"
      });
      return false;
    },
    verifyPortugueseTerritory(e) {
      return true;
    },
    correctMarkerPosition(e) {
      this.deleteMarker();
      this.generateMarker(this.getNthSpotCoords(0));
    },
    generateMarker(latLng) {
      this.marker = new google.maps.Marker({
        position: { lat: latLng.lat(), lng: latLng.lng() },
        map: this.map,
        icon: "https://i.ibb.co/fXJwvnL/map-pointer.png"
      });
    },
    deleteMarker() {
      this.marker.setMap(null);
    },
    saveLastPath() {
      var pathTempCopy = jQuery.extend(true, {}, this.userPolyline.getPath());
      this.userPolylinePathsArray.push(pathTempCopy);
    },
    getNthSpotCoords(n) {
      var rawCoords = this.userPolyline
        .getPath()
        .getArray()
        [n].toString();
      var spotCoords = new google.maps.LatLng(
        rawCoords.substring(
          rawCoords.lastIndexOf("(") + 1,
          rawCoords.lastIndexOf(",")
        ),
        rawCoords.substring(
          rawCoords.lastIndexOf(" ") + 1,
          rawCoords.lastIndexOf(")")
        )
      );
      return spotCoords;
    },
    addSpot(e) {
      this.pathsQuantity++;

      //adiciona ponto à polyline
      this.userPolyline.getPath().push(e.latLng);

      this.saveLastPath();

      if (this.pathsQuantity == 1) {
        this.generateMarker(e.latLng);
      }
    },
    addInnerSpot(e) {
      this.pathsQuantity++;

      this.saveLastPath();
    },
    setNewSpotPosition() {
      this.pathsQuantity++;
      this.saveLastPath();
    },
    undoLastSpot() {
      if (this.pathsQuantity == 0) {
        return;
      }

      this.pathsQuantity--;

      if (this.userPolylinePathsArray.length > 1) {
        var pathTempCopy = jQuery.extend(
          true,
          {},
          this.userPolylinePathsArray[this.userPolylinePathsArray.length - 2]
        );
        this.userPolyline.setPath(pathTempCopy.getArray());
        this.correctMarkerPosition(0);
      } else {
        this.userPolyline.setPath(new google.maps.MVCArray());
        this.deleteMarker();
      }

      //apaga ultimo path, mas adiciona à lista de possiveis redos
      this.undonePathsArray.push(this.userPolylinePathsArray.pop());

      this.startPathListeners();

      this.redoMoveEnability = true;
    },
    redoMove() {
      var _this = this;
      this.pathsQuantity++;

      var pathTempCopy = jQuery.extend(
        true,
        {},
        _this.undonePathsArray[_this.undonePathsArray.length - 1]
      );
      this.userPolyline.setPath(pathTempCopy.getArray());
      this.correctMarkerPosition(0);

      this.userPolylinePathsArray.push(this.undonePathsArray.pop());

      this.startPathListeners();

      if (this.undonePathsArray.length == 0) {
        this.redoMoveEnability = false;
      }
    },
    setLand() {
      this.landSet = true;
      this.map.setOptions({ draggableCursor: "" }); //Set cursor to default

      this.userPolyline.setMap(null);
      this.marker.setMap(null);
      var pathFinal = jQuery.extend(true, {}, this.userPolyline.getPath());
      this.userPolygonFinal = new google.maps.Polygon({
        path: pathFinal.getArray(),
        strokeColor: "blue"
      });
      this.userPolygonFinal.setMap(this.map);

      this.polygonsPathsArray.push(pathFinal.getArray());

      this.resetPolyline();

      this.makeHoleEnability = true;

      this.finish();
    },
    resetPolyline() {
      this.userPolylinePathsArray = [];
      this.undonePathsArray = [];
      this.pathsQuantity = 0;
    },
    makeHoleInLand() {
      this.makeHoleEnability = false;
      this.userPolygonFinal.setOptions({ fillOpacity: 0 });

      this.generateUserPolyline();

      this.startClickListener(this.userPolygonFinal);
      this.startPathListeners();
      this.startFirstVertexListener();
    },
    finishHoleInLand() {
      this.makeHoleEnability = true;

      this.userPolyline.setMap(null);
      this.marker.setMap(null);

      var pathHoleFinal = jQuery.extend(true, {}, this.userPolyline.getPath());
      this.polygonsPathsArray.push(pathHoleFinal.getArray());

      this.userPolygonFinal = new google.maps.Polygon({
        paths: this.polygonsPathsArray,
        strokeColor: "blue"
      });
      this.userPolygonFinal.setMap(this.map);

      this.resetPolyline();
    },
    finish() {
      //Area in square meters
      this.userPolyline.computedArea = google.maps.geometry.spherical.computeArea(
        this.userPolyline.getPath()
      );

      this.$emit("landFinished", this.userPolyline);
    },
    googleMaps2JTS(path) {
      var coordinates = [];

      for (var i = 0; i < path.getLength(); i++) {
        var spot = new jsts.geom.Coordinate(
          path.getAt(i).lat(),
          path.getAt(i).lng()
        );
        coordinates.push(spot);
      }

      return coordinates;
    },
    confirmBack() {
      if (this.pathsQuantity > 0 || this.landSet) {
        this.returnDialog = true;
        return;
      }

      this.back();
    },
    back() {
      this.$emit("back");
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  min-height: 500px;
}

#divWrapperMap {
  position: relative;
  height: 500px;
}
#mapBtns {
  position: absolute;
  top: -7px;
  left: -5px;
  z-index: 99;
  text-align: center;
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
</style>