import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import {
  type AdminComplaint,
  type AdminDashboardData,
  type AgentDetailsState,
  type AgentFormData,
  type AllShipmentsResponse,
  type ComplaintPagination,
  type ComplaintStatus,
  type DashboardDateParams,
  type DeliveryAgent,
  type FetchComplaintsParams,
  type ReassignResponse,
  type RevenueTab,
  type UpdateComplaintStatusResponse,
} from "./adminTypes";
import { AxiosError } from "axios";

export const createAgentDetails = createAsyncThunk<
  AgentFormData,
  AgentFormData,
  { rejectValue: string }
>(
  "admin/createAgentDetails",
  async (data: AgentFormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/deliveryAgents", data);
      return res.data?.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to create agent Details",
      );
    }
  },
);


export const getAllAgents = createAsyncThunk<
  DeliveryAgent[],
  void,
  { rejectValue: string }
>("admin/getAllAgents", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/deliveryAgents");
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch agents",
    );
  }
});

export const fetchAdminDashboard = createAsyncThunk<
  AdminDashboardData,
  DashboardDateParams,
  { rejectValue: string }
>(
  "admin/fetchDashboard",
  async ({ fromDate, toDate, groupBy }, { rejectWithValue }) => {
    try {
      const res = await api.get("/dashboard/admin", {
        params: { fromDate, toDate, groupBy },
      });
      return res.data.data as AdminDashboardData;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to load dashboard",
      );
    }
  },
);

export const fetchAllShipments = createAsyncThunk<
  AllShipmentsResponse,
  { page: number; limit: number },
  { rejectValue: string }
>("admin/fetchAllShipments", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const res = await api.get("/shipments", { params: { page, limit } });
    return res.data.data as AllShipmentsResponse;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch shipments",
    );
  }
});


export const fetchComplaints = createAsyncThunk(
  "adminComplaints/fetchComplaints",
  async (params: FetchComplaintsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(status ? { status } : {}),
      });
      const res = await api.get(`/complaints?${query}`);
      return res.data.data as {
        complaints: AdminComplaint[];
        pagination: ComplaintPagination;
      };
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch complaints",
      );
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "adminComplaints/updateComplaintStatus",
  async (
    { complaintId, status }: { complaintId: number; status: ComplaintStatus },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `/complaints/${complaintId}/status`,
        { status }
      );
      return res.data.data as UpdateComplaintStatusResponse;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status",
      );
    }
  }
);

export const reassignShipmentAgent = createAsyncThunk<
  ReassignResponse,
  { shipmentId: number; newAgentId: number },
  { rejectValue: string }
>(
  "admin/reassignShipmentAgent",
  async ({ shipmentId, newAgentId }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/deliveryAgents/reassign/${shipmentId}`,
        { newAgentId },
      );
      return res.data.data as ReassignResponse;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to reassign agent",
      );
    }
  },
);

export const toggleAgentActiveStatus = createAsyncThunk<
  { id: number; isActive: boolean },
  number,
  { rejectValue: string }
>("admin/toggleAgentActiveStatus", async (agentId, { rejectWithValue }) => {
  try {
    const res = await api.patch(
      `/deliveryAgents/${agentId}/toggleStatus`
    );
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update agent status",
    );
  }
});

const initialState: AgentDetailsState = {
  shipments: [],
  agents: [],
  dashboard: null,
  dashboardLoading: false,
  activeRevenueTab: "Weekly",

  allShipments: [],
  shipmentPagination: null,
  shipmentsLoading: false,

  loading: false,
  error: null,

  timelineData: null,
  timelineLoading: false,
  timelineError: null,

  complaints: [],
  complaintPagination: null,
  complaintsLoading: false,
  complaintUpdateLoading: false,
  activeComplaintTab: "ALL",
  selectedComplaint: null,
  complaintError: null,

  reassignLoading: false,
  reassignSuccess: false,
  reassignResult: null,
  reassignError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {

    clearTimeline: (state) => {
      state.timelineData = null;
      state.timelineError = null;
    },

    setActiveRevenueTab(state, action: PayloadAction<RevenueTab>) {
      state.activeRevenueTab = action.payload;
    },
    //Complaints
    setActiveComplaintTab(state, action: PayloadAction<"ALL" | ComplaintStatus>) {
      state.activeComplaintTab = action.payload;
    },
    setSelectedComplaint(state, action: PayloadAction<AdminComplaint | null>) {
      state.selectedComplaint = action.payload;
    },
    clearComplaintError(state) {
      state.complaintError = null;
      state.complaintUpdateLoading = false;
    },

    clearReassignState(state) {
      state.reassignLoading = false;
      state.reassignSuccess = false;
      state.reassignResult = null;
      state.reassignError = null;
    },
  },

  extraReducers: (builder) => {
    const pending = (state: AgentDetailsState) => {
      state.loading = true;
      state.error = null;
    };

    const rejected = (
      state: AgentDetailsState,
      action: PayloadAction<string | undefined>,
    ) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };

    builder

      // CREATE AGENT
      .addCase(createAgentDetails.pending, pending)
      .addCase(createAgentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.unshift(action.payload);
        state.error = null;
      })
      .addCase(createAgentDetails.rejected, rejected)

      // GET ALL AGENTS
      .addCase(getAllAgents.pending, pending)
      .addCase(getAllAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
        state.error = null;
      })
      .addCase(getAllAgents.rejected, rejected)

      //fetch dashboard datas
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload || "Failed to load dashboard";
      })

      //get all shipments
      .addCase(fetchAllShipments.pending, (state) => {
        state.shipmentsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllShipments.fulfilled, (state, action) => {
        state.shipmentsLoading = false;
        state.allShipments = action.payload.shipments;
        state.shipmentPagination = action.payload.pagination;
      })
      .addCase(fetchAllShipments.rejected, (state, action) => {
        state.shipmentsLoading = false;
        state.error = action.payload || "Failed to fetch shipments";
      })

      //Complaints
      .addCase(fetchComplaints.pending, (state) => {
        state.complaintsLoading = true;
        state.complaintError = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.complaintsLoading = false;
        state.complaints = action.payload.complaints;
        state.complaintPagination = action.payload.pagination;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.complaintsLoading = false;
        state.complaintError = action.payload as string;
      })

      //Update Complaint Status
      .addCase(updateComplaintStatus.pending, (state) => {
        state.complaintUpdateLoading = true;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.complaintUpdateLoading = false;
        const { complaintId, currentStatus } = action.payload;
        const target = state.complaints.find(
          (c) => c.complaintId === complaintId
        );
        if (target) target.status = currentStatus;
        if (state.selectedComplaint?.complaintId === complaintId) {
          state.selectedComplaint.status = currentStatus;
        }
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.complaintUpdateLoading = false;
        state.complaintError = action.payload as string;
      })

      // Reassign Shipment Agent
      .addCase(reassignShipmentAgent.pending, (state) => {
        state.reassignLoading = true;
        state.reassignSuccess = false;
        state.reassignError = null;
      })
      .addCase(reassignShipmentAgent.fulfilled, (state, action) => {
        state.reassignLoading = false;
        state.reassignSuccess = true;
        state.reassignResult = action.payload;
      })
      .addCase(reassignShipmentAgent.rejected, (state, action) => {
        state.reassignLoading = false;
        state.reassignError = action.payload || "Failed to reassign agent";
      })

      //Toggle agent status by admin
      .addCase(toggleAgentActiveStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload;
        const agent = state.agents.find((a) => a.id === id);
        if (agent) agent.isActive = isActive;
      });
  },
});

export const { clearTimeline, setActiveRevenueTab, setActiveComplaintTab, setSelectedComplaint, clearComplaintError, clearReassignState } = adminSlice.actions;
export default adminSlice.reducer;
