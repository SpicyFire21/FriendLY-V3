import express from 'express';
import * as commentController from "../controller/comment.controller.js";

var router = express.Router();

router.get("/",commentController.getComments);


export default router;
