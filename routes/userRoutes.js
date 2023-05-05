const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.route("/").get(userController.getUsers).post(userController.addUser)

router.route("/updateLogin").post(userController.updateLogin)

module.exports = router
