import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import type { Location } from "@/context/GameContext";

export default function LocationGrid() {
  const colors = useColors();
  const { state, selectLocation, selectedLocation, canTravel } = useGame();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.location }]}>Locations</Text>
      <View style={styles.grid}>
        {state.locations.map((location) => {
          if (!location.revealed) {
            return (
              <View key={location.id} style={[styles.hiddenCard, { backgroundColor: colors.muted }]}>
                <Text style={[styles.hiddenText, { color: colors.mutedForeground }]}>???</Text>
              </View>
            );
          }

          const isSelected = selectedLocation?.id === location.id;
          const canGo = canTravel(location);
          const cost = Math.max(1, location.danger - (state.activePickaxe?.energyReduction || 0));

          return (
            <TouchableOpacity
              key={location.id}
              onPress={() => selectLocation(isSelected ? null : location)}
              disabled={location.visited}
              style={[
                styles.locationCard,
                {
                  backgroundColor: location.visited ? colors.muted : isSelected ? colors.location : colors.card,
                  borderColor: isSelected ? colors.location : colors.border,
                  opacity: location.visited ? 0.5 : 1,
                },
              ]}
            >
              <Text style={[styles.locationName, { color: location.visited ? colors.mutedForeground : colors.foreground }]}>
                {location.name}
              </Text>
              {!location.visited && (
                <>
                  <Text style={[styles.cost, { color: colors.energy }]}>
                    {cost} energy
                  </Text>
                  {location.item && (
                    <Text style={[styles.item, { color: colors.item }]}>
                      {location.item.quality} {location.item.type}
                    </Text>
                  )}
                  {location.monster && (
                    <Text style={[styles.monsterTag, { color: colors.monster }]}>
                      monster!
                    </Text>
                  )}
                </>
              )}
              {location.visited && (
                <Text style={[styles.visited, { color: colors.mutedForeground }]}>Visited</Text>
              )}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  locationCard: {
    borderRadius: 10,
    padding: 10,
    margin: 4,
    width: 100,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 90,
  },
  hiddenCard: {
    borderRadius: 10,
    padding: 10,
    margin: 4,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 90,
  },
  hiddenText: {
    fontSize: 18,
    fontWeight: "700",
  },
  locationName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cost: {
    fontSize: 11,
    marginTop: 2,
  },
  item: {
    fontSize: 10,
    marginTop: 2,
  },
  monsterTag: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "700",
  },
  visited: {
    fontSize: 11,
    marginTop: 4,
  },
});
