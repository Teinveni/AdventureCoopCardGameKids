import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ITEM_EMOJI, ITEM_NAMES, QUALITY_COLORS, QUALITY_LABEL, MONSTER_EMOJI } from "@/constants/gameData";
import type { Item } from "@/context/GameContext";

interface PlayerPanelProps {
  playerIndex: number;
}

export default function PlayerPanel({ playerIndex }: PlayerPanelProps) {
  const colors = useColors();
  const { state, useItem } = useGame();
  const player = state.players[playerIndex];
  const isCurrent = playerIndex === state.currentPlayerIndex;

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: isCurrent ? "#16213e" : colors.muted,
          borderColor: isCurrent ? colors.primary : colors.border,
          borderWidth: isCurrent ? 2 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.playerName, { color: isCurrent ? colors.primary : colors.mutedForeground }]}>
          {isCurrent ? "▶ " : ""}{player.name}
          {player.shieldActive ? " 🛡️" : ""}
        </Text>
        {player.activeSword && (
          <Text style={[styles.buffTag, { color: colors.gold }]}>
            {ITEM_EMOJI["sword"]} -{player.activeSword.energyReduction} fight
          </Text>
        )}
        {player.activePickaxe && (
          <Text style={[styles.buffTag, { color: colors.gold }]}>
            {ITEM_EMOJI["pickaxe"]} -{player.activePickaxe.energyReduction} travel
          </Text>
        )}
      </View>

      {/* Defeated monsters summary */}
      {player.defeatedMonsters.length > 0 && (
        <View style={styles.defeatedRow}>
          {Object.entries(
            player.defeatedMonsters.reduce((acc, t) => {
              acc[t] = (acc[t] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <View key={type} style={[styles.defeatedChip, { backgroundColor: colors.muted }]}>
              <Text style={styles.chipEmoji}>{MONSTER_EMOJI[type as any]}</Text>
              <Text style={[styles.chipCount, { color: count >= 2 ? colors.gold : colors.mutedForeground }]}>
                ×{count}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Inventory */}
      {player.inventory.length === 0 ? (
        <Text style={[styles.emptyInv, { color: colors.mutedForeground }]}>Empty inventory</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inventoryRow}>
          {player.inventory.map((item) => {
            const isActive =
              (item.type === "sword" && player.activeSword?.id === item.id) ||
              (item.type === "pickaxe" && player.activePickaxe?.id === item.id);
            const usable = isCurrent && (item.type === "food" || item.type === "shield" || item.type === "sword" || item.type === "pickaxe");
            const qualColor = QUALITY_COLORS[item.quality];

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => usable && useItem(item)}
                disabled={!usable || isActive}
                activeOpacity={usable && !isActive ? 0.7 : 1}
                style={[
                  styles.itemChip,
                  {
                    backgroundColor: isActive ? "#1a3a1a" : colors.card,
                    borderColor: isActive ? colors.location : qualColor,
                    borderWidth: item.quality !== "basic" || isActive ? 2 : 1,
                    opacity: !isCurrent ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={styles.itemEmoji}>{ITEM_EMOJI[item.type]}</Text>
                <Text style={[styles.itemLabel, { color: qualColor }]}>
                  {QUALITY_LABEL[item.quality]}{ITEM_NAMES[item.type]}
                </Text>
                {(item.type === "sword" || item.type === "pickaxe") && (
                  <Text style={[styles.usesLeft, { color: colors.mutedForeground }]}>
                    {item.usesLeft} use{item.usesLeft !== 1 ? "s" : ""}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  buffTag: {
    fontSize: 11,
    fontWeight: "600",
  },
  defeatedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 6,
  },
  defeatedChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 2,
  },
  chipEmoji: {
    fontSize: 12,
  },
  chipCount: {
    fontSize: 11,
    fontWeight: "600",
  },
  inventoryRow: {
    gap: 6,
    paddingHorizontal: 2,
  },
  itemChip: {
    borderRadius: 10,
    padding: 7,
    alignItems: "center",
    minWidth: 64,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemLabel: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
  usesLeft: {
    fontSize: 8,
    marginTop: 1,
  },
  emptyInv: {
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 4,
  },
});
