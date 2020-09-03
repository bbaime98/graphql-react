const Event = require("../../models/event")
const {transformEvent} = require("./shared")

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map((event) => {
        // return {...event._doc} this works too
        return transformEvent(event)
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
      creator: "5f42e11d1a1a092bf85265ae",
    })
    let createdEvent
    try {
      const result = await event.save()

      createdEvent = transformEvent(result)
      const creator = await User.findById("5f42e11d1a1a092bf85265ae")
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
}
