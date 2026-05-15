import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "../../constants/appTheme";
import { defaultProductImage } from "../../constants/productImages";
import { getToken } from "../../services/AuthServices";
import { addManyToCart } from "../../services/CartServices";
import { API_BASE_URL } from "../../services/api";

type OrderDetailItem = {
  orderDetailId?: number;
  orderId?: number;
  productId?: number;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  subtotal?: number;
};

type OrderDetail = {
  id: number;
  orderDate?: string;
  totalAmount?: number;
  status?: string;
  tableId?: number | null;
  userId?: number;
  customerId?: number;
  creatorFullName?: string;
  details?: OrderDetailItem[];
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

export default function OrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const orderId = useMemo(() => Number(params.id), [params.id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);

      if (!orderId || Number.isNaN(orderId)) {
        Alert.alert("Error", "Invalid order id");
        router.back();
        return;
      }

      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/client/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const raw = await response.json();

      if (!response.ok) {
        throw new Error(raw?.message || "Unable to load order detail");
      }

      setOrder(raw);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to load order detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const handleReorder = async () => {
    try {
      if (!order?.details?.length) {
        Alert.alert("Cannot reorder", "This order has no items.");
        return;
      }

      const cartItems = order.details
        .map((item) => {
          const productId = Number(item.productId);
          const price = Number(item.unitPrice ?? 0);
          const quantity = Number(item.quantity ?? 0);
          const name = item.productName || "Product";

          if (!productId || Number.isNaN(productId) || quantity <= 0) {
            return null;
          }

          return {
            productId,
            name,
            price,
            imageUrl: null,
            quantity,
          };
        })
        .filter(Boolean) as {
        productId: number;
        name: string;
        price: number;
        imageUrl?: string | null;
        quantity: number;
      }[];

      if (!cartItems.length) {
        Alert.alert("Cannot reorder", "No valid items were found in this order.");
        return;
      }

      setReordering(true);
      await addManyToCart(cartItems);
      router.push("/cart" as any);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to reorder items");
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading order detail...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.notFoundTitle}>Order not found</Text>
        <Text style={styles.notFoundText}>
          We could not load this order detail.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusColors = getStatusColors(order.status);
  const total = Number(order.totalAmount ?? 0);
  const details = Array.isArray(order.details) ? order.details : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.headerBack}
            onPress={() => router.back()}
          >
            <Text style={styles.headerBackText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Order Detail</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.orderCode}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Amount</Text>
            <Text style={styles.infoValue}>${total.toFixed(2)}</Text>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Created By</Text>
            <Text style={[styles.infoValue, styles.noteValue]}>
              {order.creatorFullName || "Unknown"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>

          {details.length ? (
            details.map((item, index) => {
              const quantity = Number(item.quantity ?? 0);
              const unitPrice = Number(item.unitPrice ?? 0);
              const lineTotal = Number(item.subtotal ?? unitPrice * quantity);
              const itemName = item.productName || "Product";

              return (
                <View
                  key={`${item.orderDetailId ?? "item"}-${index}`}
                  style={[
                    styles.itemRow,
                    index === details.length - 1 && styles.itemRowLast,
                  ]}
                >
                  <View style={styles.itemLeft}>
                    <Image source={defaultProductImage} style={styles.itemImage} />

                    <View style={styles.itemTextWrap}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {itemName}
                      </Text>
                      <Text style={styles.itemMeta}>
                        {quantity} x ${unitPrice.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.itemLineTotal}>${lineTotal.toFixed(2)}</Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyItemsBox}>
              <Text style={styles.emptyItemsText}>No items in this order.</Text>
            </View>
          )}
        </View>

        <PrimaryButton
          title="Order Again"
          onPress={handleReorder}
          loading={reordering}
          style={styles.reorderButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
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
  notFoundTitle: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  notFoundText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  backButtonText: {
    color: colors.surface,
    fontWeight: "700",
    fontSize: typography.bodySmall,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  headerBack: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackText: {
    fontSize: 18,
    color: colors.text,
  },
  headerPlaceholder: {
    width: 42,
    height: 42,
  },
  title: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  infoBlock: {
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoRowLast: {
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },
  noteValue: {
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  itemImage: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginRight: spacing.md,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  itemLineTotal: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },
  emptyItemsBox: {
    paddingVertical: spacing.md,
  },
  emptyItemsText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  reorderButton: {
    marginTop: spacing.sm,
  },
});