const express = require("express")
const router = express.Router()
const statController = require("../controllers/statController")

router.route("/").get(statController.getStats)

module.exports = router
