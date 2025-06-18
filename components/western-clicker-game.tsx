"use client"

import {
  RocketIcon as Revolver,
  SaladIcon as Saloon,
  DogIcon as Horse,
  BugIcon as Wanted,
  Swords,
  Scroll,
  Trophy,
} from "lucide-react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"
import { ResponsiveGameLayout } from "@/components/responsive-game-layout"
import { getTouchTargetSize } from "@/utils/mobile-optimization"
import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Utility function to format numbers
const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number)
}

export default function WesternClickerUnified() {
  // State variables
  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)

  // Western quotes
  const westernQuotes = [
    "Howdy, partner!",
    "This town ain't big enough for the both of us.",
    "Reach for the sky!",
    "There's a new sheriff in town.",
    "It's high noon.",
  ]
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  // Ορισμός των βασικών αναβαθμίσεων
  const upgrades = [
    {
      id: "shooting_skill",
      name: "Shooting Skill",
      description: "Improve your aim and shooting speed",
      basePrice: 15,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 50,
      icon: <Revolver className="h-4 w-4 mr-1" />,
    },
    {
      id: "deputies",
      name: "Deputies",
      description: "Hire deputies to help you maintain law and order",
      basePrice: 30,
      priceMultiplier: 1.7,
      effect: 0.5,
      maxLevel: 50,
      icon: <Wanted className="h-4 w-4 mr-1" />,
    },
    {
      id: "horses",
      name: "Horses",
      description: "Better horses for faster travel and pursuit",
      basePrice: 100,
      priceMultiplier: 1.8,
      effect: 3,
      maxLevel: 30,
      icon: <Horse className="h-4 w-4 mr-1" />,
    },
    {
      id: "saloon",
      name: "Saloon Reputation",
      description: "Increase your reputation in town",
      basePrice: 250,
      priceMultiplier: 2.0,
      effect: 5,
      maxLevel: 20,
      icon: <Saloon className="h-4 w-4 mr-1" />,
    },
  ]

  // Ορισμός των προχωρημένων αναβαθμίσεων
  const advancedUpgrades = [
    {
      id: "legendary_revolver",
      name: "Legendary Revolver",
      description: "A custom-made revolver with incredible accuracy",
      basePrice: 2000,
      priceMultiplier: 2.2,
      effect: 0.2,
      maxLevel: 10,
      icon: <Revolver className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "shooting_skill", level: 10 },
    },
    {
      id: "posse",
      name: "Posse Formation",
      description: "Form a posse of skilled gunslingers",
      basePrice: 5000,
      priceMultiplier: 2.3,
      effect: 0.3,
      maxLevel: 5,
      icon: <Wanted className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "deputies", level: 15 },
    },
    {
      id: "duel_mastery",
      name: "Duel Mastery",
      description: "Become unbeatable in quick-draw duels",
      basePrice: 10000,
      priceMultiplier: 2.5,
      effect: 0.4,
      maxLevel: 3,
      icon: <Swords className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "shooting_skill", level: 20 },
    },
    {
      id: "town_ownership",
      name: "Town Ownership",
      description: "Take control of the entire town",
      basePrice: 25000,
      priceMultiplier: 3.0,
      effect: 0.5,
      maxLevel: 3,
      icon: <Saloon className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "saloon", level: 10 },
    },
    {
      id: "legend_of_the_west",
      name: "Legend of the West",
      description: "Your name becomes legendary throughout the frontier",
      basePrice: 50000,
      priceMultiplier: 3.5,
      effect: 1.0,
      maxLevel: 1,
      icon: <Scroll className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "horses", level: 15 },
    },
  ]

  // Μηνύματα για τα εφέ κλικ
  const clickMessages = [
    "BANG!",
    "WANTED!",
    "BOUNTY!",
    "BULLSEYE!",
    "OUTLAW DOWN!",
    "SHOWDOWN!",
    "QUICK DRAW!",
    "SHOOTOUT!",
    "GOLD RUSH!",
    "JACKPOT!",
  ].map((text) => ({ text }))

  // Βαθμίδες/επίπεδα
  const ranks = [
    { name: "Greenhorn", threshold: 0 },
    { name: "Ranch Hand", threshold: 100 },
    { name: "Cowboy", threshold: 500 },
    { name: "Deputy", threshold: 1000 },
    { name: "Sheriff", threshold: 5000 },
    { name: "Gunslinger", threshold: 10000 },
    { name: "Bounty Hunter", threshold: 25000 },
    { name: "Marshal", threshold: 50000 },
    { name: "Outlaw", threshold: 100000 },
    { name: "Legend of the West", threshold: 250000 },
  ]

  // Ρυθμίσεις παιχνιδιού για το νέο UnifiedClickerTemplate
  const settings = {
    name: "Wild West Clicker",
    description: "Become a legend of the Wild West!",
    storageKey: "western-clicker-progress",
    mainStatName: "Bounty",
    mainStatIcon: Trophy,
    secondaryStatName: "Shooting Power",
    clickButtonText: "DRAW!",
    clickButtonIcon: <Revolver className="h-8 w-8 mr-4" />,
    backgroundClass: "western-bg",
    headerGradientClass: "bg-gradient-to-r from-amber-900 to-red-900",
    buttonGradientClass: "bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800",
    textColorClass: "text-amber-300",
    accentColorClass: "text-red-500",
    clickMessages,
    ranks,
    upgrades,
    advancedUpgrades,
  }

  // Αρχικά στατιστικά
  const initialStats = {
    mainStat: 0,
    clickPower: 1,
    autoGeneration: 0,
    multiplier1: 1,
    multiplier2: 1,
    upgrades: {},
    streak: 0,
    achievements: [],
  }

  // Προσθήκη mobile optimization hooks
  const { isMobile, reducedAnimations, touchOptimized } = useMobileOptimization()
  const touchTargetSize = getTouchTargetSize()

  // Responsive styles για κινητές συσκευές
  const mobileStyles = isMobile
    ? {
        buttonSize: {
          minHeight: `${touchTargetSize}px`,
          fontSize: "1.1rem",
          padding: "0.75rem 1rem",
        },
        gridCols: "grid-cols-2",
        cardPadding: "p-2",
        textSize: "text-sm",
      }
    : {
        buttonSize: {},
        gridCols: "grid-cols-4",
        cardPadding: "p-4",
        textSize: "text-base",
      }

  // Upgrade levels state
  const [upgradeLevel, setUpgradeLevel] = useState<{ [key: string]: number }>({})

  // Function to handle clicking
  const handleClick = () => {
    setScore((prevScore) => prevScore + clickPower)
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % westernQuotes.length)
  }

  // Function to calculate upgrade price
  const getUpgradePrice = (upgrade: any) => {
    const level = upgradeLevel[upgrade.id] || 0
    return Math.ceil(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, level))
  }

  // Function to handle buying upgrades
  const handleUpgrade = (upgrade: any) => {
    const price = getUpgradePrice(upgrade)
    if (score >= price && (upgradeLevel[upgrade.id] || 0) < upgrade.maxLevel) {
      setScore((prevScore) => prevScore - price)
      setUpgradeLevel((prevLevels) => ({
        ...prevLevels,
        [upgrade.id]: (prevLevels[upgrade.id] || 0) + 1,
      }))
      setClickPower((prevPower) => prevPower + upgrade.effect)
    }
  }

  // Function to check if advanced upgrade is unlocked
  const isUpgradeUnlocked = (upgrade: any) => {
    if (!upgrade.unlockRequirement) return true
    return (upgradeLevel[upgrade.unlockRequirement.id] || 0) >= upgrade.unlockRequirement.level
  }

  // Check if there are any advanced upgrades
  const hasAdvancedUpgrades = advancedUpgrades.length > 0

  // Determine current rank
  const getCurrentRank = () => {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (score >= ranks[i].threshold) {
        return ranks[i]
      }
    }
    return ranks[0]
  }

  const currentRank = getCurrentRank()
  const nextRankThreshold = ranks[ranks.indexOf(currentRank) + 1]?.threshold || Number.POSITIVE_INFINITY

  return (
    <ResponsiveGameLayout
      backgroundClass={`western-bg ${reducedAnimations ? "reduce-animations" : ""}`}
      className="min-h-screen"
    >
      <Card className={`w-full max-w-md mx-auto shadow-md backdrop-blur-lg ${isMobile ? "mobile-card" : ""}`}>
        <CardHeader className="bg-gradient-to-r from-amber-900 to-red-900">
          <CardTitle className="text-2xl font-bold text-center text-white">Wild West Clicker</CardTitle>
          <CardDescription className="text-center text-white/80">Become a legend of the Wild West!</CardDescription>
        </CardHeader>
        <CardContent className={`${mobileStyles.cardPadding}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-amber-500" />
              <p className="text-lg font-bold">Bounty: {formatNumber(score)}</p>
            </div>
            <div className="flex items-center">
              <Revolver className="h-5 w-5 mr-2 text-amber-500" />
              <p className="text-lg">Power: {formatNumber(clickPower)}</p>
            </div>
          </div>

          <div className="wanted-poster mb-4 p-3">
            <p className={`western-quote ${mobileStyles.textSize}`}>"{westernQuotes[currentQuoteIndex]}"</p>
          </div>

          <Button
            onClick={handleClick}
            className={`w-full shoot-button bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800 ${touchOptimized ? "touch-optimized" : ""}`}
            style={mobileStyles.buttonSize}
          >
            <Revolver className="h-6 w-6 mr-2" />
            DRAW!
          </Button>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className={`font-semibold ${mobileStyles.textSize}`}>Reputation</p>
              <p className={`reputation-label ${mobileStyles.textSize}`}>{currentRank.name}</p>
            </div>
            <div className="reputation-progress">
              <div
                className="reputation-progress-fill"
                style={{ width: `${Math.min((score / nextRankThreshold) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className={`font-semibold mb-2 ${mobileStyles.textSize}`}>Locations</h3>
            <div className={`locations-grid ${mobileStyles.gridCols} gap-2`}>
              {upgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`location-item cursor-pointer ${
                    score >= getUpgradePrice(upgrade) ? "hover:bg-amber-700/20" : "opacity-70"
                  }`}
                  onClick={() => handleUpgrade(upgrade)}
                >
                  <div className="location-icon">{upgrade.icon}</div>
                  <div className={`font-medium ${mobileStyles.textSize}`}>{upgrade.name}</div>
                  <div className={`location-count ${mobileStyles.textSize}`}>
                    Lvl {upgradeLevel[upgrade.id] || 0}/{upgrade.maxLevel}
                  </div>
                  <div className={`text-amber-500 ${mobileStyles.textSize}`}>
                    {formatNumber(getUpgradePrice(upgrade))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasAdvancedUpgrades && (
            <div className="mt-4">
              <h3 className={`font-semibold mb-2 ${mobileStyles.textSize}`}>Advanced</h3>
              <div className={`locations-grid ${mobileStyles.gridCols} gap-2`}>
                {advancedUpgrades
                  .filter((upgrade) => isUpgradeUnlocked(upgrade))
                  .map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className={`location-item cursor-pointer ${
                        score >= getUpgradePrice(upgrade) ? "hover:bg-amber-700/20" : "opacity-70"
                      }`}
                      onClick={() => handleUpgrade(upgrade)}
                    >
                      <div className="location-icon">{upgrade.icon}</div>
                      <div className={`font-medium ${mobileStyles.textSize}`}>{upgrade.name}</div>
                      <div className={`location-count ${mobileStyles.textSize}`}>
                        Lvl {upgradeLevel[upgrade.id] || 0}/{upgrade.maxLevel}
                      </div>
                      <div className={`text-amber-500 ${mobileStyles.textSize}`}>
                        {formatNumber(getUpgradePrice(upgrade))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {clickMessages.length > 0 && (
            <div className="mt-4 relative h-8">
              {clickMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`absolute left-1/2 transform -translate-x-1/2 animate-fadeOut text-amber-500 font-western ${
                    reducedAnimations ? "reduce-animations" : ""
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    top: 0,
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!reducedAnimations && (
        <>
          <div className="dust-particles">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="dust-particle"
                style={{
                  width: `${Math.random() * 5 + 2}px`,
                  height: `${Math.random() * 5 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>
          <div className="old-film-overlay"></div>
          <div className="sepia-filter"></div>
        </>
      )}
    </ResponsiveGameLayout>
  )
}
