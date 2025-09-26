import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const BASE_URL = "/videos";

export const fetchVideos = createAsyncThunk("videos/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.videos;
});

export const createVideo = createAsyncThunk("videos/create", async (formData) => {
  const res = await API.post(BASE_URL, formData);
  return res.data.video;
});

export const updateVideo = createAsyncThunk("videos/update", async ({ id, formData }) => {
  const res = await API.put(`${BASE_URL}/${id}`, formData);
  return res.data.video;
});

export const deleteVideo = createAsyncThunk("videos/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload);
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.videos = state.videos.map((v) =>
          v._id === action.payload._id ? action.payload : v
        );
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v._id !== action.payload);
      });
  },
});

export default videoSlice.reducer;
