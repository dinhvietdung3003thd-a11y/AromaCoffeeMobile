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
import { addToCart } from "../../services/CartServices";
import { getProductByIdApi, Product } from "../../services/ProductService";

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productId = useMemo(() => Number(params.id), [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      if (!productId || Number.isNaN(productId)) {
        Alert.alert("Error", "Invalid product id");
        router.back();
        return;
      }

      const data = await getProductByIdApi(productId);
      setProduct(data);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to load product detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);

      await addToCart({
        productId: product.productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });

      Alert.alert("Success", "Product added to cart");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to add product to cart");
    } finally {
      setAdding(false);
    }
  };

  const goToCart = () => {
    router.push("/cart" as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.notFoundTitle}>Product not found</Text>
        <Text style={styles.notFoundText}>
          We could not load this product detail.
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

  const isAvailable = product.isAvailable !== false;
  const totalPrice = Number(product.price || 0) * quantity;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.imageSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Text style={styles.iconButtonText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.iconButton, styles.cartButton]}
            onPress={goToCart}
          >
            <Text style={styles.iconButtonText}>🛒</Text>
          </TouchableOpacity>

          <Image
            source={defaultProductImage}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.category}>
                {product.categoryName || "Drink"}
              </Text>
            </View>

            <Text style={styles.price}>
              ${Number(product.price || 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.quantityRow}>
            <Text style={styles.sectionLabel}>Quantity</Text>

            <View style={styles.quantityControl}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.qtyBtn}
                onPress={decreaseQuantity}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{quantity}</Text>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.qtyBtn}
                onPress={increaseQuantity}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Product Detail</Text>

            <Text style={styles.description}>
              {product.description?.trim()
                ? product.description
                : "This product currently has no description."}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Availability</Text>
            <Text
              style={[
                styles.metaValue,
                isAvailable ? styles.availableText : styles.unavailableText,
              ]}
            >
              {isAvailable ? "Available" : "Out of stock"}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>
              {product.categoryName || "Drink"}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>

          <PrimaryButton
            title={isAvailable ? "Add To Basket" : "Out of Stock"}
            onPress={handleAddToCart}
            loading={adding}
            disabled={!isAvailable}
            style={styles.addButton}
          />
        </View>
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
    color: colors.textSecondary,
    fontSize: typography.body,
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
  imageSection: {
    backgroundColor: "#F2F3F2",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    position: "relative",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: spacing.xl,
    left: spacing.xl,
    zIndex: 2,
  },
  cartButton: {
    left: undefined,
    right: spacing.xl,
  },
  iconButtonText: {
    fontSize: 18,
  },
  productImage: {
    width: "100%",
    height: 260,
    marginTop: 40,
  },
  infoSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  category: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionBlock: {},
  sectionLabel: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  qtyBtnText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "500",
    lineHeight: 26,
  },
  qtyValue: {
    minWidth: 44,
    textAlign: "center",
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  metaLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  metaValue: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: "700",
  },
  availableText: {
    color: colors.success,
  },
  unavailableText: {
    color: colors.danger,
  },
  totalBox: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    backgroundColor: "#EEF7F1",
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: typography.title,
    color: colors.text,
    fontWeight: "800",
  },
  addButton: {
    marginTop: spacing.sm,
  },
});