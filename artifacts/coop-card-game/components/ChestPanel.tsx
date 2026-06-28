import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ITEM_EMOJI, ITEM_NAMES, MONSTER_EMOJI, MONSTER_NAMES } from "@/constants/gameData";

export default function ChestPanel() {
  const colors = useColors();
  const { state, fillChest, confirmChestDefeat, skipChestDefeat } = useGame();

  const allInventory = state.players.flatMap((p) => p.inventory);

  return (
    <>
      {/* Monster picker modal when a chest is pending */}
      <Modal
        visible={state.pendingChestDefeat !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.chest, borderWidth: 2 }]}>
            <Text style={[styles.modalTitle, { color: colors.chest }]}>🗃️ Choose a monster to defeat!</Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              Your chest power defeats one monster on the field.
            </Text>

            <View style={styles.monsterGrid}>
              {state.monstersOnField.map((monster) => (
                <TouchableOpacity
                  key={monster.type}
                  onPress={() => confirmChestDefeat(monster.type)}
                  style={[styles.monsterPickCard, { backgroundColor: colors.secondary, borderColor: colors.monster }]}
                >
                  <Text style={styles.monsterPickEmoji}>{MONSTER_EMOJI[monster.type]}</Text>
                  <Text style={[styles.monsterPickName, { color: colors.foreground }]}>
                    {monster.name}
                  </Text>
                  <Text style={[styles.monsterPickStr, { color: colors.mutedForeground }]}>
                    Str {monster.strength}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {state.monstersOnField.length === 0 && (
              <Text style={[styles.noMonsters, { color: colors.mutedForeground }]}>
                No monsters on the field!
              </Text>
            )}

            <TouchableOpacity
              onPress={skipChestDefeat}
              style={[styles.skipBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
                Skip (fill chest without defeating)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Chests list */}
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
            // Handle same type required (need 2 of same)
            const sameType = chest.item1 === chest.item2;
            const canFill = sameType
              ? allInventory.filter((i) => i.type === chest.item1).length >= 2
              : has1 && has2;

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
    </>
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    gap: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  modalSub: {
    fontSize: 13,
    textAlign: "center",
  },
  monsterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  monsterPickCard: {
    borderRadius: 12,
    padding: 12,
    width: 90,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  monsterPickEmoji: {
    fontSize: 30,
  },
  monsterPickName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  monsterPickStr: {
    fontSize: 10,
  },
  noMonsters: {
    textAlign: "center",
    fontSize: 13,
    fontStyle: "italic",
  },
  skipBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  skipText: {
    fontSize: 12,
  },
});
