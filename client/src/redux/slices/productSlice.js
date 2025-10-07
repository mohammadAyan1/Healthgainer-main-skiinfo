import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

// Create product
export const createProduct = createAsyncThunk(
  "product/create",
  async (productData, { rejectWithValue }) => {
    console.log(productData);

    try {
      const response = await API.post(`/products/`, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);

      return response.data.product || []; // return only product
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "product/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/`);
      return response.data; // array of products
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${productId}`);
      return response.data.product; // extract inner product
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "product/update",
  async (updatedProduct, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/products/${updatedProduct.get("id")}`,
        updatedProduct,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating product");
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/products/${productId}`);
      console.log(response);
      // return response.data.success;
      console.log(productId);

      return true;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null, // single product
    products: [], // product list
    loading: false,
    error: null,
    success: false,
    deleteStatus: null,
  },
  reducers: {
    clearSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (!Array.isArray(state.products)) state.products = [];
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = action.payload;
      });
  },
});

export const { clearSuccess } = productSlice.actions;
export default productSlice.reducer;
