import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { value: {} },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = { value: {} };
    },
  },
});

const eventSlice = createSlice({
  name: "event",
  initialState: { value: [] },
  reducers: {
    allEvents: (state, action) => {
      state.value = action.payload;
    },
  },
});

const adminSlice = createSlice({
  name: "admin",
  initialState: { value: [] },
  reducers: {
    adminData: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { login, logout } = userSlice.actions;
export const { allEvents } = eventSlice.actions;
export const { adminData } = adminSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    event: eventSlice.reducer,
    admin: adminSlice.reducer,
  },
});
