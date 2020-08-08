const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());

mongoose.connect(
  "mongodb+srv://akbar:h3xac0re@cluster0.1dpvv.mongodb.net/graphql-akbar?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.once("open", () => {
  console.log("MongoDB Connected :)");
});

const PORT = process.env.PORT || 5000;
const schema = require("./schema/schema");

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema, //since the object name is the same u can just put schema name only
    graphiql: true, //this object is for using graphiql tool in a browser if set to true then u can use it
  })
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
