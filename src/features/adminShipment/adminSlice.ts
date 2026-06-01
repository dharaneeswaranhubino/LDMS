import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import {
  type AdminDashboardData,
  type AgentDetailsState,
  type AgentFormData,
  type DashboardDateParams,
  type DeliveryAgent,
} from "./adminTypes";
import { AxiosError } from "axios";
import type { ShipmentResponse } from "../shipment/shipmentTypes";

// ─── Mock Generator ────────────────────────────────────────────────
// date range based-a deterministic mock data generate பண்றோம்.
// Same date range → same data (seed = day diff count).
 
function getDayDiff(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}
 
// Simple seeded pseudo-random (so same dates → same numbers)
function seededRand(seed: number, index: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + 233) * 100000;
  return x - Math.floor(x);
}
 
function generateMockDashboard(fromDate: string, toDate: string): AdminDashboardData {
  const days = getDayDiff(fromDate, toDate);
  // seed = numeric representation of fromDate
  const seed = new Date(fromDate).getTime() / 86400000;
 
  const totalShipments    = Math.round(50 + seededRand(seed, 1) * 150);   // 50–200
  const deliveredShipments = Math.round(totalShipments * (0.5 + seededRand(seed, 2) * 0.4));
  const activeDeliveries   = Math.round(totalShipments * (0.05 + seededRand(seed, 3) * 0.15));
  const delayedShipments   = Math.round(totalShipments * seededRand(seed, 4) * 0.1);
  const pendingShipments   = totalShipments - deliveredShipments - activeDeliveries - delayedShipments;
  const totalRevenue       = Math.round((30000 + seededRand(seed, 5) * 200000) * (days / 7));
 
  const paid    = Math.round(totalShipments * (0.6 + seededRand(seed, 6) * 0.3));
  const failed  = Math.round(totalShipments * seededRand(seed, 7) * 0.08);
  const pending = totalShipments - paid - failed;
 
  // ── Agent Performance ──
  const agentNames = ["Ravi Kumar", "Meera S", "Suresh P", "Arjun K"];
  const agentPerformance = agentNames.map((name, i) => {
    const total = Math.round(5 + seededRand(seed, 10 + i) * 40);
    const active = Math.round(seededRand(seed, 20 + i) * 6);
    return {
      agentId: i + 1,
      agentName: name,
      totalDeliveries: total,
      activeShipments: active,
      completedShipments: total - active,
    };
  });
 
  // ── Recent Shipments ──
  const statuses = ["IN_TRANSIT", "CONFIRMED", "PENDING", "DELAYED", "DELIVERED"] as const;
  const payStatuses = ["PAID", "PAID", "PENDING", "PAID", "PAID"] as const;
  const customers = ["John Doe", "Meera S", "Ravi P", "Anita K", "Suresh K"];
  const trackIds  = ["TRK-ABC123", "TRK-DEF456", "TRK-GHI789", "TRK-JKL012", "TRK-MNO345"];
 
  const recentShipments = customers.map((name, i) => ({
    shipmentId: i + 1,
    trackingId: trackIds[i],
    customerName: name,
    shipmentStatus: statuses[Math.floor(seededRand(seed, 30 + i) * statuses.length)],
    paymentStatus: payStatuses[i],
    createdAt: new Date(
      new Date(toDate).getTime() - i * 3600000 * 3
    ).toISOString(),
  }));
 
  // ── Complaints ──
  const complaintStatuses = ["OPEN", "OPEN", "RESOLVED"] as const;
  const complaintMsgs = [
    "Package delayed since yesterday. No update from agent at all.",
    "Agent marked delivered but I never received the package.",
    "Fragile item was damaged. Please initiate a refund process.",
  ];
  const complaintShipmentStatuses = ["DELAYED", "DELIVERED", "DELIVERED"] as const;
  const complaintCustomers = ["John Doe", "Meera Singh", "Ravi P"];
 
  const complaints = complaintCustomers.map((name, i) => ({
    id: i + 1,
    trackingId: trackIds[i],
    customerName: name,
    message: complaintMsgs[i],
    status: complaintStatuses[Math.floor(seededRand(seed, 40 + i) * 3)] as "OPEN" | "RESOLVED" | "IN_PROGRESS",
    shipmentStatus: complaintShipmentStatuses[i],
    createdAt: new Date(
      new Date(toDate).getTime() - i * 7200000
    ).toISOString(),
  }));
 
  // ── Revenue by Tab ──
  // Daily — show days in range (max 7 labels)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyCount = Math.min(days, 7);
  const dailyData = Array.from({ length: dailyCount }, (_, i) => ({
    label: dayLabels[i % 7],
    value: Math.round(8000 + seededRand(seed, 50 + i) * 30000),
  }));
 
  // Weekly — show weeks in range (min 1)
  const weekCount = Math.max(1, Math.min(Math.ceil(days / 7), 8));
  const weeklyData = Array.from({ length: weekCount }, (_, i) => ({
    label: `Week ${i + 1}`,
    value: Math.round(25000 + seededRand(seed, 60 + i) * 60000),
  }));
 
  // Monthly — show months covered
  const fromD = new Date(fromDate);
  const toD   = new Date(toDate);
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData: { label: string; value: number }[] = [];
  const cur = new Date(fromD.getFullYear(), fromD.getMonth(), 1);
  let mi = 0;
  while (cur <= toD && mi < 12) {
    monthlyData.push({
      label: monthNames[cur.getMonth()],
      value: Math.round(60000 + seededRand(seed, 70 + mi) * 120000),
    });
    cur.setMonth(cur.getMonth() + 1);
    mi++;
  }
 
  return {
    totalShipments,
    deliveredShipments,
    activeDeliveries,
    pendingShipments: Math.max(0, pendingShipments),
    delayedShipments,
    totalRevenue,
    paymentSummary: { paid, pending: Math.max(0, pending), failed },
    agentPerformance,
    recentShipments,
    complaints,
    revenueByTab: {
      Daily: dailyData,
      Weekly: weeklyData,
      Monthly: monthlyData.length ? monthlyData : [{ label: monthNames[fromD.getMonth()], value: totalRevenue }],
    },
  };
}

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

export const fetchMyShipments = createAsyncThunk<
  ShipmentResponse[],
  void,
  { rejectValue: string }
>("shipment/fetchMyShipments", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/shipments/myShipments");
    return res.data.data as ShipmentResponse[];
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch shipments",
    );
  }
});

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

// Dashboard thunk — date params accept பண்றோம்
export const fetchAdminDashboard = createAsyncThunk<
  AdminDashboardData,
  DashboardDateParams,
  { rejectValue: string }
>("admin/fetchDashboard", async ({ fromDate, toDate }, { rejectWithValue }) => {
  try {
    const res = await api.get("/dashboard/admin", {
      params: { fromDate, toDate },
    });
    const apiData = res.data.data;
    // API ready — but revenueByTab & complaints missing, so generate mock for those
    return {
      ...apiData,
      complaints: generateMockDashboard(fromDate, toDate).complaints,
      revenueByTab: generateMockDashboard(fromDate, toDate).revenueByTab,
    } as AdminDashboardData;
  } catch (_err) {
    // API not ready — full date-based mock
    return generateMockDashboard(fromDate, toDate);
  }
});

const initialState: AgentDetailsState = {
  shipments: [],
  agents: [],
  dashboard: null,
  dashboardLoading: false,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},

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
      });
  },
});

export default adminSlice.reducer;
