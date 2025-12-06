import express from 'express';
import * as loveController from "../controller/loves.controller.js";

var router = express.Router();

router.get("/",loveController.getLoves);


export default router;
