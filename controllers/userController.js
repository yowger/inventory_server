const User = require("../models/User")

const addUser = async (req, res) => {
    const { name, role } = req.body

    await User.create({
        name,
        role,
    })

    res.status(201).json({ success: `${name} has been created` })
}

const updateLogin = async (req, res) => {
    const { id } = req.body

    if (!id) res.status(400).json({ message: "User Id required" })

    await User.findOneAndUpdate(
        { _id: id },
        {
            updatedAt: Date.now(),
        }
    )

    res.status(200).json({ success: "login updated" })
}

const getUsers = async (req, res) => {
    const users = await User.find()

    res.status(200).json(users)
}

module.exports = { addUser, getUsers, updateLogin }
