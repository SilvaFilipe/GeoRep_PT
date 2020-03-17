const express = require("express");
const router = express.Router();
const File = require("../../model/File");

/**
 * @route POST api/files/addfile
 * @desc Add a new file
 * @access Private
 */
router.post("/addfile", async (req, res) => {
  let {
    name,
    type,
    dataUrl,
    relatedTable,
    relatedId,
    userId,
    isPublic
  } = req.body;

  try {
    //Check if file has extension
    if (name.lastIndexOf(".") <= 0) {
      return res.status(201).json({
        msg: "Invalid file."
      });
    }

    //Valid data, add file
    file = new File({
      name,
      type,
      dataUrl,
      relatedTable,
      relatedId,
      userId,
      isPublic
    });

    //Save file
    await file.save();
    return res.status(201).json({
      success: true,
      msg: "File added successfully."
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/files/landimages
 * @desc Get all image files attached to a land
 * @access Private
 */
router.post("/landimages", async (req, res) => {
  let { _id } = req.body;
  try {
    File.find({ relatedTable: "land", relatedId: _id, type: /^image/ }).then(
      files => {
        return res.status(201).json({
          success: true,
          msg: "Files retrieved. Quantity: " + files.length,
          result: files
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/files/removelandimages
 * @desc Remove all image files attached to a land
 * @access Private
 */
router.post("/removelandimages", async (req, res) => {
  let { _id } = req.body;
  try {
    File.find({ relatedTable: "land", relatedId: _id, type: /^image/ }).then(
      files => {
        files.forEach(file => {
          file.remove();
        });
        return res.status(201).json({
          success: true,
          msg: "Files deleted."
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/files/landvalidationfiles
 * @desc Get all validation files attached to a land
 * @access Private
 */
router.post("/landvalidationfiles", async (req, res) => {
  let { _id } = req.body;
  try {
    File.find({
      relatedTable: "land",
      relatedId: _id,
      type: "validation"
    }).then(files => {
      return res.status(201).json({
        success: true,
        msg: "Files retrieved. Quantity: " + files.length,
        result: files
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/files/alllandfiles
 * @desc Get all validation attached to a land
 * @access Private
 */
router.post("/alllandfiles", async (req, res) => {
  let { _id } = req.body;
  try {
    File.find({
      relatedTable: "land",
      relatedId: _id
    }).then(files => {
      return res.status(201).json({
        success: true,
        msg: "Files retrieved. Quantity: " + files.length,
        result: files
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
