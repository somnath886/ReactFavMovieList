const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")

const { MONGODB } = require("./config")
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

mongoose.connect(MONGODB, {
    useNewUrlParser: true
})
.then(() => {
    console.log("Connected to the Database")
    return server.listen({ port: 5000 })
}).then(res => {
    console.log(`server running at ${res.url}`)
})