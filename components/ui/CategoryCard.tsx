import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors, radius, spacing, typography } from "../../constants/appTheme";

type CategoryCardProps = {
  title: string;
  bgColor?: string;
  onPress: () => void;
};

export default function CategoryCard({
  title,
  bgColor = "#EEF7F1",
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <View style={styles.imagePlaceholder} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 170,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    justifyContent: "space-between",
  },
  imagePlaceholder: {
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.65)",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
});