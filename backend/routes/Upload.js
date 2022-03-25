const multer = require("multer");
const verifyToken = require("../authScripts/verifyToken");
const router = require("express").Router();
const con = require("../dbScripts/connect");
const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const SetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.mimetype);
    cb(null, "./upload/videos/sets");
  },
  filename: function (req, file, cb) {
    let UserId;
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err || !file.mimetype.startsWith("video")) return;
      UserId = authData.user.UserID;
    });
    if (!UserId) return;
    const WorkoutId = req.params.WorkoutId;
    let SetNum = Number(req.params.set);
    if (!Number.isInteger(SetNum) || SetNum < 1) 
      return;
    
    SetNum--;
    const Sql =
      "SELECT s.SetId,w.UserId FROM sets s " +
      "join exercisessets e using (exersetid) " +
      "join workouts w using(WorkoutId) " +
      "where w.WorkoutId=? " +
      "limit 1 offset ?";
    con.query(Sql, [WorkoutId, SetNum], function (err, result) {
      if (err) console.log(err);
      else if(result.length!=0){
        if (result[0].UserId == UserId) {
          cb(null, result[0].SetId + ".mp4");
        }
      }
    });
  },
});
const upload = multer({ storage: SetStorage });
router
  .route("/:WorkoutId/:set")
  .post(verifyToken, upload.single("video"), (req, res) => {
    let user;
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) return res.sendStatus(401);
      user = authData.user;
    });
    if (!user) return;
    res.sendStatus(200);
  });
module.exports = router;
