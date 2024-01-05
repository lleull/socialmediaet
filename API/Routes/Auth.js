const express = require("express");
const router = express.Router();
const User = require("./../Models/Users");
const bcrypt = require("bcrypt");
router.use(express.json());

router.post("/register", async (req, res) => {
  try {
    //generates  an ecrypted password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //Create a User  from the client
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //save the data that was sent

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }

  res.send("Ok");
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not Found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).send("Wrong Password");
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
