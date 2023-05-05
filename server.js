require("dotenv").config()
require("express-async-errors")

const path = require("path")
const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const credentials = require("./middleware/credentials")
const corsOptions = require("./config/corsOptions")
const connectDb = require("./config/connectDb")
const statRoute = require("./routes/statRoutes")
const userRoute = require("./routes/userRoutes")
const itemRoute = require("./routes/itemRoutes")
const trashRoute = require("./routes/trashRoutes")

const PORT = process.env.PORT || 3500

const app = express()

connectDb()

app.use(credentials)

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/stats", statRoute)
app.use("/users", userRoute)
app.use("/items", itemRoute)
app.use("/trash", trashRoute)

mongoose.connection
    .once("open", () => {
        app.listen(PORT, () => console.log(`server running on port ${PORT}`))
    })
    .on("error", (error) => console.log(`Mongoose connection error: ${error}`))
