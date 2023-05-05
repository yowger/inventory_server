const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ItemSchema = new Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        oldName: {
            type: String,
        },
        newName: {
            type: String,
        },
        oldPrice: {
            type: Number,
        },
        newPrice: { 
            type: Number,
        },
        oldDescription: {
            type: String,
        },
        newDescription: {
            type: String,
        },
        oldQuantity: {
            type: Number,
        },
        newQuantity: {
            type: Number,
        },
        oldTags: {
            type: String,
        },
        newTags: {},
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
