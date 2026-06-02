import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import shipmentReducer from "../features/customerShipment/shipmentSlice";
import adminReducer from "../features/adminShipment/adminSlice";
import agentReducer from "../features/agentShipment/agentSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        shipment: shipmentReducer,
        admin:adminReducer,
        agent:agentReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;