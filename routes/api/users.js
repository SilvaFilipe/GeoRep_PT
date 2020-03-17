const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../config/keys").secret;
const User = require("../../model/User");

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post("/register", async (req, res) => {
  let { name, email, password, confirmPassword, birthDate } = req.body;

  try {
    //Mandatory fields
    if (
      name.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      !birthDate
    ) {
      return res.status(201).json({
        msg: "msg.all_register_fields_mandatory"
      });
    }

    //Check email format
    var re = /\S+@\S+\.\S+/; //regular expression
    if (!re.test(email)) {
      return res.status(201).json({
        msg: "msg.valid_email"
      });
    }

    //Password length
    if (password.length < 6) {
      return res.status(201).json({
        msg: "msg.password_chars"
      });
    }

    //Confirm password
    if (password != confirmPassword) {
      return res.status(201).json({
        msg: "msg.passwords_dont_match"
      });
    }

    //Check if is older than 18 years
    var today = new Date();
    var birthDate1 = new Date(birthDate);
    var age = today.getFullYear() - birthDate1.getFullYear();
    var m = today.getMonth() - birthDate1.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate1.getDate())) {
      age--;
    }

    if (age < 18) {
      return res.status(201).json({
        msg: "msg.invalid_birth_date"
      });
    }

    //Email not taken
    user = await User.findOne({ email });

    if (user) {
      return res.status(201).json({
        msg: "msg.email_used"
      });
    }

    //Valid data, register user
    user = new User({
      name,
      password,
      email,
      birthDate
    });

    //Hash password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    //Save user
    await user.save();
    return res.status(201).json({
      success: true,
      msg: "User registered successfully."
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/users/login
 * @desc Login the user
 * @access Public
 */
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(201).json({
        msg: "msg.invalid_credentials",
        success: false
      });
    }

    //Compare password
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        //Password is correct, send the JSON token for the user
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email
        };

        jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
          res.status(200).json({
            success: true,
            user: user,
            token: "Bearer " + token,
            msg: "You are logged in."
          });
        }); //604800 seconds in a week
      } else {
        return res.status(201).json({
          msg: "msg.invalid_credentials",
          success: false
        });
      }
    });
  });
});

/**
 * @route GET api/users/profile
 * @desc Return the user's data
 * @access Private
 */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      user: req.user,
      success: true
    });
  }
);

/**
 * @route GET api/users/allusers
 * @desc Get all users
 * @access Private
 */
router.get("/allusers", async (req, res) => {
  try {
    User.find().then(users => {
      return res.status(201).json({
        success: true,
        msg: "All users retrieved. Quantity: " + users.length,
        result: users
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/users/removeuseraccount
 * @desc Remove user account
 * @access Private
 */
router.post("/removeuseraccount", async (req, res) => {
  try {
    let { userId, deleteUserLands } = req.body;

    if (deleteUserLands) {
      Land.find({ userId: userId }).then(lands => {
        if (!lands) {
          return res.status(404).json({ msg: "Lands not found." });
        }

        lands.forEach(land => {
          var landId = land._id;

          land.remove();

          //Remove land likes
          LandLike.find({ landId: landId }).then(landLikes => {
            landLikes.forEach(landLike => {
              landLike.remove();
            });
          });
          //Remove land files
          File.find({ relatedId: landId, relatedTable: "land" }).then(files => {
            files.forEach(file => {
              file.remove();
            });
          });
          //Remove land validations
          Validation.find({ landId: landId }).then(validations => {
            validations.forEach(validation => {
              validation.remove();
            });
          });
        });
      });
    }

    User.findById(userId).then(user => {
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      user.remove();

      return res.status(201).json({
        success: true,
        msg: "User removed."
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route POST api/users/setusercategory
 * @desc Set user category
 * @access Private
 */
router.post("/setusercategory", async (req, res) => {
  try {
    let { userId, category, managingDistrict, managingCounty } = req.body;

    User.findById(userId).then(user => {
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      user.category = category;
      user.managingDistrict = managingDistrict;
      user.managingCounty = managingCounty;
      user.save();

      return res.status(201).json({
        success: true,
        msg: "Categoria de utilizador gravada com sucesso."
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
