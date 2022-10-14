import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { weatherRequest } from "../../request";

interface WeatherState {
  weather: string;
  temp: string;
}

const initialState: WeatherState = {
  weather: "",
  temp: "",
};

// Async function for get weather from api
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async () => {
    const res = await weatherRequest.get("/weather/getWeather");
    return res.data;
  }
);

// Async function for get temp from api
export const fetchTemp = createAsyncThunk("weather/fetchTemp", async () => {
  const res = await weatherRequest.get("/weather/getTemp");
  return res.data;
});

export const updateWeather = createAsyncThunk(
  "weather/updateWeather",
  async () => {
    const res = await weatherRequest.put("/weather/updateWeather");
    return res.data;
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWeather.fulfilled, (state, action) => {
      state.weather = action.payload;
    });
    builder.addCase(fetchTemp.fulfilled, (state, action) => {
      state.temp = action.payload;
    });
  },
});

export default weatherSlice.reducer;
