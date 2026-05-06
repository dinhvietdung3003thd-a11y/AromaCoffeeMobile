import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryCard from "../../components/ui/CategoryCard";
import ProductCard from "../../components/ui/ProductCard";
import { colors, radius, spacing, typography } from "../../constants/appTheme";
import { addToCart, CartItem, getCart, getTotal } from "../../services/CartServices";
import { getProductsApi, Product } from "../../services/ProductService";

const CATEGORY_COLORS = [
  "#EAF7EE",
  "#FFF3E5",
  "#FDE8E8",
  "#E8F1FF",
  "#F3E8FF",
  "#FFF7CC",
];

const groupByCategory = (products: Product[]) => {
  const map: Record<string, Product[]> = {};

  for (const item of products) {
    const key = item.categoryName || "Others";

    if (!map[key]) {
      map[key] = [];
    }

    map[key].push(item);
  }

  return Object.keys(map).map((key) => ({
    title: key,
    data: map[key],
  }));
};

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  const sections = useMemo(() => groupByCategory(products), [products]);
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.categoryName || "Others"))],
    [products]
  );

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotal(cart);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      setProducts(data);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.log("Load cart error:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const handleAddToCart = async (item: Product) => {
    try {
      setAddingId(item.productId);

      await addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      });

      await loadCart();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unable to add product to cart");
    } finally {
      setAddingId(null);
    }
  };

  const goToProduct = (productId: number) => {
    router.push(`/product/${productId}` as any);
  };

  const goToExplore = () => {
    router.push("/explore" as any);
  };

  const goToProfile = () => {
    router.push("/profile" as any);
  };

  const goToCart = () => {
    router.push("/cart" as any);
  };

  const renderCategoryCards = () => {
    if (categories.length === 0) return null;

    return (
      <View style={styles.categoryGrid}>
        {categories.slice(0, 4).map((category, index) => (
          <CategoryCard
            key={category}
            title={category}
            bgColor={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
            onPress={goToExplore}
          />
        ))}
      </View>
    );
  };

  const renderSection = (title: string, items: Product[]) => {
    if (!items.length) return null;

    return (
      <View style={styles.sectionBlock} key={title}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>

          <TouchableOpacity activeOpacity={0.8} onPress={goToExplore}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {items.map((item) => (
            <View key={item.productId} style={styles.productCardWrap}>
              <ProductCard
                id={item.productId}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                categoryName={item.categoryName || "Drink"}
                isAvailable={item.isAvailable !== false}
                onPress={() => goToProduct(item.productId)}
                onAddToCart={
                  item.isAvailable === false
                    ? undefined
                    : () => handleAddToCart(item)
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>Good day</Text>
            <Text style={styles.title}>Find your favorite drinks</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.avatar}
            onPress={goToProfile}
          >
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerSubtitle}>Fresh & tasty every day</Text>
          <Text style={styles.bannerTitle}>Aroma Coffee</Text>
          <Text style={styles.bannerText}>
            Explore coffee, tea, milk tea and more from our menu.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.bannerButton}
            onPress={goToExplore}
          >
            <Text style={styles.bannerButtonText}>Explore now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>

            <TouchableOpacity activeOpacity={0.8} onPress={goToExplore}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {renderCategoryCards()}
        </View>

        {renderSection("Popular Drinks", featuredProducts)}

        {sections.slice(0, 3).map((section) => renderSection(section.title, section.data))}

        {!products.length && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No products available</Text>
            <Text style={styles.emptyText}>
              Please check your API connection and try again.
            </Text>
          </View>
        )}
      </ScrollView>

      {addingId !== null && (
        <View style={styles.addingOverlay}>
          <View style={styles.addingBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.addingText}>Adding to cart...</Text>
          </View>
        </View>
      )}

      {cart.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.bottomCartBar}
          onPress={goToCart}
        >
          <View>
            <Text style={styles.bottomCartTitle}>Go to Cart</Text>
            <Text style={styles.bottomCartSubtitle}>
              {totalQuantity} item{totalQuantity > 1 ? "s" : ""}
            </Text>
          </View>

          <Text style={styles.bottomCartPrice}>
            ${Number(totalPrice || 0).toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}
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
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: typography.titleLarge,
    fontWeight: "700",
    color: colors.text,
    maxWidth: 240,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
  },
  banner: {
    marginTop: spacing.xl,
    backgroundColor: "#EAF4EC",
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  bannerSubtitle: {
    fontSize: typography.bodySmall,
    color: colors.primaryDark,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bannerText: {
    fontSize: typography.bodySmall,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  bannerButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  bannerButtonText: {
    color: colors.surface,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  sectionBlock: {
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
  },
  seeAllText: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  horizontalList: {
    paddingRight: spacing.md,
  },
  productCardWrap: {
    marginRight: spacing.md,
  },
  emptyBox: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  addingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  addingBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  addingText: {
    marginLeft: spacing.sm,
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: "600",
  },
  bottomCartBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  bottomCartTitle: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: "700",
  },
  bottomCartSubtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.86)",
    fontSize: typography.bodySmall,
    fontWeight: "500",  
  },
  bottomCartPrice: {
    color: colors.surface,
    fontSize: typography.heading,
    fontWeight: "800",
  },
});