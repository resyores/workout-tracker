const multer = require("multer");
const verifyToken = require("../authScripts/verifyToken");
const router = require("express").Router();
const con = require("../dbScripts/connect");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const verifyUserAuth = require("../authScripts/verifyUserAuth");
const SECRET_KEY = process.env.SECRET_KEY;
const SetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/videos/sets");
  },
  filename: function (req, file, cb) {
    if (!file.mimetype.startsWith("video")) cb("error");
    else cb(null, req.SetId + ".mp4");
  },
});
const upload = multer({ storage: SetStorage }).single("video");
router.route("/:WorkoutId/:set").post(verifyToken, (req, res) => {
  let UserId;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) return res.sendStatus(401);

    UserId = authData.user.UserID;
  });
  if (!UserId) return;
  const WorkoutId = req.params.WorkoutId;
  let SetNum = Number(req.params.set);
  if (!Number.isInteger(SetNum) || SetNum < 0) {
    return res.sendStatus(400);
  }
  const CheckSetSql =
    "SELECT s.SetId,w.UserId FROM sets s " +
    "join exercisessets e using (exersetid) " +
    "join workouts w using(WorkoutId) " +
    "where w.WorkoutId=? " +
    "limit 1 offset ?";
  const UpdateSetSql = "update sets set VideoExist=true where setid=?";
  con.query(CheckSetSql, [WorkoutId, SetNum], function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result.length == 0 || result[0].UserId != UserId) {
      res.sendStatus(400);
    } else {
      req.SetId = result[0].SetId;
      upload(req, res, (err) => {
        if (err) res.sendStatus(400);
        else {
          con.query(UpdateSetSql, [req.SetId], function (err) {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else res.sendStatus(200);
          });
        }
      });
    }
  });
});
router.route("/:WorkoutId/:set/video.mp4").get((req, res) => {
  const CheckSetSql =
    "SELECT w.UserId,w.public,s.SetId,s.VideoExist FROM sets s " +
    "join exercisessets e using (exersetid) " +
    "join workouts w using(WorkoutId) " +
    "where w.WorkoutId=? " +
    "limit 1 offset ?";
  let UserId;
  jwt.verify(req.query.token, SECRET_KEY, (err, authData) => {
    if (err) {
      return res.sendStatus(401);
    }
    UserId = authData.user.UserID;
  });
  if (!UserId) return;
  const WorkoutId = req.params.WorkoutId;
  let SetNum = Number(req.params.set);
  if (!Number.isInteger(SetNum) || SetNum < 0) {
    return res.sendStatus(400);
  }
  con.query(CheckSetSql, [WorkoutId, SetNum], function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result.length == 0) res.sendStatus(400);
    else {
      if (!result[0].VideoExist) return res.sendStatus(404);
      const SetId = result[0].SetId;
      verifyUserAuth(UserId, result[0].UserId, result[0].public).then(
        (isAuth) => {
          if (!isAuth) return res.sendStatus(403);
          const options = {
            root: path.join(__dirname, "../"),
          };
          if (fs.existsSync("upload/videos/sets/" + SetId + ".mp4", options)) {
            res.sendFile("upload/videos/sets/" + SetId + ".mp4", options);
          } else res.sendStatus(404);
        }
      );
    }
  });
});
module.exports = router;
