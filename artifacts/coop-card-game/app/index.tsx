import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          <Text style={styles.iconEmoji}>🗃️</Text>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>Coop Card Quest</Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          Explore. Survive. Fill the Chests.
        </Text>

        <View style={[styles.featureBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            ["🗺️", "Travel to 12 secret locations"],
            ["⚡", "6 energy per turn — spend wisely"],
            ["👹", "6 monster types, up to 6 on the field"],
            ["🍖", "Food heals, swords fight, shields block"],
            ["🗝️", "Fill 4 chests together to win"],
            ["👥", "1–4 player cooperative play"],
          ].map(([emoji, text]) => (
            <View key={text} style={styles.feature}>
              <Text style={styles.featureEmoji}>{emoji}</Text>
              <Text style={[styles.featureText, { color: colors.foreground }]}>{text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/setup")}
          style={[styles.playButton, { backgroundColor: colors.primary }]}
        >
          <Feather name="play" size={18} color={colors.primaryForeground} />
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
    gap: 18,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  iconEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  tagline: {
    fontSize: 14,
    fontStyle: "italic",
  },
  featureBox: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureEmoji: {
    fontSize: 18,
    width: 26,
    textAlign: "center",
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
  },
  playText: {
    fontSize: 16,
    fontWeight: "700",
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
