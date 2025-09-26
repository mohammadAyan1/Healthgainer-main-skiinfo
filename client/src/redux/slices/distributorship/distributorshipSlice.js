import { createSlice } from "@reduxjs/toolkit";
import {
  createForm,
  fetchForms,
  fetchFormById,
  updateForm,
  deleteForm,
} from "./distributorshipThunks";

const initialState = {
  distributorship: [],
  form: null,
  loading: false,
  error: null,
};

const distributorshipSlice = createSlice({
  name: "distributorship",
  initialState,
  reducers: {
    clearForm: (state) => {
      state.form = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createForm.fulfilled, (state, action) => {
      state.loading = false;
      state.distributorship.push(action.payload);
    });
    builder.addCase(createForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchForms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.loading = false;
      state.distributorship = action.payload;
    });
    builder.addCase(fetchForms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchFormById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFormById.fulfilled, (state, action) => {
      state.loading = false;
      state.form = action.payload;
    });
    builder.addCase(fetchFormById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateForm.fulfilled, (state, action) => {
      state.loading = false;
      state.distributorship = state.distributorship.map((form) =>
        form._id === action.payload._id ? action.payload : form
      );
    });
    builder.addCase(updateForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteForm.fulfilled, (state, action) => {
      state.loading = false;
      state.distributorship = state.distributorship.filter(
        (form) => form._id !== action.payload
      );
    });
    builder.addCase(deleteForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearForm, clearError } = distributorshipSlice.actions;
export default distributorshipSlice.reducer;
