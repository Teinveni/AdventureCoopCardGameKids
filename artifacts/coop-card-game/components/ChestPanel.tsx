import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ITEM_EMOJI, ITEM_NAMES } from "@/constants/gameData";

export default function ChestPanel() {
  const colors = useColors();
  const { state, fillChest } = useGame();

  const allInventory = state.players.flatMap((p) => p.inventory);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.chest }]}>
        🗝️ Chests {state.filledChests}/{state.totalChests}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {state.chests.map((chest) => {
          if (chest.filled) {
            return (
              <View key={chest.id} style={[styles.chestCard, { backgroundColor: colors.chest, borderColor: colors.chest }]}>
                <Text style={styles.chestEmoji}>✅</Text>
                <Text style={[styles.chestLabel, { color: colors.background }]}>Filled!</Text>
              </View>
            );
          }

          const has1 = allInventory.some((i) => i.type === chest.item1);
          const has2 = allInventory.some((i) => i.type === chest.item2);
          const canFill = has1 && has2;

          return (
            <TouchableOpacity
              key={chest.id}
              onPress={() => fillChest(chest.id)}
              disabled={!canFill}
              activeOpacity={0.75}
              style={[
                styles.chestCard,
                {
                  backgroundColor: canFill ? "#2a1a0a" : colors.card,
                  borderColor: canFill ? colors.chest : colors.border,
                  borderWidth: canFill ? 2 : 1,
                  opacity: canFill ? 1 : 0.6,
                },
              ]}
            >
              <Text style={styles.chestEmoji}>🗃️</Text>
              <View style={styles.needsRow}>
                <Text style={[styles.itemReq, { color: has1 ? colors.location : colors.mutedForeground }]}>
                  {ITEM_EMOJI[chest.item1]} {ITEM_NAMES[chest.item1]}
                </Text>
                <Text style={[styles.plus, { color: colors.mutedForeground }]}>+</Text>
                <Text style={[styles.itemReq, { color: has2 ? colors.location : colors.mutedForeground }]}>
                  {ITEM_EMOJI[chest.item2]} {ITEM_NAMES[chest.item2]}
                </Text>
              </View>
              {canFill && (
                <Text style={[styles.fillLabel, { color: colors.chest }]}>Tap to fill!</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    gap: 8,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  chestCard: {
    borderRadius: 12,
    padding: 10,
    width: 110,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 100,
    justifyContent: "space-between",
  },
  chestEmoji: {
    fontSize: 26,
  },
  chestLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  needsRow: {
    alignItems: "center",
    gap: 2,
  },
  itemReq: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  plus: {
    fontSize: 11,
  },
  fillLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
});
