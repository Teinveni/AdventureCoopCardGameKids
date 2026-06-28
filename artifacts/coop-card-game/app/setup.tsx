import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { startGame } = useGame();
  const [playerCount, setPlayerCount] = useState(2);

  const handleStart = () => {
    startGame(playerCount);
    router.replace("/game");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 20 },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Feather name="arrow-left" size={20} color={colors.foreground} />
      </TouchableOpacity>

      <View style={styles.content}>
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
          <Text style={[styles.rulesTitle, { color: colors.accent }]}>Quick Tips</Text>
          <Text style={[styles.rulesText, { color: colors.mutedForeground }]}>
            🍖 Food restores +2 energy{"\n"}
            ⚔️ Swords have 2 uses — fight then use in a chest{"\n"}
            ⛏️ Pickaxes have 2 uses — travel then use in a chest{"\n"}
            👹 Defeat 2 of the same monster = +1 energy!{"\n"}
            🗺️ 5 locations shown — spend ⚡1 to replenish{"\n"}
            🗝️ Chests use items from anyone's inventory
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleStart}
          style={[styles.startBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.startText, { color: colors.primaryForeground }]}>Begin Adventure!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  back: {
    padding: 8,
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
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
  startBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
