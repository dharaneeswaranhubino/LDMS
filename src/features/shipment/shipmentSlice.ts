import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShipmentResponse, ShipmentState } from "./shipmentTypes";
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
            console.log(payload);

            const res = await api.post("/shipments", payload);
            return res.data.data;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to create shipment");
        }
    }
);

export const fetchMyShipments = createAsyncThunk<
    ShipmentResponse[],  // return type
    void,                // no args
    { rejectValue: string }
>(
    "shipment/fetchMyShipments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/shipments/myShipments");
            return res.data.data as ShipmentResponse[];
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
        const rejected = (state: ShipmentState, action: PayloadAction<string | undefined>) => { state.loading = false; state.error = action.payload || "Failed to create shipment"};

        builder
            .addCase(createShipment.pending, pending)
            .addCase(createShipment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentShipment = action.payload;
                state.shipments.unshift(action.payload);
            })
            .addCase(createShipment.rejected, rejected)

            .addCase(fetchMyShipments.pending, pending)
            .addCase(fetchMyShipments.fulfilled, (state, action) => {
                state.loading = false;
                state.shipments = action.payload;
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