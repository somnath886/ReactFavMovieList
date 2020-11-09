const gql = require("graphql-tag")

module.exports = gql`
    type MovieList {
        id: ID!
        username: String!
        movie: [Movies]!
    }
    type Movies {
        title: String!
        image: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    type Query {
        getMovieLists: [MovieList]
        getMovieList(username: String!): MovieList
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String! password: String!): User!
        addtoList(title: String! image: String!): MovieList!
        removefromList(listId: ID! itemId: ID!): MovieList!
    }
`