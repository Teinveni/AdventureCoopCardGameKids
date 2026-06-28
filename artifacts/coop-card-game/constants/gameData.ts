import type { MonsterType, ItemType, LocationTheme } from "@/context/GameContext";

export const MONSTER_NAMES: Record<MonsterType, string> = {
  goblin: "Goblin",
  orc: "Orc",
  dragon: "Dragon",
  skeleton: "Skeleton",
  wolf: "Wolf",
  witch: "Witch",
};

export const MONSTER_EMOJI: Record<MonsterType, string> = {
  goblin: "👺",
  orc: "👹",
  dragon: "🐉",
  skeleton: "💀",
  wolf: "🐺",
  witch: "🧙‍♀️",
};

export const MONSTER_STRENGTH: Record<MonsterType, number> = {
  goblin: 1,
  orc: 2,
  dragon: 4,
  skeleton: 1,
  wolf: 2,
  witch: 3,
};

export const ITEM_NAMES: Record<ItemType, string> = {
  food: "Food",
  sword: "Sword",
  pickaxe: "Pickaxe",
  shield: "Shield",
  decoration: "Decoration",
  flower: "Flower",
};

export const ITEM_EMOJI: Record<ItemType, string> = {
  food: "🍖",
  sword: "⚔️",
  pickaxe: "⛏️",
  shield: "🛡️",
  decoration: "🏺",
  flower: "🌸",
};

export const LOCATION_THEMES: LocationTheme[] = [
  "forest",
  "cave",
  "mine",
  "swamp",
  "ruins",
  "lake",
  "volcano",
  "ice",
  "valley",
  "grove",
  "peak",
  "town",
];

export const LOCATION_EMOJI: Record<LocationTheme, string> = {
  forest: "🌲",
  cave: "🕳️",
  mine: "⛏️",
  swamp: "🌿",
  ruins: "🏛️",
  lake: "💧",
  volcano: "🌋",
  ice: "❄️",
  valley: "🏔️",
  grove: "🌳",
  peak: "⛰️",
  town: "👻",
};

export const LOCATION_NAMES: Record<LocationTheme, string> = {
  forest: "Dark Forest",
  cave: "Cursed Cave",
  mine: "Abandoned Mine",
  swamp: "Haunted Swamp",
  ruins: "Ancient Ruins",
  lake: "Crystal Lake",
  volcano: "Volcano Base",
  ice: "Ice Cavern",
  valley: "Shadow Valley",
  grove: "Mystic Grove",
  peak: "Dragon Peak",
  town: "Ghost Town",
};

export const QUALITY_COLORS: Record<string, string> = {
  basic: "#a0a0b0",
  steel: "#95a5a6",
  gold: "#f4d03f",
  diamond: "#5dade2",
};

export const QUALITY_LABEL: Record<string, string> = {
  basic: "",
  steel: "Steel ",
  gold: "Gold ",
  diamond: "Diamond ",
};

export const FOOD_ENERGY_GAIN = 2;
