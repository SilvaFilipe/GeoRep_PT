const express = require("express");
const router = express.Router();
const Validation = require("../../model/Validation");

/**
 * @route POST api/validations/addvalidation
 * @desc Add a new validation
 * @access Private
 */
router.post("/addvalidation", async (req, res) => {
  let { state, landId, landName, userId, countyCode, districtCode } = req.body;

  try {
    validation = new Validation({
      state,
      landId,
      landName,
      userId,
      countyCode,
      districtCode
    });

    //Save validation
    await validation.save();
    return res.status(201).json({
      id: validation._id,
      success: true,
      msg: "Validation added successfully."
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route GET api/validations/allvalidations
 * @desc Get all validations
 * @access Private
 */
router.get("/allvalidations", async (req, res) => {
  try {
    Validation.find().then(validations => {
      return res.status(201).json({
        success: true,
        msg: "All validations retrieved. Quantity: " + validations.length,
        result: validations
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/validations/validateland
 * @desc Validate a land
 * @access Private
 */
router.post("/validateland", async (req, res) => {
  try {
    let { _id, landId } = req.body;

    Validation.findById(_id).then(validation => {
      if (!validation) {
        return res.status(404).json({ msg: "Validation not found." });
      }

      validation.state = "validated";
      validation.save();

      Land.findById(landId).then(land => {
        if (!land) {
          return res.status(404).json({ msg: "Land not found." });
        }

        land.isValidated = true;
        land.requiringValidation = false;
        land.save();

        return res.status(201).json({
          success: true,
          msg: "msg.landvalidated",
          result: validation
        });
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
