const port = process.env.SOCKET_PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const verifyUserAuth = require("../authScripts/verifyUserAuth");
const con = require("../dbScripts/connect");
const jwt = require("jsonwebtoken");
const { verifyFriend } = require("../authScripts/verifyFriend");
const io = require("socket.io")(port, {
  cors: {
    origin: ["http://localhost:3000", "http://10.0.0.19:3000"],
    methods: ["GET"],
  },
});
const rooms = {};
const onlineUsers = {};
io.on("connection", (socket) => {
  socket.on("new-user", (token) => {
    let user;
    jwt.verify(token, SECRET_KEY, (err, authData) => {
      if (err) return;
      user = authData.user;
    });
    if (!user) return;
    onlineUsers[user.UserID] = socket.id;
  });
  socket.on("enter-room", (id, token) => {
    const roomId = "w-" + id;
    let user;
    jwt.verify(token, SECRET_KEY, (err, authData) => {
      if (err) return;
      user = authData.user;
    });
    if (!user) return;
    const WorkoutSql = "Select UserId,public From Workouts Where WorkoutId=?";
    const workoutPromise = new Promise((resolve) => {
      con.query(WorkoutSql, [id], (err, result) => {
        if (err) return console.log(err);
        if (result.length == 0) return;
        resolve(result[0].UserId, result[0].public);
      });
    });

    workoutPromise.then((userId, public) => {
      verifyUserAuth(userId, user.UserID, public).then((isAuth) => {
        if (!isAuth) return;
        if (!rooms[roomId]) createWorkoutRoom(id, userId);
        socket.join(roomId);
        rooms[roomId].users[socket.id] = user.UserID;
        if (user.UserID == userId) rooms[roomId].creatorOnline = true;
      });
    });
  });
  socket.on("enter-chat", (id, token) => {
    let user;
    jwt.verify(token, SECRET_KEY, (err, authData) => {
      if (err) return;
      user = authData.user;
    });
    if (!user) return;
    const userId = Number(user.UserID);
    verifyFriend(id, userId).then((isFriend) => {
      if (!isFriend) return;
      let numid = Number(id);
      const roomId = Math.min(numid, userId) + "-c-" + Math.max(numid, userId);
      if (!rooms[roomId]) createChatRoom(numid, userId);
      socket.join(roomId);
      rooms[roomId].users[socket.id] = user.UserID;
    });
  });
  socket.on("disconnect", () => {
    exitAllRooms(socket.id);
    exitOnlineUsers(socket.id);
  });
});
function exitAllRooms(SocketId) {
  Object.keys(rooms).forEach((id) => {
    if (!rooms[id].users[SocketId]) return;
    delete rooms[id].users[SocketId];
    if (Object.keys(rooms[id].users).length == 0) delete rooms[id];
  });
}
function exitOnlineUsers(SocketId) {
  Object.keys(onlineUsers).forEach((userId) => {
    if (onlineUsers[userId] == SocketId) delete onlineUsers[userId];
  });
}
function createWorkoutRoom(id, creatorId) {
  const roomId = "w-" + id;
  if (!rooms[roomId])
    rooms[roomId] = {
      users: {},
      creator: creatorId,
      creatorOnline: false,
      sendMessage: (message, sender, creator) => {
        let user = { UserName: sender.username, UserID: sender.UserID };
        console.log(rooms);
        io.in(roomId).emit("chat-message", {
          message,
          user,
        });
        if (onlineUsers[creator])
          io.to(onlineUsers[creator]).emit("new-comment", id, user, message);
      },
    };
}
function createChatRoom(id1, id2) {
  const roomId = Math.min(id1, id2) + "-c-" + Math.max(id1, id2);
  if (!rooms[roomId])
    rooms[roomId] = {
      users: {},
      messagors: [id1, id2],
      sendMessage: (reciver, message, username) => {
        io.in(roomId).emit("message", message);
        io.to(onlineUsers[reciver]).emit(
          "new-message",
          reciver == id1 ? id2 : id1,
          username,
          message
        );
      },
    };
  //alert if not online
}
function getChatRoom(id1, id2) {
  const roomId = Math.min(id1, id2) + "-c-" + Math.max(id1, id2);
  return rooms[roomId];
}
function getWorkoutRoom(id) {
  return rooms["w-" + id];
}
function sendMessage(UserId, WorkoutId) {
  if (onlineUsers[UserId])
    io.to(onlineUsers[UserId]).emit("new-comment", WorkoutId);
}
module.exports = { getWorkoutRoom, sendMessage, getChatRoom };
