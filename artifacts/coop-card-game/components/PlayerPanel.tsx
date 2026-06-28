import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ITEM_EMOJI, ITEM_NAMES, QUALITY_COLORS, QUALITY_LABEL, MONSTER_EMOJI } from "@/constants/gameData";
import type { Item } from "@/context/GameContext";

interface PlayerPanelProps {
  playerIndex: number;
}

const CHEST_ITEMS = new Set(["relic", "dragon_egg", "decoration", "flower"]);
const AUTO_ITEMS = new Set(["sword", "pickaxe"]);

function itemTag(item: Item): string {
  if (AUTO_ITEMS.has(item.type)) return "auto";
  if (CHEST_ITEMS.has(item.type)) return "chest";
  return "use";
}

export default function PlayerPanel({ playerIndex }: PlayerPanelProps) {
  const colors = useColors();
  const { state, useItem } = useGame();
  const player = state.players[playerIndex];
  const isCurrent = playerIndex === state.currentPlayerIndex;

  // Best sword/pickaxe for showing which will auto-apply
  const bestSword = player.inventory
    .filter((i) => i.type === "sword")
    .sort((a, b) => b.energyReduction - a.energyReduction)[0] ?? null;
  const bestPickaxe = player.inventory
    .filter((i) => i.type === "pickaxe")
    .sort((a, b) => b.energyReduction - a.energyReduction)[0] ?? null;

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
        {/* Show active auto-weapon/tool */}
        {isCurrent && bestSword && (
          <View style={[styles.autoBadge, { backgroundColor: "#1a2a1a", borderColor: colors.location }]}>
            <Text style={[styles.autoText, { color: colors.location }]}>
              ⚔️ -{bestSword.energyReduction} fight
            </Text>
          </View>
        )}
        {isCurrent && bestPickaxe && (
          <View style={[styles.autoBadge, { backgroundColor: "#1a1a2a", borderColor: colors.accent }]}>
            <Text style={[styles.autoText, { color: colors.accent }]}>
              ⛏️ -{bestPickaxe.energyReduction} travel
            </Text>
          </View>
        )}
      </View>

      {/* Defeated monsters */}
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
            const tag = itemTag(item);
            const usable = isCurrent && (item.type === "food" || item.type === "shield" || item.type === "spyglass" || item.type === "map");
            const isAutoWeapon = AUTO_ITEMS.has(item.type);
            const isActiveBest =
              (item.type === "sword" && bestSword?.id === item.id) ||
              (item.type === "pickaxe" && bestPickaxe?.id === item.id);
            const qualColor = QUALITY_COLORS[item.quality];

            let tagLabel = "";
            let tagColor = colors.mutedForeground;
            if (tag === "auto") { tagLabel = "auto ↗"; tagColor = colors.location; }
            else if (tag === "chest") { tagLabel = "→ chest"; tagColor = colors.chest; }

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => usable ? useItem(item) : undefined}
                disabled={!usable}
                activeOpacity={usable ? 0.7 : 1}
                style={[
                  styles.itemChip,
                  {
                    backgroundColor: isActiveBest ? "#1a3a1a" : colors.card,
                    borderColor: isActiveBest ? colors.location : qualColor,
                    borderWidth: item.quality !== "basic" || isActiveBest ? 2 : 1,
                    opacity: !isCurrent ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={styles.itemEmoji}>{ITEM_EMOJI[item.type]}</Text>
                <Text style={[styles.itemLabel, { color: qualColor }]} numberOfLines={1}>
                  {QUALITY_LABEL[item.quality]}{ITEM_NAMES[item.type]}
                </Text>
                {(isAutoWeapon) && (
                  <Text style={[styles.usesLeft, { color: colors.mutedForeground }]}>
                    {item.usesLeft} use{item.usesLeft !== 1 ? "s" : ""}
                  </Text>
                )}
                {tagLabel ? (
                  <Text style={[styles.tagLabel, { color: tagColor }]}>{tagLabel}</Text>
                ) : null}
                {usable && (
                  <Text style={[styles.tagLabel, { color: colors.energy }]}>tap to use</Text>
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
    gap: 6,
    marginBottom: 6,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  autoBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  autoText: {
    fontSize: 10,
    fontWeight: "700",
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
  chipEmoji: { fontSize: 12 },
  chipCount: { fontSize: 11, fontWeight: "600" },
  inventoryRow: {
    gap: 6,
    paddingHorizontal: 2,
    paddingBottom: 2,
  },
  itemChip: {
    borderRadius: 10,
    padding: 7,
    alignItems: "center",
    minWidth: 68,
    gap: 1,
  },
  itemEmoji: { fontSize: 20 },
  itemLabel: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
  usesLeft: { fontSize: 8 },
  tagLabel: { fontSize: 8, fontWeight: "700" },
  emptyInv: {
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 4,
  },
});
