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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server avviato sulla porta", PORT);
});
