import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppSearchBar from "../../components/ui/AppSearchBar";
import CategoryCard from "../../components/ui/CategoryCard";
import ProductCard from "../../components/ui/ProductCard";
import { colors, radius, spacing, typography } from "../../constants/appTheme";
import { addToCart, CartItem, getCart } from "../../services/CartServices";
import {
  getProductsApi,
  Product,
  searchProductsElasticApi,
} from "../../services/ProductService";

const CATEGORY_COLORS = [
  "#EAF7EE",
  "#FFF3E5",
  "#FDE8E8",
  "#E8F1FF",
  "#F3E8FF",
  "#FFF7CC",
  "#E8F8F5",
  "#FDEDEC",
];

export default function ExploreScreen() {
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const debounceRef = useRef<any>(null);

  const categories = useMemo(
    () => [...new Set(allProducts.map((item) => item.categoryName || "Others"))],
    [allProducts]
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      setAllProducts(data);
      setDisplayProducts(data);
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

  const applyCategoryFilter = useCallback(
    (category: string) => {
      const normalizedKeyword = keyword.trim().toLowerCase();

      let base = [...allProducts];

      if (normalizedKeyword) {
        base = base.filter((item) =>
          item.name?.toLowerCase().includes(normalizedKeyword)
        );
      }

      if (category) {
        base = base.filter(
          (item) => (item.categoryName || "Others") === category
        );
      }

      setDisplayProducts(base);
    },
    [allProducts, keyword]
  );

  const handleSearch = useCallback(
    async (text: string) => {
      setKeyword(text);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        const trimmed = text.trim();

        if (!trimmed) {
          if (selectedCategory) {
            const filtered = allProducts.filter(
              (item) => (item.categoryName || "Others") === selectedCategory
            );
            setDisplayProducts(filtered);
          } else {
            setDisplayProducts(allProducts);
          }
          return;
        }

        try {
          setSearching(true);

          const result = await searchProductsElasticApi(trimmed);

          const filteredByCategory = selectedCategory
            ? result.filter(
                (item: Product) =>
                  (item.categoryName || "Others") === selectedCategory
              )
            : result;

          setDisplayProducts(filteredByCategory);
        } catch (error: any) {
          Alert.alert("Search error", error?.message || "Unable to search products");
        } finally {
          setSearching(false);
        }
      }, 500);
    },
    [allProducts, selectedCategory]
  );

  const handleSelectCategory = async (category: string) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);

    const trimmed = keyword.trim();

    if (!trimmed) {
      if (!newCategory) {
        setDisplayProducts(allProducts);
      } else {
        const filtered = allProducts.filter(
          (item) => (item.categoryName || "Others") === newCategory
        );
        setDisplayProducts(filtered);
      }
      return;
    }

    try {
      setSearching(true);
      const result = await searchProductsElasticApi(trimmed);

      const filtered = !newCategory
        ? result
        : result.filter(
            (item: Product) => (item.categoryName || "Others") === newCategory
          );

      setDisplayProducts(filtered);
    } catch (error: any) {
      Alert.alert("Search error", error?.message || "Unable to filter products");
    } finally {
      setSearching(false);
    }
  };

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

  const goToCart = () => {
    router.push("/cart" as any);
  };

  const clearAllFilters = () => {
    setKeyword("");
    setSelectedCategory("");
    setDisplayProducts(allProducts);
  };

  const renderCategorySection = () => {
    if (keyword.trim()) return null;

    return (
      <View style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Find by Category</Text>

          {selectedCategory ? (
            <TouchableOpacity activeOpacity={0.8} onPress={clearAllFilters}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.9}
                style={[
                  styles.categoryCardWrap,
                  isSelected && styles.categoryCardWrapSelected,
                ]}
                onPress={() => handleSelectCategory(category)}
              >
                <CategoryCard
                  title={category}
                  bgColor={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  onPress={() => handleSelectCategory(category)}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItemWrap}>
      <ProductCard
        id={item.productId}
        name={item.name}
        price={item.price}
        imageUrl={item.imageUrl}
        categoryName={item.categoryName || "Drink"}
        isAvailable={item.isAvailable !== false}
        onPress={() => goToProduct(item.productId)}
        onAddToCart={
          item.isAvailable === false ? undefined : () => handleAddToCart(item)
        }
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading explore page...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Explore</Text>

        <View style={styles.searchWrap}>
          <AppSearchBar
            value={keyword}
            onChangeText={handleSearch}
            placeholder="Search drinks"
          />
        </View>

        {selectedCategory ? (
          <View style={styles.selectedCategoryBox}>
            <Text style={styles.selectedCategoryText}>
              Category: {selectedCategory}
            </Text>

            <TouchableOpacity activeOpacity={0.8} onPress={() => handleSelectCategory(selectedCategory)}>
              <Text style={styles.removeCategoryText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {searching ? (
          <View style={styles.searchingBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.searchingText}>Searching products...</Text>
          </View>
        ) : null}

        {!keyword.trim() ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderCategorySection()}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory ? `${selectedCategory} Drinks` : "All Drinks"}
              </Text>

              {(selectedCategory || keyword) && (
                <TouchableOpacity activeOpacity={0.8} onPress={clearAllFilters}>
                  <Text style={styles.clearText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={displayProducts}
              keyExtractor={(item) => String(item.productId)}
              renderItem={renderProductItem}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productList}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>No products found</Text>
                  <Text style={styles.emptyText}>
                    Try another category or check your API data.
                  </Text>
                </View>
              }
            />
          </ScrollView>
        ) : (
          <FlatList
            data={displayProducts}
            keyExtractor={(item) => String(item.productId)}
            renderItem={renderProductItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.searchResultList}
            ListHeaderComponent={
              <View style={styles.resultHeader}>
                <Text style={styles.sectionTitle}>
                  Search Results
                </Text>
                <Text style={styles.resultSubText}>
                  {displayProducts.length} item{displayProducts.length !== 1 ? "s" : ""} found
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>No matching products</Text>
                <Text style={styles.emptyText}>
                  Try another keyword or remove the category filter.
                </Text>
              </View>
            }
          />
        )}
      </View>

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
          style={styles.floatingCartButton}
          onPress={goToCart}
        >
          <Text style={styles.floatingCartText}>Cart ({cart.length})</Text>
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
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  screenTitle: {
    fontSize: typography.titleLarge,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  searchWrap: {
    marginBottom: spacing.lg,
  },
  selectedCategoryBox: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: "#EEF7F1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCategoryText: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: "600",
  },
  removeCategoryText: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  searchingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  searchingText: {
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  categorySection: {
    marginBottom: spacing.xxl,
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
  clearText: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCardWrap: {
    width: "48%",
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  categoryCardWrapSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  productList: {
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  productItemWrap: {
    width: "48%",
  },
  resultHeader: {
    marginBottom: spacing.lg,
  },
  resultSubText: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
  },
  searchResultList: {
    paddingBottom: 120,
  },
  emptyBox: {
    marginTop: spacing.xl,
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
  floatingCartButton: {
    position: "absolute",
    right: spacing.xl,
    bottom: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  floatingCartText: {
    color: colors.surface,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
});