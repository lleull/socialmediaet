const router = require("express").Router();
const Post = require("./../Models/Post");
const User = require("./../Models/Users");
//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ set: req.body });
      res.status(500).json("Post have been Updated");
    } else {
      res.status(500).json("This is not ur post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(500).json("You only can delete your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//like/dislike a post
router.put("/:id/likes", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been Liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("This post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Error while fetching post");
  }
});

//get all following post
router.get("/timeline", async (req, res) => {
  let postArray = [];

  const currentUser = await User.findById(req.body.userId);
  const userPost = await Post.find({userId: currentUser._id})
  try {
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
