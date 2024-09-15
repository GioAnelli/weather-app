import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WeatherDailyCard from "../../../components/weatherCards/weatherDailyCards/WeatherDailyCard";
import WeatherHourlyCard from "../../../components/weatherCards/weatherHourlyCards/weatherHourlyCard";
import { updatePositionAndWeather } from "../../../utils/redux/positionSlice";
import { getCurrentPosition } from "../../../utils/geoLocations";
import "./SubHome.css";

export const SubHome = () => {
  const city = useSelector((state) => state.position.city);

  const loading = useSelector((state) => state.position.loading);
  const error = useSelector((state) => state.position.error);

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

  console.log(city);
  return (
    <div>
      {city === "" ? (
        <h1>Loading weather info</h1>
      ) : (
        <>
          <h1 className="city-name">Weather in {city}</h1>
          <h2 className="description">Hourly Weather for the next 48 H</h2>
          <WeatherHourlyCard />
          <h2 className="description">Daily Weather for the next 8 Days</h2>
          <WeatherDailyCard />
        </>
      )}
    </div>
  );
};
