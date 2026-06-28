import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GameCardProps {
  title: string;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
  small?: boolean;
}

export default function GameCard({
  title,
  subtitle,
  color,
  onPress,
  disabled,
  selected,
  children,
  small,
}: GameCardProps) {
  const colors = useColors();
  const bgColor = color || colors.card;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
          opacity: disabled ? 0.5 : 1,
          padding: small ? 8 : 12,
          minWidth: small ? 70 : 100,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground, fontSize: small ? 12 : 14 }]} numberOfLines={2}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontSize: small ? 10 : 12 }]}>
          {subtitle}
        </Text>
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    minHeight: 70,
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 2,
    textAlign: "center",
  },
});
