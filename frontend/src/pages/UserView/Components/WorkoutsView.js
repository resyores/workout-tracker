import SearchDiv from "./SearchDiv";
import Workout from "./WorkoutRow";
export default function WorkoutsView({
  workouts,
  query,
  message,
  lastWorkoutElementRef,
  handleSearch,
  functions,
}) {
  const mine = functions?true:false;
  if (workouts.length || query.length)
    return (
      <>
        <SearchDiv handleSearch={handleSearch} query={query} />
        {workouts.map((workout, index) => {
          if (workouts.length - 1 == index)
            return (
              <span ref={lastWorkoutElementRef}>
                <Workout workout={workout} mine={mine} functions={functions} />
              </span>
            );
          return (
            <Workout workout={workout} mine={mine} functions={functions} />
          );
        })}
      </>
    );
  return <h2 className="text-muted text-center mt-4">{message}</h2>;
}
