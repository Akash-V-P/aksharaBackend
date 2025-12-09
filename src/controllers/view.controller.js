import mongoose, { isValidObjectId } from "mongoose"
import { View } from "../models/view.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const addVideoView = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video id is required");
    }

    const videoView = await View.findOneAndUpdate(
        {
            video: videoId,
            viewedBy: req.user?._id
        },
        {
            $set: {
                lastViewedAt: new Date()
            }
        },
        { upsert: true, new: true }
    )

    if (!videoView) {
        throw new ApiError(500, "could not add view to the video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoView,
                "view added to the video successfully"
            )
        )
})

const addBookView = asyncHandler(async (req, res) => {
    const { bookId } = req.params

    if (!bookId) {
        throw new ApiError(400, "book id is required");
    }

    const bookView = await View.findOneAndUpdate(
        {
            book: bookId,
            viewedBy: req.user?._id
        },
        {
            $set: {
                lastViewedAt: new Date()
            }
        },
        { upsert: true, new: true }
    )

    if (!bookView) {
        throw new ApiError(500, "could not add view to the book")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                bookView,
                "view added to the book successfully"
            )
        )
})

const addCommentView = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "comment id is required");
    }

    const commentView = await View.findOneAndUpdate(
        {
            comment: commentId,
            viewedBy: req.user?._id
        },
        {
            $set: {
                lastViewedAt: new Date()
            }
        },
        { upsert: true, new: true }
    )

    if (!commentView) {
        throw new ApiError(500, "could not add comment to the book")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                bookView,
                "view added to the comment successfully"
            )
        )
})

const addTweetView = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "tweet id is required");
    }

    const tweetView = await View.findOneAndUpdate(
        {
            tweet: tweetId,
            viewedBy: req.user?._id
        },
        {
            $set: {
                lastViewedAt: new Date()
            }
        },
        { upsert: true, new: true }
    )

    if (!tweetView) {
        throw new ApiError(500, "could not add view to the tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweetView,
                "view added to the tweet successfully"
            )
        )
})

const getTotalViewsForVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if ( !videoId ) {
        throw new ApiError(400, "video id not found")
    }
    
    const totalVideoViews = await View.countDocuments({ video: videoId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                totalVideoViews,
                "total video views fetched successfully"
            )
        )
})

const getTotalViewsForTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if ( !tweetId ) {
        throw new ApiError(400, "tweet id not found")
    }
    
    const totalTweetViews = await View.countDocuments({ tweet: tweetId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                totalTweetViews,
                "total tweet views fetched successfully"
            )
        )
})

const getTotalViewsForBooks = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    if ( !bookId ) {
        throw new ApiError(400, "book id not found")
    }
    
    const totalBookViews = await View.countDocuments({ book: bookId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                totalBookViews,
                "total book views fetched successfully"
            )
        )
})


export { addVideoView, addBookView, addCommentView, addTweetView, getTotalViewsForVideo, getTotalViewsForBooks, getTotalViewsForTweet}