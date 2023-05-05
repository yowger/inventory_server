const Item = require("../models/Item")
const generateSort = require("../helper/generateSort")
const pushToArrayIfExist = require("../helper/pushToArrayIfExist")

const getItems = async (req, res) => {
    const { page, per_page: perPage, search, category, sort } = req.query

    const skip = (page - 1) * perPage
    const limit = Number(perPage)

    const parsedSort = sort && JSON.parse(sort)
    const parsedSearch = search && JSON.parse(search)
    const parsedCategory = category && JSON.parse(category)

    const formattedSort = parsedSort.sort ? generateSort(JSON.parse(sort)) : {}

    let aggregateQuery = []
    let matchQuery = { $match: {} },
        addFieldQuery,
        sortQuery,
        facetQuery,
        projectQuery

    if (parsedSearch)
        matchQuery.$match = { name: { $regex: parsedSearch, $options: "i" } }

    if (parsedCategory && parsedCategory.length > 0) {
        matchQuery.$match = {
            ...matchQuery.$match,
            tags: {
                $in: parsedCategory,
            },
        }
    }

    matchQuery.$match = { ...matchQuery.$match, status: "inactive" }

    addFieldQuery = {
        $addFields: {
            total: {
                $multiply: ["$price", "$quantity"],
            },
        },
    }

    facetQuery = {
        $facet: {
            data: [matchQuery, { $skip: skip }, { $limit: limit }],
            totalCount: [matchQuery, { $count: "total" }],
            categories: [
                {
                    $group: {
                        _id: "$tags",
                    },
                },
            ],
        },
    }

    sortQuery = parsedSort && parsedSort.length > 0 && { $sort: formattedSort }

    projectQuery = {
        $project: { data: { status: 0 } },
    }

    aggregateQuery = pushToArrayIfExist([
        addFieldQuery,
        sortQuery,
        facetQuery,
        projectQuery,
    ])

    const items = await Item.aggregate(aggregateQuery)

    res.status(200).json({
        items,
    })
}

const deleteItem = async (req, res) => {
    const { ids } = req.body

    const deleteItemsResult = await Item.deleteMany({ _id: { $in: ids } })

    res.status(200).json({
        message: `${deleteItemsResult.deletedCount} item deleted`,
        count: deleteItemsResult.deletedCount,
    })
}

module.exports = {
    getItems,
    deleteItem,
}
