import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function EnergyBar() {
  const colors = useColors();
  const { state } = useGame();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.energy }]}>Energy</Text>
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
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
  barContainer: {
    flexDirection: "row",
    gap: 4,
  },
  orb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 30,
  },
});
