import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    getChannelBooks,
    getChannelStats,
    getChannelTweets,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"

const router = Router();

router.use(verifyJWT);

router.route("/stats/:channelId").get(getChannelStats);
router.route("/videos/:channelId").get(getChannelVideos);
router.route("/books/:channelId").get(getChannelBooks);
router.route("/tweets/:channelId").get(getChannelTweets);


export default router