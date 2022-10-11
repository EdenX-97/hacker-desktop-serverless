import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { podcastRequest } from "../../request";

// interface Podcast {
//   title: string;
//   link: string;
//   image: string;
// }

interface PodcastsState {
  // accidentalTechPodcast: Podcast;
  selectedPodcast: string;
  podcastsList: object;
}

const initialState: PodcastsState = {
  // accidentalTechPodcast: { title: "", link: "", image: "" },
  selectedPodcast: "0",
  podcastsList: [],
};

// Async function for get podcasts from api
export const fetchPodcasts = createAsyncThunk(
  "podcasts/fetchPodcasts",
  async () => {
    const res = await podcastRequest.get("/podcast/getAllPodcasts");
    return res.data;
  }
);

export const podcastsSlice = createSlice({
  name: "podcasts",
  initialState,
  reducers: {
    select: (state, action: PayloadAction<string>) => {
      state.selectedPodcast = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPodcasts.fulfilled, (state, action) => {
      // state.accidentalTechPodcast = action.payload;
      state.podcastsList = action.payload;
    });
  },
});

// export const selectHackerNewsList = (state: RootState) => state.hacker.list;
export const { select } = podcastsSlice.actions;
export default podcastsSlice.reducer;
