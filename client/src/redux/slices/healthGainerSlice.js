import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

export const fetchHealthGainers = createAsyncThunk("healthGainer/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/healthgainer");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchHealthGainerByProduct = createAsyncThunk("healthGainer/fetchByProduct", async (productId, { rejectWithValue }) => {
  try {
    const response = await API.get(`/healthgainer/product/${productId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createHealthGainer = createAsyncThunk("healthGainer/create", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post("/healthgainer", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateHealthGainer = createAsyncThunk("healthGainer/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/healthgainer/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteHealthGainer = createAsyncThunk("healthGainer/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/healthgainer/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  healthGainers: [],
  loading: false,
  error: null,
};

const healthGainerSlice = createSlice({
  name: "healthGainer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchHealthGainers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHealthGainers.fulfilled, (state, action) => {
        state.loading = false;
        state.healthGainers = action.payload;
      })
      .addCase(fetchHealthGainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchHealthGainerByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHealthGainerByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.healthGainers = [action.payload];
      })
      .addCase(fetchHealthGainerByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createHealthGainer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHealthGainer.fulfilled, (state, action) => {
        state.loading = false;
        state.healthGainers.push(action.payload);
      })
      .addCase(createHealthGainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateHealthGainer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHealthGainer.fulfilled, (state, action) => {
        state.loading = false;
        state.healthGainers = state.healthGainers.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateHealthGainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteHealthGainer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHealthGainer.fulfilled, (state, action) => {
        state.loading = false;
        state.healthGainers = state.healthGainers.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteHealthGainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default healthGainerSlice.reducer;
