import express from 'express';
import * as commentController from "../controller/comment.controller.js";

var router = express.Router();

router.get("/",commentController.getComments);
router.post("/send",commentController.addComment);

// router.delete("/:id",commentController.deleteComment);


export default router;
