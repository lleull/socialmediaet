const express = require("express");
const router = express.Router();
const User = require("./../Models/Users");
const bcrypt = require("bcrypt");
router.get("/", (req, res) => {
  res.json("Users api");
});

//updateuser dont forget to change the isAdimn
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).send("Error While Encrypting");
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(400).json("You cant update other account");
  }
  res.send("Updating user working");
});
//deleteuser
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has deleted succesfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(400).json("You cant delete other account!");
  }
});
//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { updatedAt, password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).send("Error");
  }
});
//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
      } else {
        res.status(500).json("You already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json("You can`t follow Yourself");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.deleteOne({ $pull: { followers: req.body.userId } });
        await currentUser.deleteOne({ $pull: { followings: req.params.id } });
        res.status(500).json("user has been Unfollowed");
      } else {
        res.status(500).json("You dont follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json("You can`t follow Yourself");
  }
});

module.exports = router;
