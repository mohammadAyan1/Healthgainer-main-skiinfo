import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/cart?userId=${userId}`);
      return response.data.cart[0]?.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, variantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/add`, {
        userId,
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

// Remove item
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/remove`, { userId, itemId });
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
  async ({ userId, itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/update`, {
        userId,
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
