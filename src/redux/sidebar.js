// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt";

const config = useJwt.jwtConfig;

const initialUser1 = () => {
  const item = window.localStorage.getItem("sidebar");
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {};
};

export const authSlice1 = createSlice({
  name: "sidebar",
  initialState: {
    sidebar: initialUser1(),
  },
  reducers: {
    handleSidebar: (state, action) => {
      console.log("fgfgfg");
      state.sidebar = action.payload;
      localStorage.setItem("sidebar", JSON.stringify(action.payload));
    },
  },
});

export const { handleLogin, handleLogout } = authSlice1.actions;

export default authSlice1.reducer;
