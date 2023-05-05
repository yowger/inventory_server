const Item = require("../models/Item")
const deleteFile = require("../helper/deleteFile")
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

    matchQuery.$match = { ...matchQuery.$match, status: "active" }

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

const addItem = async (req, res) => {
    const { adminId, name, price, description, quantity, tags } = req.body

    const result = await Item.create({
        adminId,
        name,
        tags,
        price,
        description,
        quantity,
        tags,
    })

    res.status(201).json({
        success: `Item successfully registered`,
    })
}

const addManyItems = async (req, res) => {
    const { data } = req.body

    Item.insertMany(data)

    res.status(201).json({
        success: `Item successfully registered`,
    })
}

const removeItems = async (req, res) => {
    const { ids } = req.body

    const updatedItems = await Item.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" }
    )

    res.status(200).json({
        message: "items removed successfully",
    })
}

const deleteItem = async (req, res) => {
    const { ids } = req.body

    const query = { _id: { $in: ids } }
    const findImages = await Item.find(query).select("adminId images")

    if (findImages.length > 0) {
        findImages.map(async (data) => {
            const path = data.adminId.toString()
            const images = data.images

            images.forEach((fileName) => {
                deleteFile({ path, fileName })
            })
        })
    }

    const deleteItemsResult = await Item.deleteMany({ _id: { $in: ids } })

    res.status(200).json({
        message: `${deleteItemsResult.deletedCount} item deleted`,
        count: deleteItemsResult.deletedCount,
    })
}

const updateItem = async (req, res) => {
    const { id, name, price, description, quantity, tags } = req.body

    const result = await Item.findOneAndUpdate(
        { _id: id },
        {
            name,
            price,
            description,
            quantity,
            tags,
        }
    )

    res.status(200).json({
        success: `updated`,
    })
}

module.exports = {
    getItems,
    addItem,
    addManyItems,
    removeItems,
    deleteItem,
    updateItem,
}
