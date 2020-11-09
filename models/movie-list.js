const { model, Schema } = require("mongoose")

const movielistSchema = new Schema({
    username: String,
    movie: [
        {
            title: String,
            image: String
        }
    ]

})

module.exports = model("MovieList", movielistSchema)