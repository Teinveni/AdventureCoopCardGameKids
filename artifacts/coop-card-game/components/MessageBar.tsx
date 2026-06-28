import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function MessageBar() {
  const colors = useColors();
  const { state } = useGame();

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
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
    borderWidth: 1,
    marginVertical: 4,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    textAlign: "center",
  },
});
