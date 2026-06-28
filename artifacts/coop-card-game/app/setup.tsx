import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  CHEST_POOL,
  DIFFICULTY_EMOJI,
  DIFFICULTY_LABEL,
  ITEM_EMOJI,
  ITEM_NAMES,
} from "@/constants/gameData";
import type { ChestDifficulty } from "@/constants/gameData";

const DIFFICULTY_COLORS: Record<ChestDifficulty, string> = {
  easy: "#27ae60",
  medium: "#f39c12",
  hard: "#e74c3c",
  legendary: "#8e44ad",
};

export default function SetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { startGame } = useGame();
  const [step, setStep] = useState<"players" | "chests">("players");
  const [playerCount, setPlayerCount] = useState(2);
  const [selectedChests, setSelectedChests] = useState<Set<string>>(new Set());

  const toggleChest = (id: string) => {
    setSelectedChests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 4) {
        next.add(id);
      }
      return next;
    });
  };

  const handleStart = () => {
    startGame(playerCount, Array.from(selectedChests));
    router.replace("/game");
  };

  const canStart = selectedChests.size === 4;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 12 },
      ]}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            if (step === "chests") setStep("players");
            else router.back();
          }}
          style={styles.back}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.stepLine, { backgroundColor: step === "chests" ? colors.primary : colors.border }]} />
          <View style={[styles.stepDot, { backgroundColor: step === "chests" ? colors.primary : colors.border }]} />
        </View>
        <View style={{ width: 36 }} />
      </View>

      {step === "players" ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.foreground }]}>⚔️ Setup Quest</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            How many adventurers join the quest?
          </Text>

          <View style={styles.playerGrid}>
            {[1, 2, 3, 4].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setPlayerCount(n)}
                style={[
                  styles.playerOption,
                  {
                    backgroundColor: playerCount === n ? colors.primary : colors.card,
                    borderColor: playerCount === n ? colors.primary : colors.border,
                    borderWidth: playerCount === n ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.playerEmoji}>
                  {n === 1 ? "🧙" : n === 2 ? "🧙🛡️" : n === 3 ? "🧙🛡️⚔️" : "🧙🛡️⚔️🏹"}
                </Text>
                <Text
                  style={[
                    styles.playerNum,
                    { color: playerCount === n ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {n} {n === 1 ? "Player" : "Players"}
                </Text>
                <Text
                  style={[
                    styles.playerDesc,
                    { color: playerCount === n ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {n === 1
                    ? "Solo challenge"
                    : n === 2
                    ? "Classic duo"
                    : n === 3
                    ? "Adventuring party"
                    : "Full fellowship"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.rulesBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.rulesTitle, { color: colors.accent }]}>New: Secret Locations!</Text>
            <Text style={[styles.rulesText, { color: colors.mutedForeground }]}>
              🗺️ Find a Map → reveals a hidden rare location{"\n"}
              🔭 Find a Spyglass → peek at all current location contents{"\n"}
              🏯 Lost Sanctum → holds the Ancient Relic{"\n"}
              🐲 Dragon's Lair → holds the Dragon Egg{"\n"}
              ⭐ Some chests need these rare items!
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setStep("chests")}
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.nextText, { color: colors.primaryForeground }]}>
              Choose Chests →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.chestHeader}>
            <Text style={[styles.title, { color: colors.foreground }]}>🗃️ Pick 4 Chests</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {selectedChests.size}/4 selected — your chests set the difficulty
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.chestList}>
            {CHEST_POOL.map((chest) => {
              const selected = selectedChests.has(chest.id);
              const locked = !selected && selectedChests.size >= 4;
              const diffColor = DIFFICULTY_COLORS[chest.difficulty];

              return (
                <TouchableOpacity
                  key={chest.id}
                  onPress={() => toggleChest(chest.id)}
                  disabled={locked}
                  activeOpacity={0.8}
                  style={[
                    styles.chestCard,
                    {
                      backgroundColor: selected ? "#1a1a3e" : colors.card,
                      borderColor: selected ? diffColor : colors.border,
                      borderWidth: selected ? 2 : 1,
                      opacity: locked ? 0.4 : 1,
                    },
                  ]}
                >
                  <View style={styles.chestCardLeft}>
                    <View style={[styles.diffBadge, { backgroundColor: diffColor + "33", borderColor: diffColor }]}>
                      <Text style={[styles.diffText, { color: diffColor }]}>
                        {DIFFICULTY_EMOJI[chest.difficulty]} {DIFFICULTY_LABEL[chest.difficulty]}
                      </Text>
                    </View>
                    <Text style={[styles.chestName, { color: colors.foreground }]}>{chest.name}</Text>
                    <Text style={[styles.chestDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                      {chest.description}
                    </Text>
                    <View style={styles.chestRequires}>
                      <Text style={[styles.requiresLabel, { color: colors.mutedForeground }]}>Needs: </Text>
                      <Text style={[styles.requireItem, { color: colors.foreground }]}>
                        {ITEM_EMOJI[chest.item1]} {ITEM_NAMES[chest.item1]}
                      </Text>
                      <Text style={[styles.requirePlus, { color: colors.mutedForeground }]}> + </Text>
                      <Text style={[styles.requireItem, { color: colors.foreground }]}>
                        {ITEM_EMOJI[chest.item2]} {ITEM_NAMES[chest.item2]}
                      </Text>
                    </View>
                  </View>

                  <View style={[
                    styles.checkCircle,
                    {
                      backgroundColor: selected ? diffColor : "transparent",
                      borderColor: selected ? diffColor : colors.border,
                    },
                  ]}>
                    {selected && <Feather name="check" size={14} color="#fff" />}
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Sticky start button */}
          <View style={[styles.startBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 10 }]}>
            <TouchableOpacity
              onPress={handleStart}
              disabled={!canStart}
              style={[
                styles.startBtn,
                {
                  backgroundColor: canStart ? colors.primary : colors.muted,
                  opacity: canStart ? 1 : 0.5,
                },
              ]}
            >
              <Text style={[styles.startText, { color: canStart ? colors.primaryForeground : colors.mutedForeground }]}>
                {canStart ? "Begin Adventure!" : `Select ${4 - selectedChests.size} more chest${4 - selectedChests.size !== 1 ? "s" : ""}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  back: {
    padding: 8,
    width: 36,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  scrollContent: {
    alignItems: "center",
    gap: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  playerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  playerOption: {
    borderRadius: 14,
    padding: 14,
    width: 145,
    alignItems: "center",
    gap: 6,
  },
  playerEmoji: {
    fontSize: 26,
  },
  playerNum: {
    fontSize: 15,
    fontWeight: "700",
  },
  playerDesc: {
    fontSize: 11,
    textAlign: "center",
  },
  rulesBox: {
    borderRadius: 12,
    padding: 14,
    width: "100%",
    borderWidth: 1,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  rulesText: {
    fontSize: 12,
    lineHeight: 20,
  },
  nextBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "700",
  },
  // Chest selection
  chestHeader: {
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  chestList: {
    gap: 10,
    paddingHorizontal: 2,
  },
  chestCard: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chestCardLeft: {
    flex: 1,
    gap: 5,
  },
  diffBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  diffText: {
    fontSize: 11,
    fontWeight: "700",
  },
  chestName: {
    fontSize: 15,
    fontWeight: "700",
  },
  chestDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  chestRequires: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  requiresLabel: {
    fontSize: 11,
  },
  requireItem: {
    fontSize: 11,
    fontWeight: "600",
  },
  requirePlus: {
    fontSize: 11,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  startBar: {
    position: "absolute",
    bottom: 0,
    left: -20,
    right: -20,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  startBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  startText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
