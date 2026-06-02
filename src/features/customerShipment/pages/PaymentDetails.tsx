// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../../shared/hooks/reduxHooks";
// import { fetchPaymentDetails } from "../shipmentSlice";

// const PaymentDetails = () => {
//   const { shipmentId } = useParams();

//   const dispatch = useAppDispatch();

//   const { paymentDetails, loading } = useAppSelector(
//     (state) => state.shipment,
//   );

//   useEffect(() => {
//     if (shipmentId) {
//       dispatch(fetchPaymentDetails(Number(shipmentId)));
//     }
//   }, [dispatch, shipmentId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading payment details...
//       </div>
//     );
//   }

//   if (!paymentDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Payment details not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
//       <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        
//         <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
//           <h1 className="text-2xl font-bold">
//             Payment Details
//           </h1>

//           <p className="text-sm text-emerald-100 mt-1">
//             Shipment #{paymentDetails.shipmentId}
//           </p>
//         </div>

//         <div className="p-6 space-y-5">

//           <div className="grid grid-cols-2 gap-5">

//             <div>
//               <p className="text-xs text-slate-400">
//                 Payment Status
//               </p>

//               <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
//                 {paymentDetails.paymentStatus}
//               </div>
//             </div>

//             <div>
//               <p className="text-xs text-slate-400">
//                 Amount
//               </p>

//               <h2 className="text-xl font-bold text-slate-800 mt-1">
//                 ₹{paymentDetails.amount}
//               </h2>
//             </div>

//             <div>
//               <p className="text-xs text-slate-400">
//                 Transaction ID
//               </p>

//               <p className="font-medium text-slate-700 mt-1 break-all">
//                 {paymentDetails.transactionId}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-slate-400">
//                 Paid At
//               </p>

//               <p className="font-medium text-slate-700 mt-1">
//                 {new Date(paymentDetails.paidAt).toLocaleString()}
//               </p>
//             </div>

//             <div className="col-span-2">
//               <p className="text-xs text-slate-400">
//                 Razorpay Order ID
//               </p>

//               <p className="font-medium text-slate-700 mt-1 break-all">
//                 {paymentDetails.razorpayOrderId}
//               </p>
//             </div>

//             <div className="col-span-2">
//               <p className="text-xs text-slate-400">
//                 Razorpay Payment ID
//               </p>

//               <p className="font-medium text-slate-700 mt-1 break-all">
//                 {paymentDetails.razorpayPaymentId}
//               </p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentDetails;
import React from 'react'

const PaymentDetails = () => {
  return (
    <div>PaymentDetails</div>
  )
}

export default PaymentDetails