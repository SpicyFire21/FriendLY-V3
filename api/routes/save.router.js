import express from 'express';
import * as saveController from "../controller/save.controller.js";
var router = express.Router();

router.get("/saves",saveController.getSaves);

router.get("/saves/:postid",saveController.getSavesByPostId);

router.get("/saves/:userid",saveController.getSavesByUserId);

router.get("/saves/:postid/:userid",saveController.getSavesByPostIdAndUserId);

export default router;