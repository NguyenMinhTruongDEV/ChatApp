import express from 'express';
import { authMe, test, searchUserByUsername, uploadAvatar } from '../controllers/user.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get("/me", authMe);
router.get("/test", test);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);

export default router;