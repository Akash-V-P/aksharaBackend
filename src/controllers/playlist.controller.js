import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Playlist} from "../models/playlist.model.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "name and description of playlist is required")
    }

    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: req.user?._id
        }
    )

    if (!playlist) {
        throw new ApiError(500, "playlist could no be created.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "playlist created successfully."
            )
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "playlist id is requiredl")
    }

    if (!name || !description) {
        throw new ApiError(400, "name and description of playlist is required.")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "could not update playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "playlist updated successfully."
            )
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!videoId || !playlistId) {
        throw new ApiError(400, "video id and playlist id is required.")
    }

    const updatedPlaylstAfterAddition = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        { new: true }
    ).populate(
        "videos",
        "title thumbnail duration"
    )

    if (!updatedPlaylstAfterAddition) {
        throw new ApiError(500, "could not add the video to the playlist.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylstAfterAddition,
                "video added to the playlist successfully."
            )
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!videoId || !playlistId) {
        throw new ApiError(400, "video id and playlist id is required.")
    }

    const updatedPlaylstAfterDeletion = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        { new: true }
    ).populate(
        "videos",
        "title thumbnail duration"
    )

    if (!updatedPlaylstAfterDeletion) {
        throw new ApiError(500, "could not remove the video to the playlist.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylstAfterDeletion,
                "video added to the playlist successfully."
            )
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")

    if (!playlist) {
        throw new ApiError(500, "could not fetch playlist.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "playlist fetched successfully."
            )
        )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "user id required.")
    }

    const userPlaylists = await Playlist.find({ owner: userId })
                                        .populate("videos", "title thumbnail duration")

    // if (userPlaylists.length === 0) {
    //     throw new ApiError(500, "could not find the playlist")
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlaylists,
                "user playlist fetched successfully"
            )
        )
})



export { createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById, getUserPlaylists, updatePlaylist }