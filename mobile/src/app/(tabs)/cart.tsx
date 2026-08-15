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
        <Text style={styles.emptyIcon}>🛒</Text>

        <Text style={styles.emptyTitle}>
          Your cart is empty
        </Text>

        <Text style={styles.emptyText}>
          Add some delicious food from the menu.
        </Text>

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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <View style={styles.details}>
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text style={styles.price}>
                ₹{item.price}
              </Text>

              <View style={styles.quantityRow}>
                <View style={styles.quantityControls}>
                  <Pressable
                    onPress={() =>
                      decreaseQuantity(item.id)
                    }
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityText}>
                      −
                    </Text>
                  </Pressable>

                  <Text style={styles.quantity}>
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() =>
                      increaseQuantity(item.id)
                    }
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityText}>
                      +
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() =>
                    removeFromCart(item.id)
                  }
                >
                  <Text style={styles.remove}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.itemCount}>
              {items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}{" "}
              items
            </Text>
          </View>

          <Text style={styles.total}>
            ₹{total}
          </Text>
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
    paddingBottom: 20,
  },

  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    elevation: 1,
  },

  image: {
    width: 92,
    height: 92,
    borderRadius: 11,
    backgroundColor: "#eee",
  },

  details: {
    flex: 1,
    paddingLeft: 13,
    justifyContent: "space-between",
    paddingVertical: 2,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    marginTop: 4,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontSize: 18,
    color: "#111",
  },

  quantity: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 16,
    textAlign: "center",
  },

  remove: {
    color: "#d32f2f",
    fontSize: 13,
    fontWeight: "600",
  },

  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  itemCount: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  total: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  checkout: {
    backgroundColor: "#111",
    paddingVertical: 16,
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
    padding: 24,
    backgroundColor: "#f7f7f7",
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
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