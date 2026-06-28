import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import EnergyBar from "./EnergyBar";

export default function GameHUD() {
  const colors = useColors();
  const { state } = useGame();

  const totalMonsters = Object.values(state.monsterDeck).reduce((a, b) => a + b, 0) + state.monstersOnField.length;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.turnText, { color: colors.foreground }]}>Turn {state.turn}</Text>
        <EnergyBar />
      </View>
      <View style={styles.statsRow}>
        <Text style={[styles.stat, { color: colors.monster }]}>
          Monsters: {state.monstersOnField.length} | Deck: {totalMonsters}
        </Text>
        <Text style={[styles.stat, { color: colors.chest }]}>
          Chests: {state.filledChests}/{state.totalChests}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  turnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 4,
  },
  stat: {
    fontSize: 12,
    fontWeight: "600",
  },
});
