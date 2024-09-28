import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // funzioni necessarie da Redux Toolkit
import { getCity, getWeather } from "../../apis/weather/browserWeather";
import { setMeteoDescription } from "./weatherSlice";

// Crea un'azione asincrona per aggiornare la posizione e il meteo
export const updatePositionAndWeather = createAsyncThunk(
  "position/updatePositionAndWeather",
  async (position, { dispatch }) => {
    // Funzione asincrona che accetta la posizione
    const city = await getCity(position.latitude, position.longitude);
    const weather = await getWeather(position.latitude, position.longitude);

    dispatch(setMeteoDescription(weather));
    return { position, city, weather };
  }
);
// Stato iniziale per lo slice
const initialState = {
  position: null,
  city: "",
  loading: false,
  error: null,
  weather: null,
};
// Crea uno slice di Redux per gestire lo stato della posizione
const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition(state, action) {
      state.position = action.payload;
    },
  },
  // Gestisce gli stati delle azioni asincrone
  extraReducers: (builder) => {
    builder
      .addCase(updatePositionAndWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePositionAndWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.position = action.payload.position;
        state.city = action.payload.city;
        state.weather = action.payload.weather;
      })
      .addCase(updatePositionAndWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPosition } = positionSlice.actions;
export default positionSlice.reducer;
