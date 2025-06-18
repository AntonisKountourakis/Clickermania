"use client"

import {
  Rocket,
  Orbit,
  Satellite,
  Telescope,
  Star,
  Sparkles,
  Atom,
  Zap,
  Globe,
  SpaceIcon as Planet,
} from "lucide-react"
import YouTubeStyleClickerTemplate from "./youtube-style-clicker-template"

export default function YouTubeStyleSpaceClicker() {
  const BASIC_UPGRADES = [
    {
      id: "exploration",
      name: "Space Exploration",
      description: "Improve your ability to explore the cosmos",
      basePrice: 15,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 50,
      count: 0,
      icon: <Rocket className="h-4 w-4 mr-1" />,
    },
    {
      id: "space_station",
      name: "Space Station",
      description: "Build stations that generate cosmic energy automatically",
      basePrice: 30,
      priceMultiplier: 1.7,
      effect: 0.5,
      maxLevel: 50,
      count: 0,
      icon: <Satellite className="h-4 w-4 mr-1" />,
    },
    {
      id: "telescope",
      name: "Advanced Telescope",
      description: "Discover more celestial bodies in the universe",
      basePrice: 100,
      priceMultiplier: 1.8,
      effect: 3,
      maxLevel: 30,
      count: 0,
      icon: <Telescope className="h-4 w-4 mr-1" />,
    },
    {
      id: "colonization",
      name: "Planet Colonization",
      description: "Establish colonies on distant planets",
      basePrice: 250,
      priceMultiplier: 2.0,
      effect: 5,
      maxLevel: 20,
      count: 0,
      icon: <Planet className="h-4 w-4 mr-1" />,
    },
  ]

  const ADVANCED_UPGRADES = [
    {
      id: "wormhole",
      name: "Wormhole Technology",
      description: "Develop technology to travel through wormholes",
      basePrice: 2000,
      priceMultiplier: 2.2,
      effect: 0.2,
      maxLevel: 10,
      count: 0,
      icon: <Orbit className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "exploration", level: 10 },
    },
    {
      id: "dyson_sphere",
      name: "Dyson Sphere",
      description: "Harness the energy of stars with massive structures",
      basePrice: 5000,
      priceMultiplier: 2.3,
      effect: 0.3,
      maxLevel: 5,
      count: 0,
      icon: <Star className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "space_station", level: 15 },
    },
    {
      id: "quantum_telescope",
      name: "Quantum Telescope",
      description: "See beyond the observable universe",
      basePrice: 10000,
      priceMultiplier: 2.5,
      effect: 0.4,
      maxLevel: 3,
      count: 0,
      icon: <Sparkles className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "telescope", level: 15 },
    },
    {
      id: "terraforming",
      name: "Terraforming Technology",
      description: "Transform hostile planets into habitable worlds",
      basePrice: 25000,
      priceMultiplier: 3.0,
      effect: 0.5,
      maxLevel: 3,
      count: 0,
      icon: <Globe className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "colonization", level: 10 },
    },
    {
      id: "intergalactic_empire",
      name: "Intergalactic Empire",
      description: "Expand your civilization across multiple galaxies",
      basePrice: 50000,
      priceMultiplier: 3.5,
      effect: 1.0,
      maxLevel: 1,
      count: 0,
      icon: <Atom className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "colonization", level: 15 },
    },
  ]

  const MILESTONES = [
    { name: "Space Cadet", threshold: 0, icon: "🚀" },
    { name: "Astronaut", threshold: 100, icon: "👨‍🚀" },
    { name: "Space Explorer", threshold: 500, icon: "🛰️" },
    { name: "Stellar Voyager", threshold: 2000, icon: "🌠" },
    { name: "Galactic Pioneer", threshold: 5000, icon: "🌌" },
    { name: "Cosmic Navigator", threshold: 10000, icon: "🪐" },
    { name: "Interstellar Admiral", threshold: 25000, icon: "⭐" },
    { name: "Nebula Commander", threshold: 50000, icon: "☄️" },
    { name: "Galaxy Conqueror", threshold: 100000, icon: "👽" },
    { name: "Universal Emperor", threshold: 250000, icon: "👑" },
  ]

  const SPACE_MESSAGES = [
    "🚀 New discovery!",
    "🌌 Galaxy explored!",
    "🪐 Planet colonized!",
    "⭐ Star charted!",
    "🌠 Cosmic energy!",
    "🛰️ Station deployed!",
    "🔭 New observation!",
    "👽 Contact made!",
  ]

  // Custom grid section for celestial bodies
  const celestialBodiesGrid = (
    <div className="content-grid mb-4">
      {["🌎", "🌙", "🔴", "🪐", "☀️", "✨", "🌌", "🕳️"].map((body, i) => (
        <div key={i} className="content-item">
          <div className="content-icon">{body}</div>
          <div className="content-count">{i + 1}</div>
        </div>
      ))}
    </div>
  )

  return (
    <YouTubeStyleClickerTemplate
      gameId="space-clicker"
      gameTitle="Space Explorer"
      gameDescription="Explore the cosmos and build your galactic empire!"
      mainStatName="Energy"
      mainStatIcon={<Zap className="h-5 w-5 mr-2 text-purple-500" />}
      secondaryStatName="Discoveries"
      secondaryStatIcon={<Star className="h-4 w-4 mr-1 text-yellow-400" />}
      backgroundClassName="space-bg"
      headerGradientClassName="bg-gradient-to-r from-indigo-900 to-purple-900"
      buttonGradientClassName="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
      textColorClassName="text-white"
      accentColorClassName="text-purple-300"
      basicUpgrades={BASIC_UPGRADES}
      advancedUpgrades={ADVANCED_UPGRADES}
      milestones={MILESTONES}
      clickMessages={SPACE_MESSAGES}
      customGridComponent={celestialBodiesGrid}
    />
  )
}
