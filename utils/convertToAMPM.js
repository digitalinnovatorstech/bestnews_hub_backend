const convertToAMPM = (time) => {
  console.log(time);

  if (typeof time !== "string") {
    throw new TypeError("Expected a string as the time argument");
  }

  const [hours, minutes] = time.split(":");
  const hoursNum = parseInt(hours, 10);
  const ampm = hoursNum >= 12 ? "PM" : "AM";
  const formattedHours = hoursNum % 12 || 12; // Convert 0 to 12
  return `${formattedHours}:${minutes} ${ampm}`;
};

module.exports = { convertToAMPM };
