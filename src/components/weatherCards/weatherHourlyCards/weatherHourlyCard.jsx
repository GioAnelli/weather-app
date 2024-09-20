import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { updatePositionAndWeather } from "../../../utils/redux/positionSlice";
import { getCurrentPosition } from "../../../utils/geoLocations";
import degreesToDirection from "../../../utils/windDegreesToDirection";
import {
  celsius,
  fahrenheit,
  kmHour,
  formatDateTime,
  milesHour,
  knots,
} from "../../../utils/utils";
import "./weatherHourly.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function WeatherCard({ hourlyWeather }) {
  // const dispatch = useDispatch();
  const [expanded, setExpanded] = useState({});
  const windSpeedUnit = useSelector((state) => state.units.wind);
  const temperatureUnit = useSelector((state) => state.units.temperature);
  // const hourlyWeather = useSelector((state) => state.position.weather.hourly);

  // const setNewPosition = (position) => {
  //   dispatch(updatePositionAndWeather(position));
  // };

  // const getPosition = () => {
  //   getCurrentPosition()
  //     .then((position) => {
  //       setNewPosition({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     })
  //     .catch((err) => {
  //       alert("non hai autorizzato il browser a leggere la posizione attuale");
  //       console.log(err);
  //       setNewPosition(undefined);
  //     });
  // };

  // useEffect(() => {
  //   getPosition();
  // }, []);

  useEffect(() => {
    setExpanded({});
  }, [hourlyWeather]);

  if (!hourlyWeather) {
    return <p>Loading...</p>;
  }

  if (!Array.isArray(hourlyWeather)) {
    console.error("hourlyWeather is not in the correct format:", hourlyWeather);
    return <p>Error: Data format issue</p>;
  }

  const createData = (
    timeString,
    dayString,
    weatherIcon,
    weather,
    temperature,
    windDirection,
    windSpeed,
    humidity,
    uvi
  ) => {
    return {
      timeString,
      dayString,
      weatherIcon,
      weather,
      temperature,
      windDirection,
      windSpeed,
      humidity,
      uvi,
    };
  };

  let rows = [];
  if (hourlyWeather.length > 0) {
    rows = hourlyWeather.map((hourly) => {
      const { timeString, dayString } = formatDateTime(hourly.dt);
      let temperature;
      if (temperatureUnit === "C°") {
        temperature = celsius(hourly.temp);
      } else if (temperatureUnit === "F°") {
        temperature = fahrenheit(hourly.temp);
      } else {
        temperature = hourly.temp;
      }

      let windSpeed;
      if (windSpeedUnit === "km/h") {
        windSpeed = kmHour(hourly.wind_speed);
      } else if (windSpeedUnit === "mph") {
        windSpeed = milesHour(hourly.wind_speed);
      } else if (windSpeedUnit === "kn") {
        windSpeed = knots(hourly.wind_speed);
      } else {
        windSpeed = hourly.wind_speed;
      }

      return createData(
        timeString,
        dayString,
        hourly.weather[0].icon,
        hourly.weather[0].description,
        temperature,
        degreesToDirection(hourly.wind_deg),
        windSpeed,
        hourly.humidity,
        hourly.uvi
      );
    });
  }

  const handleExpandClick = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="card-container-hourly">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`card-wrapper-hourly ${expanded[index] ? "expanded" : ""}`}
        >
          <Card className="card-hourly" sx={{ borderRadius: "20px" }}>
            <CardHeader title={row.timeString} subheader={row.dayString} />
            <Icon iconCode={row.weatherIcon} alt="Weather Icon" />
            <CardContent>
              <Typography variant="body1" color="text.primary">
                {row.temperature} {temperatureUnit}
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
}
