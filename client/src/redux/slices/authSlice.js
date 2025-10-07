import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/api";

const getInitialUserState = () => {
  if (typeof window !== "undefined") {
    // ✅ check for browser
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  }
  return null; // server-side
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/login", userData);
      // Token is set as httpOnly cookie by backend; only persist user locally
      localStorage.setItem("user", JSON.stringify(data.user));

      // Store token for withAuth
      localStorage.setItem("token", data.token); // <-- add this

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getOTPLogin = createAsyncThunk(
  "auth/getotplogin",
  async (userData, thunkAPI) => {
    console.log(userData);

    try {
      const { data } = await API.post("/auth/getotplogin", userData);
      // Token is set as httpOnly cookie by backend; only persist user locally
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Register User
export const getOTP = createAsyncThunk(
  "auth/getOTP",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/getOTP", userData);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/register", userData);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Store token for withAuth
      localStorage.setItem("token", data.token); // <-- add this
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get User Profile
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/auth/profile");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update User Profile
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.put("/auth/update", userData);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "auth/updateUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.put("/auth/updateDetails", userData);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, thunkAPI) => {
    try {
      await API.delete("/auth/delete", { data: { id } });
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get All Users (Admin Only)
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/auth/all");

      return data.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const todayLogins = createAsyncThunk(
  "auth/todayLogins",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/auth/todayLogins");

      return data.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      const { data: response } = await API.put("/auth/changePassword", data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await API.post("/auth/logout");
    localStorage.removeItem("user");
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logingout = createAsyncThunk(
  "auth/logingout",
  async (_, thunkAPI) => {
    return null;
  }
);

// Create Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getInitialUserState(),
    users: [],
    todayLogins: [],
    getOTPAfterValidation: "",
    loading: false,
    error: null,
  },
  reducers: {
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem("user");
      state.user = user ? JSON.parse(user) : null;
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(todayLogins.pending, (state) => {
        state.loading = true;
      })
      .addCase(todayLogins.fulfilled, (state, action) => {
        state.loading = false;
        state.todayLogins = action.payload;
      })
      .addCase(todayLogins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOTP.pending, (state, action) => {
        state.loading = true;
        // state.error = action.payload;
      })
      .addCase(getOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.getOTPAfterValidation = action.payload;
      })
      .addCase(getOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loadUserFromStorage, clearUser } = authSlice.actions;

export default authSlice.reducer;
