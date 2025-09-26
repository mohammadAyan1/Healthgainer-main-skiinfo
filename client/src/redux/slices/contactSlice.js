import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

export const fetchContacts = createAsyncThunk("contacts/fetchAll", async () => {
  const response = await API.get("/contacts/all");
  return response.data;
});

export const createContact = createAsyncThunk(
  "contacts/create",
  async (contactData) => {
    const response = await API.post("/contacts/create", contactData);
    return response.data;
  }
);

export const deleteContact = createAsyncThunk("contacts/delete", async (id) => {
  await API.delete(`/contacts/delete/${id}`);
  return id;
});

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload.contact);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload
        );
      });
  },
});

export default contactSlice.reducer;
