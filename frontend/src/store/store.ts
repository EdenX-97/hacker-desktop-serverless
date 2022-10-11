import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import newsReducer from './news/index'
import podcastsReducer from './podcasts/index'

export const store = configureStore({
    reducer: {
        news: newsReducer,
        podcasts: podcastsReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;
