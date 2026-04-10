import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import { colors, spacing, typography } from "../constants/appTheme";

export default function OrderSuccessScreen() {
  const goHome = () => {
    router.replace("/home");
  };

  const goToOrders = () => {
    router.push("/order" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationWrap}>
          <View style={styles.circleLarge}>
            <View style={styles.circleSmall}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Your Order has been accepted</Text>
        <Text style={styles.subtitle}>
          Your items have been placed and are being processed.
        </Text>

        <View style={styles.buttonGroup}>
          <PrimaryButton title="Track Order" onPress={goToOrders} />

          <TouchableOpacity activeOpacity={0.85} onPress={goHome}>
            <Text style={styles.secondaryText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationWrap: {
    marginBottom: spacing.xxl,
  },
  circleLarge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#EAF7EE",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSmall: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    color: colors.surface,
    fontSize: 52,
    fontWeight: "800",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  buttonGroup: {
    width: "100%",
    marginTop: spacing.xxl,
  },
  secondaryText: {
    marginTop: spacing.xl,
    textAlign: "center",
    fontSize: typography.body,
    color: colors.text,
    fontWeight: "600",
  },
});