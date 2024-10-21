const { Op } = require("sequelize");
const databases = require("../config/database/databases");

const checkMeetingConflicts = async (date, startTime, endTime, attendees) => {
  let conflictingAttendees = [];

  // Check each attendee for time conflicts
  for (const attendee of attendees) {
    const attendeeConflict = await databases.meeting.findOne({
      where: {
        date: date,
        attendeesIds: { [Op.like]: `%${attendee}%` },
        [Op.or]: [
          {
            startTime: {
              [Op.lt]: endTime,
            },
            endTime: {
              [Op.gt]: startTime,
            },
          },
        ],
      },
    });

    if (attendeeConflict) {
      conflictingAttendees.push(attendee);
    }
  }

  return {
    conflicts: conflictingAttendees.length > 0,
    conflictingAttendees,
  };
};

// Helper function to add time (for endTime calculation)
const addTime = (startTime, durationInHours) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endTime = new Date();
  endTime.setHours(hours + durationInHours);
  endTime.setMinutes(minutes);
  return endTime.toTimeString().split(" ")[0];
};

const markCalender = async (req, res, meetingData) => {
  try {
    const {
      title,
      isRepeat,
      date,
      startTime,
      endTime,
      meetingMode,
      location,
      description,
      attendees,
      topics,
      _lead,
    } = meetingData;

    const attendeesArray = attendees;

    let newMeeting = await databases.meeting.create({
      title,
      isRepeat,
      date,
      startTime,
      endTime,
      meetingMode,
      location,
      description,
      attendeesIds: attendeesArray.join(","),
      topics,
      _lead,
    });
    if (newMeeting) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message,
    });
  }
};

module.exports = { addTime, checkMeetingConflicts, markCalender };
