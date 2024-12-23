/* eslint-disable  @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosInstance";

// Async actions
export const fetchMenus = createAsyncThunk("menu/fetch", async (_, { dispatch }) => {
  try {
    const response = await axios.get("/menu");
    return response.data;
  } catch (error) {
    dispatch(clearSelectedMenu())
    dispatch(setMenu([]))
  }
});

export const addMenu = createAsyncThunk(
  "menu/add",
  async (menu, { dispatch }) => {
    const response = await axios.post("/menu", menu);
    dispatch(fetchMenus());
    return response.data;
  }
);

export const updateMenu = createAsyncThunk(
  "menu/update",
  async (menu: any, { dispatch }) => {
    const response = await axios.put(`/menu/${menu?.id}`, menu);
    dispatch(fetchMenus());
    return response.data;
  }
);

export const deleteMenu = createAsyncThunk(
  "menu/delete",
  async (id, { dispatch }) => {
    const response = await axios.delete(`/menu/${id}`);
    dispatch(fetchMenus());
    return response.data;
  }
);

// Menu slice
const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menus: [],
    selectedMenu: [],
    menuForm: {}, // Store for menu form data
    status: "idle",
  },
  reducers: {
    setMenu: (state, action) => {
      state.menus = action.payload;
    },
    setSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload;
    },
    clearSelectedMenu: (state) => {
      state.selectedMenu = [];
    },
    setMenuForm: (state, action) => {
      state.menuForm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.menus = action.payload;
        if (state.selectedMenu.length) {
          if (action.payload.length) {
            const newMenu = action?.payload?.find(
              (res: any) => res?.id == state?.selectedMenu?.[0]?.id
            );
            if (newMenu) state.selectedMenu = [newMenu];
            else {
              state.selectedMenu = [];
            }
          } else if (action.payload.length == 1) {
            state.selectedMenu = [];
          } else {
            state.selectedMenu = [];
          }
        }
      })
      .addCase(addMenu.fulfilled, (state) => {
        state.menuForm = {};
      })
      .addCase(updateMenu.fulfilled, (state) => {
        state.menuForm = {};
      });
  },
});

export const { setSelectedMenu, clearSelectedMenu, setMenuForm, setMenu } = menuSlice.actions;
export default menuSlice.reducer;