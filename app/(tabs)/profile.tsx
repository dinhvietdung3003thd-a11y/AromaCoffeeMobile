import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../../constants/appTheme";
import { removeToken } from "../../services/AuthServices";

type MenuRowProps = {
  icon: string;
  title: string;
  danger?: boolean;
  onPress: () => void;
};

function MenuRow({ icon, title, danger = false, onPress }: MenuRowProps) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconWrap}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>

        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
          {title}
        </Text>
      </View>

      <Text style={[styles.menuArrow, danger && styles.menuArrowDanger]}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  const goToOrders = () => {
    router.push("/order" as any);
  };

  const goToHome = () => {
    router.push("/home" as any);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await removeToken();
            router.replace("/login");
          } catch (error) {
            Alert.alert("Error", "Unable to log out right now.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>Customer</Text>
            <Text style={styles.email}>Welcome back to Aroma Coffee</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <MenuRow icon="🧾" title="My Orders" onPress={goToOrders} />
          <MenuRow icon="🏠" title="Back to Home" onPress={goToHome} />
          <MenuRow icon="🚪" title="Log Out" danger onPress={handleLogout} />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Aroma Coffee</Text>
          <Text style={styles.infoText}>
            Browse your drinks, place orders, and check your order history here.
          </Text>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  email: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    marginBottom: spacing.xl,
  },
  menuRow: {
    minHeight: 68,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#EEF7F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text,
  },
  menuTitleDanger: {
    color: colors.danger,
  },
  menuArrow: {
    fontSize: 26,
    color: colors.textSecondary,
    lineHeight: 28,
  },
  menuArrowDanger: {
    color: colors.danger,
  },
  infoBox: {
    backgroundColor: "#EAF7EE",
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  infoTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});