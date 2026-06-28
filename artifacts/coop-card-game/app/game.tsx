import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import GameHUD from "@/components/GameHUD";
import LocationGrid from "@/components/LocationGrid";
import MonsterField from "@/components/MonsterField";
import PlayerPanel from "@/components/PlayerPanel";
import ChestPanel from "@/components/ChestPanel";
import ActionPanel from "@/components/ActionPanel";
import MessageBar from "@/components/MessageBar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function GameScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, resetGame } = useGame();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.replace("/")} style={styles.headerBtn}>
          <Feather name="home" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Coop Card Quest</Text>
        <TouchableOpacity onPress={resetGame} style={styles.headerBtn}>
          <Feather name="refresh-cw" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GameHUD />
        <MessageBar />

        <SectionDivider label="⚔️ Actions" colors={colors} />
        <ActionPanel />

        <SectionDivider label="📦 Chests" colors={colors} />
        <ChestPanel />

        <SectionDivider label="🗺️ Locations" colors={colors} />
        <LocationGrid />

        <SectionDivider label="👹 Monster Field" colors={colors} />
        <MonsterField />

        <SectionDivider label="🎒 Players" colors={colors} />
        {state.players.map((_, i) => (
          <PlayerPanel key={i} playerIndex={i} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function SectionDivider({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={[dividerStyles.container, { borderBottomColor: colors.border }]}>
      <Text style={[dividerStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const dividerStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginTop: 12,
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 6,
    width: 36,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 8,
  },
});
