import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import newsReducer from "./news/index";
import podcastsReducer from "./podcasts/index";
import costReducer from "./cost/index";
import weatherReducer from "./weather/index";

export const store = configureStore({
  reducer: {
    news: newsReducer,
    podcasts: podcastsReducer,
    cost: costReducer,
    weather: weatherReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
