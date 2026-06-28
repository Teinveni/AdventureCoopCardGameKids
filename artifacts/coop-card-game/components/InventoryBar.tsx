import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function InventoryBar() {
  const colors = useColors();
  const { state, useItem } = useGame();

  if (state.inventory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Inventory empty
        </Text>
      </View>
    );
  }

  // Group items by type
  const grouped: Record<string, number> = {};
  state.inventory.forEach((item) => {
    const key = `${item.quality} ${item.type}`;
    grouped[key] = (grouped[key] || 0) + 1;
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.item }]}>Inventory</Text>
      <View style={styles.row}>
        {state.inventory.map((item, i) => {
          const usable = item.type === "shield" || item.type === "sword" || item.type === "pickaxe";
          return (
            <TouchableOpacity
              key={`${item.type}-${item.quality}-${i}`}
              onPress={() => usable && useItem(item)}
              disabled={!usable}
              style={[
                styles.itemChip,
                {
                  backgroundColor: usable ? colors.secondary : colors.muted,
                  borderColor: item.quality === "diamond" ? colors.diamond : item.quality === "gold" ? colors.gold : item.quality === "steel" ? colors.steel : colors.border,
                  borderWidth: item.quality !== "basic" ? 2 : 1,
                },
              ]}
            >
              <Text style={[styles.itemText, { color: colors.foreground }]}>
                {item.quality} {item.type}
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
  itemChip: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 3,
  },
  itemText: {
    fontSize: 11,
  },
  emptyContainer: {
    paddingVertical: 8,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
