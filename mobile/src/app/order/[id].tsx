import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getOrder, Order } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && id) {
      loadOrder();
    }
  }, [token, id]);

  async function loadOrder() {
    if (!token) return;

    try {
      const data = await getOrder(
        token,
        Number(id)
      );

      setOrder(data);
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

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const currentIndex = statuses.indexOf(order.status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Order #{order.id}
      </Text>

      <Text style={styles.total}>
        ₹{order.total}
      </Text>

      <View style={styles.timeline}>
        {statuses.map((status, index) => {
          const completed = index <= currentIndex;

          return (
            <View
              key={status}
              style={styles.statusRow}
            >
              <View
                style={[
                  styles.circle,
                  completed && styles.completedCircle,
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  completed && styles.completedText,
                ]}
              >
                {status}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  total: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },

  timeline: {
    marginTop: 40,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ddd",
    marginRight: 14,
  },

  completedCircle: {
    backgroundColor: "#111",
  },

  statusText: {
    color: "#999",
    fontSize: 16,
  },

  completedText: {
    color: "#111",
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});