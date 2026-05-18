import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import { type AgentDetailsState, type AgentFormData } from "./adminTypes";
import { AxiosError } from "axios";
import type { ShipmentResponse } from "../shipment/shipmentTypes";

export const createAgentDetails = createAsyncThunk<
    AgentFormData,
    AgentFormData,
    {rejectValue:string}
>(
    "admin/createAgentDetails",
    async (data: AgentFormData, { rejectWithValue }) => {
        try {
            console.log("data: ",data);
            const res = await api.post("/deliveryAgents", data);
            return res.data.data;

        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data?.message || "Failed to create agent Details");
        }
    }
)

export const fetchMyShipments = createAsyncThunk<
    ShipmentResponse[],
    void,
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

const initialState: AgentDetailsState = {
    shipments: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const pending = (state: AgentDetailsState) => { state.loading = true; state.error = null; };
        const rejected = (state: AgentDetailsState, action: PayloadAction<string | undefined>) => { state.loading = false; state.error = action.payload || "Failed to create agent details"};
        builder
            .addCase(createAgentDetails.pending, pending)
            .addCase(createAgentDetails.fulfilled,(state,action)=>{
                state.loading= false;
                state.shipments.unshift(action.payload);
                state.error = null;
                // console.log("state.shipments: ",state.shipments);
            })
            .addCase(createAgentDetails.rejected,rejected);
    }
})

export default adminSlice.reducer;