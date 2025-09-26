import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const BASE_URL = "/supplements";

export const fetchSupplements = createAsyncThunk("supplement/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.supplements;
});

export const createSupplement = createAsyncThunk("supplement/create", async (formData) => {
  const res = await API.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.supplement;
});

export const updateSupplement = createAsyncThunk("supplement/update", async ({ id, formData }) => {
  const res = await API.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.supplement;
});

export const deleteSupplement = createAsyncThunk("supplement/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const supplementSlice = createSlice({
  name: "supplements",
  initialState: {
    supplements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSupplements.fulfilled, (state, action) => {
        state.loading = false;
        state.supplements = action.payload;
      })
      .addCase(fetchSupplements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSupplement.fulfilled, (state, action) => {
        state.supplements.push(action.payload);
      })
      .addCase(updateSupplement.fulfilled, (state, action) => {
        state.supplements = state.supplements.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(deleteSupplement.fulfilled, (state, action) => {
        state.supplements = state.supplements.filter((b) => b._id !== action.payload);
      });
  },
});

export default supplementSlice.reducer;
