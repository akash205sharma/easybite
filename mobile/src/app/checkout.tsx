import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";

export default function CheckoutScreen() {
  const { items, total } = useCart();

  const tax = Math.round(total * 0.05);
  const grandTotal = total + tax;

  const placeOrder = () => {
    // TODO: POST /api/orders
    router.replace("/order/1");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Checkout</Text>

      {/* Address */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>

      <View style={styles.card}>
        <Text style={styles.addressTitle}>Home</Text>
        <Text style={styles.address}>
          Bhagalpur, Bihar, India
        </Text>
      </View>

      {/* Order summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>

      <View style={styles.card}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.name} × {item.quantity}
            </Text>

            <Text>
              ₹{item.price * item.quantity}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <Text>Subtotal</Text>
          <Text>₹{total}</Text>
        </View>

        <View style={styles.itemRow}>
          <Text>Tax</Text>
          <Text>₹{tax}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>₹{grandTotal}</Text>
        </View>
      </View>

      {/* Payment */}
      <Text style={styles.sectionTitle}>Payment</Text>

      <View style={styles.card}>
        <View style={styles.paymentRow}>
          <View style={styles.radioSelected} />

          <View>
            <Text style={styles.paymentTitle}>
              Cash on Delivery
            </Text>

            <Text style={styles.paymentSubtitle}>
              Pay when your order arrives
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={placeOrder}
      >
        <Text style={styles.buttonText}>
          Place Order · ₹{grandTotal}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },

  addressTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  address: {
    color: "#666",
    marginTop: 5,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 7,
  },

  itemName: {
    flex: 1,
    marginRight: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
  },

  total: {
    fontSize: 18,
    fontWeight: "800",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#111",
    marginRight: 12,
  },

  paymentTitle: {
    fontWeight: "700",
  },

  paymentSubtitle: {
    color: "#666",
    marginTop: 3,
  },

  button: {
    backgroundColor: "#111",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});