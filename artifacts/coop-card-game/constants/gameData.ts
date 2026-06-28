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
  map: "Map",
  spyglass: "Spyglass",
  relic: "Ancient Relic",
  dragon_egg: "Dragon Egg",
};

export const ITEM_EMOJI: Record<ItemType, string> = {
  food: "🍖",
  sword: "⚔️",
  pickaxe: "⛏️",
  shield: "🛡️",
  decoration: "🏺",
  flower: "🌸",
  map: "🗺️",
  spyglass: "🔭",
  relic: "🏛️",
  dragon_egg: "🥚",
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

export const RARE_LOCATION_THEMES: LocationTheme[] = ["sanctum", "lair"];

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
  sanctum: "🏯",
  lair: "🐲",
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
  sanctum: "Lost Sanctum",
  lair: "Dragon's Lair",
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

export type ChestDifficulty = "easy" | "medium" | "hard" | "legendary";

export interface ChestTemplate {
  id: string;
  name: string;
  item1: ItemType;
  item2: ItemType;
  difficulty: ChestDifficulty;
  description: string;
}

export const DIFFICULTY_EMOJI: Record<ChestDifficulty, string> = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
  legendary: "⭐",
};

export const DIFFICULTY_LABEL: Record<ChestDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  legendary: "Legendary",
};

export const CHEST_POOL: ChestTemplate[] = [
  {
    id: "chest_flower_food",
    name: "Wanderer's Pack",
    item1: "flower",
    item2: "food",
    difficulty: "easy",
    description: "Common finds from any forest.",
  },
  {
    id: "chest_decoration_flower",
    name: "Trinket Box",
    item1: "decoration",
    item2: "flower",
    difficulty: "easy",
    description: "Pretty things found on the road.",
  },
  {
    id: "chest_food_decoration",
    name: "Traveler's Cache",
    item1: "food",
    item2: "decoration",
    difficulty: "easy",
    description: "Basic supplies and keepsakes.",
  },
  {
    id: "chest_sword_shield",
    name: "Warrior's Chest",
    item1: "sword",
    item2: "shield",
    difficulty: "medium",
    description: "Gear from cleared battlefields.",
  },
  {
    id: "chest_pickaxe_decoration",
    name: "Miner's Haul",
    item1: "pickaxe",
    item2: "decoration",
    difficulty: "medium",
    description: "Dug up from deep caverns.",
  },
  {
    id: "chest_sword_flower",
    name: "Duelist's Prize",
    item1: "sword",
    item2: "flower",
    difficulty: "medium",
    description: "A warrior's spoils and a victory bloom.",
  },
  {
    id: "chest_shield_pickaxe",
    name: "Ironclad Vault",
    item1: "shield",
    item2: "pickaxe",
    difficulty: "medium",
    description: "Heavy gear for seasoned adventurers.",
  },
  {
    id: "chest_relic_sword",
    name: "Sanctum Armory",
    item1: "relic",
    item2: "sword",
    difficulty: "hard",
    description: "Requires the Ancient Relic — hidden in the Lost Sanctum.",
  },
  {
    id: "chest_dragon_egg_shield",
    name: "Dragon Hoard",
    item1: "dragon_egg",
    item2: "shield",
    difficulty: "hard",
    description: "Requires the Dragon Egg — deep in the Dragon's Lair.",
  },
  {
    id: "chest_relic_dragon_egg",
    name: "Legend's Trove",
    item1: "relic",
    item2: "dragon_egg",
    difficulty: "legendary",
    description: "Both rare items — find both secret locations to win!",
  },
];
