import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const BASE_URL = "/mediaReports";

export const fetchMediaReports = createAsyncThunk("mediaReports/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.mediaReports;
});

export const createMediaReport = createAsyncThunk("mediaReports/create", async (formData) => {
  const res = await API.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.mediaReport;
});

export const updateMediaReport = createAsyncThunk("mediaReports/update", async ({ id, formData }) => {
  const res = await API.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.mediaReport;
});

export const deleteMediaReport = createAsyncThunk("mediaReports/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const mediaReportSlice = createSlice({
  name: "mediaReports",
  initialState: {
    mediaReports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMediaReports.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaReports = action.payload;
      })
      .addCase(fetchMediaReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createMediaReport.fulfilled, (state, action) => {
        state.mediaReports.push(action.payload);
      })
      .addCase(updateMediaReport.fulfilled, (state, action) => {
        state.mediaReports = state.mediaReports.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(deleteMediaReport.fulfilled, (state, action) => {
        state.mediaReports = state.mediaReports.filter((b) => b._id !== action.payload);
      });
  },
});

export default mediaReportSlice.reducer;
