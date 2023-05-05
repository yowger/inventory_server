const pushToArrayIfExist = (data) => {
    const filteredArray = data.filter((value) => {
        if (value) return value
    })

    return filteredArray
}

module.exports = pushToArrayIfExist
