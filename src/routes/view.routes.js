import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addBookView, addCommentView, addTweetView, addVideoView, getTotalViewsForBooks, getTotalViewsForTweet, getTotalViewsForVideo } from '../controllers/view.controller.js';



const router = Router();

router.use(verifyJWT);


router.route("/add-view/v/:videoId").post(addVideoView);
router.route("/add-view/c/:commentId").post(addCommentView);
router.route("/add-view/t/:tweetId").post(addTweetView);
router.route("/add-view/b/:bookId").post(addBookView);
router.route("/v/:videoId").get(getTotalViewsForVideo);
router.route("/t/:tweetId").get(getTotalViewsForTweet);
router.route("/b/:bookId").get(getTotalViewsForBooks);



export default router