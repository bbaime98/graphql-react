const DataLoader = require("dataloader")
const Event = require("../../models/event")
const User = require("../../models/user")
const {dateToString} = require("../../helpers/date")

const eventLoader = new DataLoader((eventsIds) => {
  return events(eventsIds)
})

const userLoader = new DataLoader((userIds) => {
  return User.find({_id: {$in: userIds}})
})
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
    const event = await eventLoader.load(eventId.toString())
    return event
  } catch (error) {
    throw error
  }
}

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      // ...user._doc,
      email: user.email,
      _id: user.id,
      // it is supposed to be like this..but there is a bug to be fixed
      // createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),

      createdEvents: events.bind(this, user._doc.createdEvents),
    }
  } catch (error) {
    throw error
  }
}

const transformEvent = (event) => {
  return {
    // ...event._doc,
    _id: event.id,
    title: event.title,
    description: event.description,
    price: event.price,
    date: event.date,
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
