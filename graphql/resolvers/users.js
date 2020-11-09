const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { UserInputError } = require("apollo-server")

const User = require("../../models/user")
const { SECRET_KEY } = require("../../config")
const { validateRegisterInput, validateLoginInput } = require("../../util/validators")

function generateToken(user) {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: "1h" })
    return token
}

module.exports = {
    Mutation: {
        async register(_, { registerInput: {
            username,
            password,
            confirmPassword,
            email
        } }) {
            const { valid, errors } = validateRegisterInput(username, password, confirmPassword, email)

            if (!valid) {
                throw new UserInputError("Errors", { errors })
            }

            const user = await User.findOne({ username })

            if (user) {
                throw new UserInputError("Username is taken.", {
                    errors: {
                        username: "This username is taken."
                    }
                })
            }

            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res.id,
                token
            }
        },

        async login(_, {
            username,
            password
        }) {
            const { valid, errors } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError("Errors", { errors })
            }

            const user = await User.findOne({ username })

            if (!user) {
                errors.general = "User not found."
                throw new UserInputError("User not found.", { errors })
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                throw new UserInputError("Wrong credentials", { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user.id,
                token
            }
        }
    }
}