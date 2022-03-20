const router = require("express").Router();
const con = require("../dbScripts/connect");
const verifyToken = require("../authScripts/verifyToken");
const verifyUserAuth = require("../authScripts/verifyUserAuth");
const jwt = require("jsonwebtoken");
const { CreateRoom, getRoom } = require("../socketScripts/commentsSocket");
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
    "Insert into comments (CommentorId,WorkoutId,content) Values (?) ";
  let userId, public;
  const workoutPromise = new Promise((resolve) => {
    const WorkoutSql = "Select UserId,public From Workouts Where WorkoutId=?";
    con.query(WorkoutSql, [WorkoutId], (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result.length == 0) return res.sendStatus(400);
      userId = result[0].UserId;
      public = result[0].public;
      resolve();
    });
  });

  workoutPromise.then(() => {
    verifyUserAuth(userId, tokenUserId, public)
      .then((isAuth) => {
        if (!isAuth) return res.sendStatus(403);
        con.query(commentSql, [[tokenUserId, WorkoutId, Content]], (err) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          res.sendStatus(201);
          console.log(WorkoutId);
          const room = getRoom(String(WorkoutId));
          if (!room) return;
          room.sendMessage(
            Content,
            Object.values(room.users).filter(
              (user) => user.UserID == tokenUserId
            )[0]
          );
        });
      })
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
  });
});
module.exports = router;
