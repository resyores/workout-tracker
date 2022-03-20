const router = require("express").Router();
const con = require("../dbScripts/connect");
const path = require("path");
const fs = require("fs");
router.route("/").get((req, res) => {
  let sql = "SELECT * FROM Exercises";
  con.query(sql, function (err, result) {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    } else res.json(result);
  });
});
router.route("/:id").get((req, res) => {
  const options = {
    root: path.join(__dirname, "../"),
  };
  if (fs.existsSync("upload/exercises/" + req.params.id + ".jpg", options)) {
    res.sendFile("upload/exercises/" + req.params.id + ".jpg", options);
  } else res.sendStatus(404);
});
router.route("/add").post((req, res) => {
  const ExerciseName = req.body.exercisename;
  let sql = "Insert Into Exercises (ExerciseName)  Values (?)";
  con.query(sql, [ExerciseName], function (err, result, fields) {
    if (err) {
      if ((err.sqlState = 23000))
        res.status(400).send("Exercise Already Exists");
      else {
        res.sendStatus(500);
        console.log(err);
      }
    } else {
      res.sendStatus(201);
    }
  });
});
module.exports = router;
