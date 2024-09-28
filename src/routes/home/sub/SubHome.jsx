import { useEffect, useState, useCallback } from "react";
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
  const error = useSelector((state) => state.position.error);
  const dispatch = useDispatch();

  // Usa stato locale per memorizzare la città attuale
  const [city, setCity] = useState(cityFromHome || cityInRedux);

  const setNewPosition = (position) => {
    dispatch(updatePositionAndWeather(position));
  };

  // Funzione per ottenere la posizione
  const getPosition = useCallback(async () => {
    try {
      const position = await getCurrentPosition();
      setNewPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      alert("Non hai autorizzato il browser a leggere la posizione attuale");
      console.log(err);
    }
  }, [dispatch]);

  // Effettua l'assegnazione di cityFromHome solo al primo render
  useEffect(() => {
    const fetchData = async () => {
      if (cityFromHome && !cityInRedux) {
        await getPosition(); // Solo la prima volta
      } else if (cityFromHome && cityInRedux) {
        setCity(cityInRedux);
      } else if (cityInRedux) {
        setCity(cityInRedux); // Da Redux nelle ricerche successive
      } else if (!cityFromHome && !cityInRedux) {
        await getPosition(); // Geolocalizzazione se nessuna città è presente
      }
    };
    fetchData();
  }, [cityInRedux, cityFromHome, getPosition]);

  return (
    <div>
      {error && <h1>Error: {error}</h1>}
      {city === "" && !error ? (
        <h1>Loading weather info...</h1>
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
