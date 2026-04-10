import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppTextInput from "../components/ui/AppTextInput";
import PrimaryButton from "../components/ui/PrimaryButton";
import { colors, spacing, typography } from "../constants/appTheme";
import { customerLoginApi, saveToken } from "../services/AuthServices";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let isValid = true;

    setUsernameError("");
    setPasswordError("");

    if (!username.trim()) {
      setUsernameError("Please enter your username");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const response = await customerLoginApi({
        username: username.trim(),
        password: password,
      });
      const token =
        response?.token ||
        response?.data?.token ||
        response?.accessToken ||
        response?.jwtToken ||
        response?.Token;

      if (!token) {
        Alert.alert("Login failed", "Token was not returned from server.");
        return;
      }

      await saveToken(token);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert(
        "Login failed",
        error?.message || "Something went wrong while signing in."
      );
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSpacing} />

          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>A</Text>
            </View>
          </View>

          <View style={styles.headerBlock}>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>
              Enter your username and password
            </Text>
          </View>

          <View style={styles.formCard}>
            <AppTextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your username"
              error={usernameError}
            />

            <AppTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your password"
              error={passwordError}
            />

            <TouchableOpacity activeOpacity={0.8} style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={goToRegister} activeOpacity={0.8}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  topSpacing: {
    height: 40,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: "800",
  },
  headerBlock: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.titleLarge,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: spacing.xl,
  },
  forgotText: {
    fontSize: typography.bodySmall,
    color: colors.text,
    fontWeight: "600",
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: typography.bodySmall,
    color: colors.text,
    fontWeight: "500",
  },
  footerLink: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    fontWeight: "700",
  },
});