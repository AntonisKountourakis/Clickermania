"use client"

import { Brain, Skull, Users, WormIcon as Virus, FlaskRoundIcon as Flask, Biohazard, Zap } from "lucide-react"
import YouTubeStyleClickerTemplate from "./youtube-style-clicker-template"

export default function YouTubeStyleZombieClicker() {
  // Define basic upgrades
  const basicUpgrades = [
    {
      id: "shambling_gait",
      name: "Shambling Gait",
      description: "Move faster to catch victims",
      basePrice: 10,
      priceMultiplier: 1.15,
      effect: 0.1,
      maxLevel: 0,
      count: 0,
      icon: <Zap className="h-4 w-4 text-red-500" />,
    },
    {
      id: "rotten_teeth",
      name: "Rotten Teeth",
      description: "Bite harder, get more brains",
      basePrice: 50,
      priceMultiplier: 1.15,
      effect: 0.5,
      maxLevel: 0,
      count: 0,
      icon: <Skull className="h-4 w-4 text-red-500" />,
    },
    {
      id: "zombie_friend",
      name: "Zombie Friend",
      description: "Convert humans to join your cause",
      basePrice: 200,
      priceMultiplier: 1.15,
      effect: 2,
      maxLevel: 0,
      count: 0,
      icon: <Users className="h-4 w-4 text-red-500" />,
    },
    {
      id: "zombie_horde",
      name: "Zombie Horde",
      description: "Strength in numbers",
      basePrice: 1000,
      priceMultiplier: 1.15,
      effect: 10,
      maxLevel: 0,
      count: 0,
      icon: <Users className="h-4 w-4 text-red-500" />,
    },
  ]

  // Define advanced upgrades
  const advancedUpgrades = [
    {
      id: "toxic_waste",
      name: "Toxic Waste",
      description: "Create more zombies faster",
      basePrice: 5000,
      priceMultiplier: 1.3,
      effect: 0.5,
      maxLevel: 5,
      count: 0,
      icon: <Flask className="h-4 w-4 text-green-500" />,
      unlockRequirement: {
        id: "zombie_horde",
        level: 5,
      },
    },
    {
      id: "zombie_virus",
      name: "Zombie Virus",
      description: "Airborne infection",
      basePrice: 25000,
      priceMultiplier: 1.4,
      effect: 0.75,
      maxLevel: 3,
      count: 0,
      icon: <Virus className="h-4 w-4 text-green-500" />,
      unlockRequirement: {
        id: "toxic_waste",
        level: 2,
      },
    },
    {
      id: "apocalypse",
      name: "Apocalypse",
      description: "The end of humanity is near",
      basePrice: 100000,
      priceMultiplier: 1.5,
      effect: 1.5,
      maxLevel: 1,
      count: 0,
      icon: <Biohazard className="h-4 w-4 text-red-500" />,
      unlockRequirement: {
        id: "zombie_virus",
        level: 2,
      },
    },
  ]

  // Define milestones
  const milestones = [
    {
      name: "Fresh Zombie",
      threshold: 0,
      icon: "🧟",
    },
    {
      name: "Evolved Zombie",
      threshold: 100,
      icon: "🧟‍♂️",
    },
    {
      name: "Zombie Leader",
      threshold: 1000,
      icon: "🧠",
    },
    {
      name: "Zombie Master",
      threshold: 10000,
      icon: "☣️",
    },
    {
      name: "Zombie King",
      threshold: 100000,
      icon: "👑",
    },
    {
      name: "Zombie Overlord",
      threshold: 1000000,
      icon: "🌍",
    },
  ]

  // Define click messages
  const clickMessages = [
    "Braaains!",
    "Hungry!",
    "Fresh meat!",
    "Grrrr!",
    "Uuuuugh!",
    "Nom nom!",
    "Tasty!",
    "More brains!",
    "Apocalypse!",
    "Infection!",
  ]

  return (
    <YouTubeStyleClickerTemplate
      gameId="zombie-clicker"
      gameTitle="Zombie Outbreak"
      gameDescription="Survive the apocalypse and build your zombie empire"
      mainStatName="Brains"
      mainStatIcon={<Brain className="h-5 w-5 text-red-500" />}
      secondaryStatName="Infection Level"
      secondaryStatIcon={<Virus className="h-5 w-5 text-green-500" />}
      backgroundClassName="bg-gradient-to-b from-gray-900 to-gray-800"
      headerGradientClassName="bg-gradient-to-r from-red-900 to-red-700"
      buttonGradientClassName="bg-gradient-to-r from-red-800 to-red-600"
      textColorClassName="text-red-500"
      accentColorClassName="text-red-400"
      basicUpgrades={basicUpgrades}
      advancedUpgrades={advancedUpgrades}
      milestones={milestones}
      clickMessages={clickMessages}
    />
  )
}
