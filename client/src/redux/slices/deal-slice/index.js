import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const BASE_URL = "/deals";

export const fetchDeals = createAsyncThunk("deal/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.deals;
});

export const createDeal = createAsyncThunk("deal/create", async (formData) => {
    const res = await API.post(BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.deal;
  });

  export const updateDeal = createAsyncThunk("deal/update", async ({ id, formData }) => {
    const res = await API.put(`${BASE_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.deal;
  });

export const deleteDeal = createAsyncThunk("deal/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const dealSlice = createSlice({
  name: "deal",
  initialState: {
    deals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.deals.push(action.payload);
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.deals = state.deals.map((d) =>
          d._id === action.payload._id ? action.payload : d
        );
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => d._id !== action.payload);
      });
  },
});

export default dealSlice.reducer;
