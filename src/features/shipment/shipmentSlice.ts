import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    Pagination,
    ShipmentResponse,
    ShipmentState,
    InitiatePaymentResponse,
    VerifyPaymentPayload,
    VerifyPaymentResponse,
    PaymentDetailsResponse,
    CustomerDashboardData,
} from "./shipmentTypes";
import { api } from "../../lib/axios";
import { mapToBackendPayload, type CreateShipmentPayload } from "./components/createShipmentComponents/shipmentMapper";
import { getMockCustomerDashboard } from "../dashboard/utils/CustomerDashboardHelper";

export const createShipment = createAsyncThunk<
    ShipmentResponse,       // return type
    CreateShipmentPayload,  // arg type
    { rejectValue: string } // error type
>(
    "shipment/createShipment",
    async (data: CreateShipmentPayload, { rejectWithValue }) => {
        try {
            const payload = mapToBackendPayload(data);
            console.log(payload);

            const res = await api.post("/shipments", payload);
            return res.data.data;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to create shipment");
        }
    }
);

export const initiatePayment = createAsyncThunk<
    InitiatePaymentResponse,
    number,
    { rejectValue: string }
>(
    "payment/initiatePayment",
    async (shipmentId, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/payments/initiate/${shipmentId}`
            );

            return res.data.data;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;

            return rejectWithValue(
                error.response?.data?.message || "Failed to initiate payment"
            );
        }
    }
);

export const verifyPayment = createAsyncThunk<
    VerifyPaymentResponse,
    {
        shipmentId: number;
        payload: VerifyPaymentPayload;
    },
    { rejectValue: string }
>(
    "payment/verifyPayment",
    async ({ shipmentId, payload }, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/payments/verify/${shipmentId}`,
                payload
            );

            return res.data.data;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;

            return rejectWithValue(
                error.response?.data?.message || "Payment verification failed"
            );
        }
    }
);

export const fetchMyShipments = createAsyncThunk<
    { shipments: ShipmentResponse[]; pagination: Pagination; },
    { page?: number; limit?: number; },
    { rejectValue: string }
>(
    "shipment/fetchMyShipments",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/shipments/myShipments?page=${page}&limit=${limit}`);
            return {
                shipments: res.data.data.shipments,
                pagination: res.data.data.pagination,
            };
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to fetch shipments");
        }
    }
);

export const fetchShipmentById = createAsyncThunk<
    ShipmentResponse,
    number,
    { rejectValue: string }
>(
    "shipment/fetchShipmentById",
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await api.get(`/shipments/${id}`);
            return res.data.data as ShipmentResponse;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to fetch shipment");
        }
    }
);

export const fetchPaymentDetails = createAsyncThunk<
    PaymentDetailsResponse,
    number,
    { rejectValue: string }
>(
    "payment/fetchPaymentDetails",
    async (shipmentId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/payments/${shipmentId}`);
            return res.data.data;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch payment details"
            );
        }
    }
);

// export const fetchCustomerDashboard = createAsyncThunk<
//     CustomerDashboardData,
//     { from: string; to: string },
//     { rejectValue: string }
// >(
//     "customerDashboard/fetch",
//     async (_args, { rejectWithValue }) => {
//         try {
//             // Simulate network delay so loading state is visible during dev
//             await new Promise((res) => setTimeout(res, 600));
//             return MOCK_CUSTOMER_DASHBOARD;
//         } catch (err: unknown) {
//             const error = err as import("axios").AxiosError<{ message: string }>;
//             return rejectWithValue(
//                 error.response?.data?.message || "Failed to fetch dashboard"
//             );
//         }
//     }
// );

export const fetchCustomerDashboard = createAsyncThunk<
    CustomerDashboardData,
    { from: string; to: string },
    { rejectValue: string }
>(
    "customerDashboard/fetch",
    async ({ from, to }, { rejectWithValue }) => {
        try {
            await new Promise((res) => setTimeout(res, 500)); // simulate network delay
            return getMockCustomerDashboard(from, to);        // ← filters by date range
        } catch {
            return rejectWithValue("Failed to load mock dashboard");
        }
    }
);

// API is ready
// export const fetchCustomerDashboard = createAsyncThunk<
//     CustomerDashboardData,
//     { from: string; to: string },
//     { rejectValue: string }
// >(
//     "customerDashboard/fetch",
//     async ({ from, to }, { rejectWithValue }) => {
//         try {
//             const res = await api.get(`/dashboard/customer?from=${from}&to=${to}`);
//             return res.data.data;
//         } catch (err: unknown) {
//             const error = err as import("axios").AxiosError<{ message: string }>;
//             return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard");
//         }
//     }
// );

const today = new Date().toISOString().split("T")[0];
const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

const initialState: ShipmentState = {
    shipments: [],
    currentShipment: null,
    paymentDetails: null,
    pagination: null,
    dashboardData: null,
    dateRange: { from: firstOfMonth, to: today },
    loading: false,
    error: null,
};

const shipmentSlice = createSlice({
    name: "shipment",
    initialState,
    reducers: {
        clearCurrentShipment: (state) => { state.currentShipment = null; },
        clearError: (state) => { state.error = null; },
        setDateRange: (
            state,
            action: PayloadAction<{ from: string; to: string }>
        ) => {
            state.dateRange = action.payload;
        },
    },
    extraReducers: (builder) => {
        const pending = (state: ShipmentState) => { state.loading = true; state.error = null; };
        const rejected = (state: ShipmentState, action: PayloadAction<string | undefined>) => { state.loading = false; state.error = action.payload || "Failed to create shipment" };

        builder
            .addCase(createShipment.pending, pending)
            .addCase(createShipment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentShipment = action.payload;
                state.shipments = [action.payload, ...state.shipments];
            })
            .addCase(createShipment.rejected, rejected)

            .addCase(fetchMyShipments.pending, pending)
            .addCase(fetchMyShipments.fulfilled, (state, action) => {
                state.loading = false;
                state.shipments = action.payload.shipments;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchMyShipments.rejected, rejected)

            .addCase(fetchShipmentById.pending, pending)
            .addCase(fetchShipmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentShipment = action.payload;
            })
            .addCase(fetchShipmentById.rejected, rejected)

            .addCase(fetchPaymentDetails.pending, pending)
            .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentDetails = action.payload;
            })
            .addCase(fetchPaymentDetails.rejected, rejected)

            .addCase(fetchCustomerDashboard.pending, pending)
            .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(fetchCustomerDashboard.rejected, rejected);
    },
});

export const { clearCurrentShipment, clearError, setDateRange } = shipmentSlice.actions;
export default shipmentSlice.reducer;