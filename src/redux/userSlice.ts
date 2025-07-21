import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  balance: number;
  role: string;
}

const initialState: userState = {
  id: "",
  fullName: "",
  avatar: "",
  email: "",
  balance: 0,
  role: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
     addUser: (state, action: PayloadAction<userState>) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.avatar = action.payload.avatar;
      state.email = action.payload.email;
      state.balance = action.payload.balance;
      state.role = action.payload.role;
    },
  },
});

export const {addUser}=userSlice.actions;
export default userSlice.reducer;
