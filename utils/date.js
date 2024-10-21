const getWeekDateRange = (date) => {
  const startOfWeek = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    )
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
  startOfWeek.setUTCHours(0, 0, 0, 0);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

const getMonthDateRange = (date) => {
  const startOfMonth = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), 1)
  );
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const endOfMonth = new Date(
    Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)
  );
  endOfMonth.setUTCHours(23, 59, 59, 999);

  return { startOfMonth, endOfMonth };
};

const getWeeklyRanges = (startOfMonth, endOfMonth) => {
  const weeks = [];
  let currentStart = new Date(startOfMonth);

  currentStart = new Date(
    Date.UTC(
      currentStart.getUTCFullYear(),
      currentStart.getUTCMonth(),
      currentStart.getUTCDate()
    )
  );
  endOfMonth = new Date(
    Date.UTC(
      endOfMonth.getUTCFullYear(),
      endOfMonth.getUTCMonth(),
      endOfMonth.getUTCDate()
    )
  );

  while (currentStart <= endOfMonth) {
    const currentEnd = new Date(currentStart);
    currentEnd.setUTCDate(currentStart.getUTCDate() + 6);
    currentEnd.setUTCHours(23, 59, 59, 999);

    if (currentEnd > endOfMonth) {
      currentEnd.setTime(endOfMonth.getTime());
      currentEnd.setUTCHours(23, 59, 59, 999);
    }

    weeks.push({
      start: new Date(currentStart.toISOString()),
      end: new Date(currentEnd.toISOString()),
    });

    currentStart.setUTCDate(currentStart.getUTCDate() + 7);
  }

  return weeks;
};

const getDailyRanges = (startOfWeek, endOfWeek) => {
  const days = [];
  let currentStart = new Date(startOfWeek);

  while (currentStart <= endOfWeek) {
    const currentEnd = new Date(currentStart);

    currentEnd.setUTCHours(23, 59, 59, 999);

    days.push({
      start: new Date(currentStart.toISOString()),
      end: new Date(currentEnd.toISOString()),
    });

    currentStart.setUTCDate(currentStart.getUTCDate() + 1);
    currentStart.setUTCHours(0, 0, 0, 0);
  }

  return days;
};

module.exports = {
  getWeekDateRange,
  getMonthDateRange,
  getWeeklyRanges,
  getDailyRanges,
};
