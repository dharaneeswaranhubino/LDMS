import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "../../utils/shipmentHelpers";

const ReceiptPDF = ({
  razorpayPaymentId,
  paymentStatus,
  trackingId,
  prices,
  priority,
  packageWeight,
  today,
}: {
  razorpayPaymentId: string | undefined;
  paymentStatus: string | undefined;
  trackingId?: string;
  prices?: {
    platformFee: number;
    weightCharge: number;
    priorityCharge: number;
    fragileCharge: number | undefined;
    subtotal: number;
    gst: number;
    total: number;
  };
  priority: string | undefined;
  packageWeight: number | undefined;
  today?: string;
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View>
          <Text style={pdfStyles.brandName}>ShipFast</Text>
          <Text style={pdfStyles.brandSub}>Logistics & Delivery</Text>
        </View>
        <View style={pdfStyles.badgeWrap}>
          <Text
            style={
              paymentStatus === "REFUNDED"
                ? pdfStyles.refundedBadge
                : pdfStyles.badge
            }
          >
            {paymentStatus === "REFUNDED" ? paymentStatus : "Paid"}
          </Text>
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
        <Text style={pdfStyles.rowValue}>Rs. {prices?.platformFee}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Weight ({packageWeight}kg)</Text>
        <Text style={pdfStyles.rowValue}>Rs. {prices?.weightCharge}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Priority ({priority})</Text>
        <Text style={pdfStyles.rowValue}>Rs. {prices?.priorityCharge}</Text>
      </View>
      {(prices?.fragileCharge ?? 0) > 0 && (
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.rowLabel}>Fragile handling</Text>
          <Text style={pdfStyles.rowValue}>Rs. {prices?.fragileCharge}</Text>
        </View>
      )}
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>Subtotal</Text>
        <Text style={pdfStyles.rowValue}>Rs. {prices?.subtotal}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.rowLabel}>GST (18%)</Text>
        <Text style={pdfStyles.rowValue}>Rs. {prices?.gst}</Text>
      </View>
      {/* <View style={pdfStyles.totalRow}>
        <Text style={pdfStyles.totalLabel}>Total</Text>
        <Text style={pdfStyles.totalValue}>Rs. {prices?.total}</Text>
      </View> */}
      <View
        style={
          paymentStatus === "REFUNDED"
            ? pdfStyles.refundedTotalRow
            : pdfStyles.totalRow
        }
      >
        <Text style={pdfStyles.totalLabel}>Total</Text>
        <Text
          style={
            paymentStatus === "REFUNDED"
              ? pdfStyles.refundedTotalValue
              : pdfStyles.totalValue
          }
        >
          Rs. {prices?.total}
        </Text>
      </View>

      <Text style={pdfStyles.footer}>
        System-generated receipt. No signature required.
      </Text>
    </Page>
  </Document>
);

export default ReceiptPDF;
