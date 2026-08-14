import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { menu } from "@/constants/menu";

export default function FoodDetails() {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = menu.find((food) => food.id === id);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Food not found</Text>
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
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.price}>₹{item.price}</Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <View style={styles.quantityRow}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Text style={styles.quantityText}>−</Text>
          </Pressable>

          <Text style={styles.quantity}>{quantity}</Text>

          <Pressable
            style={styles.quantityButton}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Text style={styles.quantityText}>+</Text>
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
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 320,
  },

  content: {
    padding: 24,
  },

  name: {
    fontSize: 28,
    fontWeight: "800",
  },

  price: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },

  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginTop: 16,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
  },

  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  quantityText: {
    fontSize: 24,
  },

  quantity: {
    fontSize: 18,
    fontWeight: "700",
  },

  cartButton: {
    marginTop: 30,
    padding: 16,
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
  },
});