import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function EnergyBar() {
  const colors = useColors();
  const { state } = useGame();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.energy }]}>⚡</Text>
      <View style={styles.barContainer}>
        {Array.from({ length: state.maxEnergy }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.orb,
              {
                backgroundColor: i < state.energy ? colors.energy : colors.muted,
                borderColor: colors.energy,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.value, { color: colors.energy }]}>
        {state.energy}/{state.maxEnergy}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 14,
  },
  barContainer: {
    flexDirection: "row",
    gap: 3,
  },
  orb: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 28,
  },
});
