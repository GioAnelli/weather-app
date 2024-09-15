import { getBrowserLang } from "./geoLocations";

const browserLang = getBrowserLang();

// format date from timestamp

export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const dayOptions = { weekday: "long" };

  const timeString = new Intl.DateTimeFormat(browserLang, timeOptions).format(
    date
  );
  const dayString = new Intl.DateTimeFormat(browserLang, dayOptions).format(
    date
  );

  return { timeString, dayString };
};

// convert timestamp to ISO date

export const convertTimestampToISODate = (timestamp, format = "dayDate") => {
  const date = new Date(timestamp * 1000);

  const dayOfWeek = date.toLocaleDateString(browserLang, {
    weekday: "long",
  });
  const time = date.toLocaleTimeString(browserLang, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = date.toLocaleDateString(browserLang, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (format === "dayDate") {
    return `${dayOfWeek} ${formattedDate}`;
  } else if (format === "timeDay") {
    return `${time} ${dayOfWeek}`;
  } else {
    return `${dayOfWeek} ${formattedDate}`;
  }
};

// convert kelvin to fahrenheit

export const fahrenheit = (kelvin) => {
  return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
};

// convert kelvin to celsius

export const celsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

// convert meters/second to Km/h

export const kmHour = (mS) => {
  return Math.round(mS * 3.6);
};

// convert meters/second to Miles/h

export const milesHour = (mS) => {
  return Math.round(mS * 2.23694);
};

// convert meters/second to knots

export const knots = (mS) => {
  return Math.round(mS * 1.943844);
};
