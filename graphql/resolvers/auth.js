const bcrypt = require("bcryptjs")
const User = require("../../models/user")

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
}
