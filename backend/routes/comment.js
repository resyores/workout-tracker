const router = require("express").Router();
const con = require("../dbScripts/connect");
const verifyToken = require("../authScripts/verifyToken");
const verifyUserAuth = require("../authScripts/verifyUserAuth");
const jwt = require("jsonwebtoken");
const { sendMessage, getWorkoutRoom } = require("../socketScripts/commentsSocket");
const MarkSeen = require("../utils/MarkSeen");
const SECRET_KEY = process.env.SECRET_KEY;
router.route("/:WorkoutId").post(verifyToken, (req, res) => {
  let user;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) return res.sendStatus(401);

    user = authData.user;
  });
  if (!user) return;
  const tokenUserId = user.UserID;
  const Content = req.body.content;
  const WorkoutId = req.params.WorkoutId;
  if (!Content || !WorkoutId) return res.sendStatus(400);
  const commentSql =
    "Insert into comments (CommentorId,WorkoutId,content,postdate) Values (?) ";
  const workoutPromise = new Promise((resolve) => {
    const WorkoutSql = "Select UserId,public From Workouts Where WorkoutId=?";
    con.query(WorkoutSql, [WorkoutId], (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result.length == 0) return res.sendStatus(400);
      resolve(result[0].UserId, result[0].public);
    });
  });

  workoutPromise.then((userId, public) => {
    verifyUserAuth(userId, tokenUserId, public)
      .then((isAuth) => {
        if (!isAuth) return res.sendStatus(403);
        con.query(
          commentSql,
          [[tokenUserId, WorkoutId, Content, new Date()]],
          (err) => {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            if (userId == tokenUserId) {
              MarkSeen(WorkoutId).catch((e) => console.log(e));
            }
            res.sendStatus(201);
            const room = getWorkoutRoom(String(WorkoutId));
            if (room) {
               room.sendMessage(Content, user, room.creator);
              if (room.creatorOnline) MarkSeen(WorkoutId);
            } else sendMessage(userId, WorkoutId);
          }
        );
      })
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
  });
});
module.exports = router;
