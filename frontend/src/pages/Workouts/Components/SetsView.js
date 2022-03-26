import Set from "./SetRow";
import VideoView from "./VideoView";
export default function SetsView({
  isCommentOpen,
  workout,
  setCurrSetNum,
  WorkoutId,
  token,isCreator
}) {
  return (
    <div id="workouts" className={isCommentOpen ? "w-75" : "w-100"}>
      {workout.map((exerSet, exerIndex) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={
                "http://10.0.0.19:4000/exercises/" + exerSet.exercise.exerciseid
              }
              height={exerSet.size}
              width={exerSet.size}
              className="rounded me-3 mb-0"
            />
            <div className="w-100">
              {exerSet.sets.map((set) => {
                return (
                  <Set
                    exerciseName={exerSet.exercise.exercisename}
                    reps={set.reps}
                    weight={set.weight}
                    index={exerIndex}
                    video={
                      Boolean(set.videoexist) && (
                        <VideoView
                          WorkoutId={WorkoutId}
                          index={set.index}
                          token={token}
                        />
                      )
                    }
                    isCreator={isCreator}
                    openModal={() => {
                      setCurrSetNum(set.index);
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
