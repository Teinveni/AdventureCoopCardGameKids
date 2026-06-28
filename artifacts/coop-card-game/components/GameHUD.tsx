import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import EnergyBar from "./EnergyBar";

export default function GameHUD() {
  const colors = useColors();
  const { state } = useGame();

  const totalDeckCards = Object.values(state.monsterDeck).reduce((a, b) => a + b, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <Text style={[styles.turnText, { color: colors.foreground }]}>Turn {state.turn}</Text>
        <EnergyBar />
      </View>
      <View style={styles.statsRow}>
        <Text style={[styles.stat, { color: colors.monster }]}>
          👹 Field: {state.monstersOnField.length}/6 | Deck: {totalDeckCards}
        </Text>
        <Text style={[styles.stat, { color: colors.chest }]}>
          🗝️ {state.filledChests}/{state.totalChests}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  turnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    fontSize: 12,
    fontWeight: "600",
  },
});
