import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 40 }]}>
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          <Feather name="box" size={48} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>Coop Card Quest</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Explore dangerous lands, collect treasures, and fill the chests before the monsters overwhelm you!
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Feather name="map" size={18} color={colors.location} />
            <Text style={[styles.featureText, { color: colors.foreground }]}>Travel to 12 locations</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="zap" size={18} color={colors.energy} />
            <Text style={[styles.featureText, { color: colors.foreground }]}>Manage your energy wisely</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="shield" size={18} color={colors.item} />
            <Text style={[styles.featureText, { color: colors.foreground }]}>Find items to help you survive</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="users" size={18} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.foreground }]}>Work together to win</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/game")}
          style={[styles.playButton, { backgroundColor: colors.primary }]}
        >
          <Feather name="play" size={20} color={colors.primaryForeground} />
          <Text style={[styles.playText, { color: colors.primaryForeground }]}>Start Adventure</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/rules")}
          style={[styles.rulesButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.rulesText, { color: colors.mutedForeground }]}>How to Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  features: {
    gap: 10,
    width: "100%",
    paddingHorizontal: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 14,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  playText: {
    fontSize: 16,
    fontWeight: "600",
  },
  rulesButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  rulesText: {
    fontSize: 14,
  },
});
