import express from 'express';
import * as postController from "../controller/post.controller.js";

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

var router = express.Router();

router.get("/",postController.getPosts);
router.post("/send",upload.single('publication'),postController.AddPost);

router.get("/loves",postController.getLoves);
router.get("/loves/:userid",postController.getLovesByUserId);
router.get("/:postid/loves",postController.getLovesByPostId);
router.get("/:postid/loves/:userid",postController.getLovesByPostIdAndUserId);
router.post("/love",postController.addLove);
router.delete("/unlove/:postid/:userid",postController.removeLove);

router.get("/likes",postController.getLikes);
router.get("/likes/:userid",postController.getLikesByUserId);
router.get("/:postid/likes",postController.getLikesByPostId);
router.get("/:postid/likes/:userid",postController.getLikesByPostIdAndUserId);
router.post("/like",postController.addLike);
router.delete("/unlike/:postid/:userid",postController.removeLike);

router.get("/:id",postController.getPostById);
router.delete("/:id",postController.deletePostById);

export default router;
