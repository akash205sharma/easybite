import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { getOrders, Order } from "@/services/api";

export default function OrdersScreen() {
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (token) {
        loadOrders();
      }
    }, [token])
  );

  async function loadOrders() {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const data = await getOrders(token);

      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }


  function getStatusStyle(status: string) {
    switch (status) {
      case "PLACED":
        return {
          backgroundColor: "#FFF3CD",
          color: "#856404",
        };

      case "CONFIRMED":
        return {
          backgroundColor: "#DDEBFF",
          color: "#2457A6",
        };

      case "PREPARING":
        return {
          backgroundColor: "#E8DFFF",
          color: "#6246A8",
        };

      case "READY":
        return {
          backgroundColor: "#D9F5E5",
          color: "#237A4B",
        };

      case "COMPLETED":
        return {
          backgroundColor: "#D4EDDA",
          color: "#155724",
        };

      case "CANCELLED":
        return {
          backgroundColor: "#F8D7DA",
          color: "#721C24",
        };

      default:
        return {
          backgroundColor: "#eee",
          color: "#555",
        };
    }
  }

  if (loading && orders.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading orders...
        </Text>
      </View>
    );
  }

  if (error && orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadOrders}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
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
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadOrders}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🧾</Text>

            <Text style={styles.emptyTitle}>
              No orders yet
            </Text>

            <Text style={styles.emptyText}>
              Your placed orders will appear here.
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

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      getStatusStyle(item.status).backgroundColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.status,
                    {
                      color: getStatusStyle(item.status).color,
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.items}>
              {item.items.length} item
              {item.items.length !== 1 ? "s" : ""}
            </Text>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.date}>
                {new Date(
                  item.createdAt
                ).toLocaleDateString()}
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
    color: "#111",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderId: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  status: {
    fontSize: 11,
    fontWeight: "700",
    color: "#333",
  },

  items: {
    color: "#666",
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  date: {
    color: "#777",
    fontSize: 13,
  },

  total: {
    fontSize: 17,
    fontWeight: "800",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  errorText: {
    color: "#666",
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

  empty: {
    alignItems: "center",
    paddingTop: 70,
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    marginTop: 6,
    textAlign: "center",
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