const Event = require("../../models/event")
const User = require("../../models/user")
const {dateToString} = require("../../helpers/date")

const events = async (eventIds) => {
  try {
    const events = await Event.find({_id: {$in: eventIds}})
    return events.map((event) => {
      return transformEvent(event)
    })
  } catch (err) {
    throw err
  }
}

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return transformEvent(event)
  } catch (error) {
    throw error
  }
}

const user = async (userId) => {
  try {
    const user = await User.findById(userId)
    return {
      // ...user._doc,
      _id: user.id,
      email: user.email,
      // createdEvents: events.bind(this, user._doc.createdEvents),
    }
  } catch (error) {
    throw error
  }
}

const transformEvent = (event) => {
  return {
    title: event.title,
    description: event.description,
    price: event.price,
    date: event.date,
    _id: event.id,
    creator: user.bind(this, event.creator),
    date: dateToString(event._doc.date),
  }
}

const transformBooking = (booking) => {
  return {
    // ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}

exports.transformBooking = transformBooking
exports.transformEvent = transformEvent
