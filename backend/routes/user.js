const router = require("express").Router();
const con = require("../dbScripts/connect");
const verifyToken = require("../authScripts/verifyToken");
const verifyUserAuth = require("../authScripts/verifyUserAuth");
const checkIfInvite = require("../authScripts/verifyFriend").checkIfInvite;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const WorkoutsPerPage = 10;
const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/profiles");
  },
  filename: function (req, file, cb) {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (!whitelist.includes(file.mimetype)) return;
      cb(null, "" + authData.user.UserID + ".jpg");
    });
  },
});
const upload = multer({ storage });
const SECRET_KEY = process.env.SECRET_KEY;
router.route("/:id/workouts").get(verifyToken, (req, res) => {
  let query = "%" + req.query.q + "%";
  let page = req.query.page || 1;
  if (!Number.isInteger(Number(page)) || page < 0) {
    res.sendStatus(400);
    return;
  }
  page--;
  let workoutSql =
    "Select WorkoutId,Title,WorkoutDate,public from Workouts where UserId=? and public and Title Like ? order by WorkoutDate desc limit ? offset ?";
  let user;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) return res.sendStatus(401);
    user = authData.user;
  });
  if (!user) return;
  let UserID = user.UserID;
  let FriendId = req.params.id;
  if (UserID == FriendId) workoutSql = workoutSql.replace(" and public", "");
  verifyUserAuth(UserID, FriendId)
    .then((isAuth) => {
      if (isAuth) {
        con.query(
          workoutSql,
          [FriendId, query, WorkoutsPerPage, page * WorkoutsPerPage],
          function (err, result) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            res.json(result);
          }
        );
      } else res.json([]);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});
router.route("/:id/userdata").get(verifyToken, (req, res) => {
  let FriendSql = "Select UserName,Email from users where UserId=?";
  let user;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) return res.sendStatus(401);
    user = authData.user;
  });
  if (!user) return;
  let UserID = user.UserID;
  let FriendId = req.params.id;
  verifyUserAuth(UserID, FriendId)
    .then((isAuth) => {
      const FriendPromise = new Promise((resolve) => {
        con.query(FriendSql, [FriendId], function (err, result) {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          resolve(result);
        });
      });
      FriendPromise.then((result) => {
        if (isAuth) {
          res.json({
            isauth: true,
            userdata: result[0],
          });
        } else {
          checkIfInvite(UserID, FriendId)
            .then((isInvited) =>
              res.json({
                isauth: false,
                userdata: result[0],
                invited: isInvited,
              })
            )
            .catch((err) => {
              console.log(err);
              res.sendStatus(500);
            });
        }
      });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});
router
  .route("/addPicture")
  .post(verifyToken, upload.single("ProfilePicture"), (req, res) => {
    let user;
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) return res.sendStatus(401);
      user = authData.user;
    });
    if (!user) return;
    res.sendStatus(200);
  });
router.route("/profile/:id").get((req, res) => {
  const options = {
    root: path.join(__dirname, "../"),
  };
  if (fs.existsSync("upload/profiles/" + req.params.id + ".jpg", options)) {
    res.sendFile("upload/profiles/" + req.params.id + ".jpg", options);
  } else res.sendStatus(404);
});
module.exports = router;
