import express from 'express'
import * as userController from "../controller/user.controller.js";

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

var router = express.Router();

router.get("/",userController.getUsers);                                                                    //
router.post("/login",userController.loginUser);
router.post("/register",userController.addUser);
router.get("/followers",userController.getFollowers);

router.post("/follow",userController.addFollower);


router.patch("/profil/:id",upload.single('avatar'),userController.updateUser);                                          //
router.delete("/:userid/unfollow/:targetid",userController.removeFollower);

router.get("/:id/followers",userController.getFollowersByUserId);
router.get("/:id/subscribes",userController.getSubscribersByUserId);
router.get("/:id",userController.getUserById);                                                              //
router.delete("/:id", userController.deleteUserById);                                                       //

export default router;
