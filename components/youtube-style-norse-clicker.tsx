"use client"

import { Hammer, Axe, Shield, Sword, Castle, Ship, Skull, Trophy, Crown, Feather } from "lucide-react"
import YouTubeStyleClickerTemplate from "./youtube-style-clicker-template"

export default function YouTubeStyleNorseClicker() {
  const BASIC_UPGRADES = [
    {
      id: "strength",
      name: "Viking Strength",
      description: "Increase your power to earn more glory",
      basePrice: 15,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 50,
      count: 0,
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
      count: 0,
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
      count: 0,
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
      count: 0,
      icon: <Castle className="h-4 w-4 mr-1" />,
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
      count: 0,
      icon: <Skull className="h-4 w-4 mr-1" />,
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
      count: 0,
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
      count: 0,
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
      count: 0,
      icon: <Shield className="h-4 w-4 mr-1" />,
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
      count: 0,
      icon: <Crown className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "feasts", level: 15 },
    },
  ]

  const MILESTONES = [
    { name: "Viking", threshold: 0, icon: "⚔️" },
    { name: "Warrior", threshold: 100, icon: "🔪" },
    { name: "Raider", threshold: 500, icon: "🛡️" },
    { name: "Berserker", threshold: 2000, icon: "🪓" },
    { name: "Jarl", threshold: 10000, icon: "👑" },
    { name: "Thane", threshold: 50000, icon: "🏰" },
    { name: "King", threshold: 200000, icon: "⚡" },
    { name: "Legend", threshold: 1000000, icon: "🌟" },
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

  // Custom grid section for runes
  const runesGrid = (
    <div className="content-grid mb-4">
      {["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ"].map((rune, i) => (
        <div key={i} className="content-item">
          <div className="content-icon">{rune}</div>
          <div className="content-count">{i + 1}</div>
        </div>
      ))}
    </div>
  )

  return (
    <YouTubeStyleClickerTemplate
      gameId="norse-clicker"
      gameTitle="Norse Saga"
      gameDescription="Lead your Vikings to glory and conquest!"
      mainStatName="Glory"
      mainStatIcon={<Trophy className="h-5 w-5 mr-2 text-yellow-500" />}
      secondaryStatName="Warriors"
      secondaryStatIcon={<Sword className="h-4 w-4 mr-1 text-gray-300" />}
      backgroundClassName="norse-bg"
      headerGradientClassName="bg-gradient-to-r from-gray-800 to-slate-700"
      buttonGradientClassName="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950"
      textColorClassName="text-white"
      accentColorClassName="text-amber-300"
      basicUpgrades={BASIC_UPGRADES}
      advancedUpgrades={ADVANCED_UPGRADES}
      milestones={MILESTONES}
      clickMessages={BATTLE_MESSAGES}
      customGridComponent={runesGrid}
    />
  )
}
