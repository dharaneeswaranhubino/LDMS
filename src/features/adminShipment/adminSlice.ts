import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import type {
  AdminComplaint,
  AdminDashboardData,
  AdminState,
  AgentFormData,
  AllShipmentsResponse,
  ChatHistoryShipmentInfo,
  ChatMessage,
  ChatPagination,
  ComplaintPagination,
  ComplaintStatus,
  DashboardDateParams,
  DeliveryAgent,
  FetchComplaintsParams,
  ReassignResponse,
  UpdateComplaintStatusResponse,
  UpdateShipmentStatusPayload,
  UpdateShipmentStatusResponse,
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

// export const fetchAdminDashboard = createAsyncThunk<
//   AdminDashboardData,
//   DashboardDateParams,
//   { rejectValue: string }
// >(
//   "admin/fetchDashboard",
//   async ({ fromDate, toDate, groupBy }, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/dashboard/admin", {
//         params: { fromDate, toDate, groupBy },
//       });
//       return res.data.data as AdminDashboardData;
//     } catch (err: unknown) {
//       const error = err as AxiosError<{ message: string }>;
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to load dashboard",
//       );
//     }
//   },
// );
export const fetchAdminDashboard = createAsyncThunk<
  AdminDashboardData,
  DashboardDateParams,
  { rejectValue: string }
>(
  "admin/fetchDashboard",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const res = await api.get("/dashboard/admin", {
        params: { fromDate, toDate },
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


export const fetchChatHistory = createAsyncThunk<
  {
    messages: ChatMessage[];
    shipmentInfo: ChatHistoryShipmentInfo;
    pagination: ChatPagination;
  },
  { shipmentId: number; page?: number; limit?: number },
  { rejectValue: string }
>(
  "chat/fetchHistory",
  async ({ shipmentId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/chat/${shipmentId}/history`, {
        params: { page, limit },
      });
      return {
        messages: res.data.data,
        shipmentInfo: res.data.shipmentInfo,
        pagination: res.data.pagination,
      };
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat history",
      );
    }
  },
);

//Admin completed status
export const updateShipmentStatus = createAsyncThunk<
  UpdateShipmentStatusResponse,
  UpdateShipmentStatusPayload,
  { rejectValue: string }
>(
  "admin/updateShipmentStatus",
  async ({ shipmentId, status, remarks }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/shipments/status/${shipmentId}`, {
        status,
        ...(remarks ? { remarks } : {}),
      });
      return res.data.data as UpdateShipmentStatusResponse;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update shipment status",
      );
    }
  },
);

const initialState: AdminState = {
  shipments: [],
  agents: [],
  dashboard: null,
  dashboardLoading: false,

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

  chatHistory: [],
  chatHistoryShipmentInfo: null,
  chatHistoryPagination: null,
  chatHistoryLoading: false,
  chatHistoryError: null,

  completeShipmentLoading: false,
  completeShipmentError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {

    clearTimeline: (state) => {
      state.timelineData = null;
      state.timelineError = null;
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

    clearChatHistory(state) {
      state.chatHistory = [];
      state.chatHistoryShipmentInfo = null;
      state.chatHistoryPagination = null;
      state.chatHistoryError = null;
    },

    clearCompleteShipmentError(state) {
      state.completeShipmentError = null;
    },
  },

  extraReducers: (builder) => {
    const pending = (state: AdminState) => {
      state.loading = true;
      state.error = null;
    };

    const rejected = (
      state: AdminState,
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
      })

      .addCase(fetchChatHistory.pending, (state) => {
        state.chatHistoryLoading = true;
        state.chatHistoryError = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatHistoryLoading = false;
        state.chatHistory = action.payload.messages;
        state.chatHistoryShipmentInfo = action.payload.shipmentInfo;
        state.chatHistoryPagination = action.payload.pagination;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.chatHistoryLoading = false;
        state.chatHistoryError = action.payload || "Failed to fetch chat history";
      })

      //Admin completed status
      .addCase(updateShipmentStatus.pending, (state) => {
        state.completeShipmentLoading = true;
        state.completeShipmentError = null;
      })
      .addCase(updateShipmentStatus.fulfilled, (state, action) => {
        state.completeShipmentLoading = false;
        // Update the shipment in allShipments array
        const idx = state.allShipments.findIndex(
          (s) => s.shipmentId === action.payload.shipmentId
        );
        if (idx !== -1) {
          state.allShipments[idx].shipmentStatus = action.payload.shipmentStatus;
        }
      })
      .addCase(updateShipmentStatus.rejected, (state, action) => {
        state.completeShipmentLoading = false;
        state.completeShipmentError = action.payload || "Failed to update status";
      });
  },
});

export const { clearTimeline, setActiveComplaintTab, setSelectedComplaint, clearComplaintError, clearReassignState, clearChatHistory, clearCompleteShipmentError } = adminSlice.actions;
export default adminSlice.reducer;
