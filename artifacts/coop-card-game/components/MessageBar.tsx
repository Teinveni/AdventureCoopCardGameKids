import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function MessageBar() {
  const colors = useColors();
  const { state } = useGame();

  const isGood = state.message.toLowerCase().includes("found") ||
    state.message.toLowerCase().includes("filled") ||
    state.message.toLowerCase().includes("victory") ||
    state.message.toLowerCase().includes("defeated") ||
    state.message.toLowerCase().includes("energy") ||
    state.message.toLowerCase().includes("revealed");

  const isBad = state.message.toLowerCase().includes("game over") ||
    state.message.toLowerCase().includes("need");

  const bgColor = isBad ? "#3a1a1a" : isGood ? "#1a2a1a" : colors.secondary;
  const borderColor = isBad ? colors.monster : isGood ? colors.location : colors.border;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor, borderWidth: 1 }]}>
      <Text style={[styles.text, { color: colors.foreground }]} numberOfLines={2}>
        {state.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
