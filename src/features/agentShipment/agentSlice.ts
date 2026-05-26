import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import type { UpdateTrackStatus, DeliveriesResponse } from "./agentTypes";
import { mockDeliveries } from "./utils/mockDelivery";
import type { AxiosError } from "axios";

export const updateTrackStatus = createAsyncThunk(
  "agent/updateTrackStatus",
  async ({ id, data }: UpdateTrackStatus, { rejectWithValue }) => {
    try {
      console.log("{ id, data } :", { id, data });

      const res = await api.patch(`shipments/status/${id}`, data);
      return res.data?.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update agent status",
      );
    }
  },
);

export const getMyDeliveries = createAsyncThunk(
  "agent/getMyDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<DeliveriesResponse>(
        "/api/v1/shipments/myDeliveries",
      );
      console.log(res);

      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deliveries",
      );
    }
  },
);

const initialState = {
  deliveries: mockDeliveries,
  // deliveries: [],
  statusState: {},
  search: "",
  priorityFilter: "ALL",
  activeTab: "ALL",
  currentPage: 1,
  itemsPerPage: 6,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1;
    },

    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.priorityFilter = action.payload;
      state.currentPage = 1;
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
      state.currentPage = 1;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTrackStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrackStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statusState = action.payload;
        state.error = null;
        console.log(state.statusState);
      })
      .addCase(updateTrackStatus.rejected, (state) => {
        state.loading = false;
        // state.error = action.payload || "Failed to fetch agent details"
      })

      .addCase(getMyDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload;
      })

      .addCase(getMyDeliveries.rejected, (state) => {
        state.loading = false;
        // state.error = (action.payload as string) || "Failed to fetch deliveries";
      });
  },
});

export const { setSearch, setPriorityFilter, setActiveTab, setCurrentPage } =
  agentSlice.actions;
export default agentSlice.reducer;
