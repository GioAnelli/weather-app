import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import MyLocationAutoComplete from "../../../components/atom/myLocationAutoComplete";
import { getCurrentPosition } from "../../../utils/geoLocations";
import "./mainHome.css";
import { updatePositionAndWeather } from "../../../utils/redux/positionSlice";
import { Button } from "@mui/material";
import { GiPositionMarker } from "react-icons/gi";
import { FaTemperatureHalf } from "react-icons/fa6";
import { celsius, fahrenheit } from "../../../utils/utils";

export const MainHome = () => {
  const city = useSelector((state) => state.position.city);
  const loading = useSelector((state) => state.position.loading);
  const error = useSelector((state) => state.position.error);
  const weather = useSelector((state) => state.position.weather);
  const temperatureUnit = useSelector((state) => state.units.temperature);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setNewPosition = (position) => {
    dispatch(updatePositionAndWeather(position));
  };

  const getPosition = () => {
    getCurrentPosition()
      .then((position) => {
        setNewPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      })
      .catch((err) => {
        alert("non hai autorizzato il browser a leggere la posizione attuale");
        console.log(err);
        setNewPosition(undefined);
      });
  };

  useEffect(() => {
    getPosition();
  }, []);
  let temperature;
  if (weather && temperatureUnit === "C°") {
    temperature = celsius(weather.current.temp);
  } else if (temperatureUnit === "F°") {
    temperature = fahrenheit(weather.current.temp);
  } else if (temperatureUnit === "K°") {
    temperature = weather.current.temp;
  } else {
    return;
  }

  return (
    <div className="home">
      <h2>Current Weather</h2>
      {loading && <p>Loading city...</p>}
      {city && (
        <h3>
          <GiPositionMarker />
          &nbsp;{city}
        </h3>
      )}

      {error && <p>Error: {error}</p>}
      {loading && <p>Loading temperature...</p>}
      {!loading && weather && weather.current && (
        <h3>
          <FaTemperatureHalf />
          &nbsp;{temperature} {temperatureUnit}
        </h3>
      )}

      {error && <p>Error: {error}</p>}
      <MyLocationAutoComplete />
      <br />
      <Button
        variant="contained"
        sx={{ borderRadius: "12px" }}
        onClick={() => navigate("/sub")}
      >
        View More details
      </Button>
    </div>
  );
};
