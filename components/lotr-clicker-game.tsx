"use client"

import { BellRingIcon as Ring, Sword, Castle, Shield, Book, Scroll, Eye, Sun } from "lucide-react"
import YouTubeStyleClickerTemplate from "./youtube-style-clicker-template"

export default function YouTubeStyleLOTRClicker() {
  const BASIC_UPGRADES = [
    {
      id: "ring_power",
      name: "Ring Power",
      description: "Increase the power of the One Ring",
      basePrice: 15,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 50,
      count: 0,
      icon: <Ring className="h-4 w-4 mr-1" />,
    },
    {
      id: "fellowship",
      name: "Fellowship",
      description: "Recruit companions to generate power automatically",
      basePrice: 30,
      priceMultiplier: 1.7,
      effect: 0.5,
      maxLevel: 50,
      count: 0,
      icon: <Shield className="h-4 w-4 mr-1" />,
    },
    {
      id: "weapons",
      name: "Legendary Weapons",
      description: "Acquire powerful weapons of Middle-earth",
      basePrice: 100,
      priceMultiplier: 1.8,
      effect: 3,
      maxLevel: 30,
      count: 0,
      icon: <Sword className="h-4 w-4 mr-1" />,
    },
    {
      id: "strongholds",
      name: "Strongholds",
      description: "Establish safe havens across Middle-earth",
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
      id: "mithril",
      name: "Mithril Armor",
      description: "Craft armor from the legendary metal of Moria",
      basePrice: 2000,
      priceMultiplier: 2.2,
      effect: 0.2,
      maxLevel: 10,
      count: 0,
      icon: <Shield className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "ring_power", level: 10 },
    },
    {
      id: "palantir",
      name: "Palantír",
      description: "Use the seeing stones to gain knowledge and power",
      basePrice: 5000,
      priceMultiplier: 2.3,
      effect: 0.3,
      maxLevel: 5,
      count: 0,
      icon: <Eye className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "fellowship", level: 15 },
    },
    {
      id: "ancient_lore",
      name: "Ancient Lore",
      description: "Discover forgotten knowledge in ancient texts",
      basePrice: 10000,
      priceMultiplier: 2.5,
      effect: 0.4,
      maxLevel: 3,
      count: 0,
      icon: <Book className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "weapons", level: 15 },
    },
    {
      id: "alliance",
      name: "Alliance of Free Peoples",
      description: "Unite the races of Middle-earth against darkness",
      basePrice: 25000,
      priceMultiplier: 3.0,
      effect: 0.5,
      maxLevel: 3,
      count: 0,
      icon: <Scroll className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "strongholds", level: 10 },
    },
    {
      id: "white_council",
      name: "The White Council",
      description: "Summon the most powerful beings in Middle-earth",
      basePrice: 50000,
      priceMultiplier: 3.5,
      effect: 1.0,
      maxLevel: 1,
      count: 0,
      icon: <Sun className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "strongholds", level: 15 },
    },
  ]

  const MILESTONES = [
    { name: "Hobbit", threshold: 0, icon: "🍃" },
    { name: "Ranger", threshold: 100, icon: "🏹" },
    { name: "Warrior", threshold: 500, icon: "⚔️" },
    { name: "Knight", threshold: 2000, icon: "🛡️" },
    { name: "Captain", threshold: 5000, icon: "🏰" },
    { name: "Lord", threshold: 10000, icon: "👑" },
    { name: "King", threshold: 25000, icon: "🔱" },
    { name: "Wizard", threshold: 50000, icon: "🧙" },
    { name: "Maiar", threshold: 100000, icon: "✨" },
    { name: "Valar", threshold: 250000, icon: "⭐" },
  ]

  const LOTR_MESSAGES = [
    "One Ring to rule them all!",
    "My precious!",
    "You shall not pass!",
    "A wizard is never late!",
    "Not all who wander are lost!",
    "The eagles are coming!",
    "It's the deep breath before the plunge!",
    "Even the smallest person can change the course of the future!",
  ]

  // Custom grid section for Middle-earth locations
  const middleEarthGrid = (
    <div className="content-grid mb-4">
      {["🏔️", "🌋", "🏰", "🌲", "🏞️", "⚔️", "🧝", "🧙"].map((location, i) => (
        <div key={i} className="content-item">
          <div className="content-icon">{location}</div>
          <div className="content-count">{i + 1}</div>
        </div>
      ))}
    </div>
  )

  return (
    <YouTubeStyleClickerTemplate
      gameId="lotr-clicker"
      gameTitle="Lord of the Rings"
      gameDescription="Journey through Middle-earth and harness the power of the One Ring!"
      mainStatName="Power"
      mainStatIcon={<Ring className="h-5 w-5 mr-2 text-yellow-500" />}
      secondaryStatName="Allies"
      secondaryStatIcon={<Shield className="h-4 w-4 mr-1 text-gray-300" />}
      backgroundClassName="lotr-bg"
      headerGradientClassName="bg-gradient-to-r from-amber-900 to-yellow-700"
      buttonGradientClassName="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600"
      textColorClassName="text-white"
      accentColorClassName="text-yellow-300"
      basicUpgrades={BASIC_UPGRADES}
      advancedUpgrades={ADVANCED_UPGRADES}
      milestones={MILESTONES}
      clickMessages={LOTR_MESSAGES}
      customGridComponent={middleEarthGrid}
    />
  )
}
