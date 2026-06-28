import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function MonsterField() {
  const colors = useColors();
  const { state, selectMonster, selectedMonster, canDefeat } = useGame();

  if (state.monstersOnField.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No monsters on field
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.monster }]}>Monsters</Text>
      <View style={styles.row}>
        {state.monstersOnField.map((monster) => {
          const isSelected = selectedMonster?.type === monster.type;
          const canFight = canDefeat(monster);
          return (
            <TouchableOpacity
              key={monster.type}
              onPress={() => selectMonster(isSelected ? null : monster)}
              style={[
                styles.monsterCard,
                {
                  backgroundColor: isSelected ? colors.monster : colors.card,
                  borderColor: isSelected ? colors.monster : colors.border,
                  opacity: canFight ? 1 : 0.5,
                },
              ]}
            >
              <Text style={[styles.monsterName, { color: isSelected ? colors.destructiveForeground : colors.monster }]}>
                {monster.name}
              </Text>
              <Text style={[styles.monsterStat, { color: isSelected ? colors.destructiveForeground : colors.mutedForeground }]}>
                Str: {monster.strength}
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
  monsterCard: {
    borderRadius: 10,
    padding: 10,
    margin: 4,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
  },
  monsterName: {
    fontSize: 13,
    fontWeight: "700",
  },
  monsterStat: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
