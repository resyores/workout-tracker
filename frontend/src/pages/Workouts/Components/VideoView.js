export default function VideoView({ WorkoutId, index, token }) {
  return (
    <video
      width="480"
      height="360"
      controls
      className="rounded mb-auto me-auto"
    >
      <source
        src={`http://10.0.0.19:4000/SetVideo/${WorkoutId}/${index}/video.mp4?token=${token}`}
        type="video/mp4"
      />
    </video>
  );
}
