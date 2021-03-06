(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3a0e9514"],{1681:function(t,e,a){},"1dc3":function(t,e,a){},4243:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"addLand"}},[a("h4",[t._v(t._s(t.$t("land.addland")))]),a("p",[t._v(t._s(t.$t("land.fillfields")))]),a("v-card",[a("v-tabs",{attrs:{vertical:""},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[a("v-tab",[a("v-icon",{attrs:{left:""}},[t._v("mdi-format-list-bulleted")]),t._v(" "+t._s(t.$t("label.info"))+" ")],1),a("v-tab",[a("v-icon",{attrs:{left:""}},[t._v("mdi-file-check-outline")]),t._v(" "+t._s(t.$t("label.validation"))+" ")],1),a("v-tab",[a("v-icon",{attrs:{left:""}},[t._v("mdi-map-marker-multiple")]),t._v(" "+t._s(t.$t("label.map"))+" ")],1),t.pickedCounty?a("p",{staticClass:"font-weight-light county-name-font"},[t._v(t._s(t.pickedCounty.countyName))]):t._e(),a("v-tab",{attrs:{disabled:!t.submitTabEnability}},[a("v-icon",{attrs:{left:""}},[t._v("mdi-send")]),t._v(" "+t._s(t.$t("button.submit"))+" ")],1),a("v-tab-item",[a("v-card",[a("v-text-field",{staticClass:"sidePadding",attrs:{spellcheck:"false",maxlength:"100",label:t.$t("land.landname")},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}}),a("v-textarea",{staticClass:"sidePadding",attrs:{spellcheck:"false",maxlength:"800","auto-grow":"",label:t.$t("land.landdescription")},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}}),a("v-btn-toggle",{staticClass:"sidePadding",attrs:{mandatory:""},model:{value:t.isPrivate,callback:function(e){t.isPrivate=e},expression:"isPrivate"}},[a("v-btn",{attrs:{value:"0"}},[a("span",{staticClass:"hidden-sm-and-down"},[t._v(t._s(t.$t("button.public")))]),a("v-icon",{attrs:{right:""}},[t._v("mdi-earth")])],1),a("v-btn",{attrs:{value:"1"}},[a("span",{staticClass:"hidden-sm-and-down"},[t._v(t._s(t.$t("button.private")))]),a("v-icon",{attrs:{right:""}},[t._v("mdi-account-lock-outline")])],1)],1),a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-icon",t._g({staticStyle:{"margin-top":"-20px"},attrs:{color:"grey",dark:""}},i),[t._v("mdi-help-circle")])]}}])},[a("span",[t._v(t._s(t.$t("land.public_private_help")))])]),a("div",{staticStyle:{display:"flex","max-width":"1160px"}},[a("FileInput",{staticStyle:{width:"40%"},attrs:{id:"fileInputImages",btnLabel:t.$t("button.attach_pictures"),type:"image",maxFilesQtty:20},on:{filesChanged:t.imageFilesChanged}}),t.imageFiles.length>0?a("v-carousel",{attrs:{id:"carouselImageFiles"}},t._l(t.imageFiles,(function(t,e){return a("v-carousel-item",{key:e,staticStyle:{height:"300px"},attrs:{src:t.dataUrl,"reverse-transition":"fade-transition",transition:"fade-transition"}})})),1):t._e()],1)],1)],1),a("v-tab-item",[a("v-card",{staticStyle:{"min-height":"192px"}},[a("p",{staticClass:"sidePadding"},[t._v(t._s(t.$t("land.land_validation_info")))]),a("FileInput",{staticStyle:{width:"40%"},attrs:{id:"fileInputValidation",btnLabel:t.$t("button.attach_files"),type:"validation",maxFilesQtty:20},on:{filesChanged:t.validationFilesChanged}})],1)],1),a("v-tab-item",[t.pickedCounty?t._e():a("DistrictsMap",{attrs:{mapHeight:"635"},on:{pickedCountyChanged:t.pickedCountyChanged}}),t.pickedCounty?a("PickAreaMap",{attrs:{pickedCounty:t.pickedCounty},on:{back:function(e){return t.pickedCountyChanged(null)},landFinished:t.landCoordsSet}}):t._e()],1),a("v-tab-item",[a("v-card",[a("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[a("tbody",[a("tr",[a("td",{staticClass:"table-headers-font"},[t._v(t._s(t.$t("label.name")))]),a("td",[t._v(t._s(t.name))]),a("td",{staticClass:"table-headers-font"},[t._v(t._s(t.$t("label.description")))]),a("td",{attrs:{colspan:"3"}},[t._v(t._s(t.description))])]),a("tr",[a("td",{staticClass:"table-headers-font"},[t._v(t._s(t.$t("label.district")))]),a("td",[t._v(t._s(t.getDistrictName()))]),a("td",{staticClass:"table-headers-font"},[t._v(t._s(t.$t("label.county")))]),a("td",[t._v(t._s(t.getCountyName()))]),a("td",{staticClass:"table-headers-font"},[t._v(t._s(t.$t("label.area")))]),a("td",[t._v(" "+t._s(t.landAreaHa)+"ha / "+t._s(t.landAreaKm)+" km "),a("sup",[t._v("2")])])])])]},proxy:!0}])}),a("v-card",{attrs:{id:"mapSubmit"}}),a("v-tooltip",{attrs:{left:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({staticClass:"map-type-btn",attrs:{"x-large":"",color:"primary",fab:"",dark:""},on:{click:function(e){return t.changeMapType()}}},i),[a("v-icon",{directives:[{name:"show",rawName:"v-show",value:!t.isMapTypeSatellite,expression:"!isMapTypeSatellite"}],attrs:{color:"#75ce2e"}},[t._v("mdi-earth-box")]),a("v-icon",{directives:[{name:"show",rawName:"v-show",value:t.isMapTypeSatellite,expression:"isMapTypeSatellite"}],attrs:{color:"#f9df9a"}},[t._v("mdi-map-marker-path")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.change_map_type")))])]),a("v-tooltip",{attrs:{left:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({attrs:{disabled:!t.submitTabEnability,id:"btnSubmitLand",fab:"","x-large":""},on:{click:t.submitLand}},i),[a("v-icon",[t._v("mdi-map-plus")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.submit_land")))])])],1)],1)],1)],1)],1)},n=[],s=(a("a4d3"),a("e01a"),a("99af"),a("4de4"),a("4160"),a("c975"),a("d81d"),a("0d03"),a("b0c0"),a("b65f"),a("e439"),a("dbb4"),a("b64b"),a("d3b7"),a("acd8"),a("ac1f"),a("25f0"),a("1276"),a("159b"),a("2fa7")),r=a("56d7"),o=a("2f62"),l=a("bc7e"),c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"divWrapperMap"}},[a("v-card",{attrs:{id:"map"}}),a("v-tooltip",{attrs:{left:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({staticClass:"map-type-btn",attrs:{"x-large":"",color:"primary",fab:"",dark:""},on:{click:function(e){return t.changeMapType()}}},i),[a("v-icon",{directives:[{name:"show",rawName:"v-show",value:!t.isMapTypeSatellite,expression:"!isMapTypeSatellite"}],attrs:{color:"#75ce2e"}},[t._v("mdi-earth-box")]),a("v-icon",{directives:[{name:"show",rawName:"v-show",value:t.isMapTypeSatellite,expression:"isMapTypeSatellite"}]},[t._v("mdi-map-marker-path")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.change_map_type")))])]),a("v-text-field",{staticClass:"geocode-search",attrs:{solo:"",spellcheck:"false","append-icon":"search"},model:{value:t.geocodeSearchExpression,callback:function(e){t.geocodeSearchExpression=e},expression:"geocodeSearchExpression"}}),a("div",{key:"end",class:"d-flex justify-end mb-6",attrs:{id:"mapBtns",flat:"",tile:""}},[a("v-col",[a("div",{staticClass:"pa-2",attrs:{tile:""}},[a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({attrs:{fab:"","x-large":""},on:{click:t.confirmBack}},i),[a("v-icon",[t._v("mdi-arrow-left")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.back")))])])],1),a("div",{staticClass:"pa-2",attrs:{tile:""}},[a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({attrs:{fab:"","x-large":"",color:"primary",disabled:!t.undoLastSpotEnability},on:{click:t.undoLastSpot}},i),[a("v-icon",[t._v("mdi-undo-variant")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.undo")))])])],1),a("div",{staticClass:"pa-2",attrs:{tile:""}},[a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({attrs:{fab:"",color:"primary",disabled:!t.redoMoveEnability},on:{click:t.redoMove}},i),[a("v-icon",[t._v("mdi-redo-variant")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.redo")))])])],1),a("div",{staticClass:"pa-2",attrs:{tile:""}},[a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on;return[a("v-btn",t._g({attrs:{fab:"","x-large":"",color:"green",disabled:!t.setLandEnability},on:{click:t.setLand}},i),[a("v-icon",{attrs:{color:"white"}},[t._v("mdi-map-check")])],1)]}}])},[a("span",[t._v(t._s(t.$t("button.end_land")))])])],1)])],1),a("v-dialog",{attrs:{"max-width":"480"},model:{value:t.returnDialog,callback:function(e){t.returnDialog=e},expression:"returnDialog"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[t._v(t._s(t.$t("land.confirm_return")))]),a("v-card-text",[t._v(t._s(t.$t("land.sub_confirm_return")))]),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{text:""},on:{click:function(e){t.returnDialog=!1}}},[t._v(t._s(t.$t("button.cancel")))]),a("v-btn",{attrs:{text:""},on:{click:function(e){t.returnDialog=!1,t.back()}}},[t._v(t._s(t.$t("button.return")))])],1)],1)],1)],1)},u=[];a("7db0"),a("baa5");function d(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function p(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?d(Object(a),!0).forEach((function(e){Object(s["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var h={props:["pickedCounty"],data:function(){return{map:null,userPolyline:null,pathsQuantity:0,userPolylinePathsArray:[],mapWasClicked:!1,maxDistance:null,undonePathsArray:[],polygonsPathsArray:[],landSet:!1,geodata:"",userPolygonFinal:null,marker:null,redoMoveEnability:!1,makeHoleEnability:!1,returnDialog:!1,outerPolygon:null,geocodeSearchExpression:"",geocodeSearchTimeout:null,pickedDistrictName:null}},mounted:function(){var t=this,e=a("e32c").countysCoords,i=e.find((function(e){return e.properties.districtID==t.pickedCounty.districtCode})).features,n=i.find((function(e){return e.properties.code==t.pickedCounty.countyCode})).properties.coords,s=i.find((function(e){return e.properties.code==t.pickedCounty.countyCode})).geometry.coordinates[0],r=a("e32c").geojsonDistricts;this.pickedDistrictName=r.features.find((function(e){return e.properties.id==t.pickedCounty.districtCode})).properties.name,this.generateMap(n),this.generateOuterPolygon(s),this.generateOtherPolygons(),this.generateUserPolyline(),this.startKeyboardShorcutsListener(),this.startClickListener(this.map),this.startPathListeners(),this.startFirstVertexListener(),this.maxDistance=a("e32c").maxDistance},computed:{undoLastSpotEnability:function(){return this.pathsQuantity>0},setLandEnability:function(){return this.pathsQuantity>=3},isMapTypeSatellite:function(){if(this.map&&this.map.getMapTypeId())return"satellite"==this.map.getMapTypeId()}},watch:{geocodeSearchExpression:function(t){if(t){var e=a("e32c").geocodeInputDelay;null!=this.geocodeSearchTimeout&&clearTimeout(this.geocodeSearchTimeout);var i=this;this.geocodeSearchTimeout=setTimeout((function(){this.geocodeSearchTimeout=null;var e={expression:t};i.getGeocode(e).then((function(t){if("OK"==t.data.status){var e=t.data.results[0],a=e.address_components[e.address_components.length-3].long_name,n=e.address_components[e.address_components.length-2].long_name;a==i.pickedDistrictName||n==i.pickedDistrictName?i.geocodeExpressionFound(e.geometry.location):r["eventBus"].$emit("generateGrowl",{msg:i.$t("msg.geocode_no_results_district")+i.pickedDistrictName+".",type:"error"})}else r["eventBus"].$emit("generateGrowl",{msg:i.$t("msg.geocode_no_results_district")+i.pickedDistrictName+".",type:"error"})}))}),e)}else clearTimeout(this.geocodeSearchTimeout)}},methods:p({},Object(o["b"])(["getAllLands","getGeocode"]),{generateMap:function(t){var e=document.getElementById("map"),i=a("e32c").googleMapOptions;i.zoom=17,i.center={lat:parseFloat(t.split(", ")[0]),lng:parseFloat(t.split(", ")[1])},this.map=new google.maps.Map(e,i),this.map.setOptions({draggableCursor:"crosshair"})},changeMapType:function(){this.isMapTypeSatellite?this.map.setMapTypeId("roadmap"):this.map.setMapTypeId("satellite")},geocodeExpressionFound:function(t){if(t){this.map.setZoom(15);var e={lat:t.lat,lng:t.lng};this.map.setCenter(e)}},startKeyboardShorcutsListener:function(){var t=this;document.addEventListener("keydown",(function(e){90==e.keyCode&&e.ctrlKey&&t.undoLastSpotEnability&&t.undoLastSpot(),89==e.keyCode&&e.ctrlKey&&t.redoMoveEnability&&t.redoMove()}))},generateOuterPolygon:function(t){},generateOtherPolygons:function(){var t=this;this.getAllLands().then((function(e){if(e.data.success){var i=e.data.result,n=[];i.forEach((function(t,e){n[e]=[];var a=t.coords;while(a.length>0){var i=a.substring(a.indexOf("(")+1,a.indexOf(")"));n[e].push(new google.maps.LatLng(i.split(", ")[0],i.split(", ")[1])),a=a.substring(a.indexOf(")")+1)}}));var s=a("e32c").bluePolygonColor;n.forEach((function(e){var a={path:e,strokeColor:s,fillColor:s},i=new google.maps.Polygon(a);i.setMap(t.map)}))}}))},generateUserPolyline:function(){var t=new google.maps.MVCArray,e={path:t,editable:!0,suppressUndo:!0};this.userPolyline=new google.maps.Polyline(e),this.userPolyline.setMap(this.map)},startClickListener:function(t){var e=this;google.maps.event.addListener(t,"click",(function(t){if(!e.landSet){e.pathsQuantity;e.mapWasClicked=!0,e.verifyDistance(t)&&(e.addSpot(t),e.verifyPathSelfIntersects(e.userPolyline.getPath())&&e.verifyPortugueseTerritory(t.latLng)?e.landSet&&!e.verifySpotInsidePolygon(t.latLng)||e.pathsQuantityTemp!=e.pathsQuantity&&(e.undonePathsArray=[],e.redoMoveEnability=!1):e.undoLastSpot())}}))},startPathListeners:function(){var t=this;google.maps.event.addListener(this.userPolyline.getPath(),"insert_at",(function(e){if(t.mapWasClicked)t.mapWasClicked=!1;else{var a=t.pathsQuantity;t.addInnerSpot(e),t.verifyDistance(t.getNthSpotCoords(e))&&t.verifyPathSelfIntersects(t.userPolyline.getPath())&&t.verifyPortugueseTerritory(t.getNthSpotCoords(e))?t.landSet&&!t.verifySpotInsidePolygon(t.getNthSpotCoords(e))||a!=t.pathsQuantity&&(t.undonePathsArray=[],t.redoMoveEnability=!1):t.undoLastSpot()}})),google.maps.event.addListener(this.userPolyline.getPath(),"set_at",(function(e){var a=t.pathsQuantity;t.setNewSpotPosition(),t.landSet||0!=e||(t.correctMarkerPosition(e),e=1),!(t.pathsQuantity>1)||t.verifyDistance(t.getNthSpotCoords(e))&&t.verifyPathSelfIntersects(t.userPolyline.getPath())&&t.verifyPortugueseTerritory(t.getNthSpotCoords(e))||setTimeout((function(){t.undoLastSpot()}),1),t.landSet&&!t.verifySpotInsidePolygon(t.getNthSpotCoords(e))||a!=t.pathsQuantity&&(t.undonePathsArray=[],t.redoMoveEnability=!1)}))},startFirstVertexListener:function(){var t=this;google.maps.event.addListener(this.userPolyline,"click",(function(e){0==e.vertex&&(t.userPolyline.getPath().length>=3?t.landSet?t.finishHoleInLand():t.setLand():r["eventBus"].$emit("generateGrowl",{msg:this.$t("land.insufficient_points"),type:"error"}))}))},verifySpotInsidePolygon:function(t){return!!google.maps.geometry.poly.containsLocation(t,this.userPolygonFinal)||(setTimeout((function(){this.undoLastSpot()}),1),r["eventBus"].$emit("generateGrowl",{msg:this.$t("land.hole_inside_land"),type:"error"}),!1)},verifyPathSelfIntersects:function(t){if(this.pathsQuantity<4)return!0;var e=this.googleMaps2JTS(t),a=new jsts.geom.GeometryFactory;return!!a.createLineString(e).isSimple()||(r["eventBus"].$emit("generateGrowl",{msg:this.$t("land.land_intersect"),type:"error"}),!1)},verifyDistance:function(t){if(this.pathsQuantity<1)return!0;void 0==t.latLng&&(t.latLng=t);var e=google.maps.geometry.spherical.computeDistanceBetween(t.latLng,this.getNthSpotCoords(0));return e<this.maxDistance||(r["eventBus"].$emit("generateGrowl",{msg:this.$t("land.distance_initial_point"),type:"error"}),!1)},verifyPortugueseTerritory:function(t){return!0},correctMarkerPosition:function(t){this.deleteMarker(),this.generateMarker(this.getNthSpotCoords(0))},generateMarker:function(t){this.marker=new google.maps.Marker({position:{lat:t.lat(),lng:t.lng()},map:this.map,icon:"https://i.ibb.co/fXJwvnL/map-pointer.png"})},deleteMarker:function(){this.marker.setMap(null)},saveLastPath:function(){var t=jQuery.extend(!0,{},this.userPolyline.getPath());this.userPolylinePathsArray.push(t)},getNthSpotCoords:function(t){var e=this.userPolyline.getPath().getArray()[t].toString(),a=new google.maps.LatLng(e.substring(e.lastIndexOf("(")+1,e.lastIndexOf(",")),e.substring(e.lastIndexOf(" ")+1,e.lastIndexOf(")")));return a},addSpot:function(t){this.pathsQuantity++,this.userPolyline.getPath().push(t.latLng),this.saveLastPath(),1==this.pathsQuantity&&this.generateMarker(t.latLng)},addInnerSpot:function(t){this.pathsQuantity++,this.saveLastPath()},setNewSpotPosition:function(){this.pathsQuantity++,this.saveLastPath()},undoLastSpot:function(){if(0!=this.pathsQuantity){if(this.pathsQuantity--,this.userPolylinePathsArray.length>1){var t=jQuery.extend(!0,{},this.userPolylinePathsArray[this.userPolylinePathsArray.length-2]);this.userPolyline.setPath(t.getArray()),this.correctMarkerPosition(0)}else this.userPolyline.setPath(new google.maps.MVCArray),this.deleteMarker();this.undonePathsArray.push(this.userPolylinePathsArray.pop()),this.startPathListeners(),this.redoMoveEnability=!0}},redoMove:function(){var t=this;this.pathsQuantity++;var e=jQuery.extend(!0,{},t.undonePathsArray[t.undonePathsArray.length-1]);this.userPolyline.setPath(e.getArray()),this.correctMarkerPosition(0),this.userPolylinePathsArray.push(this.undonePathsArray.pop()),this.startPathListeners(),0==this.undonePathsArray.length&&(this.redoMoveEnability=!1)},setLand:function(){this.landSet=!0,this.map.setOptions({draggableCursor:""}),this.userPolyline.setMap(null),this.marker.setMap(null);var t=jQuery.extend(!0,{},this.userPolyline.getPath());this.userPolygonFinal=new google.maps.Polygon({path:t.getArray(),strokeColor:"blue"}),this.userPolygonFinal.setMap(this.map),this.polygonsPathsArray.push(t.getArray()),this.resetPolyline(),this.makeHoleEnability=!0,this.finish()},resetPolyline:function(){this.userPolylinePathsArray=[],this.undonePathsArray=[],this.pathsQuantity=0},makeHoleInLand:function(){this.makeHoleEnability=!1,this.userPolygonFinal.setOptions({fillOpacity:0}),this.generateUserPolyline(),this.startClickListener(this.userPolygonFinal),this.startPathListeners(),this.startFirstVertexListener()},finishHoleInLand:function(){this.makeHoleEnability=!0,this.userPolyline.setMap(null),this.marker.setMap(null);var t=jQuery.extend(!0,{},this.userPolyline.getPath());this.polygonsPathsArray.push(t.getArray()),this.userPolygonFinal=new google.maps.Polygon({paths:this.polygonsPathsArray,strokeColor:"blue"}),this.userPolygonFinal.setMap(this.map),this.resetPolyline()},finish:function(){this.userPolyline.computedArea=google.maps.geometry.spherical.computeArea(this.userPolyline.getPath()),this.$emit("landFinished",this.userPolyline)},googleMaps2JTS:function(t){for(var e=[],a=0;a<t.getLength();a++){var i=new jsts.geom.Coordinate(t.getAt(a).lat(),t.getAt(a).lng());e.push(i)}return e},confirmBack:function(){this.pathsQuantity>0||this.landSet?this.returnDialog=!0:this.back()},back:function(){this.$emit("back")}})},f=h,g=(a("57b2"),a("2877")),y=a("6544"),v=a.n(y),m=a("8336"),b=a("b0af"),P=a("99d9"),_=(a("caad"),a("13d5"),a("45fc"),a("4ec9"),a("a9e3"),a("3ca3"),a("5319"),a("2ca0"),a("ddb0"),a("4b85"),a("2b0e")),k=a("d9f7"),C=a("80d2");function S(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function w(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?S(Object(a),!0).forEach((function(e){Object(s["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):S(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var O=["sm","md","lg","xl"],x=function(){return O.reduce((function(t,e){return t[e]={type:[Boolean,String,Number],default:!1},t}),{})}(),j=function(){return O.reduce((function(t,e){return t["offset"+Object(C["D"])(e)]={type:[String,Number],default:null},t}),{})}(),M=function(){return O.reduce((function(t,e){return t["order"+Object(C["D"])(e)]={type:[String,Number],default:null},t}),{})}(),T={col:Object.keys(x),offset:Object.keys(j),order:Object.keys(M)};function I(t,e,a){var i=t;if(null!=a&&!1!==a){if(e){var n=e.replace(t,"");i+="-".concat(n)}return"col"!==t||""!==a&&!0!==a?(i+="-".concat(a),i.toLowerCase()):i.toLowerCase()}}var L=new Map,$=_["a"].extend({name:"v-col",functional:!0,props:w({cols:{type:[Boolean,String,Number],default:!1}},x,{offset:{type:[String,Number],default:null}},j,{order:{type:[String,Number],default:null}},M,{alignSelf:{type:String,default:null,validator:function(t){return["auto","start","end","center","baseline","stretch"].includes(t)}},justifySelf:{type:String,default:null,validator:function(t){return["auto","start","end","center","baseline","stretch"].includes(t)}},tag:{type:String,default:"div"}}),render:function(t,e){var a=e.props,i=e.data,n=e.children,r=(e.parent,"");for(var o in a)r+=String(a[o]);var l=L.get(r);return l||function(){var t,e;for(e in l=[],T)T[e].forEach((function(t){var i=a[t],n=I(e,t,i);n&&l.push(n)}));var i=l.some((function(t){return t.startsWith("col-")}));l.push((t={col:!i||!a.cols},Object(s["a"])(t,"col-".concat(a.cols),a.cols),Object(s["a"])(t,"offset-".concat(a.offset),a.offset),Object(s["a"])(t,"order-".concat(a.order),a.order),Object(s["a"])(t,"align-self-".concat(a.alignSelf),a.alignSelf),Object(s["a"])(t,"justify-self-".concat(a.justifySelf),a.justifySelf),t)),L.set(r,l)}(),t(a.tag,Object(k["a"])(i,{class:l}),n)}}),F=a("169a"),A=a("132d"),D=a("2fa4"),E=a("8654"),N=a("3a2f"),V=Object(g["a"])(f,c,u,!1,null,"50ad08ad",null),Q=V.exports;v()(V,{VBtn:m["a"],VCard:b["a"],VCardActions:P["a"],VCardText:P["c"],VCardTitle:P["d"],VCol:$,VDialog:F["a"],VIcon:A["a"],VSpacer:D["a"],VTextField:E["a"],VTooltip:N["a"]});var H=a("b1b6");function B(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function G(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?B(Object(a),!0).forEach((function(e){Object(s["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):B(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var z={components:{DistrictsMap:l["a"],PickAreaMap:Q,FileInput:H["a"]},data:function(){return{name:"",description:"",isPrivate:"0",pickedCounty:null,land:null,centerCoords:null,landArea:null,landAreaKm:null,landAreaHa:null,countyName:null,activeTab:0,map:null,imageFiles:[],validationFiles:[]}},watch:{activeTab:function(t){if(3==t){var e=this;setTimeout((function(){e.generateSubmitMap(e.centerCoords),e.generateNewPolygon()}),500)}}},computed:{submitTabEnability:function(){return this.name&&this.land},isMapTypeSatellite:function(){if(this.map&&this.map.getMapTypeId())return"satellite"==this.map.getMapTypeId()}},methods:G({},Object(o["b"])(["addland","addfile","addvalidation"]),{generateSubmitMap:function(t){var e=document.getElementById("mapSubmit"),i=a("e32c").googleMapOptions;i.zoom=17,i.center={lat:parseFloat(t.split(", ")[0]),lng:parseFloat(t.split(", ")[1])},this.map=new google.maps.Map(e,i)},changeMapType:function(){this.isMapTypeSatellite?this.map.setMapTypeId("roadmap"):this.map.setMapTypeId("satellite")},generateNewPolygon:function(){var t=a("e32c").bluePolygonColor,e={path:this.land.getPath(),strokeColor:t,fillColor:t},i=new google.maps.Polygon(e);i.setMap(this.map)},pickedCountyChanged:function(t){this.pickedCounty=t,t||(this.land=null)},landCoordsSet:function(t){this.land=t;var e=this.land.getPath().getArray().toString();this.centerCoords=e.substring(e.indexOf("(")+1,e.indexOf(")")),this.landArea=t.computedArea,this.landAreaKm=Math.trunc(t.computedArea)/1e6,this.landAreaHa=Math.trunc(t.computedArea)/1e4,this.name.length>=3?this.activeTab=3:this.activeTab=0},getDistrictName:function(){for(var t=a("e32c").geojsonDistricts,e=0;e<t.features.length;e++){var i=t.features[e];if(i.properties.id==this.pickedCounty.districtCode)return i.properties.name}},getCountyName:function(){for(var t=a("e32c").countysCoords,e=0;e<t.length;e++){var i=t[e];if(i.properties.districtID==this.pickedCounty.districtCode)for(var n=0;n<i.features.length;n++){var s=i.features[n];if(s.properties.code==this.pickedCounty.countyCode)return s.properties.name}}},submitLand:function(){var t=this,e={name:this.name,description:this.description,coords:this.land.getPath().getArray().toString(),districtCode:this.pickedCounty.districtCode,countyCode:this.pickedCounty.countyCode,area:this.landArea,centerCoords:this.centerCoords,isPublic:"1"!=this.isPrivate,requiringValidation:this.validationFiles.length>0},a=this;this.addland(e).then((function(i){i.data.success?(r["eventBus"].$emit("generateGrowl",{msg:t.$t(i.data.msg),type:"success"}),a.saveFiles(i.data.id,e.name)):r["eventBus"].$emit("generateGrowl",{msg:t.$t(i.data.msg),type:"error"})}))},saveFiles:function(t,e){var a=this.imageFiles.concat(this.validationFiles),i=this;a.length>0?a.forEach((function(n,s){n.relatedId=t,n.relatedTable="land",i.addfile(n).then((function(n){n.data.success&&a.length-1==s&&(i.validationFiles.length>0?i.openValidationProcess(t,e):i.$router.push("/"+i.$i18n.locale+"/profile"))}))})):i.$router.push("/"+i.$i18n.locale+"/profile")},openValidationProcess:function(t,e){var a={state:"initialized",landId:t,landName:e,countyCode:this.pickedCounty.countyCode,districtCode:this.pickedCounty.districtCode},i=this;this.addvalidation(a).then((function(t){t.data.success&&i.$router.push("/"+i.$i18n.locale+"/profile")}))},imageFilesChanged:function(t){this.imageFiles=t},validationFilesChanged:function(t){this.validationFiles=t}})},R=z,K=(a("a7ea"),a("a609")),U=a("5e66"),W=a("3e35"),J=a("1f4f"),q=a("71a3"),X=a("c671"),Z=a("fe57"),Y=a("a844"),tt=Object(g["a"])(R,i,n,!1,null,"6ea48b36",null);e["default"]=tt.exports;v()(tt,{VBtn:m["a"],VBtnToggle:K["a"],VCard:b["a"],VCarousel:U["a"],VCarouselItem:W["a"],VIcon:A["a"],VSimpleTable:J["a"],VTab:q["a"],VTabItem:X["a"],VTabs:Z["a"],VTextField:E["a"],VTextarea:Y["a"],VTooltip:N["a"]})},"4b85":function(t,e,a){},"57b2":function(t,e,a){"use strict";var i=a("d199"),n=a.n(i);n.a},a7ea:function(t,e,a){"use strict";var i=a("1dc3"),n=a.n(i);n.a},a844:function(t,e,a){"use strict";a("a4d3"),a("4de4"),a("4160"),a("a9e3"),a("e439"),a("dbb4"),a("b64b"),a("acd8"),a("e25e"),a("159b");var i=a("2fa7"),n=(a("1681"),a("8654")),s=a("58df");function r(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function o(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?r(Object(a),!0).forEach((function(e){Object(i["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var l=Object(s["a"])(n["a"]);e["a"]=l.extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:function(t){return!isNaN(parseFloat(t))}},rows:{type:[Number,String],default:5,validator:function(t){return!isNaN(parseInt(t,10))}}},computed:{classes:function(){return o({"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle},n["a"].options.computed.classes.call(this))},noResizeHandle:function(){return this.noResize||this.autoGrow}},watch:{lazyValue:function(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight:function(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted:function(){var t=this;setTimeout((function(){t.autoGrow&&t.calculateInputHeight()}),0)},methods:{calculateInputHeight:function(){var t=this.$refs.input;if(t){t.style.height="0";var e=t.scrollHeight,a=parseInt(this.rows,10)*parseFloat(this.rowHeight);t.style.height=Math.max(a,e)+"px"}},genInput:function(){var t=n["a"].options.methods.genInput.call(this);return t.tag="textarea",delete t.data.attrs.type,t.data.attrs.rows=this.rows,t},onInput:function(t){n["a"].options.methods.onInput.call(this,t),this.autoGrow&&this.calculateInputHeight()},onKeyDown:function(t){this.isFocused&&13===t.keyCode&&t.stopPropagation(),this.$emit("keydown",t)}}})},b0afe:function(t,e,a){},b1b6:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("input",{ref:"fileInput",staticStyle:{display:"none"},attrs:{type:"file",multiple:""},on:{change:t.onFilesChange}}),a("v-btn",{staticClass:"ma-2",attrs:{color:"primary"},on:{click:t.callFileInput}},["image"==t.type?a("v-icon",{attrs:{left:""}},[t._v("mdi-image")]):t._e(),"image"!=t.type?a("v-icon",{attrs:{left:""}},[t._v("mdi-paperclip")]):t._e(),t._v(" "+t._s(t.btnLabel)+" ")],1),a("v-data-table",{directives:[{name:"show",rawName:"v-show",value:t.files.length>0,expression:"files.length > 0"}],staticClass:"elevation-1",attrs:{"no-data-text":t.$t("label.nodata"),"hide-default-footer":"",id:"tableFiles",dense:"","hide-default-header":"",headers:t.tableHeaders,items:t.files,"item-key":"name"},scopedSlots:t._u([{key:"item.name",fn:function(e){var i=e.item;return[a("div",{staticStyle:{display:"initial"}},[a("td",{staticClass:"td-style",attrs:{id:"tdItemRow"}},[t._v(t._s(i.name))]),a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[a("v-icon",t._g({staticClass:"tdRowIcon deleteFileIcon pointerCursor",on:{click:function(e){return t.deleteFile(i)}}},n),[t._v("delete")])]}}],null,!0)},[a("span",[t._v(t._s(t.$t("label.delete_file")))])]),a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return["image"==t.type?a("v-icon",t._g({directives:[{name:"show",rawName:"v-show",value:i.isPublic,expression:"item.isPublic"}],staticClass:"tdRowIcon fileVisibilityIcon pointerCursor",on:{click:function(t){i.isPublic=!1}}},n),[t._v("mdi-earth")]):t._e()]}}],null,!0)},[a("span",[t._v(t._s(t.$t("label.image_visibility")))])]),a("v-tooltip",{attrs:{right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return["image"==t.type?a("v-icon",t._g({directives:[{name:"show",rawName:"v-show",value:!i.isPublic,expression:"!item.isPublic"}],staticClass:"tdRowIcon fileVisibilityIcon pointerCursor",on:{click:function(t){i.isPublic=!0}}},n),[t._v("mdi-lock")]):t._e()]}}],null,!0)},[a("span",[t._v(t._s(t.$t("label.image_visibility")))])])],1)]}}])})],1)},n=[],s=(a("4160"),a("caad"),a("c975"),a("a434"),a("b0c0"),a("ac1f"),a("2532"),a("1276"),a("159b"),{props:["btnLabel","type","maxFilesQtty","initialFiles"],data:function(){return{pagination:{rowsPerPage:15},files:[],tableHeaders:[{text:"",align:"left",value:"name",sortable:!1}]}},watch:{files:function(t){this.$emit("filesChanged",t)},initialFiles:function(t){this.files=t}},computed:{imageExts:function(){return a("e32c").imageFileExtensions},validationExts:function(){return a("e32c").validationFileExtensions}},methods:{callFileInput:function(){this.$refs.fileInput.click()},readFile:function(t){var e=new FileReader;e.file=t;var i=a("e32c").maxFileSize,n=this;e.addEventListener("load",(function(t){for(var a=t.currentTarget.file,s={name:a.name,type:n.type,contentType:a.type,dataUrl:e.result,isPublic:"image"==n.type},r=0;r<n.files.length;r++){var o=n.files[r];if(o.name==s.name)return}var l=s.name.toLowerCase().split(".").pop();n.files.length<n.maxFilesQtty&&a.size<i&&(!n.type||"image"==n.type&&n.imageExts.includes(l)||"validation"==n.type&&n.validationExts.includes(l))&&n.files.push(s)})),e.readAsDataURL(t)},deleteFile:function(t){this.files.splice(this.files.indexOf(t),1)},onFilesChange:function(t){var e=this,a=t.target.files;a.forEach((function(t){e.readFile(t)}))}}}),r=s,o=(a("d5c3"),a("2877")),l=a("6544"),c=a.n(l),u=a("8336"),d=a("8fea"),p=a("132d"),h=a("3a2f"),f=Object(o["a"])(r,i,n,!1,null,"764443ca",null);e["a"]=f.exports;c()(f,{VBtn:u["a"],VDataTable:d["a"],VIcon:p["a"],VTooltip:h["a"]})},baa5:function(t,e,a){var i=a("23e7"),n=a("e58c");i({target:"Array",proto:!0,forced:n!==[].lastIndexOf},{lastIndexOf:n})},d199:function(t,e,a){},d5c3:function(t,e,a){"use strict";var i=a("b0afe"),n=a.n(i);n.a},e58c:function(t,e,a){"use strict";var i=a("fc6a"),n=a("a691"),s=a("50c4"),r=a("b301"),o=Math.min,l=[].lastIndexOf,c=!!l&&1/[1].lastIndexOf(1,-0)<0,u=r("lastIndexOf");t.exports=c||u?function(t){if(c)return l.apply(this,arguments)||0;var e=i(this),a=s(e.length),r=a-1;for(arguments.length>1&&(r=o(r,n(arguments[1]))),r<0&&(r=a+r);r>=0;r--)if(r in e&&e[r]===t)return r||0;return-1}:l}}]);
//# sourceMappingURL=chunk-3a0e9514.c4fa8552.js.map