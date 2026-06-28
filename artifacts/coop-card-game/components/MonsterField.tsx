import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { MONSTER_EMOJI, MONSTER_NAMES, MONSTER_STRENGTH } from "@/constants/gameData";
import type { MonsterType } from "@/context/GameContext";

export default function MonsterField() {
  const colors = useColors();
  const { state, selectMonster, canDefeat } = useGame();
  const { selectedMonster } = state;

  if (state.monstersOnField.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          ✨ No monsters on field
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.monster }]}>
        Monsters on Field ({state.monstersOnField.length}/6)
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {state.monstersOnField.map((monster) => {
          const isSelected = selectedMonster?.type === monster.type;
          const canFight = canDefeat(monster);
          const player = state.players[state.currentPlayerIndex];
          const reduction = player.activeSword ? player.activeSword.energyReduction : 0;
          const cost = Math.max(1, monster.strength - reduction);

          return (
            <TouchableOpacity
              key={monster.type}
              onPress={() => selectMonster(isSelected ? null : monster)}
              activeOpacity={0.75}
              style={[
                styles.monsterCard,
                {
                  backgroundColor: isSelected ? "#3a1a1a" : colors.card,
                  borderColor: isSelected ? colors.monster : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                  opacity: canFight ? 1 : 0.55,
                },
              ]}
            >
              <Text style={styles.emoji}>{MONSTER_EMOJI[monster.type]}</Text>
              <Text style={[styles.monsterName, { color: isSelected ? colors.monster : colors.foreground }]}>
                {monster.name}
              </Text>
              <Text style={[styles.cost, { color: colors.energy }]}>⚡ {cost}</Text>
              <Text style={[styles.str, { color: colors.mutedForeground }]}>
                Str {monster.strength}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginBottom: 8,
  },
  row: {
    gap: 8,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  monsterCard: {
    borderRadius: 12,
    padding: 10,
    width: 90,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 105,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 2,
  },
  monsterName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cost: {
    fontSize: 12,
    fontWeight: "700",
  },
  str: {
    fontSize: 10,
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
