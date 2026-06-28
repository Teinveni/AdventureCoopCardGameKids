import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { LOCATION_EMOJI, MONSTER_EMOJI, QUALITY_COLORS, QUALITY_LABEL } from "@/constants/gameData";
import type { Location } from "@/context/GameContext";

export default function LocationGrid() {
  const colors = useColors();
  const { state, selectLocation, selectedLocation, canTravel, replenishLocations } = useGame();

  const visitedCount = state.activeLocations.filter((l) => l.visited).length;
  const canReplenish = state.energy >= 1 && visitedCount > 0;
  const poolRemaining = state.allLocations.filter(
    (l) => !state.activeLocations.some((a) => a.id === l.id)
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.location }]}>
          🗺️ Locations ({state.activeLocations.filter((l) => !l.visited).length} active)
        </Text>
        <TouchableOpacity
          onPress={replenishLocations}
          disabled={!canReplenish || poolRemaining === 0}
          style={[
            styles.replenishBtn,
            {
              backgroundColor: canReplenish && poolRemaining > 0 ? colors.primary : colors.muted,
              opacity: canReplenish && poolRemaining > 0 ? 1 : 0.4,
            },
          ]}
        >
          <Text style={[styles.replenishText, { color: colors.background }]}>⚡1 Replenish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {state.activeLocations.map((location) => {
          if (location.visited) {
            return (
              <View key={location.id} style={[styles.card, styles.visitedCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={styles.emoji}>{LOCATION_EMOJI[location.theme]}</Text>
                <Text style={[styles.locationName, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {location.name}
                </Text>
                <Text style={[styles.visitedLabel, { color: colors.mutedForeground }]}>Visited</Text>
              </View>
            );
          }

          const isSelected = selectedLocation?.id === location.id;
          const canGo = canTravel(location);
          const player = state.players[state.currentPlayerIndex];
          const reduction = player.activePickaxe ? player.activePickaxe.energyReduction : 0;
          const cost = Math.max(1, location.danger - reduction);

          return (
            <TouchableOpacity
              key={location.id}
              onPress={() => selectLocation(isSelected ? null : location)}
              activeOpacity={0.75}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? "#1a3a2a" : colors.card,
                  borderColor: isSelected ? colors.location : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                  opacity: canGo ? 1 : 0.6,
                },
              ]}
            >
              <Text style={styles.emoji}>{LOCATION_EMOJI[location.theme]}</Text>
              <Text style={[styles.locationName, { color: colors.foreground }]} numberOfLines={2}>
                {location.name}
              </Text>
              <Text style={[styles.cost, { color: colors.energy }]}>⚡ {cost}</Text>
              {/* Secret — contents revealed only after travel */}
              <View style={[styles.secretBadge, { backgroundColor: colors.muted }]}>
                <Text style={[styles.secretText, { color: colors.mutedForeground }]}>? Unknown</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Empty placeholder slots to always show 5 */}
        {Array.from({ length: Math.max(0, 5 - state.activeLocations.length) }).map((_, i) => (
          <View key={`empty-${i}`} style={[styles.card, styles.emptyCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>???</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  replenishBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  replenishText: {
    fontSize: 11,
    fontWeight: "600",
  },
  row: {
    paddingHorizontal: 2,
    gap: 8,
    paddingBottom: 4,
  },
  card: {
    borderRadius: 12,
    padding: 10,
    width: 105,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 120,
    justifyContent: "space-between",
  },
  visitedCard: {
    opacity: 0.45,
  },
  emptyCard: {
    justifyContent: "center",
    opacity: 0.3,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  locationName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  cost: {
    fontSize: 12,
    fontWeight: "700",
  },
  secretBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  secretText: {
    fontSize: 10,
  },
  visitedLabel: {
    fontSize: 10,
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
  },
});
