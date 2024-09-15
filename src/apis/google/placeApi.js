import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "../../components/atom/locationAutoComplete";

export const getPosition = async (newValue, cb = undefined) => {
  if (!newValue) return;

  try {
    const response = await axios(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: newValue.place_id,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const data = await response.data.result.geometry.location;

    const location = {
      latitude: data.lat,
      longitude: data.lng,
    };

    if (cb) {
      cb(location);
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
};
