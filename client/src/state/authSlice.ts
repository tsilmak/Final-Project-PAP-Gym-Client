import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/redux";

// Helper function to retrieve token from localStorage
const getInitialToken = () => {
  return localStorage.getItem("token") || null; // Get token from localStorage
};
const getInitialUser = () => {
  const user = localStorage.getItem("user");

  // Check if the user exists and is a valid JSON string
  try {
    if (user) {
      return JSON.parse(user); // Attempt to parse the user if it exists
    } else {
      return null; // If no user is found, return null
    }
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    localStorage.removeItem("user"); // Remove invalid user data from localStorage
    localStorage.removeItem("token"); // Remove associated token if user is invalid
    return null; // Return null after clearing invalid data
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getInitialUser(),
    token: getInitialToken(),
  },
  reducers: {
    setCredetials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredetials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
