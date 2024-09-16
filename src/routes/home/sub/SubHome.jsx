import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import WeatherDailyCard from "../../../components/weatherCards/weatherDailyCards/WeatherDailyCard";
import WeatherHourlyCard from "../../../components/weatherCards/weatherHourlyCards/weatherHourlyCard";
import { updatePositionAndWeather } from "../../../utils/redux/positionSlice";
import { getCurrentPosition } from "../../../utils/geoLocations";
import "./SubHome.css";

export const SubHome = () => {
  const location = useLocation();
  const cityFromHome = location.state?.city; // Leggi la città dallo stato passato
  console.log("Città passata dalla pagina Home:", cityFromHome);

  // controlla la città passata da weather details della home

  // const cityInRedux = useSelector((state) => state.position.city); const city = useSelector((state) => state.position.city) || cityFromHome; // Usa la città di Redux o quella passata

  const cityInRedux = useSelector((state) => state.position.city);
  const position = useSelector((state) => state.position.position); // checking position

  const loading = useSelector((state) => state.position.loading);
  const error = useSelector((state) => state.position.error);

  console.log(position); // checking position

  const dispatch = useDispatch();

  const city = cityFromHome || cityInRedux;
  console.log("City in Redux:", cityInRedux);
  console.log("City in use:", city); // Verifica quale città viene effettivamente usata

  const setNewPosition = (position) => {
    dispatch(updatePositionAndWeather(position));
  };

  const getPosition = () => {
    // Se non c'è già una posizione/città salvata, usa la geolocalizzazione
    if (!city && !position) {
      getCurrentPosition()
        .then((position) => {
          setNewPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        })
        .catch((err) => {
          alert(
            "non hai autorizzato il browser a leggere la posizione attuale"
          );
          console.log(err);
        });
    }
  };

  // Effettua la geolocalizzazione solo se la città non è già stata impostata
  useEffect(() => {
    console.log("City in Redux:", city);
    getPosition();
  }, [city, position]); // Aggiungi 'city' e 'position' come dipendenze

  console.log(city);
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
          <WeatherHourlyCard />
          <h2 className="description">Daily Weather for the next 8 Days</h2>
          <WeatherDailyCard />
        </>
      )}
    </div>
  );
};
