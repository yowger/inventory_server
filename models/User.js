const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ROLES = require("../config/rolesList")

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ROLES,
            default: ROLES[2], //user
            require: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("user", UserSchema)
