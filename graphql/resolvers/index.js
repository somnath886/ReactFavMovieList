const movielistsResolvers = require("./movie-lists")
const userResolvers = require("./users")

module.exports = {
    Query: {
        ...movielistsResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...movielistsResolvers.Mutation
    }
}