const express = require("express");
const cors = require("cors");

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/register", registerRoute);
app.use("/login", loginRoute);

app.listen(3000, () => {
  console.log("Server avviato su http://localhost:3000");
});
