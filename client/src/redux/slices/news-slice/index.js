import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../lib/api";

const BASE_URL = "/news";

export const fetchNews = createAsyncThunk("news/fetchAll", async () => {
  const res = await API.get(BASE_URL);
  return res.data.news;
});

export const createNews = createAsyncThunk("news/create", async (data) => {
  const res = await API.post(BASE_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.news;
});

export const updateNews = createAsyncThunk("news/update", async ({ id, formData }) => {
  const res = await API.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.news;
});

export const deleteNews = createAsyncThunk("news/delete", async (id) => {
  await API.delete(`${BASE_URL}/${id}`);
  return id;
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.news.push(action.payload);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.news = state.news.map((n) =>
          n._id === action.payload._id ? action.payload : n
        );
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.news = state.news.filter((n) => n._id !== action.payload);
      });
  },
});

export default newsSlice.reducer;
