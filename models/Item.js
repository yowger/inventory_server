const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ItemSchema = new Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        tags: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("item", ItemSchema)
