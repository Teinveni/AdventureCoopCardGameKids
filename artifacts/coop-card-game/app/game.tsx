import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import GameHUD from "@/components/GameHUD";
import LocationGrid from "@/components/LocationGrid";
import MonsterField from "@/components/MonsterField";
import InventoryBar from "@/components/InventoryBar";
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Coop Card Quest</Text>
        {state.gameOver && (
          <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
            <Feather name="refresh-cw" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GameHUD />
        <MessageBar />
        <ChestPanel />
        <LocationGrid />
        <MonsterField />
        <InventoryBar />
        <ActionPanel />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  restartButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});
