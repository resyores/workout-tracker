const con = require("../dbScripts/connect");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
function addWorkout(req, res) {
  let user;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) return res.sendStatus(401);

    user = authData.user;
  });
  if (!user) return;
  const UserId = user.UserID;
  let public = req.body.public;
  let title = req.body.title;
  if (public === undefined) public = false;
  if (!title) return res.sendStatus(400);
  const exerSets = req.body.exersets;
  console.log();
  let exerciseSql =
    "SELECT sum(i)>0 as error from" +
    "(Select column_0 not in(select exerciseid from exercises) as i FROM " +
    "(VALUES ?) my_list)my_table;";
  let workoutSql =
    "Insert Into Workouts (UserId,public,WorkoutDate,title)  Values (?)";
  let exerSetsSql = "Insert Into exercisessets (WorkoutId,ExerciseId) values ?";
  let SetSql = "Insert Into Sets (ExerSetId,Reps,Weight) values ?";
  let exerciseRows = "";
  for (exerSet of exerSets) {
    if (Number.isInteger(Number(exerSet.exerciseid)))
      exerciseRows += "Row(" + exerSet.exerciseid + "),";
    else {
      res.sendStatus(400);
      return;
    }
  }
  exerciseSql = exerciseSql.replace(
    "?",
    exerciseRows.substring(0, exerciseRows.length - 1)
  );
  exerciseExistPromise = new Promise((resolve) => {
    con.query(exerciseSql, [], function (err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result[0].error) return res.sendStatus(400);
      resolve();
    });
  });
  exerciseExistPromise.then(() => {
    con.query(
      workoutSql,
      [[UserId, public, new Date(), title]],
      function (err, result) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        const WorkoutId = result.insertId;
        let exerSetsOnly;
        try {
          exerSetsOnly = exerSets.map((exerSet) => {
            return [WorkoutId, exerSet.exerciseid];
          });
        } catch (e) {
          return res.sendStatus(400);
        }
        const exersetPromise = new Promise((resolve) => {
          con.query(exerSetsSql, [exerSetsOnly], function (err, result2) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            const firstExerSetId = result2.insertId;
            let sets = [];
            try {
              exerSets.forEach((exerSet, index) => {
                const ExerSetId = firstExerSetId + index;
                exerSet.sets.forEach((set) => {
                  sets.push([ExerSetId, Number(set.reps), Number(set.weight)]);
                });
              });
              if (sets.length == 0) {
                return res.sendStatus(400);
              }
              resolve(sets);
            } catch (e) {
              return res.sendStatus(400);
            }
          });
        });
        exersetPromise.then((sets) => {
          con.query(SetSql, [sets], function (err) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
          });
        });
      }
    );
    if (!res.headersSent) res.sendStatus(201);
  });
}
module.exports = addWorkout;
