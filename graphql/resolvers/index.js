const bcrypt = require("bcryptjs")

const Event = require("../../models/event")
const User = require("../../models/user")

const events = async (eventIds) => {
  try {
    const events = await Event.find({_id: {$in: eventIds}})
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator),
        date: new Date(event._doc.date).toISOString(),
      }
    })
  } catch (err) {
    throw err
  }
}

const user = async (userId) => {
  try {
    const user = await User.findById(userId)
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map((event) => {
        // return {...event._doc} this works too
        return {
          ...event._doc,
          _id: event.id,
          creator: user.bind(this, event._doc.creator),
          date: new Date(event._doc.date).toISOString(),
        }
      })
    } catch (error) {
      throw error
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f3cbd4c8c2bb24f1c2f71ca",
    })
    let createdEvent
    try {
      const result = await event.save()

      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: user.bind(this, result._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      }
      const creator = await User.findById("5f3cbd4c8c2bb24f1c2f71ca")
      // return {...result._doc} this works too
      if (!creator) {
        throw new Error("User not found.")
      }
      creator.createdEvents.push(event)
      await creator.save()
      return createdEvent
    } catch (error) {
      throw error
    }
  },

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
