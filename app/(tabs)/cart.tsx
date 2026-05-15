import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "../../constants/appTheme";
import { defaultProductImage } from "../../constants/productImages";
import {
  CartItem,
  getCart,
  getTotal,
  removeFromCart,
  updateQuantity,
} from "../../services/CartServices";

export default function CartScreen() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

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

  const handleIncrease = async (item: CartItem) => {
    try {
      setLoadingId(item.productId);

      await updateQuantity(item.productId, item.quantity + 1);
      await loadCart();
    } catch (error) {
      Alert.alert("Error", "Unable to update quantity");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecrease = async (item: CartItem) => {
    if (item.quantity <= 1) return;

    try {
      setLoadingId(item.productId);

      await updateQuantity(item.productId, item.quantity - 1);
      await loadCart();
    } catch (error) {
      Alert.alert("Error", "Unable to update quantity");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    try {
      setLoadingId(item.productId);

      await removeFromCart(item.productId);
      await loadCart();
    } catch (error) {
      Alert.alert("Error", "Unable to remove item");
    } finally {
      setLoadingId(null);
    }
  };

  const goToCheckout = () => {
    router.push("/checkout" as any);
  };

  const totalPrice = getTotal(cart);

  const renderItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.itemCard}>
        <Image source={defaultProductImage} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>
            ${Number(item.price).toFixed(2)}
          </Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleDecrease(item)}
            >
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleIncrease(item)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(item)}
        >
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!cart.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add some drinks from the menu
        </Text>

        <PrimaryButton
          title="Go Shopping"
          onPress={() => router.push("/home" as any)}
          style={{ marginTop: spacing.xl }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.productId)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.bottomBox}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${Number(totalPrice).toFixed(2)}
          </Text>
        </View>

        <PrimaryButton
          title="Go to Checkout"
          onPress={goToCheckout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.titleLarge,
    fontWeight: "700",
    marginVertical: spacing.lg,
    color: colors.text,
  },
  list: {
    paddingBottom: 120,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },
  price: {
    marginTop: 4,
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 18,
  },
  qtyValue: {
    marginHorizontal: spacing.md,
    fontWeight: "700",
  },
  removeBtn: {
    padding: spacing.sm,
  },
  removeText: {
    fontSize: 18,
    color: colors.danger,
  },
  bottomBox: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    bottom: 20,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.title,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
});