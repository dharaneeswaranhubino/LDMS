import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import type {
  UpdateTrackStatus,
  DeliveryItem,
  AgentState,
  AgentDashboardData,
  SendOtpResponse,
  VerifyOtpResponse,
  VerifyOtpPayload,
} from "./agentTypes";

import type { AxiosError } from "axios";

export const getMyDeliveries = createAsyncThunk<
  // DeliveriesResponse,
  DeliveryItem[],
  void,
  { rejectValue: string }
>("agent/getMyDeliveries", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("shipments/myDeliveries");
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;

    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch deliveries",
    );
  }
});

export const updateTrackStatus = createAsyncThunk(
  "agent/updateTrackStatus",
  async ({ id, data }: UpdateTrackStatus, { rejectWithValue }) => {
    try {
      console.log("{ id, data } :", { id, data });
      const res = await api.patch(`shipments/status/${id}`, data);
      console.log("Patch res :", res.data);

      return res.data?.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update agent status",
      );
    }
  },
);

export const toggleAvailability = createAsyncThunk(
  "agent/toggleAvailability",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch("deliveryAgents/myAvailability");
      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;

      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle availability",
      );
    }
  },
);

export const fetchAgentDashboard = createAsyncThunk<
  AgentDashboardData,
  void,
  { rejectValue: string }
>("agent/fetchAgentDashboard", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("dashboard/deliveryAgent");
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch agent dashboard",
    );
  }
});

export const sendDeliveryOtp = createAsyncThunk<
  SendOtpResponse,
  number,
  { rejectValue: string }
>("agent/sendDeliveryOtp", async (shipmentId, { rejectWithValue }) => {
  try {
    const res = await api.post(`shipments/${shipmentId}/sendOtp`);
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP"
    );
  }
});

export const verifyDeliveryOtp = createAsyncThunk<
  VerifyOtpResponse,
  VerifyOtpPayload,
  { rejectValue: string }
>("agent/verifyDeliveryOtp", async ({ shipmentId, otp }, { rejectWithValue }) => {
  try {
    const res = await api.post(`shipments/${shipmentId}/verifyOtp`, { otp });
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify OTP"
    );
  }
});

const initialState: AgentState = {
  deliveries: [],
  // deliveries: [],
  // statusState: Partial<DeliveryItem> | null,
  statusState: {},
  availability: "AVAILABLE",
  availabilityLoading: false,
  search: "",
  priorityFilter: "ALL",
  activeTab: "ALL",
  currentPage: 1,
  itemsPerPage: 6,
  loading: false,
  error: null,
  statusUpdateLoading: false,

  timelineData: null,
  timelineLoading: false,
  timelineError: null,

  dashboardData: null,
  dashboardLoading: false,
  dashboardError: null,
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

    clearTimeline: (state) => {
      state.timelineData = null;
      state.timelineError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload;
      })

      .addCase(getMyDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch deliveries";
      })
      .addCase(updateTrackStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateTrackStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusState = action.payload;
        state.error = null;

        const index = state.deliveries.findIndex(
          (item) => item.shipmentId === action.payload.shipmentId,
        );

        if (index !== -1) {
          state.deliveries[index] = {
            ...state.deliveries[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateTrackStatus.rejected, (state) => {
        state.statusUpdateLoading = false;
        // state.error = action.payload || "Failed to fetch agent details"
      })

      .addCase(toggleAvailability.pending, (state) => {
        state.availabilityLoading = true;
      })

      .addCase(toggleAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availability = action.payload.currentStatus;
      })

      .addCase(toggleAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.error =
          (action.payload as string) || "Failed to toggle availability";
      })

      .addCase(fetchAgentDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchAgentDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = action.payload;
        state.availability = action.payload.availabilityStatus;
      })
      .addCase(fetchAgentDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload || "Failed to fetch dashboard";
      });
  },
});

export const {
  setSearch,
  setPriorityFilter,
  setActiveTab,
  setCurrentPage,
  clearTimeline,
} = agentSlice.actions;
export default agentSlice.reducer;
