const express = require("express")
const router = express.Router()
const itemController = require("../controllers/itemController")

router
    .route("/")
    .get(itemController.getItems)
    .post(itemController.addItem)
    .delete(itemController.deleteItem)
    .patch(itemController.updateItem)

router
    .route("/many")
    .post(itemController.addManyItems)
    .patch(itemController.removeItems)

module.exports = router
