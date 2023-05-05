const fs = require("fs")
const { join } = require("path")

const deleteFile = ({ path = "", fileName = "" }) => {
    const imageUrl = join("assets", "images", "items", path, fileName)

    if (fileName) {
        if (fs.existsSync(imageUrl)) {
            fs.unlink(imageUrl, function (error) {
                if (error) {
                    console.log("error deleting file ", error)
                } else return
            })
        }
    }
}

module.exports = deleteFile
