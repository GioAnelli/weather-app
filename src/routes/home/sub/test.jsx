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
  const cityFromHome = location.state?.city;
  const dispatch = useDispatch();

  // Redux state
  const cityInRedux = useSelector((state) => state.position.city);
  const position = useSelector((state) => state.position.position);
  const loading = useSelector((state) => state.position.loading);
  const error = useSelector((state) => state.position.error);

  // Stato locale per gestire se abbiamo già effettuato una richiesta
  const [hasRequested, setHasRequested] = useState(false);

  // Determina quale città usare
  const city = !cityFromHome ? cityInRedux : cityFromHome;

  // console.log("Città passata dalla pagina Home:", cityFromHome);
  // console.log("City in Redux:", cityInRedux);
  console.log("City in use:", city);

  const setNewPosition = (position) => {
    dispatch(updatePositionAndWeather(position));
  };
  // prova a mettere if(city || position || hasRequested){
  //return} else
  const getPosition = () => {
    if (!cityFromHome && !position && !hasRequested) {
      setHasRequested(true);
      console.log(
        "No city or position available, fetching browser position..."
      );
      getCurrentPosition()
        .then((position) => {
          setNewPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        })
        .catch((err) => {
          console.error("Error getting current position:", err);
          alert(
            "Non hai autorizzato il browser a leggere la posizione attuale"
          );
        })
        .finally(() => {
          setHasRequested(false); // Permette future richieste se necessario
        });
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with", { city, position, loading });

    // Solo se non ci sono città e non siamo in fase di caricamento
    if (!loading && (!cityFromHome || !position)) {
      console.log("Fetching position...");
      getPosition();
    }
  }, [cityInRedux, position]); // Verifica che le dipendenze siano corrette

  // Se città e posizione non sono disponibili, non mostrare i dati meteo
  if (loading) {
    return <h1>Loading weather info...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!city) {
    return <h1>No city data available</h1>;
  }

  return (
    <div>
      <h1 className="city-name">Weather in {city}</h1>
      <h2 className="description">Hourly Weather for the next 48 H</h2>
      <WeatherHourlyCard />
      <h2 className="description">Daily Weather for the next 8 Days</h2>
      <WeatherDailyCard />
    </div>
  );
};
