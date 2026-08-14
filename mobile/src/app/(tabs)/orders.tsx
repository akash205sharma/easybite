import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { getOrders, Order } from "@/services/api";

export default function OrdersScreen() {
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  async function loadOrders() {
    if (!token) return;

    try {
      setLoading(true);

      const data = await getOrders(token);

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadOrders}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No orders yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(`/order/${item.id}`)
            }
          >
            <View style={styles.row}>
              <Text style={styles.orderId}>
                Order #{item.id}
              </Text>

              <Text style={styles.status}>
                {item.status}
              </Text>
            </View>

            <Text style={styles.items}>
              {item.items.length} item
              {item.items.length !== 1 ? "s" : ""}
            </Text>

            <View style={styles.row}>
              <Text>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              <Text style={styles.total}>
                ₹{item.total}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderId: {
    fontSize: 16,
    fontWeight: "700",
  },

  status: {
    fontSize: 13,
    fontWeight: "700",
  },

  items: {
    color: "#666",
    marginVertical: 10,
  },

  total: {
    fontSize: 17,
    fontWeight: "800",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
});