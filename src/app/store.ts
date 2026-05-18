import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import shipmentReducer from "../features/shipment/shipmentSlice";
import adminReducer from "../features/adminShipment/adminSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        shipment: shipmentReducer,
        admin:adminReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;