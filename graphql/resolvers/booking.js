const Booking = require("../../models/booking")
const Event = require("../../models/event")
const {transformBooking, transformEvent} = require("./shared")

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unauthenticated")
    }
    try {
      const bookings = await Booking.find({user: req.userId})
      return bookings.map((booking) => {
        return transformBooking(booking)
        // return {
        //   ...booking._doc,
        //   _id: booking.id,
        //   user: user.bind(this, booking._doc.user),
        //   event: singleEvent.bind(this, booking._doc.event),
        //   createdAt: dateToString(booking._doc.createdAt),
        //   updatedAt: dateToString(booking._doc.createdAt),
        // }
      })
    } catch (error) {
      throw error
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unauthenticated")
    }
    try {
      const fetchedEvent = await Event.findOne({_id: args.eventId})
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      })
      const result = await booking.save()
      return transformBooking(result)
    } catch (error) {
      throw error
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unauthenticated")
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event")
      const event = transformEvent(booking.event)
      await Booking.deleteOne({_id: args.bookingId})
      return event
    } catch (error) {
      throw error
    }
  },
}
