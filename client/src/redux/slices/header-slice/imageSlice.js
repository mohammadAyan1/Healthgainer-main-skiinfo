import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../lib/api";

const BASE_URL = "/images";

export const createImage = createAsyncThunk(
  "images/createImage",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post(BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return {
        message: res.data.message || "Image uploaded successfully",
        images: res.data.images,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllImages = createAsyncThunk(
  "images/fetchAllImages",
  async (_, thunkAPI) => {
    try {
      const res = await API.get(BASE_URL);
      return res.data.images;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchImageById = createAsyncThunk(
  "images/fetchImageById",
  async (id, thunkAPI) => {
    try {
      const res = await API.get(`${BASE_URL}/${id}`);
      return res.data.image;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateImage = createAsyncThunk(
  "images/updateImage",
  async ({ id, sourceUrl,sno }, thunkAPI) => {
    try {
      const res = await API.put(`${BASE_URL}/${id}`, { sourceUrl,sno });
      return res.data.image;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async (id, thunkAPI) => {
    try {
      await API.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const imageSlice = createSlice({
  name: "images",
  initialState: {
    images: [],
    selectedImage: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearImageState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.selectedImage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.images.push(...action.payload.images);
      })
      .addCase(createImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(fetchAllImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchAllImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(fetchImageById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedImage = action.payload;
      })
      .addCase(fetchImageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Image updated";
        state.images = state.images.map((img) =>
          img._id === action.payload._id ? action.payload : img
        );
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter((img) => img._id !== action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const { clearImageState } = imageSlice.actions;

export default imageSlice.reducer;
