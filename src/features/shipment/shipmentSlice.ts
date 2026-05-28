import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    Pagination,
    ShipmentResponse,
    ShipmentState,
    InitiatePaymentResponse,
    VerifyPaymentPayload,
    VerifyPaymentResponse,
} from "./shipmentTypes";
import { api } from "../../lib/axios";
import { mapToBackendPayload, type CreateShipmentPayload } from "./components/createShipmentComponents/shipmentMapper";

export const createShipment = createAsyncThunk<
    ShipmentResponse,       // ← return type
    CreateShipmentPayload,  // ← arg type
    { rejectValue: string } // ← error type
>(
    "shipment/createShipment",
    async (data: CreateShipmentPayload, { rejectWithValue }) => {
        try {
            const payload = mapToBackendPayload(data);
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
    ShipmentResponse,  // return type
    number,            // arg type (id)
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

const initialState: ShipmentState = {
    shipments: [],
    currentShipment: null,
    pagination: null,
    loading: false,
    error: null,
};

const shipmentSlice = createSlice({
    name: "shipment",
    initialState,
    reducers: {
        clearCurrentShipment: (state) => { state.currentShipment = null; },
        clearError: (state) => { state.error = null; },
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
            .addCase(fetchShipmentById.rejected, rejected);
    },
});

export const { clearCurrentShipment, clearError } = shipmentSlice.actions;
export default shipmentSlice.reducer;