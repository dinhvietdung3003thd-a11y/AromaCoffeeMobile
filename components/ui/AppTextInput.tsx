import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors, spacing, typography } from "../../constants/appTheme";

type AppTextInputProps = TextInputProps & {
  label: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
};

export default function AppTextInput({
  label,
  error,
  keyboardType = "default",
  ...props
}: AppTextInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        style={[styles.input, error ? styles.inputError : null]}
        {...props}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    fontSize: typography.body,
    color: colors.text,
    paddingVertical: 14,
  },
  inputError: {
    borderBottomColor: colors.danger,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: typography.caption,
  },
});