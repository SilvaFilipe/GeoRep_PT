const express = require("express");
const router = express.Router();
const Land = require("../../model/Land");
const mongoose = require("mongoose");

/**
 * @route POST api/lands/addland
 * @desc Add a new land
 * @access Private
 */
router.post("/addland", async (req, res) => {
  let {
    name,
    description,
    coords,
    area,
    isPublic,
    centerCoords,
    districtCode,
    countyCode,
    userId,
    userName,
    requiringValidation
  } = req.body;

  try {
    if (name.length < 3) {
      return res.status(201).json({
        msg: "msg.land_name_chars"
      });
    }

    //Valid data, add land
    var createDate = new Date();

    land = new Land({
      name,
      description,
      coords,
      area,
      isPublic,
      centerCoords,
      districtCode,
      countyCode,
      createDate,
      userId,
      userName,
      requiringValidation
    });

    //Save land
    await land.save();
    return res.status(201).json({
      id: land._id,
      success: true,
      msg: "msg.landadded"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/lands/editland
 * @desc Edit land details
 * @access Private
 */
router.post("/editland", async (req, res) => {
  let { name, description, isPublic, _id, updateDate } = req.body;

  try {
    Land.findById(_id).then(land => {
      if (!land) {
        return res.status(404).json({ msg: "Land not found." });
      }

      land.name = name;
      land.description = description;
      land.isPublic = isPublic;
      land.updateDate = updateDate;
      land.save();

      return res.status(201).json({
        success: true,
        msg: "msg.land_details_saved",
        result: land
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/lands/userlands
 * @desc Get lands of the current user
 * @access Private
 */
router.post("/userlands", async (req, res) => {
  let { userId } = req.body;
  try {
    Land.find({ userId: userId }).then(lands => {
      return res.status(201).json({
        success: true,
        msg: "Lands retrieved. Quantity: " + lands.length,
        result: lands
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route GET api/lands/alllands
 * @desc Get all lands
 * @access Private
 */
router.get("/alllands", async (req, res) => {
  try {
    Land.find().then(lands => {
      return res.status(201).json({
        success: true,
        msg: "All lands retrieved. Quantity: " + lands.length,
        result: lands
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/lands/deleteland
 * @desc Delete land
 * @access Private
 */
router.post("/deleteland", async (req, res) => {
  try {
    let { _id } = req.body;
    Land.findById(_id).then(land => {
      if (!land) {
        return res.status(404).json({ msg: "Land not found." });
      }
      land.remove();

      //Remove land likes
      LandLike.find({ landId: _id }).then(landLikes => {
        landLikes.forEach(landLike => {
          landLike.remove();
        });
      });
      //Remove land files
      File.find({ relatedId: _id, relatedTable: "land" }).then(files => {
        files.forEach(file => {
          file.remove();
        });
      });
      //Remove land validations
      Validation.find({ landId: _id }).then(validations => {
        validations.forEach(validation => {
          validation.remove();
        });
      });

      return res.status(201).json({
        success: true,
        msg: "msg.landdeleted"
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/lands/getland
 * @desc Get land
 * @access Private
 */
router.post("/getland", async (req, res) => {
  try {
    let { _id } = req.body;

    //Need to check if id is valid, if it is not, mongo will throw an error
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(200).json({ msg: "Land not found." });
    }

    Land.findById(_id).then(land => {
      if (!land) {
        return res.status(200).json({ msg: "Land not found." });
      }
      return res.status(201).json({
        success: true,
        msg: "Land retrieved.",
        result: land
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      msg: "Land not retrieved."
    });
  }
});

module.exports = router;
