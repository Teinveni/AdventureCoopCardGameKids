import React, { createContext, useContext, useState, useCallback } from "react";
import {
  MONSTER_NAMES,
  MONSTER_STRENGTH,
  ITEM_NAMES,
  LOCATION_THEMES,
  LOCATION_NAMES,
  FOOD_ENERGY_GAIN,
} from "@/constants/gameData";

export type MonsterType = "goblin" | "orc" | "dragon" | "skeleton" | "wolf" | "witch";
export type ItemType = "food" | "sword" | "pickaxe" | "shield" | "decoration" | "flower";
export type ItemQuality = "basic" | "steel" | "gold" | "diamond";
export type LocationTheme =
  | "forest" | "cave" | "mine" | "swamp" | "ruins"
  | "lake" | "volcano" | "ice" | "valley" | "grove" | "peak" | "town";

export interface Item {
  id: string;
  type: ItemType;
  quality: ItemQuality;
  energyReduction: number;
  usesLeft: number; // sword/pickaxe have 2 uses; others 1
}

export interface Location {
  id: string;
  name: string;
  theme: LocationTheme;
  danger: number;
  item: Item | null;
  monster: MonsterType | null;
  revealed: boolean; // shown on board (one of the 5 active slots)
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

export interface Player {
  id: number;
  name: string;
  inventory: Item[];
  defeatedMonsters: MonsterType[]; // history of defeated types for bonus tracking
  bonusEnergyPending: number; // +1 per pair of same-type defeats
  activeSword: Item | null;
  activePickaxe: Item | null;
  shieldActive: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  energy: number;
  maxEnergy: number;
  allLocations: Location[]; // full deck of 12 locations
  activeLocations: Location[]; // the 5 currently visible (max)
  monstersOnField: Monster[];
  monsterDeck: Record<MonsterType, number>;
  chests: Chest[];
  filledChests: number;
  totalChests: number;
  turn: number;
  gameOver: boolean;
  won: boolean;
  selectedLocation: Location | null;
  selectedMonster: Monster | null;
  pendingChestDefeat: string | null; // chestId waiting for player to pick a monster to defeat
  phase: "action" | "end";
  message: string;
}

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

const QUALITY_REDUCTIONS: Record<ItemQuality, number> = {
  basic: 0,
  steel: 1,
  gold: 2,
  diamond: 3,
};

const ITEM_USES: Record<ItemType, number> = {
  food: 1,
  sword: 2,
  pickaxe: 2,
  shield: 1,
  decoration: 1,
  flower: 1,
};

function makeItem(type: ItemType, quality: ItemQuality): Item {
  return {
    id: makeId(),
    type,
    quality,
    energyReduction: QUALITY_REDUCTIONS[quality],
    usesLeft: ITEM_USES[type],
  };
}

function createPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Player ${i + 1}`,
    inventory: [],
    defeatedMonsters: [],
    bonusEnergyPending: 0,
    activeSword: null,
    activePickaxe: null,
    shieldActive: false,
  }));
}

function createInitialState(playerCount: number): GameState {
  const monsterDeck: Record<MonsterType, number> = {
    goblin: 6, orc: 6, dragon: 6, skeleton: 6, wolf: 6, witch: 6,
  };

  const itemTypes: ItemType[] = ["food", "sword", "pickaxe", "shield", "decoration", "flower"];
  const qualities: ItemQuality[] = ["basic", "steel", "gold", "diamond"];

  const shuffledThemes = shuffle([...LOCATION_THEMES]);

  const allLocations: Location[] = shuffledThemes.map((theme) => {
    const danger = Math.floor(Math.random() * 3) + 2;
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const qualityRoll = Math.random();
    const quality: ItemQuality =
      qualityRoll > 0.85 ? "diamond" : qualityRoll > 0.65 ? "gold" : qualityRoll > 0.4 ? "steel" : "basic";
    const hasMonster = Math.random() > 0.55;

    return {
      id: makeId(),
      name: LOCATION_NAMES[theme],
      theme,
      danger,
      item: makeItem(itemType, quality),
      monster: hasMonster
        ? (Object.keys(MONSTER_NAMES) as MonsterType[])[Math.floor(Math.random() * 6)]
        : null,
      revealed: false,
      visited: false,
    };
  });

  // First 5 are active
  const activeLocations = allLocations.slice(0, 5).map((l) => ({ ...l, revealed: true }));
  const restLocations = allLocations.slice(5);

  const chests: Chest[] = [];
  const allItemTypes = [...itemTypes];
  for (let i = 0; i < 4; i++) {
    const shuffled = shuffle([...allItemTypes]);
    chests.push({ id: makeId(), item1: shuffled[0], item2: shuffled[1], filled: false });
  }

  return {
    players: createPlayers(playerCount),
    currentPlayerIndex: 0,
    energy: 6,
    maxEnergy: 6,
    allLocations: [...activeLocations, ...restLocations],
    activeLocations,
    monstersOnField: [],
    monsterDeck,
    chests,
    filledChests: 0,
    totalChests: 4,
    turn: 1,
    gameOver: false,
    won: false,
    selectedLocation: null,
    selectedMonster: null,
    pendingChestDefeat: null,
    phase: "action",
    message: "Adventure begins! Select a location to travel or a monster to fight.",
  };
}

interface GameContextType {
  state: GameState;
  travelToLocation: (locationId: string) => void;
  defeatMonster: (monsterType: MonsterType) => void;
  replenishLocations: () => void;
  endTurn: () => void;
  useItem: (item: Item) => void;
  putInChest: (chestId: string, itemId: string) => void;
  selectLocation: (location: Location | null) => void;
  selectMonster: (monster: Monster | null) => void;
  fillChest: (chestId: string) => void;
  confirmChestDefeat: (monsterType: MonsterType) => void;
  skipChestDefeat: () => void;
  resetGame: () => void;
  startGame: (playerCount: number) => void;
  canTravel: (location: Location) => boolean;
  canDefeat: (monster: Monster) => boolean;
  currentPlayer: Player;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => createInitialState(2));
  const [started, setStarted] = useState(false);

  const currentPlayer = state.players[state.currentPlayerIndex];

  const canTravel = useCallback(
    (location: Location) => {
      if (location.visited || !location.revealed) return false;
      const player = state.players[state.currentPlayerIndex];
      const reduction = player.activePickaxe ? player.activePickaxe.energyReduction : 0;
      const cost = Math.max(1, location.danger - reduction);
      return state.energy >= cost;
    },
    [state.energy, state.players, state.currentPlayerIndex]
  );

  const canDefeat = useCallback(
    (monster: Monster) => {
      const player = state.players[state.currentPlayerIndex];
      const reduction = player.activeSword ? player.activeSword.energyReduction : 0;
      const cost = Math.max(1, monster.strength - reduction);
      return state.energy >= cost;
    },
    [state.energy, state.players, state.currentPlayerIndex]
  );

  const selectLocation = useCallback((location: Location | null) => {
    setState((s) => ({ ...s, selectedLocation: location, selectedMonster: null }));
  }, []);

  const selectMonster = useCallback((monster: Monster | null) => {
    setState((s) => ({ ...s, selectedMonster: monster, selectedLocation: null }));
  }, []);

  const travelToLocation = useCallback((locationId: string) => {
    setState((s) => {
      const location = s.activeLocations.find((l) => l.id === locationId);
      if (!location || location.visited) return s;

      const player = s.players[s.currentPlayerIndex];
      const reduction = player.activePickaxe ? player.activePickaxe.energyReduction : 0;
      const cost = Math.max(1, location.danger - reduction);
      if (s.energy < cost) return s;

      // Add item to current player's inventory
      const newInventory = location.item ? [...player.inventory, location.item] : player.inventory;

      const updatedPlayer: Player = { ...player, inventory: newInventory };
      const newPlayers = s.players.map((p, i) =>
        i === s.currentPlayerIndex ? updatedPlayer : p
      );

      // Mark as visited in activeLocations
      const newActive = s.activeLocations.map((l) =>
        l.id === locationId ? { ...l, visited: true } : l
      );
      const newAll = s.allLocations.map((l) =>
        l.id === locationId ? { ...l, visited: true } : l
      );

      let msg = `Traveled to ${location.name}!`;
      if (location.item) {
        const q = location.item.quality !== "basic" ? `${location.item.quality} ` : "";
        msg += ` Found ${q}${ITEM_NAMES[location.item.type]}!`;
      } else {
        msg += " Nothing here.";
      }
      if (location.monster) {
        msg += ` A monster lurks nearby!`;
      }

      return {
        ...s,
        energy: s.energy - cost,
        players: newPlayers,
        activeLocations: newActive,
        allLocations: newAll,
        selectedLocation: null,
        message: msg,
      };
    });
  }, []);

  const defeatMonster = useCallback((monsterType: MonsterType) => {
    setState((s) => {
      const monster = s.monstersOnField.find((m) => m.type === monsterType);
      if (!monster) return s;

      const player = s.players[s.currentPlayerIndex];
      const reduction = player.activeSword ? player.activeSword.energyReduction : 0;
      const cost = Math.max(1, monster.strength - reduction);
      if (s.energy < cost) return s;

      // Track defeated monster for bonus energy
      const newDefeated = [...player.defeatedMonsters, monsterType];
      // Count same type
      const sameCount = newDefeated.filter((t) => t === monsterType).length;
      const bonusEnergy = sameCount % 2 === 0 ? 1 : 0;

      // Degrade sword: reduce uses
      let newSword = player.activeSword;
      let newInventory = player.inventory;
      if (player.activeSword) {
        const remaining = player.activeSword.usesLeft - 1;
        if (remaining > 0) {
          newSword = { ...player.activeSword, usesLeft: remaining };
        } else {
          newSword = null;
        }
        // Update inventory too
        newInventory = player.inventory.map((item) =>
          item.id === player.activeSword!.id ? { ...item, usesLeft: remaining } : item
        ).filter((item) => item.usesLeft > 0 || (item.type !== "sword" && item.type !== "pickaxe"));
      }

      const updatedPlayer: Player = {
        ...player,
        defeatedMonsters: newDefeated,
        activeSword: newSword,
        inventory: newInventory,
      };
      const newPlayers = s.players.map((p, i) =>
        i === s.currentPlayerIndex ? updatedPlayer : p
      );

      const newMonsters = s.monstersOnField.filter((m) => m.type !== monsterType);
      const bonusMsg = bonusEnergy > 0 ? " +1 bonus energy!" : "";

      return {
        ...s,
        energy: s.energy - cost + bonusEnergy,
        monstersOnField: newMonsters,
        players: newPlayers,
        selectedMonster: null,
        message: `Defeated the ${MONSTER_NAMES[monsterType]}!${bonusMsg}`,
      };
    });
  }, []);

  const replenishLocations = useCallback(() => {
    setState((s) => {
      if (s.energy < 1) return s;

      const visitedCount = s.activeLocations.filter((l) => l.visited).length;
      const canAdd = visitedCount; // we'll fill up visited slots with new ones

      if (canAdd === 0) {
        return { ...s, message: "No visited locations to replace yet!" };
      }

      // Get locations not yet in activeLocations
      const activeIds = new Set(s.activeLocations.map((l) => l.id));
      const pool = s.allLocations.filter((l) => !activeIds.has(l.id) && !l.visited);

      if (pool.length === 0) {
        return { ...s, message: "No more locations to reveal!" };
      }

      const toAdd = pool.slice(0, canAdd).map((l) => ({ ...l, revealed: true }));
      const newAll = s.allLocations.map((l) => {
        const added = toAdd.find((a) => a.id === l.id);
        return added ? added : l;
      });

      // Replace visited slots with new ones
      let poolIdx = 0;
      const newActive = s.activeLocations.map((l) => {
        if (l.visited && poolIdx < toAdd.length) {
          return toAdd[poolIdx++];
        }
        return l;
      });

      return {
        ...s,
        energy: s.energy - 1,
        activeLocations: newActive,
        allLocations: newAll,
        message: `Revealed ${toAdd.length} new location${toAdd.length > 1 ? "s" : ""}!`,
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    setState((s) => {
      if (s.gameOver) return s;

      const player = s.players[s.currentPlayerIndex];
      const nextPlayerIndex = (s.currentPlayerIndex + 1) % s.players.length;
      const isLastPlayer = nextPlayerIndex === 0;

      // Shield blocks monster (only relevant when last player ends turn)
      if (player.shieldActive && isLastPlayer) {
        const updatedPlayer: Player = { ...player, shieldActive: false };
        const newPlayers = s.players.map((p, i) =>
          i === s.currentPlayerIndex ? updatedPlayer : p
        );
        const nextName = s.players[nextPlayerIndex].name;
        return {
          ...s,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
          energy: s.maxEnergy,
          turn: s.turn + 1,
          selectedLocation: null,
          selectedMonster: null,
          message: `Shield blocked the monster! ${nextName}'s turn.`,
        };
      }

      // If not last player, just pass to next player — no monster spawn yet
      if (!isLastPlayer) {
        const updatedPlayer: Player = { ...player, shieldActive: false };
        const newPlayers = s.players.map((p, i) =>
          i === s.currentPlayerIndex ? updatedPlayer : p
        );
        const nextName = s.players[nextPlayerIndex].name;
        return {
          ...s,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
          energy: s.maxEnergy,
          selectedLocation: null,
          selectedMonster: null,
          message: `${nextName}'s turn!`,
        };
      }

      // Last player ended turn — spawn a monster
      const monsterTypes = Object.keys(s.monsterDeck) as MonsterType[];
      let spawned: Monster | null = null;
      let newDeck = { ...s.monsterDeck };
      const onField = new Set(s.monstersOnField.map((m) => m.type));

      const candidates = shuffle(monsterTypes).filter(
        (t) => newDeck[t] > 0 && !onField.has(t)
      );
      if (candidates.length > 0) {
        const type = candidates[0];
        newDeck[type]--;
        spawned = { type, name: MONSTER_NAMES[type], strength: MONSTER_STRENGTH[type] };
      }

      const newMonsters = spawned ? [...s.monstersOnField, spawned] : s.monstersOnField;

      // Check lose condition
      if (newMonsters.length >= 6) {
        return {
          ...s,
          monsterDeck: newDeck,
          monstersOnField: newMonsters,
          gameOver: true,
          won: false,
          message: "Game Over! The monsters have overwhelmed you!",
        };
      }

      const noNewTypes = monsterTypes.every((t) => onField.has(t) || newDeck[t] === 0);
      if (!spawned && noNewTypes) {
        return {
          ...s,
          monsterDeck: newDeck,
          gameOver: true,
          won: false,
          message: "Game Over! No more monsters can spawn.",
        };
      }

      const updatedPlayer: Player = { ...player, shieldActive: false };
      const newPlayers = s.players.map((p, i) =>
        i === s.currentPlayerIndex ? updatedPlayer : p
      );
      const nextName = s.players[nextPlayerIndex].name;
      const spawnMsg = spawned ? `A ${spawned.name} appeared! ` : "";

      return {
        ...s,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        monsterDeck: newDeck,
        monstersOnField: newMonsters,
        energy: s.maxEnergy,
        turn: s.turn + 1,
        selectedLocation: null,
        selectedMonster: null,
        phase: "action",
        message: `${spawnMsg}${nextName}'s turn!`,
      };
    });
  }, []);

  const useItem = useCallback((item: Item) => {
    setState((s) => {
      const player = s.players[s.currentPlayerIndex];
      const idx = player.inventory.findIndex((i) => i.id === item.id);
      if (idx === -1) return s;

      let newInventory = [...player.inventory];
      let newEnergy = s.energy;
      let newSword = player.activeSword;
      let newPickaxe = player.activePickaxe;
      let newShield = player.shieldActive;
      let msg = "";

      if (item.type === "food") {
        newInventory.splice(idx, 1);
        newEnergy = Math.min(s.maxEnergy, s.energy + FOOD_ENERGY_GAIN);
        msg = `Ate food! +${FOOD_ENERGY_GAIN} energy.`;
      } else if (item.type === "shield") {
        newInventory.splice(idx, 1);
        newShield = true;
        msg = "Shield raised! Next monster spawn blocked.";
      } else if (item.type === "sword") {
        // Activate sword - keep in inventory but mark as active
        newSword = item;
        msg = `${item.quality !== "basic" ? item.quality + " " : ""}Sword equipped! Fight cost reduced.`;
      } else if (item.type === "pickaxe") {
        newPickaxe = item;
        msg = `${item.quality !== "basic" ? item.quality + " " : ""}Pickaxe equipped! Travel cost reduced.`;
      }

      const updatedPlayer: Player = {
        ...player,
        inventory: newInventory,
        activeSword: newSword,
        activePickaxe: newPickaxe,
        shieldActive: newShield,
      };
      const newPlayers = s.players.map((p, i) =>
        i === s.currentPlayerIndex ? updatedPlayer : p
      );

      return {
        ...s,
        energy: newEnergy,
        players: newPlayers,
        message: msg,
      };
    });
  }, []);

  // Helper: remove chest items from team inventory
  function consumeChestItems(s: GameState, chest: Chest): Player[] {
    let newPlayers = s.players.map((p) => ({ ...p, inventory: [...p.inventory] }));
    let removed1 = false;
    let removed2 = false;
    newPlayers = newPlayers.map((p) => {
      const inv = [...p.inventory];
      if (!removed1) {
        const i1 = inv.findIndex((i) => i.type === chest.item1);
        if (i1 > -1) { inv.splice(i1, 1); removed1 = true; }
      }
      if (!removed2) {
        const i2 = inv.findIndex((i) => i.type === chest.item2);
        if (i2 > -1) { inv.splice(i2, 1); removed2 = true; }
      }
      return { ...p, inventory: inv };
    });
    return newPlayers;
  }

  const fillChest = useCallback((chestId: string) => {
    setState((s) => {
      const chest = s.chests.find((c) => c.id === chestId);
      if (!chest || chest.filled) return s;

      const allInventory = s.players.flatMap((p) => p.inventory);
      const hasItem1 = allInventory.some((i) => i.type === chest.item1);
      const hasItem2 = allInventory.some((i) => i.type === chest.item2);

      if (!hasItem1 || !hasItem2) {
        return {
          ...s,
          message: `Need ${ITEM_NAMES[chest.item1]} and ${ITEM_NAMES[chest.item2]} (from any player)!`,
        };
      }

      // Consume items from team inventory
      const newPlayers = consumeChestItems(s, chest);

      if (s.monstersOnField.length > 0) {
        // Pause and ask player to pick which monster to defeat
        return {
          ...s,
          players: newPlayers,
          pendingChestDefeat: chestId,
          message: "Chest loaded! Choose which monster to defeat.",
        };
      }

      // No monsters — complete chest immediately
      const newChests = s.chests.map((c) => c.id === chestId ? { ...c, filled: true } : c);
      const newFilled = s.filledChests + 1;
      if (newFilled >= s.totalChests) {
        return { ...s, players: newPlayers, chests: newChests, filledChests: newFilled, gameOver: true, won: true, message: "VICTORY! All chests filled!" };
      }
      return { ...s, players: newPlayers, chests: newChests, filledChests: newFilled, message: `Chest filled! ${newFilled}/${s.totalChests} complete.` };
    });
  }, []);

  const confirmChestDefeat = useCallback((monsterType: MonsterType) => {
    setState((s) => {
      if (!s.pendingChestDefeat) return s;
      const chestId = s.pendingChestDefeat;

      // Remove the chosen monster from the field
      const newMonsters = s.monstersOnField.filter((m) => m.type !== monsterType);

      // Mark the chest as filled
      const newChests = s.chests.map((c) => c.id === chestId ? { ...c, filled: true } : c);
      const newFilled = s.filledChests + 1;

      if (newFilled >= s.totalChests) {
        return { ...s, monstersOnField: newMonsters, chests: newChests, filledChests: newFilled, pendingChestDefeat: null, gameOver: true, won: true, message: "VICTORY! All chests filled!" };
      }

      return {
        ...s,
        monstersOnField: newMonsters,
        chests: newChests,
        filledChests: newFilled,
        pendingChestDefeat: null,
        message: `Defeated the ${MONSTER_NAMES[monsterType]} with your chest! ${newFilled}/${s.totalChests} chests filled.`,
      };
    });
  }, []);

  const skipChestDefeat = useCallback(() => {
    setState((s) => {
      if (!s.pendingChestDefeat) return s;
      const chestId = s.pendingChestDefeat;
      const newChests = s.chests.map((c) => c.id === chestId ? { ...c, filled: true } : c);
      const newFilled = s.filledChests + 1;
      if (newFilled >= s.totalChests) {
        return { ...s, chests: newChests, filledChests: newFilled, pendingChestDefeat: null, gameOver: true, won: true, message: "VICTORY!" };
      }
      return { ...s, chests: newChests, filledChests: newFilled, pendingChestDefeat: null, message: `Chest filled! ${newFilled}/${s.totalChests} complete.` };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState(2));
  }, []);

  const startGame = useCallback((playerCount: number) => {
    setState(createInitialState(playerCount));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        travelToLocation,
        defeatMonster,
        replenishLocations,
        endTurn,
        useItem,
        putInChest: () => {},
        selectLocation,
        selectMonster,
        fillChest,
        confirmChestDefeat,
        skipChestDefeat,
        resetGame,
        startGame,
        canTravel,
        canDefeat,
        currentPlayer,
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
