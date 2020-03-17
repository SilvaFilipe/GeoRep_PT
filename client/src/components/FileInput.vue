<template>
  <div>
    <input type="file" ref="fileInput" @change="onFilesChange" style="display:none" multiple />
    <v-btn class="ma-2" color="primary" @click="callFileInput">
      <v-icon v-if="type=='image'" left>mdi-image</v-icon>
      <v-icon v-if="type!='image'" left>mdi-paperclip</v-icon>
      {{btnLabel}}
    </v-btn>
    <v-data-table
      :no-data-text="$t('label.nodata')"
      hide-default-footer
      id="tableFiles"
      v-show="files.length > 0"
      dense
      hide-default-header
      :headers="tableHeaders"
      :items="files"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:item.name="{ item }">
        <div style="display:initial">
          <td class="td-style" id="tdItemRow">{{item.name}}</td>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon
                @click="deleteFile(item)"
                v-on="on"
                class="tdRowIcon deleteFileIcon pointerCursor"
              >delete</v-icon>
            </template>
            <span>{{ $t('label.delete_file') }}</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                @click="item.isPublic = false"
                v-show="item.isPublic"
                v-if="type=='image'"
                class="tdRowIcon fileVisibilityIcon pointerCursor"
              >mdi-earth</v-icon>
            </template>
            <span>{{ $t('label.image_visibility') }}</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                @click="item.isPublic = true"
                v-show="!item.isPublic"
                v-if="type=='image'"
                class="tdRowIcon fileVisibilityIcon pointerCursor"
              >mdi-lock</v-icon>
            </template>
            <span>{{ $t('label.image_visibility') }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["btnLabel", "type", "maxFilesQtty", "initialFiles"],
  data() {
    return {
      pagination: {
        rowsPerPage: 15
      },
      files: [],
      tableHeaders: [
        {
          text: "",
          align: "left",
          value: "name",
          sortable: false
        }
      ]
    };
  },
  watch: {
    files(newVal) {
      this.$emit("filesChanged", newVal);
    },
    initialFiles(newVal) {
      this.files = newVal;
    }
  },
  computed: {
    imageExts() {
      return require("../properties").imageFileExtensions;
    },
    validationExts() {
      return require("../properties").validationFileExtensions;
    }
  },
  methods: {
    callFileInput() {
      this.$refs.fileInput.click();
    },
    readFile(file) {
      var fileReader = new FileReader();
      fileReader.file = file;

      //Get max file size
      var maxFileSize = require("../properties").maxFileSize;

      var _this = this;
      fileReader.addEventListener("load", function(event) {
        var fileToRead = event.currentTarget.file;
        var fileObj = {
          name: fileToRead.name,
          type: _this.type,
          contentType: fileToRead.type,
          dataUrl: fileReader.result,
          isPublic: _this.type == "image"
        };

        //Check if array already contains a file with the same name
        for (let i = 0; i < _this.files.length; i++) {
          var file = _this.files[i];
          if (file.name == fileObj.name) return;
        }

        //Check if max files quantity has been met
        var fileExtension = fileObj.name
          .toLowerCase()
          .split(".")
          .pop();
        if (
          _this.files.length < _this.maxFilesQtty &&
          fileToRead.size < maxFileSize &&
          //Check file extension
          (!_this.type ||
            (_this.type == "image" &&
              _this.imageExts.includes(fileExtension)) ||
            (_this.type == "validation" &&
              _this.validationExts.includes(fileExtension)))
        ) {
          _this.files.push(fileObj);
        }
      });
      fileReader.readAsDataURL(file);
    },
    deleteFile(item) {
      this.files.splice(this.files.indexOf(item), 1);
    },
    onFilesChange(event) {
      var files = event.target.files;

      files.forEach(file => {
        this.readFile(file);
      });
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

.deleteFileIcon:hover {
  color: #ff6666;
}

.fileVisibilityIcon:hover {
  color: #66a3ff;
}

.pointerCursor {
  cursor: pointer;
}
</style>