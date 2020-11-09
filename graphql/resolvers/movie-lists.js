const { AuthenticationError, UserInputError } = require("apollo-server")

const MovieList = require("../../models/movie-list")
const checkAuth = require("../../util/check-auth")

module.exports = {
    Query: {
        async getMovieLists() {
            try {
                const MovieLists = await MovieList.find()
                return MovieLists
            } catch(err) {
                throw new Error(err)
            }
        },

        async getMovieList(_, {username}) {
            try {
                const list = await MovieList.findOne({
                    username: username
                })
                if (list) {
                    return list
                } else {
                    throw new Error("List not found.")
                }
            } catch(err) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async addtoList(_, {
            title,
            image
        }, context) {
            const user = checkAuth(context)

            if (title === "") {
                throw new UserInputError("Title cannot be empty")
            }                
            if (image === "") {
                throw new UserInputError("Image cannot be empty")
            }
            const list = await MovieList.findOne({
                username: user.username
            })

            let count = 0

            list.movie.map((i) => {
                if (i.title === title) {
                    count += 1
                }
            })

            if (count > 0) {
                throw new UserInputError("Already in the list.")
            } else if (count === 0) {
                list.movie.unshift({
                    title,
                    image
                })
                const res = await list.save()
                return res
            } else if (!list) {
                let newlist = new MovieList({
                    username: user.username
                })
                newlist.movie.unshift({
                    title,
                    image
                })
                const res = await newlist.save()
                return res
            }
        },
        async removefromList(_, {
            listId,
            itemId
        }, context) {
            const { username } = checkAuth(context)

            const list = await MovieList.findById(listId)

            if (list) {
                const itemIndex = list.movie.findIndex((i) => i.id === itemId)
                if (list.username === username) {
                    list.movie.splice(itemIndex, 1)
                    await list.save()
                    return list
                } else {
                    throw new AuthenticationError('Action not allowed.')
                }
            } else {
                throw new UserInputError('List not found.')
            }
        }
    }
}
