import React, { createContext, useContext, useState, useCallback } from "react";

export type MonsterType = "goblin" | "orc" | "dragon" | "skeleton" | "wolf" | "witch";
export type ItemType = "food" | "sword" | "pickaxe" | "shield" | "decoration" | "flower";
export type ItemQuality = "basic" | "steel" | "gold" | "diamond";

export interface Item {
  type: ItemType;
  quality: ItemQuality;
  energyReduction: number;
}

export interface Location {
  id: string;
  name: string;
  danger: number;
  item: Item | null;
  monster: MonsterType | null;
  revealed: boolean;
  visited: boolean;
}

export interface Monster {
  type: MonsterType;
  name: string;
  strength: number;
}

export interface Chest {
  id: string;
  item1: ItemType;
  item2: ItemType;
  filled: boolean;
}

export interface GameState {
  energy: number;
  maxEnergy: number;
  locations: Location[];
  monstersOnField: Monster[];
  monsterDeck: Record<MonsterType, number>;
  inventory: Item[];
  chests: Chest[];
  filledChests: number;
  totalChests: number;
  turn: number;
  gameOver: boolean;
  won: boolean;
  shieldActive: boolean;
  activeSword: Item | null;
  activePickaxe: Item | null;
  selectedLocation: Location | null;
  selectedMonster: Monster | null;
  phase: "start" | "action" | "monster" | "end";
  message: string;
}

const MONSTER_NAMES: Record<MonsterType, string> = {
  goblin: "Goblin",
  orc: "Orc",
  dragon: "Dragon",
  skeleton: "Skeleton",
  wolf: "Wolf",
  witch: "Witch",
};

const MONSTER_STRENGTH: Record<MonsterType, number> = {
  goblin: 1,
  orc: 2,
  dragon: 4,
  skeleton: 1,
  wolf: 2,
  witch: 3,
};

const ITEM_NAMES: Record<ItemType, string> = {
  food: "Food",
  sword: "Sword",
  pickaxe: "Pickaxe",
  shield: "Shield",
  decoration: "Decoration",
  flower: "Flower",
};

const LOCATION_NAMES = [
  "Dark Forest",
  "Cursed Cave",
  "Abandoned Mine",
  "Haunted Swamp",
  "Ancient Ruins",
  "Crystal Lake",
  "Volcano Base",
  "Ice Cavern",
  "Shadow Valley",
  "Mystic Grove",
  "Dragon Peak",
  "Ghost Town",
];

function makeId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createInitialState(): GameState {
  const monsterDeck: Record<MonsterType, number> = {
    goblin: 6,
    orc: 6,
    dragon: 6,
    skeleton: 6,
    wolf: 6,
    witch: 6,
  };

  const allItems: Item[] = [];
  const qualities: ItemQuality[] = ["basic", "steel", "gold", "diamond"];
  const reductions: Record<ItemQuality, number> = { basic: 0, steel: 1, gold: 2, diamond: 3 };

  // Create items for each location
  const itemTypes: ItemType[] = ["food", "sword", "pickaxe", "shield", "decoration", "flower"];
  const shuffledTypes = shuffle([...itemTypes, ...itemTypes]);

  const locations: Location[] = LOCATION_NAMES.map((name, i) => {
    const danger = Math.floor(Math.random() * 3) + 2; // 2-4 energy
    const itemType = shuffledTypes[i] || itemTypes[i % 6];
    const quality = Math.random() > 0.7 ? (Math.random() > 0.5 ? "gold" : "diamond") : (Math.random() > 0.5 ? "steel" : "basic");

    return {
      id: makeId(),
      name,
      danger,
      item: { type: itemType, quality, energyReduction: reductions[quality] },
      monster: Math.random() > 0.6 ? (Object.keys(MONSTER_NAMES) as MonsterType[])[Math.floor(Math.random() * 6)] : null,
      revealed: i < 3,
      visited: false,
    };
  });

  // Create 4 chests with random item requirements
  const chests: Chest[] = [];
  for (let i = 0; i < 4; i++) {
    const types = shuffle([...itemTypes]);
    chests.push({
      id: makeId(),
      item1: types[0],
      item2: types[1],
      filled: false,
    });
  }

  return {
    energy: 6,
    maxEnergy: 6,
    locations,
    monstersOnField: [],
    monsterDeck,
    inventory: [],
    chests,
    filledChests: 0,
    totalChests: 4,
    turn: 1,
    gameOver: false,
    won: false,
    shieldActive: false,
    activeSword: null,
    activePickaxe: null,
    selectedLocation: null,
    selectedMonster: null,
    phase: "start",
    message: "Welcome! Use your energy to explore locations and fill chests.",
  };
}

interface GameContextType {
  state: GameState;
  travelToLocation: (locationId: string) => void;
  defeatMonster: (monsterType: MonsterType) => void;
  revealLocation: () => void;
  endTurn: () => void;
  useItem: (item: Item) => void;
  selectLocation: (location: Location | null) => void;
  selectMonster: (monster: Monster | null) => void;
  fillChest: (chestId: string) => void;
  resetGame: () => void;
  canTravel: (location: Location) => boolean;
  canDefeat: (monster: Monster) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState);

  const selectLocation = useCallback((location: Location | null) => {
    setState((s) => ({ ...s, selectedLocation: location }));
  }, []);

  const selectMonster = useCallback((monster: Monster | null) => {
    setState((s) => ({ ...s, selectedMonster: monster }));
  }, []);

  const canTravel = useCallback((location: Location) => {
    if (location.visited || !location.revealed) return false;
    const cost = Math.max(1, location.danger - (state.activePickaxe?.energyReduction || 0));
    return state.energy >= cost;
  }, [state.energy, state.activePickaxe]);

  const canDefeat = useCallback((monster: Monster) => {
    const cost = Math.max(1, monster.strength - (state.activeSword?.energyReduction || 0));
    return state.energy >= cost;
  }, [state.energy, state.activeSword]);

  const travelToLocation = useCallback((locationId: string) => {
    setState((s) => {
      const location = s.locations.find((l) => l.id === locationId);
      if (!location || location.visited || !location.revealed) return s;

      const cost = Math.max(1, location.danger - (s.activePickaxe?.energyReduction || 0));
      if (s.energy < cost) return s;

      const newInventory = location.item ? [...s.inventory, location.item] : s.inventory;
      const newLocations = s.locations.map((l) =>
        l.id === locationId ? { ...l, visited: true } : l
      );

      let msg = `Traveled to ${location.name}`;
      if (location.item) {
        msg += `. Found ${location.item.quality} ${ITEM_NAMES[location.item.type]}!`;
      }
      if (location.monster) {
        msg += ` A ${MONSTER_NAMES[location.monster]} appeared!`;
      }

      return {
        ...s,
        energy: s.energy - cost,
        locations: newLocations,
        inventory: newInventory,
        selectedLocation: null,
        message: msg,
      };
    });
  }, []);

  const defeatMonster = useCallback((monsterType: MonsterType) => {
    setState((s) => {
      const monster = s.monstersOnField.find((m) => m.type === monsterType);
      if (!monster) return s;

      const cost = Math.max(1, monster.strength - (s.activeSword?.energyReduction || 0));
      if (s.energy < cost) return s;

      const newMonsters = s.monstersOnField.filter((m) => m.type !== monsterType);
      return {
        ...s,
        energy: s.energy - cost,
        monstersOnField: newMonsters,
        selectedMonster: null,
        activeSword: null,
        message: `Defeated the ${monster.name}!`,
      };
    });
  }, []);

  const revealLocation = useCallback(() => {
    setState((s) => {
      if (s.energy < 1) return s;
      const hidden = s.locations.find((l) => !l.revealed);
      if (!hidden) return s;

      const newLocations = s.locations.map((l) =>
        l.id === hidden.id ? { ...l, revealed: true } : l
      );

      return {
        ...s,
        energy: s.energy - 1,
        locations: newLocations,
        message: `Revealed ${hidden.name}!`,
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    setState((s) => {
      if (s.gameOver) return s;

      // If shield is active, block monster spawn
      if (s.shieldActive) {
        return {
          ...s,
          shieldActive: false,
          energy: s.maxEnergy,
          turn: s.turn + 1,
          phase: "action",
          message: "Shield blocked the monster! New turn started.",
        };
      }

      // Spawn monster - keep drawing until we get a type not on field
      const monsterTypes = Object.keys(s.monsterDeck) as MonsterType[];
      let spawned: Monster | null = null;
      let newDeck = { ...s.monsterDeck };

      const shuffledTypes = shuffle(monsterTypes);
      for (const type of shuffledTypes) {
        if (newDeck[type] > 0 && !s.monstersOnField.some((m) => m.type === type)) {
          newDeck[type]--;
          spawned = { type, name: MONSTER_NAMES[type], strength: MONSTER_STRENGTH[type] };
          break;
        }
      }

      // Check if any deck still has cards but all types on field
      const typesWithCards = monsterTypes.filter((t) => newDeck[t] > 0);
      const typesOnField = s.monstersOnField.map((m) => m.type);
      const canSpawn = typesWithCards.some((t) => !typesOnField.includes(t));

      if (!spawned && !canSpawn) {
        // Check if won
        if (s.filledChests >= s.totalChests) {
          return { ...s, gameOver: true, won: true, message: "Victory! All chests filled!" };
        }
        return { ...s, gameOver: true, won: false, message: "Game Over! No more monsters can spawn." };
      }

      const newMonsters = spawned ? [...s.monstersOnField, spawned] : s.monstersOnField;

      // Check lose condition - too many monsters
      if (newMonsters.length >= 6) {
        return { ...s, gameOver: true, won: false, message: "Game Over! Too many monsters!" };
      }

      let msg = "New turn!";
      if (spawned) {
        msg = `A ${spawned.name} appeared!`;
      } else {
        msg = "No new monster this turn.";
      }

      return {
        ...s,
        monsterDeck: newDeck,
        monstersOnField: newMonsters,
        energy: s.maxEnergy,
        turn: s.turn + 1,
        shieldActive: false,
        activeSword: null,
        activePickaxe: null,
        selectedLocation: null,
        selectedMonster: null,
        phase: "action",
        message: msg,
      };
    });
  }, []);

  const useItem = useCallback((item: Item) => {
    setState((s) => {
      const idx = s.inventory.findIndex((i) => i.type === item.type && i.quality === item.quality);
      if (idx === -1) return s;

      const newInventory = [...s.inventory];
      newInventory.splice(idx, 1);

      let msg = `Used ${item.quality} ${ITEM_NAMES[item.type]}`;

      if (item.type === "shield") {
        return {
          ...s,
          inventory: newInventory,
          shieldActive: true,
          message: msg + ". Monsters blocked next turn!",
        };
      }
      if (item.type === "sword") {
        return {
          ...s,
          inventory: newInventory,
          activeSword: item,
          message: msg + ". Monster fights cost less!",
        };
      }
      if (item.type === "pickaxe") {
        return {
          ...s,
          inventory: newInventory,
          activePickaxe: item,
          message: msg + ". Travel costs less!",
        };
      }

      return { ...s, inventory: newInventory, message: msg };
    });
  }, []);

  const fillChest = useCallback((chestId: string) => {
    setState((s) => {
      const chest = s.chests.find((c) => c.id === chestId);
      if (!chest || chest.filled) return s;

      const hasItem1 = s.inventory.some((i) => i.type === chest.item1);
      const hasItem2 = s.inventory.some((i) => i.type === chest.item2);

      if (!hasItem1 || !hasItem2) {
        return { ...s, message: `Need ${ITEM_NAMES[chest.item1]} and ${ITEM_NAMES[chest.item2]}!` };
      }

      // Remove one of each item type
      const newInventory = [...s.inventory];
      const idx1 = newInventory.findIndex((i) => i.type === chest.item1);
      if (idx1 > -1) newInventory.splice(idx1, 1);
      const idx2 = newInventory.findIndex((i) => i.type === chest.item2);
      if (idx2 > -1) newInventory.splice(idx2, 1);

      const newChests = s.chests.map((c) =>
        c.id === chestId ? { ...c, filled: true } : c
      );
      const newFilled = s.filledChests + 1;

      if (newFilled >= s.totalChests) {
        return {
          ...s,
          inventory: newInventory,
          chests: newChests,
          filledChests: newFilled,
          gameOver: true,
          won: true,
          message: "Victory! All chests filled!",
        };
      }

      return {
        ...s,
        inventory: newInventory,
        chests: newChests,
        filledChests: newFilled,
        message: `Chest filled! ${newFilled}/${s.totalChests} complete.`,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        travelToLocation,
        defeatMonster,
        revealLocation,
        endTurn,
        useItem,
        selectLocation,
        selectMonster,
        fillChest,
        resetGame,
        canTravel,
        canDefeat,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
