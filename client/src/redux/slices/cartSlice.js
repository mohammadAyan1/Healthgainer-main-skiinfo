import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/cart?userId=${userId}`);

      return response.data.cart?.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, guestId, productId, variantId, quantity },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post(`/cart/add`, {
        userId,
        guestId,
        productId,
        variantId,
        quantity,
      });
      return response.data.cart.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding to cart");
    }
  }
);

export const updateCartGuestIdToUserId = createAsyncThunk(
  "cart/addToCart",
  async ({ GuestIdCheck, UserId }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/cart/updateguestidtouserid`, {
        GuestIdCheck,
        UserId,
      });

      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating  cart");
    }
  }
);

// Remove item
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, guestId, itemId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/remove`, {
        userId,
        guestId,
        itemId,
      });
      return response.data.cart.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error removing from cart"
      );
    }
  }
);

// Update quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, guestId, itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/update`, {
        userId,
        guestId,
        itemId,
        quantity,
      });
      return response.data.cart.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating cart");
    }
  }
);

// Empty cart
export const emptyCart = createAsyncThunk(
  "cart/emptyCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/empty`, { userId });
      return response.data.cart.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error emptying cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(emptyCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default cartSlice.reducer;
