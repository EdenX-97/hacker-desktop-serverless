import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { costRequest } from "../../request";

interface CostState {
  billing: string;
}

const initialState: CostState = {
  billing: "0",
};

// Async function for get cost from api
export const fetchCost = createAsyncThunk("cost/fetchCost", async () => {
  const res = await costRequest.get("/cost/getBilling");
  return res.data;
});

export const updateBilling = createAsyncThunk(
  "cost/updateBilling",
  async () => {
    const res = await costRequest.put("/cost/updateBilling");
    return res.data;
  }
);

export const costSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<any>) => {
      state.billing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCost.fulfilled, (state, action) => {
      state.billing = action.payload;
    });
    builder.addCase(updateBilling.fulfilled, (state, action) => {
      state.billing = action.payload;
    });
  },
});

export const { update } = costSlice.actions;
export default costSlice.reducer;
