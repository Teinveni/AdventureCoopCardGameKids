import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function RulesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>How to Play</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Goal</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            Fill all 4 treasure chests with the required items to defeat the final enemy and win! Each chest needs 2 specific items.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.energy }]}>Energy</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            You start each turn with 6 energy. Spend it to travel, fight monsters, or reveal new locations. Energy resets at the start of each new turn.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.location }]}>Travel</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            Tap a location and press Travel to visit it. Dangerous locations cost more energy. You will find an item there (and sometimes a monster too!).
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.monster }]}>Monsters</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            After each turn ends, a new monster appears. If that type is already on the field, another is drawn. Select a monster and press Fight to defeat it. If 6 monsters fill the field, you lose!
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.item }]}>Items</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            Items found at locations can be basic, steel, gold, or diamond quality. Use shields to block the next monster spawn. Use swords to reduce fight cost. Use pickaxes to reduce travel cost.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.chest }]}>Chests</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            Each chest needs 2 specific items. Once you have both items in your inventory, tap the chest to fill it. Fill all 4 to win!
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.destructive }]}>Losing</Text>
          <Text style={[styles.text, { color: colors.foreground }]}>
            You lose if the monster field fills with 6 monsters, or if the monster deck runs out and no new types can spawn.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/game")}
        style={[styles.playButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.playText, { color: colors.primaryForeground }]}>Start Playing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 80,
  },
  section: {
    borderRadius: 12,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  playButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  playText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
