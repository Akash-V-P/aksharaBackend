import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Tweet} from "../models/tweet.model.js"
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "content is required.");
    }

    const tweet = await Tweet.create(
        {
            content: content,
            owner: req.user._id
        }
    )

    if (!tweet) {
        throw new ApiError(500, "could not create tweet.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "tweet successfully created."
            )
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (!tweetId || !content) {
        throw new ApiError(400, "both tweetId and updatedTweet required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if ( !tweet.owner.equals(req.user._id) ) {
        throw new ApiError(403, "users other than owner cannot edit the tweet.");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if (!updatedTweet) {
        throw new ApiError(500, "failed to update the tweet.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTweet,
                "tweet updated successfully."
            )
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "tweet id is required.");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if ( !tweet.owner.equals(req.user.tweetId) ) {
        throw new ApiError(403, "users other than owner cannot delete the tweet.");
    }

    const deletedTweet = await Tweet.deleteOne({ tweetId });

    if (deletedTweet.deletedCount === 0) {
        throw new ApiError(500, "failed to delete the tweet.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "tweet deleted successfully."
            )
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "no user found");
    }

    const userTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }, 
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    //this will return error fi no tweet were found
    // if (!userTweets?.length) {
    //     throw new ApiError(404, "no tweets found.")
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userTweets,
                "All tweets for current user fetched."
            )
        )
})


export { createTweet, updateTweet, deleteTweet, getUserTweets }