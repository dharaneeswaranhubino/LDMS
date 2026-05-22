import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
import type { UpdateTrackStatus } from "./agentTypes";
import type { AxiosError } from "axios";

export const updateTrackStatus = createAsyncThunk(
    "agent/updateTrackStatus",
    async ({ id, data }: UpdateTrackStatus, { rejectWithValue }) => {
        try {
            console.log("{ id, data } :",{ id, data });
            
            const res = await api.patch(`shipments/status/${id}`, data)
            return res.data?.data

        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to update agent status")
        }
    })

const initialState = {
    statusState: {},
    loading: false,
    error: null,
}

const agentSlice = createSlice({
    name: "agent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // const pending = (state) => { state.loading = true; state.error = null; };
        // const rejected = (state, action: PayloadAction<string | undefined>) => { state.loading = false; state.error = action.payload || "Failed to fetch agent details" };

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
            .addCase(updateTrackStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch agent details"
            });
    }
})

export default agentSlice.reducer;
