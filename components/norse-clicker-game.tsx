"use client"
import { Hammer, MountainSnow, Axe, Sword, Shield, Flame, Trophy, Ship, Feather, Crown } from "lucide-react"
import { UnifiedClickerTemplate } from "./unified-clicker-template"
import "../app/games/norse-clicker/norse-clicker.css"

const UPGRADES = [
  {
    id: "strength",
    name: "Viking Strength",
    description: "Increase your power to earn more glory",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Axe className="h-4 w-4 mr-1" />,
  },
  {
    id: "warriors",
    name: "Warrior Band",
    description: "Recruit warriors to fight for glory automatically",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Sword className="h-4 w-4 mr-1" />,
  },
  {
    id: "weapons",
    name: "Weapon Forge",
    description: "Craft better weapons for your warriors",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Hammer className="h-4 w-4 mr-1" />,
  },
  {
    id: "feasts",
    name: "Feasting Hall",
    description: "Host feasts to boost warrior morale",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Flame className="h-4 w-4 mr-1" />,
  },
]

const ADVANCED_UPGRADES = [
  {
    id: "berserker",
    name: "Berserker Rage",
    description: "Unlock the ferocious power of berserkers",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2,
    maxLevel: 10,
    icon: <Shield className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "strength", level: 10 },
  },
  {
    id: "longships",
    name: "Longship Fleet",
    description: "Build a fleet for raiding distant shores",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3,
    maxLevel: 5,
    icon: <Ship className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "warriors", level: 15 },
  },
  {
    id: "runes",
    name: "Runic Magic",
    description: "Harness the power of ancient runes",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4,
    maxLevel: 3,
    icon: <Feather className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "weapons", level: 15 },
  },
  {
    id: "conquest",
    name: "Territorial Conquest",
    description: "Conquer new lands for your growing empire",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5,
    maxLevel: 3,
    icon: <MountainSnow className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "feasts", level: 10 },
  },
  {
    id: "valhalla",
    name: "Valhalla's Blessing",
    description: "Receive the blessing of the gods themselves",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0,
    maxLevel: 1,
    icon: <Crown className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "feasts", level: 15 },
  },
]

const BATTLE_MESSAGES = [
  "⚔️ Victory!",
  "🔥 Raiding party!",
  "🛡️ Shield wall!",
  "🪓 Battle cry!",
  "⚡ Thor's might!",
  "🏰 Conquest!",
  "💪 For glory!",
  "🧙‍♂️ Odin favors you!",
]

const NORSE_RANKS = [
  { name: "Viking", threshold: 0, icon: "⚔️" },
  { name: "Warrior", threshold: 100, icon: "🔪" },
  { name: "Raider", threshold: 500, icon: "🛡️" },
  { name: "Berserker", threshold: 2000, icon: "🪓" },
  { name: "Jarl", threshold: 10000, icon: "👑" },
  { name: "Thane", threshold: 50000, icon: "🏰" },
  { name: "King", threshold: 200000, icon: "⚡" },
  { name: "Legend", threshold: 1000000, icon: "🌟" },
]

export default function NorseClickerGame() {
  return (
    <UnifiedClickerTemplate
      settings={{
        name: "Norse Saga",
        description: "Lead your Vikings to glory and conquest!",
        storageKey: "norse-clicker-progress",
        mainStatName: "Glory",
        mainStatIcon: Trophy,
        secondaryStatName: "Warriors",
        clickButtonText: "BATTLE!",
        clickButtonIcon: <Axe className="h-8 w-8 mr-4" />,
        backgroundClass: "norse-bg",
        headerGradientClass: "bg-gradient-to-r from-gray-800 to-slate-700",
        buttonGradientClass: "bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950",
        textColorClass: "text-amber-300",
        accentColorClass: "text-amber-500",
        clickMessages: BATTLE_MESSAGES,
        ranks: NORSE_RANKS,
        upgrades: UPGRADES,
        advancedUpgrades: ADVANCED_UPGRADES,
      }}
      initialStats={{
        mainStat: 0,
        clickPower: 1,
        autoGeneration: 0,
        multiplier1: 1,
        multiplier2: 1,
        upgrades: {},
        streak: 0,
        achievements: [],
      }}
      renderCustomCollection={(stats) => (
        <div className="runes-grid mb-4 grid grid-cols-4 gap-2">
          {["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ"].map((rune, i) => (
            <div key={i} className="rune-item bg-gray-800/30 rounded-md p-2 text-center">
              <div className="rune-symbol text-xl">{rune}</div>
              <div className="rune-name text-xs text-gray-300">Rune {i + 1}</div>
            </div>
          ))}
        </div>
      )}
    />
  )
}
