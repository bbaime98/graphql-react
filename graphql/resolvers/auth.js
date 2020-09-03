const bcrypt = require("bcryptjs")
const User = require("../../models/user")
const jwt = require("jsonwebtoken")
var dotenv = require("dotenv")

dotenv.config()

module.exports = {
  createUser: async (args) => {
    try {
      const userExist = await User.findOne({
        email: args.userInput.email,
      })
      if (userExist) {
        throw new Error("User already exist.")
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      })

      const result = await newUser.save()

      return {...result._doc, password: null, _id: result.id}
    } catch (error) {
      throw error
    }
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email})
    if (!user) {
      throw new Error("User does not exist")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error("Password is incorrect")
    }
    const token = jwt.sign(
      {userId: user.id, email: user.email},
      process.env.JWTKEY,
      {
        expiresIn: "1h",
      }
    )
    return {userId: user.id, token: token, tokenExpiration: 1}
  },
}
