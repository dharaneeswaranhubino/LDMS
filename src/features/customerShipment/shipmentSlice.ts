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
    FetchNotificationsResponse,
    ShipmentTimelineResponse,
    ComplaintResponse,
    RaiseComplaintPayload,
    MyComplaint,
    MyComplaintPagination,
    FetchMyComplaintsParams,
    ComplaintStatus,
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
            // console.log("res.data.data :", res.data.data);
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
            // console.log("res.data.data :", res.data.data);
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

export const fetchCustomerDashboard = createAsyncThunk<
    CustomerDashboardData,
    { from: string; to: string },
    { rejectValue: string }
>(
    "customerDashboard/fetch",
    async ({ from, to }, { rejectWithValue }) => {
        try {
            await new Promise((res) => setTimeout(res, 500));
            return getMockCustomerDashboard(from, to);
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


export const fetchNotifications = createAsyncThunk<
    FetchNotificationsResponse,
    { page?: number; limit?: number },
    { rejectValue: string }
>(
    "notification/fetchNotifications",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/notifications/me?page=${page}&limit=${limit}`);
            return res.data.data as FetchNotificationsResponse;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
        }
    }
);

export const markAllNotificationsRead = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "notification/markAllRead",
    async (_, { rejectWithValue }) => {
        try {
            await api.patch("/notifications/readAll");
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to mark all as read");
        }
    }
);

export const markSingleNotificationRead = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "notification/markSingleRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.patch(`/notifications/read/${notificationId}`);
            return notificationId;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
        }
    }
);

export const fetchShipmentTimeline = createAsyncThunk<
    ShipmentTimelineResponse,
    number,                     // shipmentId
    { rejectValue: string }
>(
    "shipment/fetchShipmentTimeline",
    async (shipmentId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/shipments/${shipmentId}/timeline`);
            return res.data.data as ShipmentTimelineResponse;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || "Failed to fetch timeline");
        }
    }
);

export const raiseComplaint = createAsyncThunk<
    ComplaintResponse,
    { shipmentId: number; payload: RaiseComplaintPayload },
    { rejectValue: string }
>(
    "complaint/raiseComplaint",
    async ({ shipmentId, payload }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/complaints/${shipmentId}`, payload);
            return res.data.data as ComplaintResponse;
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(
                error.response?.data?.message || "Failed to raise complaint"
            );
        }
    }
);


export const fetchMyComplaints = createAsyncThunk<
    { complaints: MyComplaint[]; pagination: MyComplaintPagination },
    FetchMyComplaintsParams,
    { rejectValue: string }
>(
    "complaint/fetchMyComplaints",
    async ({ page = 1, limit = 6, status } = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...(status ? { status } : {}),
            });
            const res = await api.get(`/complaints/me?${query}`);
            return res.data.data as {
                complaints: MyComplaint[];
                pagination: MyComplaintPagination;
            };
        } catch (err: unknown) {
            const error = err as import("axios").AxiosError<{ message: string }>;
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch complaints",
            );
        }
    },
);


//initial States
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
    // notification state
    notifications: [],
    unreadCount: 0,
    notificationPagination: null,
    notificationLoading: false,
    markAllLoading: false,
    markSingleLoading: null,
    notificationError: null,

    timelineData: null,
    timelineLoading: false,
    timelineError: null,

    //for complaints
    raising: false,
    raiseError: null,
    lastRaisedComplaint: null,

    // My Complaints
    myComplaints: [],
    myComplaintPagination: null,
    myComplaintsLoading: false,
    myComplaintError: null,
    activeMyComplaintTab: "ALL",
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

        clearNotificationError: (state) => { state.notificationError = null; },

        clearTimeline: (state) => {
            state.timelineData = null;
            state.timelineError = null;
        },

        clearComplaintError: (state) => {
            state.raiseError = null;
        },
        clearLastComplaint: (state) => {
            state.lastRaisedComplaint = null;
        },

        setActiveMyComplaintTab(
            state,
            action: PayloadAction<"ALL" | ComplaintStatus>
        ) {
            state.activeMyComplaintTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        const pending = (state: ShipmentState) => { state.loading = true; state.error = null; };
        const rejected = (state: ShipmentState, action: PayloadAction<string | undefined>) => { state.loading = false; state.error = action.payload || "Failed to create shipment" };

        builder
            //createShipment
            .addCase(createShipment.pending, pending)
            .addCase(createShipment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentShipment = action.payload;
                // console.log(state.currentShipment);
                state.shipments = [action.payload, ...state.shipments];
            })
            .addCase(createShipment.rejected, rejected)

            //fetchMyShipments
            .addCase(fetchMyShipments.pending, pending)
            .addCase(fetchMyShipments.fulfilled, (state, action) => {
                state.loading = false;
                state.shipments = action.payload.shipments;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchMyShipments.rejected, rejected)

            //fetchShipmentById
            .addCase(fetchShipmentById.pending, pending)
            .addCase(fetchShipmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentShipment = action.payload;
            })
            .addCase(fetchShipmentById.rejected, rejected)

            //fetchPaymentDetails
            .addCase(fetchPaymentDetails.pending, pending)
            .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentDetails = action.payload;
            })
            .addCase(fetchPaymentDetails.rejected, rejected)

            //fetchCustomerDashboard
            .addCase(fetchCustomerDashboard.pending, pending)
            .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(fetchCustomerDashboard.rejected, rejected)

            //fetchNotifications
            .addCase(fetchNotifications.pending, (state) => {
                state.notificationLoading = true;
                state.notificationError = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notificationLoading = false;
                state.notifications = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
                state.notificationPagination = action.payload.pagination;

            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.notificationLoading = false;
                state.notificationError = action.payload || "Failed to fetch notifications";
            })

            //markAllNotificationsRead
            .addCase(markAllNotificationsRead.pending, (state) => {
                state.markAllLoading = true;
                state.notificationError = null;
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.markAllLoading = false;
                state.notifications.forEach((n) => {
                    n.isRead = true;
                });
                state.unreadCount = 0;
            })
            .addCase(markAllNotificationsRead.rejected, (state, action) => {
                state.markAllLoading = false;
                state.notificationError = action.payload || "Failed to mark all as read";
            })

            //markSingleNotificationRead
            .addCase(markSingleNotificationRead.pending, (state, action) => {
                state.markSingleLoading = action.meta.arg;
            })
            .addCase(markSingleNotificationRead.fulfilled, (state, action) => {
                state.markSingleLoading = null;
                const notification = state.notifications.find((n) => n.notificationId === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markSingleNotificationRead.rejected, (state, action) => {
                state.markSingleLoading = null;
                state.notificationError = action.payload || "Failed to mark as read";
            })

            //Fetch shipments Timeline
            .addCase(fetchShipmentTimeline.pending, (state) => {
                state.timelineLoading = true;
                state.timelineError = null;
            })
            .addCase(fetchShipmentTimeline.fulfilled, (state, action) => {
                state.timelineLoading = false;
                state.timelineData = action.payload;
            })
            .addCase(fetchShipmentTimeline.rejected, (state, action) => {
                state.timelineLoading = false;
                state.timelineError = action.payload || "Failed to fetch timeline";
            })

            //Raise Complaint for Customer
            .addCase(raiseComplaint.pending, (state) => {
                state.raising = true;
                state.raiseError = null;
            })
            .addCase(raiseComplaint.fulfilled, (state, action) => {
                state.raising = false;
                state.lastRaisedComplaint = action.payload;
            })
            .addCase(raiseComplaint.rejected, (state, action) => {
                state.raising = false;
                state.raiseError = action.payload || "Failed to raise complaint";
            })

            // fetchMyComplaints
            .addCase(fetchMyComplaints.pending, (state) => {
                state.myComplaintsLoading = true;
                state.myComplaintError = null;
            })
            .addCase(fetchMyComplaints.fulfilled, (state, action) => {
                state.myComplaintsLoading = false;
                state.myComplaints = action.payload.complaints;
                state.myComplaintPagination = action.payload.pagination;
            })
            .addCase(fetchMyComplaints.rejected, (state, action) => {
                state.myComplaintsLoading = false;
                state.myComplaintError = action.payload || "Failed to fetch complaints";
            })
    },
});

export const { clearCurrentShipment, clearError, setDateRange, clearNotificationError, clearTimeline, clearComplaintError, clearLastComplaint, setActiveMyComplaintTab } = shipmentSlice.actions;
export default shipmentSlice.reducer;