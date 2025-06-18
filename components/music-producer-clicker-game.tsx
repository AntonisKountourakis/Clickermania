"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Headphones, Music, Disc, Radio, Award, Mic, Play } from "lucide-react"
import Link from "next/link"

// Music producer clicker game
const MusicProducerClicker = () => {
  const [beats, setBeats] = useState(0)
  const [beatsPerClick, setBeatsPerClick] = useState(1)
  const [autoBeats, setAutoBeats] = useState(0)
  const [studioQuality, setStudioQuality] = useState(1)
  const [fanbase, setFanbase] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; message: string; isCritical: boolean }>
  >([])
  const [lastClickTime, setLastClickTime] = useState(0)
  const [combo, setCombo] = useState(0)
  const gamePrefix = "music-producer-clicker"
  const MAX_CLICK_EFFECTS = 5

  // Basic upgrades
  const UPGRADES = [
    {
      id: "headphones",
      name: "Studio Headphones",
      description: "Better sound quality helps you make beats faster",
      basePrice: 10,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 50,
      icon: <Headphones className="h-4 w-4 mr-1" />,
    },
    {
      id: "auto_beats",
      name: "Beat Machine",
      description: "Automatically generates beats for you",
      basePrice: 25,
      priceMultiplier: 1.7,
      effect: 0.5,
      maxLevel: 50,
      icon: <Play className="h-4 w-4 mr-1" />,
    },
    {
      id: "studio_gear",
      name: "Studio Equipment",
      description: "Upgrade your studio with better gear",
      basePrice: 50,
      priceMultiplier: 1.8,
      effect: 2,
      maxLevel: 30,
      icon: <Mic className="h-4 w-4 mr-1" />,
    },
    {
      id: "promotion",
      name: "Music Promotion",
      description: "Promote your music to gain more fans",
      basePrice: 100,
      priceMultiplier: 2.0,
      effect: 5,
      maxLevel: 20,
      icon: <Radio className="h-4 w-4 mr-1" />,
    },
  ]

  // Advanced upgrades
  const ADVANCED_UPGRADES = [
    {
      id: "daw_software",
      name: "Pro DAW Software",
      description: "Professional digital audio workstation",
      basePrice: 500,
      priceMultiplier: 2.2,
      effect: 0.2, // 20% increase to beat power
      maxLevel: 10,
      icon: <Music className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "studio_gear", level: 5 } as const,
    },
    {
      id: "record_label",
      name: "Record Label",
      description: "Sign with a professional record label",
      basePrice: 1000,
      priceMultiplier: 2.5,
      effect: 0.3, // 30% increase to auto beats
      maxLevel: 5,
      icon: <Disc className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "promotion", level: 5 } as const,
    },
    {
      id: "music_festival",
      name: "Music Festival",
      description: "Perform at major music festivals",
      basePrice: 2500,
      priceMultiplier: 3.0,
      effect: 0.5, // 50% increase to total score
      maxLevel: 3,
      icon: <Award className="h-4 w-4 mr-1" />,
      unlockRequirement: { id: "headphones", level: 15 } as const,
    },
  ]

  // Music-related messages for click effects
  const MUSIC_MESSAGES = [
    "BEAT DROP!",
    "FIRE TRACK!",
    "SICK BEAT!",
    "BASS BOOST!",
    "PERFECT MIX!",
    "CHART TOPPER!",
    "PLATINUM HIT!",
    "REMIX!",
    "ENCORE!",
    "Grammy WORTHY!",
  ]

  // Music producer ranks
  const MUSIC_RANKS = [
    { name: "Bedroom Producer", threshold: 0 },
    { name: "Local DJ", threshold: 100 },
    { name: "Studio Engineer", threshold: 500 },
    { name: "Beat Maker", threshold: 1000 },
    { name: "Track Producer", threshold: 5000 },
    { name: "Hit Maker", threshold: 10000 },
    { name: "Grammy Nominee", threshold: 25000 },
    { name: "Music Mogul", threshold: 50000 },
  ]

  // Format number for display
  const formatMoney = (amount: number) => {
    if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
    return `${Math.floor(amount)}`
  }

  // Load saved progress
  useEffect(() => {
    const savedBeats = localStorage.getItem(`${gamePrefix}_beats`)
    const savedBeatsPerClick = localStorage.getItem(`${gamePrefix}_beatsPerClick`)
    const savedAutoBeats = localStorage.getItem(`${gamePrefix}_autoBeats`)
    const savedStudioQuality = localStorage.getItem(`${gamePrefix}_studioQuality`)
    const savedFanbase = localStorage.getItem(`${gamePrefix}_fanbase`)
    const savedUpgrades = localStorage.getItem(`${gamePrefix}_upgrades`)

    if (savedBeats) setBeats(Number.parseFloat(savedBeats))
    if (savedBeatsPerClick) setBeatsPerClick(Number.parseFloat(savedBeatsPerClick))
    if (savedAutoBeats) setAutoBeats(Number.parseFloat(savedAutoBeats))
    if (savedStudioQuality) setStudioQuality(Number.parseFloat(savedStudioQuality))
    if (savedFanbase) setFanbase(Number.parseFloat(savedFanbase))
    if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades))
  }, [])

  // Save progress
  useEffect(() => {
    localStorage.setItem(`${gamePrefix}_beats`, beats.toString())
    localStorage.setItem(`${gamePrefix}_beatsPerClick`, beatsPerClick.toString())
    localStorage.setItem(`${gamePrefix}_autoBeats`, autoBeats.toString())
    localStorage.setItem(`${gamePrefix}_studioQuality`, studioQuality.toString())
    localStorage.setItem(`${gamePrefix}_fanbase`, fanbase.toString())
    localStorage.setItem(`${gamePrefix}_upgrades`, JSON.stringify(upgrades))
  }, [beats, beatsPerClick, autoBeats, studioQuality, fanbase, upgrades])

  // Auto-generate beats
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoBeats > 0) {
        setBeats((prevBeats) => prevBeats + autoBeats * 0.5 * studioQuality * fanbase)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoBeats, studioQuality, fanbase])

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Update beats
    setBeats((prevBeats) => {
      const newBeats = prevBeats + beatsPerClick * studioQuality * fanbase
      return newBeats
    })

    // Handle combo
    const now = Date.now()
    if (now - lastClickTime < 1000) {
      setCombo((prev) => Math.min(prev + 1, 10))
    } else {
      setCombo(1)
    }
    setLastClickTime(now)

    // Select random message
    let message = MUSIC_MESSAGES[Math.floor(Math.random() * MUSIC_MESSAGES.length)]
    const isCritical = Math.random() < 0.05

    if (isCritical) {
      message = "PLATINUM HIT!"
    } else if (combo > 1) {
      message = `${combo}x COMBO!`
    }

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10
    const y = Math.random() * 80 + 10

    setClickEffects((prev) => {
      if (prev.length >= MAX_CLICK_EFFECTS) {
        return [...prev.slice(1), { id, x, y, message, isCritical }]
      }
      return [...prev, { id, x, y, message, isCritical }]
    })

    // Remove effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }

  // Buy upgrade
  const buyUpgrade = (upgradeId: string, isAdvanced = false) => {
    const upgradesList = isAdvanced ? ADVANCED_UPGRADES : UPGRADES
    const upgrade = upgradesList.find((u) => u.id === upgradeId)
    if (!upgrade) return

    const currentLevel = upgrades[upgradeId] || 0
    const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

    // Check if advanced upgrade is unlocked
    if (isAdvanced) {
      const advancedUpgrade = upgrade as (typeof ADVANCED_UPGRADES)[0]
      if (advancedUpgrade.unlockRequirement) {
        const reqId = advancedUpgrade.unlockRequirement.id
        const reqLevel = advancedUpgrade.unlockRequirement.level
        const currentReqLevel = upgrades[reqId] || 0
        if (currentReqLevel < reqLevel) {
          return // Not unlocked yet
        }
      }
    }

    if (beats >= cost) {
      setBeats((prevBeats) => prevBeats - cost)

      setUpgrades((prevUpgrades) => ({
        ...prevUpgrades,
        [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
      }))

      // Apply upgrade effects
      if (!isAdvanced) {
        if (upgradeId === "headphones") {
          setBeatsPerClick((prevPower) => prevPower + upgrade.effect)
        } else if (upgradeId === "auto_beats") {
          setAutoBeats((prevCount) => prevCount + 1)
        } else if (upgradeId === "studio_gear") {
          setStudioQuality((prev) => prev + upgrade.effect)
        } else if (upgradeId === "promotion") {
          setFanbase((prev) => prev + upgrade.effect)
        }
      }
      // Apply advanced upgrade effects
      else {
        if (upgradeId === "daw_software") {
          setBeatsPerClick((prev) => prev * (1 + upgrade.effect))
        } else if (upgradeId === "record_label") {
          setAutoBeats((prev) => prev * (1 + upgrade.effect))
        } else if (upgradeId === "music_festival") {
          // Increase all parameters
          setBeatsPerClick((prev) => prev * (1 + upgrade.effect * 0.5))
          setStudioQuality((prev) => prev * (1 + upgrade.effect * 0.5))
        }
      }
    }
  }

  // Get current rank
  const getCurrentRank = () => {
    for (let i = MUSIC_RANKS.length - 1; i >= 0; i--) {
      if (beats >= MUSIC_RANKS[i].threshold) {
        return MUSIC_RANKS[i].name
      }
    }
    return MUSIC_RANKS[0].name
  }

  // Get progress to next rank
  const getNextRankProgress = () => {
    const currentRank = getCurrentRank()
    const currentRankIndex = MUSIC_RANKS.findIndex((rank) => rank.name === currentRank)

    if (currentRankIndex === MUSIC_RANKS.length - 1) {
      return 100 // Already at max rank
    }

    const currentThreshold = MUSIC_RANKS[currentRankIndex].threshold
    const nextThreshold = MUSIC_RANKS[currentRankIndex + 1].threshold
    const progress = ((beats - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Reset game
  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setBeats(0)
      setBeatsPerClick(1)
      setAutoBeats(0)
      setStudioQuality(1)
      setFanbase(1)
      setUpgrades({})

      // Clear localStorage
      localStorage.removeItem(`${gamePrefix}_beats`)
      localStorage.removeItem(`${gamePrefix}_beatsPerClick`)
      localStorage.removeItem(`${gamePrefix}_autoBeats`)
      localStorage.removeItem(`${gamePrefix}_studioQuality`)
      localStorage.removeItem(`${gamePrefix}_fanbase`)
      localStorage.removeItem(`${gamePrefix}_upgrades`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center music-producer-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={(e) => handleClick(e)}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-purple-900/50 pixel-border cursor-pointer hover:shadow-xl transition-all game-container"
        >
          <CardHeader className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white glow-text">Music Producer</CardTitle>
            <CardDescription className="text-center text-white/80">
              Create beats, produce tracks, and become a music mogul!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none font-bold animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                  color: effect.isCritical ? "#ff5e5e" : "#7b61ff",
                  fontSize: effect.isCritical ? "1.5rem" : "1.2rem",
                  textShadow: effect.isCritical ? "0 0 10px rgba(255, 94, 94, 0.7)" : "0 0 5px rgba(123, 97, 255, 0.7)",
                }}
              >
                {effect.message}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Music className="h-5 w-5 mr-2 text-purple-500" />
                <p className="text-lg font-bold text-white glow-text">Beats: {formatMoney(beats)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-purple-300">Rank: {getCurrentRank()}</p>
              </div>
            </div>

            {/* Rank progress bar */}
            <div className="game-progress-bar">
              <div className="game-progress-fill" style={{ width: `${getNextRankProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Beat Quality</p>
                <p className="text-sm font-medium text-purple-300">{beatsPerClick.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Beat Machines</p>
                <p className="text-sm font-medium text-purple-300">{autoBeats}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Studio Quality</p>
                <p className="text-sm font-medium text-purple-300">x{studioQuality.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Fanbase</p>
                <p className="text-sm font-medium text-purple-300">x{fanbase.toFixed(1)}</p>
              </div>
            </div>

            {/* Combo indicator */}
            <div className="h-12 mb-4 flex items-center justify-center">
              {combo > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                  <p className="text-sm font-bold text-white">
                    {combo}x COMBO! <span className="text-xs">+{combo * 10}% bonus</span>
                  </p>
                </div>
              ) : null}
            </div>

            <div className="studio-visualizer mb-4 h-24 bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="equalizer">
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
              </div>
              <div className="text-4xl absolute">🎧</div>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleClick(e)
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 text-white font-bold text-xl py-6 px-8 rounded-lg shadow-xl border-3 border-purple-800/30 my-4"
            >
              <Disc className="h-6 w-6 mr-3" /> MAKE BEATS
            </Button>

            <div className="flex justify-between mt-4">
              <Link href="/">
                <Button variant="outline" className="text-white border-white/20 bg-white/5">
                  Back
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  resetGame()
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-purple-900/50 pixel-border">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-t-lg p-3 sm:p-4">
            <CardTitle className="text-white glow-text text-lg sm:text-xl">Studio Upgrades</CardTitle>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              Upgrade your studio and music production
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {UPGRADES.map((upgrade) => {
              const currentLevel = upgrades[upgrade.id] || 0
              const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
              const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

              return (
                <div
                  key={upgrade.id}
                  onClick={() => beats >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-900/30 transition-all ${
                    beats >= cost && !isMaxLevel
                      ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                      : "bg-gray-800/30 opacity-70"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-purple-300 flex items-center text-sm">
                      {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                    </h3>
                    <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                    <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                  </div>
                  <div
                    className={`${
                      beats >= cost && !isMaxLevel ? "bg-gradient-to-r from-purple-600 to-blue-700" : "bg-gray-700"
                    } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                  >
                    {isMaxLevel ? "Max" : `Buy (${formatMoney(cost)})`}
                  </div>
                </div>
              )
            })}

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h3 className="font-bold mb-2 text-purple-300">Advanced Upgrades</h3>

              {ADVANCED_UPGRADES.map((upgrade) => {
                const currentLevel = upgrades[upgrade.id] || 0
                const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                // Check if upgrade is unlocked
                const reqId = upgrade.unlockRequirement.id
                const reqLevel = upgrade.unlockRequirement.level
                const currentReqLevel = upgrades[reqId] || 0
                const isUnlocked = currentReqLevel >= reqLevel

                return (
                  <div
                    key={upgrade.id}
                    onClick={() => isUnlocked && beats >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-900/30 transition-all mt-2 ${
                      isUnlocked
                        ? beats >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                        : "bg-gray-700/30 opacity-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-purple-300 flex items-center text-sm">
                        {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                      </h3>
                      <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                      <p className="text-xs text-gray-500">
                        {isUnlocked
                          ? `Level: ${currentLevel}`
                          : `Requires ${reqId.replace(/_/g, " ")} level ${reqLevel}`}
                      </p>
                    </div>
                    <div
                      className={`${
                        isUnlocked && beats >= cost && !isMaxLevel
                          ? "bg-gradient-to-r from-purple-600 to-blue-700"
                          : "bg-gray-700"
                      } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                    >
                      {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatMoney(cost)})`}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MusicProducerClicker
