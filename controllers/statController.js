const Item = require("../models/Item")

// to be updated
// redo aggregation with facet
// total amount, number of categories, total quantity
const getStats = async (req, res) => {
    const categoryCount = await Item.aggregate([
        {
            $group: {
                _id: "$tags",
                total: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ])

    const categoryAmount = await Item.aggregate([
        {
            $group: {
                _id: "$tags",
                amount: { $sum: { $multiply: ["$price", "$quantity"] } },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ])

    const amountByWeek = await Item.aggregate([
        {
            $group: {
                _id: { $week: "$createdAt" },
                createdAt: { $first: "$createdAt" },
                amount: { $sum: { $multiply: ["$price", "$quantity"] } },
            },
        },
        {
            $sort: { createdAt: 1 },
        },
    ])

    const quantityByWeek = await Item.aggregate([
        {
            $group: {
                _id: { $week: "$createdAt" },
                createdAt: { $first: "$createdAt" },
                quantity: { $sum: "$quantity" },
            },
        },
        {
            $sort: { createdAt: 1 },
        },
    ])

    amountByWeek.forEach((item, index) => {
        console.log("item ", index, " : ", item)
    })

    res.status(200).json({
        stats: {
            category: categoryCount,
            amount: categoryAmount,
            amountByWeek,
            quantityByWeek,
        },
    })
}

module.exports = { getStats }
