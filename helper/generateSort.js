const generateSort = (data) => {
    if (!data) return {}

    return data.reduce((accumulated, current) => {
        const field = current.field
        const value = current.sort === "asc" ? -1 : 1

        return (accumulated[field] = value), accumulated
    }, {})
}

module.exports = generateSort
