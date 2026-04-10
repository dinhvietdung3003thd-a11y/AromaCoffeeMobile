import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors, radius, shadows, spacing, typography } from "../../constants/appTheme";

type ProductCardProps = {
  id: number | string;
  name: string;
  price: number;
  imageUrl?: string | null;
  categoryName?: string;
  isAvailable?: boolean;
  onPress: () => void;
  onAddToCart?: () => void;
};

export default function ProductCard({
  name,
  price,
  imageUrl,
  categoryName,
  isAvailable = true,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>

        <Text numberOfLines={1} style={styles.category}>
          {categoryName || "Drink"}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.price}>${Number(price || 0).toFixed(2)}</Text>
            {!isAvailable && <Text style={styles.unavailable}>Out of stock</Text>}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.addButton,
              !isAvailable && styles.addButtonDisabled,
            ]}
            disabled={!isAvailable || !onAddToCart}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 173,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  imageWrap: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: typography.bodySmall,
    color: colors.textMuted,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
    minHeight: 44,
  },
  category: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
  },
  unavailable: {
    marginTop: 4,
    fontSize: typography.caption,
    color: colors.danger,
    fontWeight: "600",
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    opacity: 0.45,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 26,
  },
});