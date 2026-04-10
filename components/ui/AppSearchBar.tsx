import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors, radius, spacing, typography } from "../../constants/appTheme";

type AppSearchBarProps = {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  onPress?: () => void;
};

export default function AppSearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  editable = true,
  onPress,
}: AppSearchBarProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.container}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textSecondary}
        style={styles.leftIcon}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        editable={editable && !onPress}
        pointerEvents={onPress ? "none" : "auto"}
        style={styles.input}
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
  },
});