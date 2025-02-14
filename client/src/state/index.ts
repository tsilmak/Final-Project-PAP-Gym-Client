import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DecodedToken, GymPlan, User } from "./api";

export interface initialStateTypes {
  isDarkMode: boolean;
  selectedGymPlan: Partial<
    Pick<GymPlan, "gymPlanId" | "name" | "price">
  > | null;
  user: User | null;
  decodedUser: DecodedToken | null;
}

const initialState: initialStateTypes = {
  isDarkMode: true,
  selectedGymPlan: null,
  user: null,
  decodedUser: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    // Storing the selected gymPlan for registration
    setSelectedGymPlan: (
      state,
      action: PayloadAction<Partial<
        Pick<GymPlan, "gymPlanId" | "name" | "price">
      > | null>
    ) => {
      state.selectedGymPlan = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setDecodedUser: (state, action: PayloadAction<DecodedToken | null>) => {
      state.decodedUser = action.payload;
    },
    logoutUser: (state) => {
      state.decodedUser = null;

      state.user = null; //Optional
      state.selectedGymPlan = null; //Optional
    },
  },
});

export const {
  setIsDarkMode,
  setSelectedGymPlan,
  setUser,
  setDecodedUser,
  logoutUser,
} = globalSlice.actions;
export default globalSlice.reducer;
