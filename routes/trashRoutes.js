const express = require("express")
const router = express.Router()
const itemController = require("../controllers/trashController")

router.route("/").get(itemController.getItems).delete(itemController.deleteItem)

module.exports = router
