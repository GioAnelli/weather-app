import axios from "axios";
import { getBrowserLangSimple } from "../../utils/geoLocations";

const BASE_PATH = "https://api.openweathermap.org";
const WEATHER_PATH = "/data/3.0/onecall";
const GEO_PATH = "/geo/1.0/reverse";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const weatherAxios = axios.create({
  baseURL: BASE_PATH,
  timeout: 5000,
});

weatherAxios.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.appid = API_KEY;
  return config;
});

export const getWeather = async (lat, lon) => {
  const params = {
    lat,
    lon,
    exclude: "minutely",
  };

  try {
    const response = await weatherAxios.get(WEATHER_PATH, { params });

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data: ", error);
  }
};

export const getCity = async (lat, lon, lang = getBrowserLangSimple()) => {
  const params = {
    lat,
    lon,
  };

  try {
    const response = await weatherAxios.get(GEO_PATH, { params });
    const data = response.data[0];
    let result;

    if (data.local_names) {
      result = data.local_names[lang];
      if (result === undefined) {
        result = data.name;
        return result;
      }
      return result;
    } else if (!data.local_names) {
      result = data.name;
      return result;
    } else {
      return data.state;
    }
  } catch (error) {
    console.error("Error fetching weather data", error);
  }
};
