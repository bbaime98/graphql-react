const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const mongoose = require("mongoose")
var dotenv = require("dotenv")
const graphqlSchema = require("./graphql/schema/index")
const graphqlResolvers = require("./graphql/resolvers/index")
const isAuth = require("./middleware/protectRoute")

dotenv.config()
const app = express()

app.use(bodyParser.json())

app.use(isAuth)

app.use("/", (req, res) => res.send("Welcome to the bookshop Api"))
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
)

mongoose
  .connect(
    process.env.MONGOLAB_URI,

    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => {
    app.listen(process.env.PORT, () => console.log("Server started"))
  })
  .catch((error) => console.log("database Error", error))
