import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "../../constants/appTheme";
import { getToken } from "../../services/AuthServices";
import { API_BASE_URL } from "../../services/api";

type OrderItem = {
  id: number;
  orderDate?: string;
  totalAmount?: number;
  status?: string;
  customerId?: number;
  userId?: number;
  tableId?: number | null;
  creatorFullName?: string;
  note?: string;
};

function getStatusLabel(status?: string) {
  const normalized = String(status || "").toLowerCase();

  switch (normalized) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "Unknown";
  }
}

function getStatusColors(status?: string) {
  const normalized = String(status || "").toLowerCase();

  switch (normalized) {
    case "pending":
      return { bg: "#FFF4E5", text: "#D9822B" };
    case "confirmed":
      return { bg: "#E8F1FF", text: "#2F6FED" };
    case "processing":
      return { bg: "#F3E8FF", text: "#8E44EC" };
    case "completed":
      return { bg: "#EAF7EE", text: "#2E9E5B" };
    case "cancelled":
      return { bg: "#FDE8E8", text: "#D64545" };
    default:
      return { bg: "#F2F3F2", text: "#666666" };
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "No date";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleString();
}

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/client/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const raw = await response.json();

      if (!response.ok) {
        throw new Error(raw?.message || "Unable to load orders");
      }

      const data = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setOrders(data);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to load order history");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const goToOrderDetail = (id: number) => {
    if (!id) {
      Alert.alert("Error", "This order does not have a valid id.");
      return;
    }

    router.push(`/order/${id}` as any);
  };

  const goToHome = () => {
    router.push("/home" as any);
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => {
    const statusColors = getStatusColors(item.status);
    const total = Number(item.totalAmount ?? 0);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.orderCard}
        onPress={() => goToOrderDetail(item.id)}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderCode}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <Text style={styles.viewDetailText}>View detail →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </SafeAreaView>
    );
  }

  if (!orders.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Text style={styles.emptyIcon}>🧾</Text>
        </View>

        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>
          Your previous orders will appear here after you place one.
        </Text>

        <View style={styles.emptyButtonWrap}>
          <PrimaryButton title="Start Shopping" onPress={goToHome} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={loadOrders}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.titleLarge,
    fontWeight: "700",
    color: colors.text,
  },
  refreshText: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 32,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  orderInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  orderCode: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  orderDate: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  cardBottomRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: typography.heading,
    fontWeight: "800",
    color: colors.text,
  },
  viewDetailText: {
    fontSize: typography.bodySmall,
    fontWeight: "700",
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EAF7EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  emptyIcon: {
    fontSize: 46,
  },
  emptyTitle: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyButtonWrap: {
    width: "100%",
    marginTop: spacing.xl,
  },
});