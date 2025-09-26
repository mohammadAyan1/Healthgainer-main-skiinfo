import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

export const fetchReq = createAsyncThunk("req/fetchAll", async () => {
  const response = await API.get("/req/all");
  return response.data;
});

export const createReq = createAsyncThunk("req/create", async (reqData) => {
  const response = await API.post("/req/create", reqData);
  return response.data;
});

export const deleteReq = createAsyncThunk("req/delete", async (id) => {
  await API.delete(`/req/delete/${id}`);
  return id;
});

const contactSlice = createSlice({
  name: "reqCall",
  initialState: {
    contacts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReq.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReq.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchReq.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createReq.fulfilled, (state, action) => {
        state.contacts.push(action.payload.req);
      })
      .addCase(deleteReq.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload
        );
      });
  },
});

export default contactSlice.reducer;
