const express = require("express");
const cors = require("cors");

const con = require("./dbScripts/connect");

const AuthRouter = require("./routes/Auth");
const userRouter = require("./routes/user");
const friendsRouter = require("./routes/friends");
const invitesRouter = require("./routes/invites");
const commentRouter = require("./routes/comment");
const exercisesRouter = require("./routes/exercises");
const workoutsRouter = require("./routes/workouts");
const messagesRouter = require("./routes/messages");
const uploadVideosRouter = require("./routes/Upload");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use("/Auth", AuthRouter);
app.use("/exercises", exercisesRouter)
app.use("/workouts", workoutsRouter);
app.use("/user", userRouter);
app.use("/friends", friendsRouter);
app.use("/invites", invitesRouter);
app.use("/comment", commentRouter);
app.use("/messages", messagesRouter);
app.use("/SetVideo", uploadVideosRouter);
con.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});
app.listen(port, () => {
  console.log("Server is running on port:" + port);
});
