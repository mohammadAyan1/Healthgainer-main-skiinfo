import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const BASE_URL = "/why/features";

export const fetchFeatures = createAsyncThunk("features/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.features;
});

export const createFeature = createAsyncThunk("features/create", async (data) => {
  const res = await API.post(BASE_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.feature;
});

export const updateFeature = createAsyncThunk("features/update", async ({ id, formData }) => {
  const res = await API.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.feature;
});

export const deleteFeature = createAsyncThunk("features/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const FeatureSlice = createSlice({
  name: "Features",
  initialState: {
    features: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.features = action.payload;
        state.loading = false;
      })
      .addCase(createFeature.fulfilled, (state, action) => {
        state.features.push(action.payload);
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.features = state.features.map((f) =>
          f._id === action.payload._id ? action.payload : f
        );
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.features = state.features.filter((f) => f._id !== action.payload);
      });
  },
});

export default FeatureSlice.reducer;
