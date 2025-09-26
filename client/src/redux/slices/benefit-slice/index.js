import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const BASE_URL = "/benefits";

export const fetchBenefits = createAsyncThunk("benefits/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.benefits;
});

export const createBenefit = createAsyncThunk("benefits/create", async (formData) => {
  const res = await API.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.benefit;
});

export const updateBenefit = createAsyncThunk("benefits/update", async ({ id, formData }) => {
  const res = await API.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.benefit;
});

export const deleteBenefit = createAsyncThunk("benefits/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const benefitSlice = createSlice({
  name: "benefits",
  initialState: {
    benefits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBenefits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBenefits.fulfilled, (state, action) => {
        state.loading = false;
        state.benefits = action.payload;
      })
      .addCase(fetchBenefits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBenefit.fulfilled, (state, action) => {
        state.benefits.push(action.payload);
      })
      .addCase(updateBenefit.fulfilled, (state, action) => {
        state.benefits = state.benefits.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(deleteBenefit.fulfilled, (state, action) => {
        state.benefits = state.benefits.filter((b) => b._id !== action.payload);
      });
  },
});

export default benefitSlice.reducer;
