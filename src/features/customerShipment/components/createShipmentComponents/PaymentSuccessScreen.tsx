// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";

// // ── PDF Styles ──
// const pdfStyles = StyleSheet.create({
//   page: {
//     padding: 32,
//     fontFamily: "Helvetica",
//     backgroundColor: "#ffffff",
//   },
//   // Header
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//     marginBottom: 16,
//   },
//   brandName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1e293b" },
//   brandSub: { fontSize: 9, color: "#64748b", marginTop: 2 },
//   badgeWrap: { alignItems: "flex-end" },
//   badge: {
//     backgroundColor: "#dcfce7",
//     color: "#15803d",
//     fontSize: 9,
//     paddingVertical: 3,
//     paddingHorizontal: 10,
//     borderRadius: 99,
//     fontFamily: "Helvetica-Bold",
//   },
//   dateText: { fontSize: 8, color: "#64748b", marginTop: 4 },
//   // Section label
//   sectionLabel: {
//     fontSize: 8,
//     color: "#94a3b8",
//     letterSpacing: 1.5,
//     fontFamily: "Helvetica-Bold",
//     marginBottom: 8,
//     marginTop: 4,
//   },
//   // Row
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 7,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   rowLabel: { fontSize: 10, color: "#64748b" },
//   rowValue: { fontSize: 10, color: "#334155" },
//   // Total
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#f0fdf4",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     marginTop: 10,
//   },
//   totalLabel: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b" },
//   totalValue: {
//     fontSize: 13,
//     fontFamily: "Helvetica-Bold",
//     color: "#16a34a",
//   },
//   // Spacer & footer
//   spacer: { marginTop: 14 },
//   footer: {
//     fontSize: 8,
//     color: "#94a3b8",
//     textAlign: "center",
//     marginTop: 28,
//   },
// });

// // ── Receipt PDF Component ──
// const ReceiptPDF = ({
//   razorpayPaymentId,
//   trackingId,
//   breakdown,
//   today,
// }: {
//   razorpayPaymentId: string;
//   trackingId?: string;
//   breakdown: {
//     base: number;
//     weight: number;
//     weightKg: number;
//     priority: number;
//     priorityType: string;
//     fragile: number;
//     subtotal: number;
//     gst: number;
//     total: number;
//   };
//   today: string;
// }) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       {/* Header */}
//       <View style={pdfStyles.header}>
//         <View>
//           <Text style={pdfStyles.brandName}>ShipFast</Text>
//           <Text style={pdfStyles.brandSub}>Logistics & Delivery</Text>
//         </View>
//         <View style={pdfStyles.badgeWrap}>
//           <Text style={pdfStyles.badge}>✓ Paid</Text>
//           <Text style={pdfStyles.dateText}>{today}</Text>
//         </View>
//       </View>

//       {/* Payment Details */}
//       <Text style={pdfStyles.sectionLabel}>PAYMENT DETAILS</Text>
//       <View style={pdfStyles.row}>
//         <Text style={pdfStyles.rowLabel}>Payment ID</Text>
//         <Text style={pdfStyles.rowValue}>{razorpayPaymentId}</Text>
//       </View>
//       {trackingId && (
//         <View style={pdfStyles.row}>
//           <Text style={pdfStyles.rowLabel}>Tracking ID</Text>
//           <Text style={pdfStyles.rowValue}>{trackingId}</Text>
//         </View>
//       )}

//       {/* Price Breakdown */}
//       <View style={pdfStyles.spacer} />
//       <Text style={pdfStyles.sectionLabel}>PRICE BREAKDOWN</Text>

//       <View style={pdfStyles.row}>
//         <Text style={pdfStyles.rowLabel}>Base rate</Text>
//         <Text style={pdfStyles.rowValue}>Rs. {breakdown.base}</Text>
//       </View>
//       <View style={pdfStyles.row}>
//         <Text style={pdfStyles.rowLabel}>
//           Weight ({breakdown.weightKg}kg x Rs. 20)
//         </Text>
//         <Text style={pdfStyles.rowValue}>Rs. {breakdown.weight}</Text>
//       </View>
//       <View style={pdfStyles.row}>
//         <Text style={pdfStyles.rowLabel}>
//           Priority ({breakdown.priorityType})
//         </Text>
//         <Text style={pdfStyles.rowValue}>Rs. {breakdown.priority}</Text>
//       </View>
//       {breakdown.fragile > 0 && (
//         <View style={pdfStyles.row}>
//           <Text style={pdfStyles.rowLabel}>Fragile handling</Text>
//           <Text style={pdfStyles.rowValue}>Rs. {breakdown.fragile}</Text>
//         </View>
//       )}
//       <View style={pdfStyles.row}>
//         <Text style={pdfStyles.rowLabel}>Subtotal</Text>
//         <Text style={pdfStyles.rowValue}>Rs. {breakdown.subtotal}</Text>
//       </View>
//       <View style={pdfStyles.row}>
//         <Text style={pdfStyles.rowLabel}>GST (18%)</Text>
//         <Text style={pdfStyles.rowValue}>Rs. {breakdown.gst}</Text>
//       </View>

//       {/* Total */}
//       <View style={pdfStyles.totalRow}>
//         <Text style={pdfStyles.totalLabel}>Total</Text>
//         <Text style={pdfStyles.totalValue}>Rs. {breakdown.total}</Text>
//       </View>

//       {/* Footer */}
//       <Text style={pdfStyles.footer}>
//         System-generated receipt. No signature required.
//       </Text>
//     </Page>
//   </Document>
// );

// // ── Main Screen ──
// const PaymentSuccessScreen = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { razorpayPaymentId, trackingId, breakdown } = location.state ?? {};

//   useEffect(() => {
//     if (!razorpayPaymentId) {
//       navigate("/sendShipment", { replace: true });
//     }
//   }, [razorpayPaymentId, navigate]);

//   if (!razorpayPaymentId) return null;

//   const today = new Date().toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   return (
//     <div className="rounded-2xl min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-4">
//       {/* Success header */}
//       <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-4 flex flex-col items-center gap-3 shadow-sm">
//         <div className="text-green-500 text-5xl">
//           <i className="fa-solid fa-circle-check"></i>
//         </div>
//         <p className="text-xl font-bold text-green-600">Payment Successful!</p>
//         <p className="text-slate-500 text-sm">Payment ID: {razorpayPaymentId}</p>
//         <p className="text-slate-600 text-center text-[14px]">
//           Your shipment has been created. Admin will assign a delivery slot shortly.
//         </p>
//       </div>

//       {/* Receipt preview */}
//       <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
//         <div className="flex justify-between items-start pb-4 border-b border-slate-200 mb-4">
//           <div>
//             <p className="text-xl font-semibold text-slate-800">ShipFast</p>
//             <p className="text-xs text-slate-500">Logistics & Delivery</p>
//           </div>
//           <div className="text-right">
//             <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
//               ✓ Paid
//             </span>
//             <p className="text-xs text-slate-500 mt-2">{today}</p>
//           </div>
//         </div>

//         <p className="text-[11px] font-semibold text-slate-400 tracking-widest mb-3">
//           PAYMENT DETAILS
//         </p>
//         <div className="space-y-2 mb-5 text-sm">
//           <div className="flex justify-between">
//             <span className="text-slate-500">Payment ID</span>
//             <span className="font-medium text-slate-700">{razorpayPaymentId}</span>
//           </div>
//           {trackingId && (
//             <div className="flex justify-between border-t border-slate-100 pt-2">
//               <span className="text-slate-500">Tracking ID</span>
//               <span className="font-medium text-slate-700">{trackingId}</span>
//             </div>
//           )}
//         </div>

//         {breakdown && (
//           <>
//             <p className="text-[11px] font-semibold text-slate-400 tracking-widest mb-3">
//               PRICE BREAKDOWN
//             </p>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Base rate</span>
//                 <span className="text-slate-700">₹{breakdown.base}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Weight ({breakdown.weightKg}kg × ₹20)</span>
//                 <span className="text-slate-700">₹{breakdown.weight}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Priority ({breakdown.priorityType})</span>
//                 <span className="text-slate-700">₹{breakdown.priority}</span>
//               </div>
//               {breakdown.fragile > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Fragile handling</span>
//                   <span className="text-slate-700">₹{breakdown.fragile}</span>
//                 </div>
//               )}
//               <div className="flex justify-between border-t border-slate-200 pt-2">
//                 <span className="text-slate-500">Subtotal</span>
//                 <span className="text-slate-700">₹{breakdown.subtotal}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-500">GST (18%)</span>
//                 <span className="text-slate-700">₹{breakdown.gst}</span>
//               </div>
//               <div className="flex justify-between border-t border-slate-300 pt-3 mt-2">
//                 <span className="font-semibold text-slate-800 text-base">Total</span>
//                 <span className="font-semibold text-green-600 text-base">₹{breakdown.total}</span>
//               </div>
//             </div>
//           </>
//         )}

//         <p className="text-[11px] text-slate-400 text-center mt-6">
//           System-generated receipt. No signature required.
//         </p>
//       </div>

//       {/* Action buttons */}
//       <div className="flex flex-col gap-3">
//         {/* PDFDownloadLink — no handleDownload needed! */}
//         <PDFDownloadLink
//           document={
//             <ReceiptPDF
//               razorpayPaymentId={razorpayPaymentId}
//               trackingId={trackingId}
//               breakdown={breakdown}
//               today={today}
//             />
//           }
//           fileName={`ShipFast-Receipt-${razorpayPaymentId}.pdf`}
//           className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
//         >
//           {({ loading }) =>
//             loading ? (
//               "Generating PDF..."
//             ) : (
//               <>
//                 <i className="fa-solid fa-download mr-2"></i>
//                 Download Receipt (PDF)
//               </>
//             )
//           }
//         </PDFDownloadLink>

//         <button
//           onClick={() => navigate("/sendShipment")}
//           className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all"
//         >
//           <i className="fa-solid fa-plus mr-2"></i>
//           Create New Shipment
//         </button>
//         <button
//           onClick={() => navigate("/myShipments")}
//           className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-all"
//         >
//           <i className="fa-solid fa-box mr-2"></i>
//           View My Shipments
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessScreen;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 16,
  },
  brandName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1e293b" },
  brandSub: { fontSize: 9, color: "#64748b", marginTop: 2 },
  badgeWrap: { alignItems: "flex-end" },
  badge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 99,
    fontFamily: "Helvetica-Bold",
  },
  dateText: { fontSize: 8, color: "#64748b", marginTop: 4 },
  sectionLabel: {
    fontSize: 8,
    color: "#94a3b8",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rowLabel: { fontSize: 10, color: "#64748b" },
  rowValue: { fontSize: 10, color: "#334155" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  totalLabel: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b" },
  totalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#16a34a" },
  spacer: { marginTop: 14 },
  footer: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 28,
  },
});

const ReceiptPDF = ({
  razorpayPaymentId,
  trackingId,
  breakdown,
  today,
}: {
  razorpayPaymentId: string;
  trackingId?: string;
  breakdown: {
    base: number;
    weight: number;
    weightKg: number;
    priority: number;
    priorityType: string;
    fragile: number;
    subtotal: number;
    gst: number;
    total: number;
  };
  today: string;
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View>
          <Text style={pdfStyles.brandName}>ShipFast</Text>
          <Text style={pdfStyles.brandSub}>Logistics & Delivery</Text>
        </View>
        <View style={pdfStyles.badgeWrap}>
          <Text style={pdfStyles.badge}>✓ Paid</Text>
          <Text style={pdfStyles.dateText}>{today}</Text>
        </View>
      </View>

      <Text style={pdfStyles.sectionLabel}>PAYMENT DETAILS</Text>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Payment ID</Text>
        <Text style={pdfStyles.rowValue}>{razorpayPaymentId}</Text>
      </View>
      {trackingId && (
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.rowLabel}>Tracking ID</Text>
          <Text style={pdfStyles.rowValue}>{trackingId}</Text>
        </View>
      )}

      <View style={pdfStyles.spacer} />
      <Text style={pdfStyles.sectionLabel}>PRICE BREAKDOWN</Text>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Base rate</Text>
        <Text style={pdfStyles.rowValue}>Rs. {breakdown.base}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Weight ({breakdown.weightKg}kg x Rs. 20)</Text>
        <Text style={pdfStyles.rowValue}>Rs. {breakdown.weight}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Priority ({breakdown.priorityType})</Text>
        <Text style={pdfStyles.rowValue}>Rs. {breakdown.priority}</Text>
      </View>
      {breakdown.fragile > 0 && (
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.rowLabel}>Fragile handling</Text>
          <Text style={pdfStyles.rowValue}>Rs. {breakdown.fragile}</Text>
        </View>
      )}
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Subtotal</Text>
        <Text style={pdfStyles.rowValue}>Rs. {breakdown.subtotal}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>GST (18%)</Text>
        <Text style={pdfStyles.rowValue}>Rs. {breakdown.gst}</Text>
      </View>
      <View style={pdfStyles.totalRow}>
        <Text style={pdfStyles.totalLabel}>Total</Text>
        <Text style={pdfStyles.totalValue}>Rs. {breakdown.total}</Text>
      </View>

      <Text style={pdfStyles.footer}>
        System-generated receipt. No signature required.
      </Text>
    </Page>
  </Document>
);

// ── Receipt Preview Modal ──
function ReceiptPreviewModal({
  onClose,
  razorpayPaymentId,
  trackingId,
  breakdown,
  today,
  fileName,
}: {
  onClose: () => void;
  razorpayPaymentId: string;
  trackingId?: string;
  breakdown: {
    base: number;
    weight: number;
    weightKg: number;
    priority: number;
    priorityType: string;
    fragile: number;
    subtotal: number;
    gst: number;
    total: number;
  };
  today: string;
  fileName: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="font-semibold text-slate-700 text-sm">Receipt Preview</p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Receipt content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 [scrollbar-width:none]">
          {/* Brand */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200 mb-4">
            <div>
              <p className="text-lg font-semibold text-slate-800">ShipFast</p>
              <p className="text-xs text-slate-500">Logistics & Delivery</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                ✓ Paid
              </span>
              <p className="text-xs text-slate-500 mt-2">{today}</p>
            </div>
          </div>

          {/* Payment details */}
          <p className="text-[10px] font-semibold text-slate-400 tracking-widest mb-3">
            PAYMENT DETAILS
          </p>
          <div className="space-y-2 mb-5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment ID</span>
              <span className="font-medium text-slate-700 text-xs">{razorpayPaymentId}</span>
            </div>
            {trackingId && (
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Tracking ID</span>
                <span className="font-medium text-slate-700 text-xs">{trackingId}</span>
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <p className="text-[10px] font-semibold text-slate-400 tracking-widest mb-3">
            PRICE BREAKDOWN
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Base rate</span>
              <span className="text-slate-700">₹{breakdown.base}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Weight ({breakdown.weightKg}kg × ₹20)</span>
              <span className="text-slate-700">₹{breakdown.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Priority ({breakdown.priorityType})</span>
              <span className="text-slate-700">₹{breakdown.priority}</span>
            </div>
            {breakdown.fragile > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Fragile handling</span>
                <span className="text-slate-700">₹{breakdown.fragile}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-700">₹{breakdown.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST (18%)</span>
              <span className="text-slate-700">₹{breakdown.gst}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-3">
              <span className="font-semibold text-slate-800 text-base">Total</span>
              <span className="font-semibold text-green-600 text-base">₹{breakdown.total}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-6">
            System-generated receipt. No signature required.
          </p>
        </div>

        {/* Modal footer — download button */}
        <div className="px-5 py-4 border-t border-slate-100">
          <PDFDownloadLink
            document={
              <ReceiptPDF
                razorpayPaymentId={razorpayPaymentId}
                trackingId={trackingId}
                breakdown={breakdown}
                today={today}
              />
            }
            fileName={fileName}
            className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
          >
            {({ loading }) =>
              loading ? (
                "Generating PDF..."
              ) : (
                <>
                  <i className="fa-solid fa-download" />
                  Download Receipt (PDF)
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}

// ── Main Screen ──
const PaymentSuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const { razorpayPaymentId, trackingId, breakdown } = location.state ?? {};

  useEffect(() => {
    if (!razorpayPaymentId) {
      navigate("/sendShipment", { replace: true });
    }
  }, [razorpayPaymentId, navigate]);

  if (!razorpayPaymentId) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const fileName = `ShipFast-Receipt-${razorpayPaymentId}.pdf`;

  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
        <ReceiptPreviewModal
          onClose={() => setShowPreview(false)}
          razorpayPaymentId={razorpayPaymentId}
          trackingId={trackingId}
          breakdown={breakdown}
          today={today}
          fileName={fileName}
        />
      )}

      <div className="rounded-2xl min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-purple-50 p-4">
        {/* Success card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-4 flex flex-col items-center gap-3 shadow-sm">
          <div className="text-green-500 text-5xl">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <p className="text-xl font-bold text-green-600">Payment Successful!</p>
          <p className="text-slate-500 text-sm">Payment ID: {razorpayPaymentId}</p>
          <p className="text-slate-600 text-center text-[14px]">
            Your shipment has been created. Admin will assign a delivery slot shortly.
          </p>

          {/* Preview/Download button row */}
          <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
            {/* Preview button */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-eye" />
              Preview Receipt
            </button>

            {/* Direct download icon button */}
            <PDFDownloadLink
              document={
                <ReceiptPDF
                  razorpayPaymentId={razorpayPaymentId}
                  trackingId={trackingId}
                  breakdown={breakdown}
                  today={today}
                />
              }
              fileName={fileName}
              className="h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center justify-center flex-shrink-0"
              title="Download PDF directly"
            >
              {({ loading }) =>
                loading ? (
                  <i className="fa-solid fa-spinner animate-spin text-sm" />
                ) : (
                  <i className="fa-solid fa-download text-sm" />
                )
              }
            </PDFDownloadLink>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/sendShipment")}
            className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Create New Shipment
          </button>
          <button
            onClick={() => navigate("/myShipments")}
            className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-all"
          >
            <i className="fa-solid fa-box mr-2"></i>
            View My Shipments
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessScreen;