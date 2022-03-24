export default function FormatDate(rawDate) {
  let date = new Date(rawDate);
  let now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = now.getTime() - date.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  let str;
  if (diffInDays == 0) str = "today ";
  else if (diffInDays == 1) str = "yesterday ";
  else str = diffInDays + " days ago ";
  return (
    str +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
