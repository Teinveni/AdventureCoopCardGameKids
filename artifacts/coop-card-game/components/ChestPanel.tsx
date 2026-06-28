import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function ChestPanel() {
  const colors = useColors();
  const { state, fillChest } = useGame();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.chest }]}>
        Chests {state.filledChests}/{state.totalChests}
      </Text>
      <View style={styles.row}>
        {state.chests.map((chest) => {
          const canFill = !chest.filled &&
            state.inventory.some((i) => i.type === chest.item1) &&
            state.inventory.some((i) => i.type === chest.item2);

          return (
            <TouchableOpacity
              key={chest.id}
              onPress={() => !chest.filled && fillChest(chest.id)}
              disabled={chest.filled || !canFill}
              style={[
                styles.chestCard,
                {
                  backgroundColor: chest.filled ? colors.chest : canFill ? colors.secondary : colors.muted,
                  borderColor: chest.filled ? colors.chest : colors.border,
                  opacity: chest.filled ? 1 : canFill ? 1 : 0.5,
                },
              ]}
            >
              <Text style={[styles.chestStatus, { color: chest.filled ? colors.background : colors.chest }]}>
                {chest.filled ? "FILLED" : "NEEDS"}
              </Text>
              <Text style={[styles.chestItems, { color: chest.filled ? colors.background : colors.foreground }]}>
                {chest.item1} + {chest.item2}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chestCard: {
    borderRadius: 10,
    padding: 10,
    margin: 4,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 1,
  },
  chestStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  chestItems: {
    fontSize: 11,
    marginTop: 2,
  },
});
