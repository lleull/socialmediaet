const express = require("express");
const morgan = require("morgan");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./Routes/User");
const authRoute = require("./Routes/Auth");

const postRoute = require("./Routes/Post");
app.use(express.json());

app.use(morgan("common"));
dotenv.config();
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/post", postRoute);
main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Atlas Connected"))
    .catch((err) => console.log(err));
}
app.post("/", (req, res) => {
  res.json("Whats Up");
});
app.listen(3001, () => {
  console.log("BackEnd Connection");
});
