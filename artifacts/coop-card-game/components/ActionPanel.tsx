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
    revealLocation,
    endTurn,
    selectedLocation,
    selectedMonster,
    canTravel,
    canDefeat,
  } = useGame();

  if (state.gameOver) {
    return (
      <View style={styles.container}>
        <View style={[styles.gameOverBox, { backgroundColor: state.won ? colors.location : colors.monster }]}>
          <Text style={[styles.gameOverText, { color: colors.background }]}>
            {state.won ? "VICTORY!" : "GAME OVER"}
          </Text>
        </View>
      </View>
    );
  }

  const travelEnabled = selectedLocation && canTravel(selectedLocation);
  const defeatEnabled = selectedMonster && canDefeat(selectedMonster);
  const revealEnabled = state.energy >= 1 && state.locations.some((l) => !l.revealed);

  return (
    <View style={styles.container}>
      {state.activeSword && (
        <Text style={[styles.buffText, { color: colors.gold }]}>
          {state.activeSword.quality} sword active (-{state.activeSword.energyReduction} fight cost)
        </Text>
      )}
      {state.activePickaxe && (
        <Text style={[styles.buffText, { color: colors.gold }]}>
          {state.activePickaxe.quality} pickaxe active (-{state.activePickaxe.energyReduction} travel cost)
        </Text>
      )}
      {state.shieldActive && (
        <Text style={[styles.buffText, { color: colors.diamond }]}>
          Shield active - blocks next monster!
        </Text>
      )}

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
          <Feather name="map-pin" size={16} color={colors.background} />
          <Text style={[styles.buttonText, { color: colors.background }]}>Travel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => selectedMonster && defeatMonster(selectedMonster.type)}
          disabled={!defeatEnabled}
          style={[
            styles.actionButton,
            {
              backgroundColor: defeatEnabled ? colors.monster : colors.muted,
              opacity: defeatEnabled ? 1 : 0.4,
            },
          ]}
        >
          <Feather name="crosshair" size={16} color={colors.background} />
          <Text style={[styles.buttonText, { color: colors.background }]}>Fight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={revealLocation}
          disabled={!revealEnabled}
          style={[
            styles.actionButton,
            {
              backgroundColor: revealEnabled ? colors.primary : colors.muted,
              opacity: revealEnabled ? 1 : 0.4,
            },
          ]}
        >
          <Feather name="eye" size={16} color={colors.background} />
          <Text style={[styles.buttonText, { color: colors.background }]}>Reveal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={endTurn}
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
        >
          <Feather name="skip-forward" size={16} color={colors.foreground} />
          <Text style={[styles.buttonText, { color: colors.foreground }]}>End Turn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 80,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  buffText: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },
  gameOverBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 20,
    fontWeight: "700",
  },
});
