import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";


const router = Router();

router.use(verifyJWT);


router.route("/c/getFollowers/:channelId").get(getUserChannelSubscribers)
                             .post(toggleSubscription)

router.route("/c/getFollowing/:userId").get(getSubscribedChannels)


export default router;