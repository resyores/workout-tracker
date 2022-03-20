const port = process.env.SOCKET_PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const verifyUserAuth = require("../authScripts/verifyUserAuth");
const con = require("../dbScripts/connect");
const jwt = require("jsonwebtoken");
const io = require("socket.io")(port, {
  cors: {
    origin: ["http://localhost:3000", "http://10.0.0.19:3000"],
    methods: ["GET"],
  },
});
const rooms = {};
io.on("connection", (socket) => {
  socket.on("new-user", (id, token) => {
    let user;
    jwt.verify(token, SECRET_KEY, (err, authData) => {
      if (err) return;
      user = authData.user;
    });
    if (!user) return;
    console.log(id);
    const WorkoutSql = "Select UserId,public From Workouts Where WorkoutId=?";
    const workoutPromise = new Promise((resolve) => {
      con.query(WorkoutSql, [id], (err, result) => {
        if (err) return console.log(err);
        if (result.length == 0) return;
        resolve(result[0].UserId, result[0].public);
      });
    });

    workoutPromise.then((userId, public) => {
      console.log("hey");
      verifyUserAuth(userId, user.UserID, public).then((isAuth) => {
        if (!isAuth) return;
        if (!rooms[id]) createRoom(id);
        socket.join(id);
        rooms[id].users[socket.id] = user;
      });
    });
  });
  socket.on("disconnect", () => {
    Object.keys(rooms).forEach((id) => {
      if (!rooms[id].users[socket.id]) return;
      delete rooms[id].users[socket.id];
      if (Object.keys(rooms[id].users).length == 0) delete rooms[id];
      console.log(rooms);
    });
  });
});
function createRoom(id) {
  if (!rooms[id])
    rooms[id] = {
      users: {},
      sendMessage: (message, user) => {
        console.log(this.users);
        io.in(id).emit("chat-message", {
          message,
          user: { UserName: user.username, UserID: user.UserID },
        });
      },
    };
}
function getRoom(id) {
  return rooms[id];
}
module.exports = { createRoom, getRoom };
