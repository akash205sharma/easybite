import { router } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";

export default function CartScreen() {
  const {
    items,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

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
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.price}>
                ₹{item.price}
              </Text>

              <View style={styles.quantityRow}>
                <Pressable
                  onPress={() => decreaseQuantity(item.id)}
                  style={styles.quantityButton}
                >
                  <Text>−</Text>
                </Pressable>

                <Text>{item.quantity}</Text>

                <Pressable
                  onPress={() => increaseQuantity(item.id)}
                  style={styles.quantityButton}
                >
                  <Text>+</Text>
                </Pressable>

                <Pressable
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>₹{total}</Text>
        </View>

        <Pressable
          style={styles.checkout}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>
            Proceed to Checkout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  list: {
    padding: 16,
  },

  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  details: {
    flex: 1,
    paddingLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  price: {
    marginTop: 5,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  remove: {
    color: "red",
    marginLeft: 5,
  },

  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 18,
  },

  total: {
    fontSize: 20,
    fontWeight: "800",
  },

  checkout: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  shopButton: {
    marginTop: 20,
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
  },

  shopButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});