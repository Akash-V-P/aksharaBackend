import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "user Id is required.");
    }

    if (!page || !limit) {
        throw new ApiError(400, "page and limit is required.");
    }

    const result = await Comment.aggregatePaginate(
        //aggregation
        [
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    owner: {
                        $first: "$owner"
                    }
                }
            }
        ],
        //pagination
        {
            page,
            limit
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "all comments for the video successfully fetched."
            )
        )

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!videoId) {
        throw new ApiError(400, "video id not found.")
    }

    const comment = await Comment.create(
        {
            content,
            owner: req.user?._id,
            video: videoId
        }
    )

    if (!comment) {
        throw new ApiError(400, "could not add comment")
    }

    const populatedComment = await Comment.findById(comment._id)
        .populate("owner", "username fullName avatar");

        if (!populatedComment) {
        throw new ApiError(400, "could not populate comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                populatedComment,
                "comment added successfully."
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
        throw new ApiError(400, "comment id is required")
    }

    const comment = await Comment.findById(commentId);

    if (!comment.owner.equals(req.user._id)) {
        throw new ApiError(403, "user other than owner cannot edit the comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    if (!updatedComment) {
        throw new ApiError(500, "could not update the comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedComment,
                "comment updated successfully."
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "comment id is required")
    }

    const comment = await Comment.findById(commentId);

    if (!comment.owner.equals(req.user._id)) {
        throw new ApiError(403, "user other than owner cannot delete the comment")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(500, "could not update the comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedComment,
                "comment updated successfully."
            )
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}