const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const {buildSchema} = require("graphql")
const mongoose = require("mongoose")
var dotenv = require("dotenv")
const Event = require("./models/event")

dotenv.config()
const app = express()

app.use(bodyParser.json())

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
     query: RootQuery
     mutation: RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              // return {...event._doc} this works too
              return {...event._doc, _id: event.id}
            })
          })
          .catch((err) => {
            throw err
          })
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        })
        return event
          .save()
          .then((result) => {
            // return {...result._doc} this works too
            return {...result._doc, _id: result._doc._id.toString()}
          })
          .catch((err) => {
            console.log(err)
            throw err
          })
      },
    },
    graphiql: true,
  })
)

mongoose
  .connect(
    process.env.MONGOLAB_URI,

    {useNewUrlParser: true}
  )
  .then(() => {
    app.listen(3000, () => console.log("Server started"))
  })
  .catch((error) => console.log("database Error", error))
