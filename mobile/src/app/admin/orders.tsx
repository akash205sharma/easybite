import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import {
  getAdminOrders,
  Order,
  updateOrderStatus,
} from "@/services/api";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersScreen() {
  const { token, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  async function loadOrders() {
    if (!token) return;

    try {
      setLoading(true);

      const data = await getAdminOrders(token);

      console.log(data);

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(
    orderId: number,
    status: string
  ) {
    if (!token) return;

    try {
      const updated = await updateOrderStatus(
        token,
        orderId,
        status
      );

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
              ...order,
              status: updated.status,
            }
            : order
        )
      );

      // Also update the order currently open in modal
      setSelectedOrder((current) =>
        current?.id === orderId
          ? {
            ...current,
            status: updated.status,
          }
          : current
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (user?.role !== "ADMIN") {
    return (
      <View style={styles.center}>
        <Text>Access denied</Text>
      </View>
    );
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
      <Text style={styles.title}>
        Restaurant Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadOrders}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Order Header */}
            <Pressable
              onPress={() =>
                setSelectedOrder(item)
              }
            >
              <View style={styles.row}>
                <Text style={styles.order}>
                  Order #{item.id}
                </Text>

                <Text style={styles.total}>
                  ₹{item.total}
                </Text>
              </View>

              <Text style={styles.status}>
                Current status:{" "}
                {item.status}
              </Text>

              <Text style={styles.items}>
                {item.items.length} item
                {item.items.length !== 1
                  ? "s"
                  : ""}
              </Text>

              <Text
                style={styles.viewDetails}
              >
                View order details →
              </Text>
            </Pressable>

            {/* Status Buttons */}
            <View
              style={styles.statusContainer}
            >
              {statuses.map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusButton,
                    item.status ===
                    status &&
                    styles.activeStatus,
                  ]}
                  onPress={() =>
                    changeStatus(
                      item.id,
                      status
                    )
                  }
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      item.status ===
                      status &&
                      styles.activeStatusText,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No orders yet
          </Text>
        }
      />

      {/* Order Details Modal */}
      <Modal
        visible={selectedOrder !== null}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setSelectedOrder(null)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                {/* Modal Header */}
                <View
                  style={styles.modalHeader}
                >
                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    Order #
                    {selectedOrder.id}
                  </Text>

                  <Pressable
                    onPress={() =>
                      setSelectedOrder(
                        null
                      )
                    }
                  >
                    <Text
                      style={
                        styles.closeButton
                      }
                    >
                      ✕
                    </Text>
                  </Pressable>
                </View>

                {/* Customer */}
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Customer
                </Text>

                <Text
                  style={
                    styles.customerName
                  }
                >
                  {selectedOrder.user
                    ?.name ||
                    "Unknown customer"}
                </Text>

                <Text
                  style={
                    styles.customerEmail
                  }
                >
                  {selectedOrder.user
                    ?.email || ""}
                </Text>

                {/* Items */}
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Items
                </Text>

                {selectedOrder.items.map(
                  (orderItem) => (
                    <View
                      key={
                        orderItem.id
                      }
                      style={
                        styles.itemRow
                      }
                    >
                      <Text
                        style={
                          styles.itemName
                        }
                      >
                        {orderItem
                          .menuItem
                          ?.name ||
                          `Item #${orderItem.menuItemId}`}{" "}
                        ×{" "}
                        {
                          orderItem.quantity
                        }
                      </Text>

                      <Text
                        style={
                          styles.itemPrice
                        }
                      >
                        ₹
                        {orderItem.price *
                          orderItem.quantity}
                      </Text>
                    </View>
                  )
                )}

                {/* Total */}
                <View
                  style={
                    styles.divider
                  }
                />

                <View
                  style={styles.row}
                >
                  <Text
                    style={
                      styles.totalLabel
                    }
                  >
                    Total
                  </Text>

                  <Text
                    style={
                      styles.modalTotal
                    }
                  >
                    ₹
                    {
                      selectedOrder.total
                    }
                  </Text>
                </View>

                {/* Status */}
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Status
                </Text>

                <Text
                  style={
                    styles.modalStatus
                  }
                >
                  {
                    selectedOrder.status
                  }
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  order: {
    fontSize: 17,
    fontWeight: "800",
  },

  total: {
    fontSize: 17,
    fontWeight: "800",
  },

  status: {
    marginTop: 10,
    fontWeight: "600",
  },

  items: {
    marginTop: 6,
    color: "#666",
  },

  viewDetails: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
  },

  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  statusButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  activeStatus: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  statusButtonText: {
    fontSize: 11,
    fontWeight: "600",
  },

  activeStatusText: {
    color: "#fff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },

  // Modal

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
  },

  closeButton: {
    fontSize: 20,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 8,
  },

  customerName: {
    fontSize: 16,
    fontWeight: "600",
  },

  customerEmail: {
    marginTop: 4,
    color: "#666",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  itemName: {
    flex: 1,
    fontSize: 15,
  },

  itemPrice: {
    fontWeight: "600",
    marginLeft: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
  },

  modalTotal: {
    fontSize: 18,
    fontWeight: "800",
  },

  modalStatus: {
    fontSize: 16,
    fontWeight: "700",
  },
});