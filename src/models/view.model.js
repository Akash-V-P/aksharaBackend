import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book"
        },
        viewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        lastViewedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

viewSchema.index({ video: 1, viewedBy: 1 }, { unique: true });
viewSchema.index({ comment: 1, viewedBy: 1 }, { unique: true });
viewSchema.index({ tweet: 1, viewedBy: 1 }, { unique: true });
viewSchema.index({ book: 1, viewedBy: 1 }, { unique: true });

export const View = mongoose.model("Views", viewSchema);