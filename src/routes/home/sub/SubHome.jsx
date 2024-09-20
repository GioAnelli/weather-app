import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import WeatherDailyCard from "../../../components/weatherCards/weatherDailyCards/WeatherDailyCard";
import WeatherHourlyCard from "../../../components/weatherCards/weatherHourlyCards/weatherHourlyCard";
import { updatePositionAndWeather } from "../../../utils/redux/positionSlice";
import { getCurrentPosition } from "../../../utils/geoLocations";
import "./SubHome.css";

export const SubHome = () => {
  const location = useLocation();
  const cityFromHome = location.state?.city; // Città passata dalla home (solo al primo render)
  const cityInRedux = useSelector((state) => state.position.city); // Città attuale salvata in Redux
  const weather = useSelector((state) => state.position.weather);
  const loading = useSelector((state) => state.position.loading);
  const error = useSelector((state) => state.position.error);
  const dispatch = useDispatch();

  // Usa stato locale per memorizzare la città inizialmente e poi aggiornarla
  const [city, setCity] = useState(cityInRedux || cityFromHome || "");

  // Seleziona `cityFromHome` solo all'inizio e ignora successivamente
  useEffect(() => {
    if (cityFromHome) {
      setCity(cityFromHome); // Solo al primo render
    }
  }, []); // Solo al mount iniziale

  // Aggiorna `city` ogni volta che cambia la città in Redux
  useEffect(() => {
    if (cityInRedux) {
      setCity(cityInRedux); // Aggiorna con il valore da Redux
    }
  }, [cityInRedux]); // Dipende da `cityInRedux`

  const setNewPosition = (position) => {
    dispatch(updatePositionAndWeather(position));
  };

  const getPosition = () => {
    if (!cityInRedux) {
      getCurrentPosition()
        .then((position) => {
          setNewPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        })
        .catch((err) => {
          alert(
            "Non hai autorizzato il browser a leggere la posizione attuale"
          );
          console.log(err);
        });
    }
  };

  // Usa la geolocalizzazione se non ci sono città impostate all'inizio
  useEffect(() => {
    getPosition();
  }, [city]); // Dipende da `city`
  console.log("city redux", cityInRedux);
  console.log("city home", cityFromHome);

  return (
    <div>
      {loading && <h1>Loading weather info...</h1>}
      {error && <h1>Error: {error}</h1>}
      {city === "" && !loading && !error ? (
        <h1>Loading weather info</h1>
      ) : (
        <>
          <h1 className="city-name">Weather in {city}</h1>
          <h2 className="description">Hourly Weather for the next 48 H</h2>
          {weather && weather.hourly ? (
            <WeatherHourlyCard hourlyWeather={weather.hourly} />
          ) : (
            <p>No hourly weather data available</p>
          )}
          <h2 className="description">Daily Weather for the next 8 Days</h2>
          {weather && weather.daily ? (
            <WeatherDailyCard dailyWeather={weather.daily} />
          ) : (
            <p>No daily weather data available</p>
          )}
        </>
      )}
    </div>
  );
};
