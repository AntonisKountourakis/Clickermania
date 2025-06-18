"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Umbrella,
  Plane,
  Hotel,
  Camera,
  CoffeeIcon as Cocktail,
  Map,
  Palmtree,
  Sailboat,
  GlassesIcon as Sunglasses,
  Gift,
  Utensils,
  ShoppingBag,
  Compass,
  Waves,
  SpadeIcon as Spa,
  Mountain,
} from "lucide-react"

// Format large numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US")
}

// Calculate the cost of the next upgrade level
const calculateUpgradeCost = (baseCost: number, level: number, multiplier = 1.5): number => {
  return Math.floor(baseCost * Math.pow(multiplier, level))
}

type HolidayClickerProps = {}

export default function HolidayClicker({}: HolidayClickerProps) {
  // Game state
  const [gameState, setGameState] = useState({
    vacationPoints: 0,
    totalVacationPoints: 0,
    pointsPerClick: 1,
    pointsPerSecond: 0,
    lastUpdated: Date.now(),
    upgrades: {
      sunscreen: { level: 0, baseCost: 10, effect: 1, maxLevel: 10, description: "Protect yourself and click longer" },
      camera: { level: 0, baseCost: 50, effect: 5, maxLevel: 10, description: "Take photos for extra points" },
      cocktails: {
        level: 0,
        baseCost: 200,
        effect: 1,
        maxLevel: 10,
        description: "Relax with cocktails for passive income",
      },
      tourGuide: {
        level: 0,
        baseCost: 500,
        effect: 5,
        maxLevel: 10,
        description: "Hire a tour guide for better experiences",
      },
      luxuryHotel: { level: 0, baseCost: 2000, effect: 25, maxLevel: 10, description: "Upgrade to a luxury hotel" },
      snorkelingGear: {
        level: 0,
        baseCost: 5000,
        effect: 10,
        maxLevel: 8,
        description: "Explore underwater treasures",
      },
      souvenirShop: {
        level: 0,
        baseCost: 7500,
        effect: 15,
        maxLevel: 8,
        description: "Collect mementos from your travels",
      },
      localCuisine: {
        level: 0,
        baseCost: 8000,
        effect: 20,
        maxLevel: 8,
        description: "Taste exotic foods for energy",
      },
      privateBeach: {
        level: 0,
        baseCost: 10000,
        effect: 100,
        maxLevel: 5,
        description: "Enjoy a private beach experience",
      },
      spaTreatment: {
        level: 0,
        baseCost: 15000,
        effect: 50,
        maxLevel: 5,
        description: "Relax and rejuvenate for more points",
      },
      islandHopping: {
        level: 0,
        baseCost: 25000,
        effect: 75,
        maxLevel: 5,
        description: "Visit multiple exotic destinations",
      },
      adventureExcursions: {
        level: 0,
        baseCost: 35000,
        effect: 90,
        maxLevel: 5,
        description: "Thrilling adventures for massive points",
      },
      yacht: { level: 0, baseCost: 50000, effect: 500, maxLevel: 5, description: "Cruise around on a private yacht" },
      privateJet: {
        level: 0,
        baseCost: 250000,
        effect: 2000,
        maxLevel: 3,
        description: "Travel in style with a private jet",
      },
    },
    achievements: {
      // Keep existing achievements
      firstVacation: { unlocked: false, description: "Earn your first vacation point", requirement: 1 },
      beachLover: { unlocked: false, description: "Earn 100 vacation points", requirement: 100 },
      worldTraveler: { unlocked: false, description: "Earn 1,000 vacation points", requirement: 1000 },
      luxuryTraveler: { unlocked: false, description: "Earn 10,000 vacation points", requirement: 10000 },
      jetSetter: { unlocked: false, description: "Earn 100,000 vacation points", requirement: 100000 },
      globeTrotter: { unlocked: false, description: "Earn 1,000,000 vacation points", requirement: 1000000 },
      photographyEnthusiast: { unlocked: false, description: "Upgrade your camera to level 5", requirement: 5 },
      cocktailConnoisseur: { unlocked: false, description: "Upgrade your cocktails to level 5", requirement: 5 },
      luxuryLifestyle: { unlocked: false, description: "Upgrade your luxury hotel to level 5", requirement: 5 },
      yachtLife: { unlocked: false, description: "Purchase a yacht", requirement: 1 },
      privateJetOwner: { unlocked: false, description: "Purchase a private jet", requirement: 1 },
      completeCollection: { unlocked: false, description: "Max out all upgrades", requirement: 1 },
      // Add new achievements for the new upgrades
      underwaterExplorer: { unlocked: false, description: "Upgrade your snorkeling gear to level 5", requirement: 5 },
      souvenirCollector: { unlocked: false, description: "Upgrade your souvenir shop to level 5", requirement: 5 },
      foodie: { unlocked: false, description: "Upgrade your local cuisine to level 5", requirement: 5 },
      spaEnthusiast: { unlocked: false, description: "Upgrade your spa treatment to level 5", requirement: 5 },
      islandExplorer: { unlocked: false, description: "Upgrade your island hopping to level 5", requirement: 5 },
      adventureSeeker: { unlocked: false, description: "Upgrade your adventure excursions to level 5", requirement: 5 },
    },
  })

  const [activeTab, setActiveTab] = useState("upgrades")
  const [showOfflineProgress, setShowOfflineProgress] = useState(false)
  const [offlinePoints, setOfflinePoints] = useState(0)

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("holiday-clicker-progress")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        const now = Date.now()
        const timeDiff = now - parsedState.lastUpdated

        // Calculate offline progress (if more than 5 seconds have passed)
        if (timeDiff > 5000 && parsedState.pointsPerSecond > 0) {
          const earnedPoints = Math.floor((parsedState.pointsPerSecond * timeDiff) / 1000)
          if (earnedPoints > 0) {
            setOfflinePoints(earnedPoints)
            setShowOfflineProgress(true)
            parsedState.vacationPoints += earnedPoints
            parsedState.totalVacationPoints += earnedPoints
          }
        }

        parsedState.lastUpdated = now
        setGameState(parsedState)
      } catch (error) {
        console.error("Failed to parse saved game state:", error)
      }
    }
  }, [])

  // Save game state to localStorage
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(
        "holiday-clicker-progress",
        JSON.stringify({
          ...gameState,
          lastUpdated: Date.now(),
        }),
      )
    }, 10000) // Save every 10 seconds

    return () => clearInterval(saveInterval)
  }, [gameState])

  // Passive income from upgrades
  useEffect(() => {
    const passiveIncomeInterval = setInterval(() => {
      if (gameState.pointsPerSecond > 0) {
        setGameState((prevState) => ({
          ...prevState,
          vacationPoints: prevState.vacationPoints + prevState.pointsPerSecond,
          totalVacationPoints: prevState.totalVacationPoints + prevState.pointsPerSecond,
          lastUpdated: Date.now(),
        }))
      }
    }, 1000) // Update every second

    return () => clearInterval(passiveIncomeInterval)
  }, [gameState.pointsPerSecond])

  // Check achievements
  useEffect(() => {
    let achievementsChanged = false
    const newAchievements = { ...gameState.achievements }

    // Check total points achievements
    if (!newAchievements.firstVacation.unlocked && gameState.totalVacationPoints >= 1) {
      newAchievements.firstVacation.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.beachLover.unlocked && gameState.totalVacationPoints >= 100) {
      newAchievements.beachLover.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.worldTraveler.unlocked && gameState.totalVacationPoints >= 1000) {
      newAchievements.worldTraveler.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.luxuryTraveler.unlocked && gameState.totalVacationPoints >= 10000) {
      newAchievements.luxuryTraveler.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.jetSetter.unlocked && gameState.totalVacationPoints >= 100000) {
      newAchievements.jetSetter.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.globeTrotter.unlocked && gameState.totalVacationPoints >= 1000000) {
      newAchievements.globeTrotter.unlocked = true
      achievementsChanged = true
    }

    // Check upgrade achievements
    if (!newAchievements.photographyEnthusiast.unlocked && gameState.upgrades.camera.level >= 5) {
      newAchievements.photographyEnthusiast.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.cocktailConnoisseur.unlocked && gameState.upgrades.cocktails.level >= 5) {
      newAchievements.cocktailConnoisseur.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.luxuryLifestyle.unlocked && gameState.upgrades.luxuryHotel.level >= 5) {
      newAchievements.luxuryLifestyle.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.yachtLife.unlocked && gameState.upgrades.yacht.level >= 1) {
      newAchievements.yachtLife.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.privateJetOwner.unlocked && gameState.upgrades.privateJet.level >= 1) {
      newAchievements.privateJetOwner.unlocked = true
      achievementsChanged = true
    }

    // Add checks for new upgrade achievements
    if (!newAchievements.underwaterExplorer.unlocked && gameState.upgrades.snorkelingGear.level >= 5) {
      newAchievements.underwaterExplorer.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.souvenirCollector.unlocked && gameState.upgrades.souvenirShop.level >= 5) {
      newAchievements.souvenirCollector.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.foodie.unlocked && gameState.upgrades.localCuisine.level >= 5) {
      newAchievements.foodie.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.spaEnthusiast.unlocked && gameState.upgrades.spaTreatment.level >= 5) {
      newAchievements.spaEnthusiast.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.islandExplorer.unlocked && gameState.upgrades.islandHopping.level >= 5) {
      newAchievements.islandExplorer.unlocked = true
      achievementsChanged = true
    }
    if (!newAchievements.adventureSeeker.unlocked && gameState.upgrades.adventureExcursions.level >= 5) {
      newAchievements.adventureSeeker.unlocked = true
      achievementsChanged = true
    }

    // Check if all upgrades are maxed out
    const allMaxed = Object.values(gameState.upgrades).every((upgrade) => upgrade.level >= upgrade.maxLevel)
    if (!newAchievements.completeCollection.unlocked && allMaxed) {
      newAchievements.completeCollection.unlocked = true
      achievementsChanged = true
    }

    if (achievementsChanged) {
      setGameState((prevState) => ({
        ...prevState,
        achievements: newAchievements,
      }))
    }
  }, [gameState.totalVacationPoints, gameState.upgrades])

  // Handle click on the vacation button
  const handleVacationClick = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      vacationPoints: prevState.vacationPoints + prevState.pointsPerClick,
      totalVacationPoints: prevState.totalVacationPoints + prevState.pointsPerClick,
    }))
  }, [])

  // Handle purchasing an upgrade
  const handleUpgrade = useCallback((upgradeKey: string) => {
    setGameState((prevState) => {
      const upgrade = prevState.upgrades[upgradeKey as keyof typeof prevState.upgrades]
      const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.level)

      if (prevState.vacationPoints >= cost && upgrade.level < upgrade.maxLevel) {
        const newUpgrades = { ...prevState.upgrades }
        newUpgrades[upgradeKey as keyof typeof prevState.upgrades] = {
          ...upgrade,
          level: upgrade.level + 1,
        }

        let newPointsPerClick = prevState.pointsPerClick
        let newPointsPerSecond = prevState.pointsPerSecond

        // Update points per click for click upgrades
        if (
          upgradeKey === "sunscreen" ||
          upgradeKey === "camera" ||
          upgradeKey === "tourGuide" ||
          upgradeKey === "snorkelingGear" ||
          upgradeKey === "souvenirShop" ||
          upgradeKey === "localCuisine"
        ) {
          newPointsPerClick = calculatePointsPerClick(newUpgrades)
        }

        // Update points per second for passive upgrades
        if (
          upgradeKey === "cocktails" ||
          upgradeKey === "luxuryHotel" ||
          upgradeKey === "privateBeach" ||
          upgradeKey === "spaTreatment" ||
          upgradeKey === "islandHopping" ||
          upgradeKey === "adventureExcursions" ||
          upgradeKey === "yacht" ||
          upgradeKey === "privateJet"
        ) {
          newPointsPerSecond = calculatePointsPerSecond(newUpgrades)
        }

        return {
          ...prevState,
          vacationPoints: prevState.vacationPoints - cost,
          pointsPerClick: newPointsPerClick,
          pointsPerSecond: newPointsPerSecond,
          upgrades: newUpgrades,
        }
      }

      return prevState
    })
  }, [])

  // Calculate points per click based on upgrades
  const calculatePointsPerClick = (upgrades: typeof gameState.upgrades): number => {
    let points = 1 // Base points per click
    points += upgrades.sunscreen.level * upgrades.sunscreen.effect
    points += upgrades.camera.level * upgrades.camera.effect
    points += upgrades.tourGuide.level * upgrades.tourGuide.effect
    points += upgrades.snorkelingGear.level * upgrades.snorkelingGear.effect
    points += upgrades.souvenirShop.level * upgrades.souvenirShop.effect
    points += upgrades.localCuisine.level * upgrades.localCuisine.effect
    return points
  }

  // Calculate points per second based on upgrades
  const calculatePointsPerSecond = (upgrades: typeof gameState.upgrades): number => {
    let points = 0
    points += upgrades.cocktails.level * upgrades.cocktails.effect
    points += upgrades.luxuryHotel.level * upgrades.luxuryHotel.effect
    points += upgrades.privateBeach.level * upgrades.privateBeach.effect
    points += upgrades.spaTreatment.level * upgrades.spaTreatment.effect
    points += upgrades.islandHopping.level * upgrades.islandHopping.effect
    points += upgrades.adventureExcursions.level * upgrades.adventureExcursions.effect
    points += upgrades.yacht.level * upgrades.yacht.effect
    points += upgrades.privateJet.level * upgrades.privateJet.effect
    return points
  }

  // Collect offline progress
  const collectOfflineProgress = () => {
    setShowOfflineProgress(false)
  }

  // Count unlocked achievements
  const unlockedAchievements = Object.values(gameState.achievements).filter((a) => a.unlocked).length
  const totalAchievements = Object.values(gameState.achievements).length

  // Render upgrade icon based on key
  const renderUpgradeIcon = (key: string) => {
    switch (key) {
      case "sunscreen":
        return <Umbrella className="h-5 w-5 text-yellow-500" />
      case "camera":
        return <Camera className="h-5 w-5 text-blue-500" />
      case "cocktails":
        return <Cocktail className="h-5 w-5 text-pink-500" />
      case "tourGuide":
        return <Map className="h-5 w-5 text-green-500" />
      case "luxuryHotel":
        return <Hotel className="h-5 w-5 text-purple-500" />
      case "snorkelingGear":
        return <Waves className="h-5 w-5 text-cyan-500" />
      case "souvenirShop":
        return <ShoppingBag className="h-5 w-5 text-orange-500" />
      case "localCuisine":
        return <Utensils className="h-5 w-5 text-red-500" />
      case "privateBeach":
        return <Palmtree className="h-5 w-5 text-green-600" />
      case "spaTreatment":
        return <Spa className="h-5 w-5 text-pink-600" />
      case "islandHopping":
        return <Compass className="h-5 w-5 text-indigo-500" />
      case "adventureExcursions":
        return <Mountain className="h-5 w-5 text-amber-700" />
      case "yacht":
        return <Sailboat className="h-5 w-5 text-blue-600" />
      case "privateJet":
        return <Plane className="h-5 w-5 text-sky-500" />
      default:
        return <Sunglasses className="h-5 w-5 text-amber-500" />
    }
  }

  return (
    <div className="holiday-bg relative">
      {/* Reduced number of particles for stability */}
      <div className="holiday-particles">
        {Array.from({ length: 8 }).map((_, index) => {
          const size = Math.random() * 20 + 10
          const left = Math.random() * 100
          const delay = Math.random() * 10
          const duration = Math.random() * 10 + 15
          const color = index % 2 === 0 ? "#ffffff" : "#ffeb3b"

          return (
            <div
              key={index}
              className="holiday-particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                left: `${left}%`,
                bottom: "-50px",
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      <div className="holiday-container relative z-10">
        <div className="holiday-header">
          <h1 className="holiday-title">Holiday Clicker</h1>
          <p className="holiday-subtitle">Click to earn vacation points and upgrade your holiday experience!</p>
        </div>

        {/* Fixed height container for offline progress to prevent layout shifts */}
        <div className={`offline-progress-container ${showOfflineProgress ? "visible" : ""}`}>
          {showOfflineProgress && (
            <Card className="mb-6 mx-auto max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  Welcome Back!
                </CardTitle>
                <CardDescription>While you were away, your holiday investments earned you:</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-center text-green-600">
                  +{formatNumber(offlinePoints)} vacation points
                </p>
                <button
                  onClick={collectOfflineProgress}
                  className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-md hover:from-green-600 hover:to-teal-600 transition-colors"
                >
                  Collect
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="holiday-card resources-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-blue-600">Holiday Resources</CardTitle>
                <CardDescription>Click on the sun umbrella to earn vacation points!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(gameState.vacationPoints)}</p>
                    <p className="text-sm text-gray-500">Vacation Points</p>
                  </div>

                  <div className="holiday-clicker-button" onClick={handleVacationClick}>
                    <span>🏖️</span>
                  </div>

                  <div className="text-center mt-6">
                    <div className="text-sm text-blue-600">+{formatNumber(gameState.pointsPerClick)} per click</div>
                    <div className="text-sm text-green-600">+{formatNumber(gameState.pointsPerSecond)} per second</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Tabs defaultValue="upgrades" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                <TabsContent value="upgrades" className="mt-4">
                  <Card className="holiday-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-blue-600">Holiday Upgrades</CardTitle>
                      <CardDescription>Upgrade your holiday experience!</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="upgrades-container">
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(gameState.upgrades).map(([key, upgrade]) => {
                            const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.level)
                            const canAfford = gameState.vacationPoints >= cost
                            const isMaxed = upgrade.level >= upgrade.maxLevel

                            return (
                              <div
                                key={key}
                                className={`holiday-upgrade ${!canAfford || isMaxed ? "disabled" : ""}`}
                                onClick={() => !isMaxed && canAfford && handleUpgrade(key)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="holiday-upgrade-title">
                                      {renderUpgradeIcon(key)}
                                      {key.charAt(0).toUpperCase() + key.slice(1)}
                                      {isMaxed && <Badge className="ml-2 bg-amber-500">MAX</Badge>}
                                    </div>
                                    <div className="holiday-upgrade-description">{upgrade.description}</div>
                                    <div className="holiday-upgrade-level">
                                      Level: {upgrade.level}/{upgrade.maxLevel}
                                    </div>
                                  </div>
                                  {!isMaxed && (
                                    <div
                                      className={`holiday-upgrade-cost ${canAfford ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {formatNumber(cost)} points
                                    </div>
                                  )}
                                </div>
                                {!isMaxed && (
                                  <div className="holiday-progress-bar mt-2">
                                    <div
                                      className="holiday-progress-fill"
                                      style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="achievements" className="mt-4">
                  <Card className="holiday-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-blue-600">Achievements</CardTitle>
                      <CardDescription>
                        Unlocked: {unlockedAchievements}/{totalAchievements}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="achievements-container">
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(gameState.achievements).map(([key, achievement]) => {
                            return (
                              <div
                                key={key}
                                className={`holiday-achievement ${achievement.unlocked ? "unlocked" : ""}`}
                              >
                                <div className="holiday-achievement-title">
                                  {achievement.unlocked ? (
                                    <Badge className="bg-amber-500">Unlocked</Badge>
                                  ) : (
                                    <Badge className="bg-gray-400">Locked</Badge>
                                  )}
                                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                </div>
                                <div className="holiday-achievement-description">{achievement.description}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <Card className="holiday-card stats-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-600">Holiday Stats</CardTitle>
                <CardDescription>Your vacation progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Total Vacation Points</span>
                      <span className="text-sm font-medium">{formatNumber(gameState.totalVacationPoints)}</span>
                    </div>
                    <Progress value={Math.min((gameState.totalVacationPoints / 10000) * 100, 100)} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Points Per Click</span>
                      <span className="text-sm font-medium">{formatNumber(gameState.pointsPerClick)}</span>
                    </div>
                    <Progress value={Math.min((gameState.pointsPerClick / 100) * 100, 100)} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Points Per Second</span>
                      <span className="text-sm font-medium">{formatNumber(gameState.pointsPerSecond)}</span>
                    </div>
                    <Progress value={Math.min((gameState.pointsPerSecond / 500) * 100, 100)} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Achievements</span>
                      <span className="text-sm font-medium">
                        {unlockedAchievements}/{totalAchievements}
                      </span>
                    </div>
                    <Progress value={(unlockedAchievements / totalAchievements) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Upgrades Purchased</span>
                      <span className="text-sm font-medium">
                        {Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.level, 0)}/
                        {Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.maxLevel, 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.level, 0) /
                          Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.maxLevel, 0)) *
                        100
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
