//Format the date before displaying
const changeDateFormat = (isoDate) => {
  if (!isoDate) return "Invalid Date";

  const date = new Date(isoDate);
  const options = { day: "numeric", month: "short", year: "numeric" };

  return date.toLocaleDateString("en-GB", options); // Example: "1 Jan 2000"
};

export { changeDateFormat };