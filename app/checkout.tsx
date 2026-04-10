import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "../constants/appTheme";
import { CartItem, clearCart, getCart, getTotal } from "../services/CartServices";
import { createOrderFromCart } from "../services/OrderServices";

export default function CheckoutScreen() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.log("Load cart error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const subtotal = getTotal(cart);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      Alert.alert("Cart is empty", "Please add items before checkout.");
      return;
    }

    try {
      setSubmitting(true);

      await createOrderFromCart(cart, note.trim());
      await clearCart();
      setCart([]);
      setNote("");

      router.replace("/order-success");
    } catch (error: any) {
      Alert.alert(
        "Order failed",
        error?.message || "Unable to place order right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToCart = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/home" as any);
  };

  if (!cart.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No items to checkout</Text>
        <Text style={styles.emptyText}>
          Your cart is empty at the moment.
        </Text>

        <View style={styles.emptyButtonWrap}>
          <PrimaryButton
            title="Back to Cart"
            onPress={() => router.push("/cart" as any)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backButton}
            onPress={goBackToCart}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Checkout</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          {cart.map((item) => (
            <View key={item.productId} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.quantity} x ${Number(item.price).toFixed(2)}
                </Text>
              </View>

              <Text style={styles.itemPrice}>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Instruction</Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note for your order"
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.noteInput}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{itemCount}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${Number(subtotal).toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>
              ${Number(subtotal).toFixed(2)}
            </Text>
          </View>
        </View>

        <PrimaryButton
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={submitting}
          style={styles.placeOrderButton}
        />

        <TouchableOpacity activeOpacity={0.85} onPress={goHome}>
          <Text style={styles.continueText}>Continue shopping</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: colors.text,
  },
  headerPlaceholder: {
    width: 42,
    height: 42,
  },
  title: {
    fontSize: typography.titleLarge,
    fontWeight: "700",
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text,
  },
  itemMeta: {
    marginTop: 4,
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },
  noteInput: {
    minHeight: 110,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    textAlignVertical: "top",
    fontSize: typography.body,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  totalLabel: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.heading,
    fontWeight: "800",
    color: colors.text,
  },
  placeOrderButton: {
    marginTop: spacing.sm,
  },
  continueText: {
    marginTop: spacing.xl,
    textAlign: "center",
    fontSize: typography.body,
    color: colors.text,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
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
  },
  emptyButtonWrap: {
    width: "100%",
    marginTop: spacing.xl,
  },
});