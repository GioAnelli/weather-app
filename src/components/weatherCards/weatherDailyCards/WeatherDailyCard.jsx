import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Icon from "../../icon/Icon";

import degreesToDirection from "../../../utils/windDegreesToDirection";
import {
  celsius,
  fahrenheit,
  kmHour,
  convertTimestampToISODate,
  milesHour,
  knots,
} from "../../../utils/utils";
import "./weatherDaily.css";

// Definisce un componente ExpandMore per l'icona di espansione
const ExpandMore = styled((props) => {
  const { expand, ...other } = props; // Estrae la proprietà expand
  return <IconButton {...other} />; // Restituisce un bottone per l'icona
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const WeatherTable = ({ dailyWeather }) => {
  // Seleziona le unità di temperatura e velocità del vento dallo stato di Redux
  const temperatureUnit = useSelector((state) => state.units.temperature);
  const windSpeedUnit = useSelector((state) => state.units.wind);

  const [expanded, setExpanded] = useState({});

  if (!dailyWeather) {
    return <p>Loading...</p>;
  }

  if (typeof dailyWeather !== "object") {
    console.error(
      "dailyWeather or hourlyWeather is not in the correct format:",
      dailyWeather
    );
    return <p>Error: Data format issue</p>;
  }
  // Crea una riga di dati
  const createData = (
    date,
    weatherIcon,
    weather,
    tempMin,
    tempMax,
    windDirection,
    windSpeed,
    humidity,
    uvi
  ) => {
    return {
      date,
      weatherIcon,
      weather,
      tempMin,
      tempMax,
      windDirection,
      windSpeed,
      humidity,
      uvi,
    };
  };

  const rows = dailyWeather.map((data) => {
    let tempMin;
    let tempMax;
    // Converte la temperatura in base all'unità selezionata
    if (temperatureUnit === "C°") {
      tempMin = celsius(data.temp.min);
      tempMax = celsius(data.temp.max);
    } else if (temperatureUnit === "F°") {
      tempMin = fahrenheit(data.temp.min);
      tempMax = fahrenheit(data.temp.max);
    } else {
      tempMin = data.temp.min;
      tempMax = data.temp.max;
    }

    let windSpeed;
    if (windSpeedUnit === "km/h") {
      windSpeed = kmHour(data.wind_speed);
    } else if (windSpeedUnit === "mph") {
      windSpeed = milesHour(data.wind_speed);
    } else if (windSpeedUnit === "kn") {
      windSpeed = knots(data.wind_speed);
    } else {
      windSpeed = data.wind_speed;
    }
    // Restituisce i dati formattati
    return createData(
      convertTimestampToISODate(data.dt),
      data.weather[0].icon,
      data.weather[0].description,
      tempMin,
      tempMax,
      degreesToDirection(data.wind_deg),
      windSpeed,
      data.humidity,
      data.uvi
    );
  });

  const handleExpandClick = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <div className="card-container">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`card-wrapper ${expanded[index] ? "expanded" : ""}`}
        >
          <Card className="card" sx={{ borderRadius: "20px" }}>
            <CardHeader title={row.date} />
            <Icon iconCode={row.weatherIcon} alt="Weather Icon" />
            <CardContent>
              <Typography variant="body1" color="text.primary">
                {row.tempMin} {temperatureUnit} / {row.tempMax}{" "}
                {temperatureUnit}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <ExpandMore
                expand={expanded[index]}
                onClick={() => handleExpandClick(index)}
                aria-expanded={expanded[index]}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>
                  <strong>Conditions:</strong> {row.weather}
                </Typography>
                <Typography paragraph>
                  <strong>Wind Direction:</strong> {row.windDirection}
                </Typography>
                <Typography paragraph>
                  <strong>Wind Speed:</strong> {row.windSpeed} {windSpeedUnit}
                </Typography>
                <Typography paragraph>
                  <strong>Humidity:</strong> {row.humidity} %
                </Typography>
                <Typography>
                  <strong>UV Index:</strong> {row.uvi}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default WeatherTable;
