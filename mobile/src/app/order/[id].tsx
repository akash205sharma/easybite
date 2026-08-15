import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

import { getOrder, Order } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

function getStatusStyle(status: string) {
  switch (status) {
    case "PLACED":
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };

    case "CONFIRMED":
      return {
        backgroundColor: "#D1ECF1",
        color: "#0C5460",
      };

    case "PREPARING":
      return {
        backgroundColor: "#E8D9FF",
        color: "#5B21B6",
      };

    case "READY":
      return {
        backgroundColor: "#D4EDDA",
        color: "#155724",
      };

    case "COMPLETED":
      return {
        backgroundColor: "#DCFCE7",
        color: "#166534",
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

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (token && id) {
        loadOrder();
      }
    }, [token, id])
  );

  async function loadOrder(isRefresh = false) {
    if (!token || !id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getOrder(
        token,
        Number(id)
      );

      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading order...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Order not found
        </Text>
      </View>
    );
  }

  const currentIndex = statuses.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";
  const statusStyle = getStatusStyle(order.status);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadOrder(true)}
        />
      }
    >
      <Text style={styles.title}>
        Order #{order.id}
      </Text>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              statusStyle.backgroundColor,
          },
        ]}
      >
        <Text
          style={[
            styles.statusBadgeText,
            {
              color: statusStyle.color,
            },
          ]}
        >
          {order.status}
        </Text>
      </View>

      <Text style={styles.total}>
        ₹{order.total}
      </Text>

      <Text style={styles.refreshHint}>
        Pull down to refresh status
      </Text>

      <View style={styles.timeline}>
        {statuses.map((status, index) => {
          const completed =
            !isCancelled && index <= currentIndex;

          const isCurrent =
            status === order.status;

          return (
            <View
              key={status}
              style={styles.statusRow}
            >
              <View style={styles.timelineColumn}>
                <View
                  style={[
                    styles.circle,
                    completed &&
                    styles.completedCircle,
                    isCurrent &&
                    styles.currentCircle,
                  ]}
                />

                {index < statuses.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      completed &&
                      styles.completedLine,
                    ]}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.statusText,
                  completed &&
                  styles.completedText,
                  isCurrent &&
                  styles.currentText,
                  isCancelled &&
                  status === "CANCELLED" &&
                  styles.cancelledText,
                ]}
              >
                {status}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  statusBadgeText: {
    fontSize: 13,
    fontWeight: "800",
  },

  total: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },

  refreshHint: {
    color: "#888",
    fontSize: 13,
    marginTop: 8,
  },

  timeline: {
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  statusRow: {
    flexDirection: "row",
    minHeight: 55,
  },

  timelineColumn: {
    width: 24,
    alignItems: "center",
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },

  completedCircle: {
    backgroundColor: "#22C55E",
  },

  currentCircle: {
    borderWidth: 4,
    borderColor: "#111",
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#ddd",
    marginVertical: 2,
  },

  completedLine: {
    backgroundColor: "#22C55E",
  },

  statusText: {
    marginLeft: 14,
    color: "#999",
    fontSize: 16,
    paddingTop: 1,
  },

  completedText: {
    color: "#111",
    fontWeight: "700",
  },

  currentText: {
    fontWeight: "800",
  },

  cancelledText: {
    color: "#d32f2f",
    fontWeight: "800",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  errorText: {
    color: "#666",
  },
});