import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/api";
import { useState } from "react";

export default function CheckoutScreen() {
  const { token } = useAuth();
  const { items, total, clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  const tax = Math.round(total * 0.05);
  const grandTotal = total + tax;

  const placeOrder = async () => {
    if (!token) {
      Alert.alert("Login required", "Please login to place an order.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Empty cart", "Please add items before checkout.");
      return;
    }

    try {
      setLoading(true);

      const order = await createOrder(
        token,
        items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        }))
      );

      clearCart();

      router.replace(`/order/${order.id}`);
    } catch (error) {
      Alert.alert(
        "Order failed",
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>

        <Pressable
          style={styles.shopButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.shopButtonText}>
            Browse Menu
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Checkout</Text>

      {/* Address */}
      <Text style={styles.sectionTitle}>
        Delivery Address
      </Text>

      <View style={styles.card}>
        <Text style={styles.addressTitle}>Home</Text>

        <Text style={styles.address}>
          Bhagalpur, Bihar, India
        </Text>
      </View>

      {/* Order summary */}
      <Text style={styles.sectionTitle}>
        Order Summary
      </Text>

      <View style={styles.card}>
        {items.map((item) => (
          <View
            key={item.id}
            style={styles.itemRow}
          >
            <Text
              style={styles.itemName}
              numberOfLines={1}
            >
              {item.name} × {item.quantity}
            </Text>

            <Text style={styles.itemPrice}>
              ₹{item.price * item.quantity}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <Text style={styles.muted}>
            Subtotal
          </Text>

          <Text>₹{total}</Text>
        </View>

        <View style={styles.itemRow}>
          <Text style={styles.muted}>
            Tax (5%)
          </Text>

          <Text>₹{tax}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.total}>
            ₹{grandTotal}
          </Text>
        </View>
      </View>

      {/* Payment */}
      <Text style={styles.sectionTitle}>
        Payment
      </Text>

      <View style={styles.card}>
        <View style={styles.paymentRow}>
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>

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
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={placeOrder}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff" />

            <Text style={styles.buttonText}>
              Placing Order...
            </Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>
            Place Order · ₹{grandTotal}
          </Text>
        )}
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
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
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
    lineHeight: 20,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 7,
  },

  itemName: {
    flex: 1,
    marginRight: 12,
    color: "#333",
  },

  itemPrice: {
    fontWeight: "600",
  },

  muted: {
    color: "#666",
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
    fontSize: 19,
    fontWeight: "800",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioOuter: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#111",
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

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  empty: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  shopButton: {
    marginTop: 20,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
  },

  shopButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});