const express = require("express");
const router = express.Router();
const LandLike = require("../../model/LandLike");

/**
 * @route POST api/landLikes/likeland
 * @desc Add a like to a land
 * @access Private
 */
router.post("/likeland", async (req, res) => {
  let { landId, userId } = req.body;

  try {
    landLike = new LandLike({
      landId,
      userId
    });

    //Save landLike
    await landLike.save();
    return res.status(201).json({
      id: landLike._id,
      success: true,
      msg: "LandLike added successfully."
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/landLikes/dislikeland
 * @desc Remove a like from a land
 * @access Private
 */
router.post("/dislikeland", async (req, res) => {
  let { landId, userId } = req.body;
  try {
    LandLike.findOne({ userId: userId, landId: landId }).then(landLike => {
      if (!landLike) {
        return res.status(404).json({ msg: "LandLike not found." });
      }

      landLike.remove();
      return res.status(201).json({
        success: true,
        msg: "LandLike removed."
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/landLikes/getlikestate
 * @desc Given a userId and a landId check if land has been liked
 * @access Private
 */
router.post("/getlikestate", async (req, res) => {
  let { landId, userId } = req.body;

  try {
    LandLike.find({ userId: userId, landId: landId }).then(landLike => {
      return res.status(201).json({
        success: true,
        result: landLike.length == 1 //If true means the land has been liked
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/landLikes/getlandlikesquantity
 * @desc Given a landId retrieve the quantity of land likes the land has
 * @access Private
 */
router.post("/getlandlikesquantity", async (req, res) => {
  let { landId } = req.body;

  try {
    LandLike.find({ landId: landId }).then(landLike => {
      return res.status(201).json({
        success: true,
        result: landLike.length
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
