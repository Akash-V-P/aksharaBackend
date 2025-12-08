import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookSchema = new Schema(
    {
        bookFile: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        pages: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Book = mongoose.model("Book", bookSchema);