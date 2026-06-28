import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { Feather } from "@expo/vector-icons";

export default function ActionPanel() {
  const colors = useColors();
  const {
    state,
    travelToLocation,
    defeatMonster,
    endTurn,
    selectedLocation,
    selectedMonster,
    canTravel,
    canDefeat,
    resetGame,
  } = useGame();

  if (state.gameOver) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.gameOverBox,
            { backgroundColor: state.won ? "#1a3a1a" : "#3a1a1a", borderColor: state.won ? colors.location : colors.monster, borderWidth: 2 },
          ]}
        >
          <Text style={styles.gameOverEmoji}>{state.won ? "🏆" : "💀"}</Text>
          <Text style={[styles.gameOverText, { color: state.won ? colors.location : colors.monster }]}>
            {state.won ? "VICTORY!" : "GAME OVER"}
          </Text>
          <TouchableOpacity
            onPress={resetGame}
            style={[styles.restartBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.restartText, { color: colors.primaryForeground }]}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const travelEnabled = selectedLocation != null && canTravel(selectedLocation);
  const fightEnabled = selectedMonster != null && canDefeat(selectedMonster);

  const player = state.players[state.currentPlayerIndex];
  const travelCost = selectedLocation
    ? Math.max(1, selectedLocation.danger - (player.activePickaxe?.energyReduction ?? 0))
    : 0;
  const fightCost = selectedMonster
    ? Math.max(1, selectedMonster.strength - (player.activeSword?.energyReduction ?? 0))
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => selectedLocation && travelToLocation(selectedLocation.id)}
          disabled={!travelEnabled}
          style={[
            styles.actionButton,
            {
              backgroundColor: travelEnabled ? colors.location : colors.muted,
              opacity: travelEnabled ? 1 : 0.4,
            },
          ]}
        >
          <Text style={styles.btnEmoji}>🗺️</Text>
          <Text style={[styles.buttonText, { color: colors.background }]}>Travel</Text>
          {selectedLocation && (
            <Text style={[styles.costTag, { color: colors.background }]}>⚡{travelCost}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => selectedMonster && defeatMonster(selectedMonster.type)}
          disabled={!fightEnabled}
          style={[
            styles.actionButton,
            {
              backgroundColor: fightEnabled ? colors.monster : colors.muted,
              opacity: fightEnabled ? 1 : 0.4,
            },
          ]}
        >
          <Text style={styles.btnEmoji}>⚔️</Text>
          <Text style={[styles.buttonText, { color: colors.background }]}>Fight</Text>
          {selectedMonster && (
            <Text style={[styles.costTag, { color: colors.background }]}>⚡{fightCost}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={endTurn}
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
        >
          <Feather name="skip-forward" size={18} color={colors.foreground} />
          <Text style={[styles.buttonText, { color: colors.foreground }]}>End Turn</Text>
        </TouchableOpacity>
      </View>

      {(selectedLocation || selectedMonster) && (
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          {selectedLocation ? `Selected: ${selectedLocation.name}` : `Selected: ${selectedMonster?.name}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  actionButton: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    gap: 2,
  },
  btnEmoji: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  costTag: {
    fontSize: 11,
    fontWeight: "600",
  },
  hint: {
    textAlign: "center",
    fontSize: 11,
    fontStyle: "italic",
  },
  gameOverBox: {
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    gap: 10,
  },
  gameOverEmoji: {
    fontSize: 40,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "700",
  },
  restartBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  restartText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
