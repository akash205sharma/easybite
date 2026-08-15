import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { useCart } from "@/context/CartContext";
import { getMenuItem, MenuItem } from "@/services/api";

export default function FoodDetails() {
  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    const menuItemId = Number(id);

    if (!menuItemId) {
      setError("Invalid food item");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getMenuItem(menuItemId);

      setItem(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load food. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading food...
        </Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Food not found"}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadItem}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.price}>
          ₹{item.price}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <Text style={styles.quantityLabel}>
          Quantity
        </Text>

        <View style={styles.quantityRow}>
          <Pressable
            style={styles.quantityButton}
            onPress={() =>
              setQuantity((q) => Math.max(1, q - 1))
            }
          >
            <Text style={styles.quantityText}>
              −
            </Text>
          </Pressable>

          <Text style={styles.quantity}>
            {quantity}
          </Text>

          <Pressable
            style={styles.quantityButton}
            onPress={() =>
              setQuantity((q) => q + 1)
            }
          >
            <Text style={styles.quantityText}>
              +
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.cartButton}
          onPress={() => {
            addToCart(
              {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
              },
              quantity
            );

            router.push("/cart");
          }}
        >
          <Text style={styles.cartButtonText}>
            Add to Cart · ₹{item.price * quantity}
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

  image: {
    width: "100%",
    height: 320,
    backgroundColor: "#eee",
  },

  content: {
    padding: 24,
  },

  name: {
    fontSize: 29,
    fontWeight: "800",
    color: "#111",
  },

  price: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginTop: 8,
  },

  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginTop: 16,
  },

  quantityLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginTop: 28,
    marginBottom: 10,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  quantityButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#e9e9e9",
    justifyContent: "center",
    alignItems: "center",
  },

  quantityText: {
    fontSize: 24,
    color: "#111",
  },

  quantity: {
    fontSize: 19,
    fontWeight: "700",
    minWidth: 25,
    textAlign: "center",
  },

  cartButton: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
  },

  cartButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  errorText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 14,
  },

  retryButton: {
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
});