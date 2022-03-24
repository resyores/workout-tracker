import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import Field from "../../components/BaseComponents/Field";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
export default function Create() {
  const Navigate = useNavigate();
  const [cookies, _] = useCookies(["user", "token"]);
  let exercises = [];
  const [options, setOptions] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [title, setTitle] = useState("");
  const [isPublic, setPublic] = useState(false);
  useEffect(Start, []);

  function chooseExercise(selected) {
    const [index, value] = selected.value.split(" ");
    let temp = [...workout];
    temp[index].exerciseid = value;
    setWorkout(temp);
    console.log(temp);
  }
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    axios.get("http://10.0.0.19:4000/exercises").then((res) => {
      exercises = res.data;
      setOptions(
        exercises.map((exer) => {
          return { value: exer.ExerciseId, label: exer.ExerciseName };
        })
      );
    });
  }
  function addExer() {
    setWorkout([...workout, { exerciseid: -1, sets: [] }]);
  }
  function addSet(index) {
    let temp = [...workout];
    let exerset = temp[index].sets;
    let set;
    console.log(exerset.length);
    if (exerset.length > 0) set = { ...exerset[exerset.length - 1] };
    else set = { reps: 0, weight: 0 };
    exerset.push(set);
    setWorkout(temp);
  }
  function publicToString() {
    if (isPublic) return <h3 class="text-info">public</h3>;
    return <h3 class="text-muted">private</h3>;
  }
  function handleSubmit(event) {
    event.preventDefault();
    let finalWorkout = [...workout];
    finalWorkout.forEach((exerset, index) => {
      if (exerset.exerciseid < 0 || exerset.sets.length == 0) {
        finalWorkout.splice(index, 1);
      }
    });
    if (finalWorkout.length == 0) return;
    axios
      .post("http://10.0.0.19:4000/workouts/add", {
        exersets: finalWorkout,
        public: isPublic,
        title,
      })
      .then((res) => {
        Navigate("/Home", { replace: true });
      });
  }
  function AddSetBtn({ index }) {
    return (
      <Button
        className="btn-outline-info btn-light btn-sml"
        onClick={() => {
          addSet(index);
        }}
      >
        <h5>+ Set</h5>
      </Button>
    );
  }
  function SetView({ set }) {
    return (
      <div class="d-flex flex-row">
        <input
          type="number"
          class="form-group ms-2"
          style={{ width: 50, height: 30 }}
          defaultValue={set.weight}
          min="0"
          onChange={(event) => {
            set.weight = parseInt(event.target.value);
          }}
        />
        kg X
        <input
          type="number"
          class="form-group ms-2"
          style={{ width: 50, height: 30 }}
          min="0"
          defaultValue={set.reps}
          onChange={(event) => {
            set.reps = parseInt(event.target.value);
          }}
        />
        reps
      </div>
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div class="d-flex flex-row w-100">
          <Field Name="title" Label="Title:" Type="text" setter={setTitle} />
          <div
            onClick={() => {
              setPublic(!isPublic);
            }}
          >
            {publicToString()}
          </div>
        </div>
        {workout.map((exerSet, index) => {
          return (
            <div className="d-flex">
              {exerSet.exerciseid >= 0 && (
                <img
                  src={"http://10.0.0.19:4000/exercises/" + exerSet.exerciseid}
                  height={80}
                  width={80}
                  className="rounded me-3 mb-4"
                />
              )}

              <div className="w-100">
                <Select
                  options={options.map((option) => {
                    return {
                      value: index + " " + option.value,
                      label: option.label,
                    };
                  })}
                  onChange={chooseExercise}
                  className="w-50"
                />

                {exerSet.sets.map((set) => {
                  return <SetView set={set} />;
                })}
                <AddSetBtn index={index} />
              </div>
            </div>
          );
        })}
        <Button className="btn-outline-info btn-light w-25" onClick={addExer}>
          <h5>+ Exercise</h5>
        </Button>
        <div className="text-center">
          <Button
            block
            size="lg"
            type="submit"
            className="submit-btn btn-success w-50"
          >
            Create
          </Button>
        </div>
      </Form>
    </>
  );
}
