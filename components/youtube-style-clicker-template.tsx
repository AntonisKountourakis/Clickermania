"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

// Format large numbers with commas and abbreviations
const formatNumber = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

export interface UpgradeType {
  id: string
  name: string
  description: string
  basePrice: number
  priceMultiplier: number
  effect: number
  maxLevel: number
  count: number
  icon: React.ReactNode
}

export interface AdvancedUpgradeType extends UpgradeType {
  unlockRequirement: {
    id: string
    level: number
  }
}

export interface MilestoneType {
  name: string
  threshold: number
  icon: string
}

export interface ClickEffectType {
  id: number
  x: number
  y: number
  text: string
  isCritical: boolean
}

export interface YouTubeStyleClickerProps {
  // Game identification
  gameId: string
  gameTitle: string
  gameDescription: string

  // Resources and stats
  mainStatName: string
  mainStatIcon: React.ReactNode
  secondaryStatName?: string
  secondaryStatIcon?: React.ReactNode

  // Styling
  backgroundClassName: string
  headerGradientClassName: string
  buttonGradientClassName: string
  textColorClassName: string
  accentColorClassName: string

  // Game content
  basicUpgrades: UpgradeType[]
  advancedUpgrades: AdvancedUpgradeType[]
  milestones: MilestoneType[]
  clickMessages: string[]

  // Custom components
  customGridComponent?: React.ReactNode
}

export default function YouTubeStyleClickerTemplate({
  gameId,
  gameTitle,
  gameDescription,
  mainStatName,
  mainStatIcon,
  secondaryStatName = "Level",
  secondaryStatIcon,
  backgroundClassName,
  headerGradientClassName,
  buttonGradientClassName,
  textColorClassName,
  accentColorClassName,
  basicUpgrades,
  advancedUpgrades,
  milestones,
  clickMessages,
  customGridComponent,
}: YouTubeStyleClickerProps) {
  // Game state
  const [mainStat, setMainStat] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoGeneration, setAutoGeneration] = useState(0)
  const [totalMainStat, setTotalMainStat] = useState(0)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<ClickEffectType[]>([])
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 for Basic, 2 for Advanced
  const [clickAnimation, setClickAnimation] = useState(false)
  const MAX_CLICK_EFFECTS = 10

  // Load game state from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`${gameId}-progress`)
    if (savedProgress) {
      try {
        const {
          mainStat: savedMainStat,
          clickPower: savedClickPower,
          autoGeneration: savedAutoGeneration,
          totalMainStat: savedTotalMainStat,
          upgrades: savedUpgrades,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setClickPower(savedClickPower || 1)
        setAutoGeneration(savedAutoGeneration || 0)
        setTotalMainStat(savedTotalMainStat || 0)
        setUpgrades(savedUpgrades || {})
        setAchievements(savedAchievements || [])

        // Calculate offline progress
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)

        // Debug offline progress calculation
        console.log(`Offline progress calculation for ${gameId}:`)
        console.log(`- Last update: ${new Date(lastUpdate).toLocaleString()}`)
        console.log(`- Current time: ${new Date(now).toLocaleString()}`)
        console.log(`- Time difference: ${timeDiff / 1000} seconds`)
        console.log(`- Auto generation rate: ${savedAutoGeneration} per second`)

        if (timeDiff > 0 && savedAutoGeneration > 0) {
          // Calculate resources earned while offline (in seconds)
          const offlineResources = (timeDiff / 1000) * savedAutoGeneration
          console.log(`- Offline resources earned: ${offlineResources}`)

          // Update the main stat with offline earnings
          const newMainStat = (savedMainStat || 0) + offlineResources
          setMainStat(newMainStat)

          // Update total main stat as well
          const newTotalMainStat = (savedTotalMainStat || 0) + offlineResources
          setTotalMainStat(newTotalMainStat)

          // Show welcome back message with offline earnings
          if (offlineResources > 0) {
            setOfflineMessage({
              message: `Welcome back! While you were away, you earned`,
              amount: offlineResources,
            })

            // Ενημερώστε το localStorage αμέσως με τις νέες τιμές για να ενημερωθεί η κεντρική σελίδα
            const immediateProgress = {
              mainStat: newMainStat,
              clickPower: savedClickPower || 1,
              autoGeneration: savedAutoGeneration || 0,
              totalMainStat: newTotalMainStat,
              upgrades: savedUpgrades || {},
              achievements: savedAchievements || [],
              lastUpdate: Date.now(),
            }
            localStorage.setItem(`${gameId}-progress`, JSON.stringify(immediateProgress))
          }
        } else {
          console.log(`- No offline resources earned: autoGeneration=${savedAutoGeneration}, timeDiff=${timeDiff}`)
          setMainStat(savedMainStat || 0)
        }
      } catch (error) {
        console.error(`Error loading saved progress for ${gameId}:`, error)
        // If there's an error, just set default values
        setMainStat(0)
        setClickPower(1)
        setAutoGeneration(0)
        setTotalMainStat(0)
        setUpgrades({})
        setAchievements([])
      }
    }
  }, [gameId])

  // Save game state to localStorage
  useEffect(() => {
    const progress = {
      mainStat,
      clickPower,
      autoGeneration,
      totalMainStat,
      upgrades,
      achievements,
      lastUpdate: Date.now(), // Σιγουρευτείτε ότι αυτό ενημερώνεται με κάθε αποθήκευση
    }

    console.log(`Saving progress for ${gameId}:`, progress)
    localStorage.setItem(`${gameId}-progress`, JSON.stringify(progress))

    // Προσθήκη event για να ενημερώσει την κεντρική σελίδα
    const updateEvent = new Event("gameProgressUpdated")
    window.dispatchEvent(updateEvent)
  }, [gameId, mainStat, clickPower, autoGeneration, totalMainStat, upgrades, achievements])

  // Auto-generate resources
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoGeneration > 0) {
        setMainStat((prev) => prev + autoGeneration)
        setTotalMainStat((prev) => prev + autoGeneration)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoGeneration])

  // Handle click
  const handleClick = useCallback(() => {
    // Play click sound
    try {
      const clickSound = document.getElementById("click-sound") as HTMLAudioElement
      if (clickSound) {
        clickSound.currentTime = 0
        clickSound.play().catch((err) => console.debug("Click sound play failed:", err))
      }
    } catch (err) {
      console.error("Error playing click sound:", err)
    }

    const now = Date.now()

    // Check for streak (clicks within 1 second)
    if (now - lastClickTime < 1000) {
      setCombo((prev) => Math.min(prev + 1, 10))
    } else {
      setCombo(1)
    }
    setLastClickTime(now)

    // Calculate resources based on upgrades and streak
    const streakMultiplier = 1 + combo * 0.1 // 10% bonus per streak level
    const totalValue = clickPower * streakMultiplier

    // 5% chance for critical hit (triple value)
    const isCritical = Math.random() < 0.05
    const finalValue = isCritical ? totalValue * 3 : totalValue

    setMainStat((prev) => prev + finalValue)
    setTotalMainStat((prev) => prev + finalValue)

    // Animate click button
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 500)

    // Select random message
    const message = isCritical
      ? "CRITICAL HIT!"
      : combo > 1
        ? `${combo}x COMBO!`
        : clickMessages[Math.floor(Math.random() * clickMessages.length)]

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    setClickEffects((prev) => {
      // If we already have too many effects, remove the oldest one
      if (prev.length >= MAX_CLICK_EFFECTS) {
        return [...prev.slice(1), { id, x, y, text: message, isCritical }]
      }
      return [...prev, { id, x, y, text: message, isCritical }]
    })

    // Remove effect after animation completes
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [clickPower, combo, lastClickTime, clickMessages])

  // Buy upgrade
  const buyUpgrade = useCallback(
    (upgradeId: string, isAdvanced = false) => {
      const upgradesList = isAdvanced ? advancedUpgrades : basicUpgrades
      const upgrade = upgradesList.find((u) => u.id === upgradeId)
      if (!upgrade) return

      const currentLevel = upgrades[upgradeId] || 0
      const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

      // Check if the upgrade is unlocked (only for advanced)
      if (isAdvanced) {
        const advancedUpgrade = upgrade as AdvancedUpgradeType
        if (advancedUpgrade.unlockRequirement) {
          const reqId = advancedUpgrade.unlockRequirement.id
          const reqLevel = advancedUpgrade.unlockRequirement.level
          const currentReqLevel = upgrades[reqId] || 0
          if (currentReqLevel < reqLevel) {
            return // Not unlocked yet
          }
        }
      }

      if (mainStat >= cost) {
        setMainStat((prev) => prev - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Apply effects based on upgrade type
        if (!isAdvanced) {
          // Basic upgrades
          if (upgradeId.includes("click") || upgradeId.includes("power")) {
            setClickPower((prev) => prev + upgrade.effect)
          } else if (upgradeId.includes("auto") || upgradeId.includes("passive")) {
            setAutoGeneration((prev) => prev + upgrade.effect)
          }
        } else {
          // Advanced upgrades - typically apply multiplier effects
          if (upgradeId.includes("click") || upgradeId.includes("power")) {
            setClickPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId.includes("auto") || upgradeId.includes("passive")) {
            setAutoGeneration((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId.includes("all") || upgradeId.includes("ultimate")) {
            // Ultimate upgrade that boosts everything
            setClickPower((prev) => prev * 2)
            setAutoGeneration((prev) => prev * 2)
          }
        }
      }
    },
    [mainStat, upgrades, basicUpgrades, advancedUpgrades],
  )

  // Calculate current milestone based on total resources
  const getCurrentMilestone = () => {
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (totalMainStat >= milestones[i].threshold) {
        return milestones[i]
      }
    }
    return milestones[0]
  }

  // Calculate progress to next milestone
  const getNextMilestoneProgress = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = milestones.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === milestones.length - 1) {
      return 100 // Already at max milestone
    }

    const currentThreshold = milestones[currentIndex].threshold
    const nextThreshold = milestones[currentIndex + 1].threshold
    const progress = ((totalMainStat - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Get the next milestone
  const getNextMilestone = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = milestones.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === milestones.length - 1) {
      return null // Already at max milestone
    }

    return milestones[currentIndex + 1]
  }

  const currentMilestone = getCurrentMilestone()
  const nextMilestone = getNextMilestone()

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${backgroundClassName} py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden`}
    >
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 cursor-pointer hover:shadow-xl transition-all mx-auto"
        >
          <CardHeader className={`${headerGradientClassName} rounded-t-lg`}>
            <CardTitle className="text-2xl font-bold text-center text-white">{gameTitle}</CardTitle>
            <CardDescription className="text-center text-white/80">{gameDescription}</CardDescription>
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
                  textShadow: effect.isCritical ? "0 0 5px rgba(255, 94, 94, 0.7)" : "0 0 3px rgba(123, 97, 255, 0.7)",
                }}
              >
                {effect.text}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {mainStatIcon}
                <p className={`text-lg font-bold ${textColorClassName}`}>
                  {mainStatName}: {formatNumber(mainStat)}
                </p>
              </div>
              <div className="flex gap-2">
                <p className={`text-sm ${textColorClassName}`}>Rank: {currentMilestone.name}</p>
              </div>
            </div>

            {/* Milestone progress bar */}
            <div className="video-progress">
              <div className="video-progress-fill" style={{ width: `${getNextMilestoneProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 mt-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">{mainStatName} per click</p>
                <p className={`text-sm font-medium ${accentColorClassName}`}>{formatNumber(clickPower)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">{mainStatName} per second</p>
                <p className={`text-sm font-medium ${accentColorClassName}`}>{formatNumber(autoGeneration)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Total {mainStatName}</p>
                <p className={`text-sm font-medium ${accentColorClassName}`}>{formatNumber(totalMainStat)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Milestone</p>
                <p className={`text-sm font-medium ${accentColorClassName}`}>{currentMilestone.icon}</p>
              </div>
            </div>

            {/* Custom grid component */}
            {customGridComponent}

            {/* Combo indicator */}
            <div className="h-8 mb-4 flex items-center justify-center">
              {combo > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  <p className="text-sm font-bold text-white flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {combo}x Combo! +{combo * 10}%
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleClick}
              className={`w-full ${buttonGradientClassName} text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 ${clickAnimation ? "click-animation" : ""}`}
            >
              {mainStatIcon} Generate {mainStatName}
            </Button>

            {/* Achievements section */}
            {achievements.length > 0 && (
              <div className="mt-4 p-2 rounded-lg bg-gray-800/50">
                <p className="text-sm font-medium text-white mb-1">Recent Achievements:</p>
                <div className="text-xs text-gray-300 max-h-20 overflow-y-auto">
                  {achievements.slice(-3).map((achievement, index) => (
                    <div key={index} className="flex items-center py-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-gray-700/50">
          <CardHeader className={`${headerGradientClassName} rounded-t-lg p-3 sm:p-4`}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-indigo-600 font-bold" : "bg-indigo-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-indigo-600 font-bold" : "bg-indigo-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your basic abilities" : "Advanced upgrades for massive boosts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {upgradesPage === 1 ? (
              // Basic upgrades
              <>
                {basicUpgrades.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => mainStat >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-700/30 transition-all ${
                        mainStat >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${accentColorClassName} flex items-center text-sm`}>
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          mainStat >= cost && !isMaxLevel ? buttonGradientClassName : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Advanced upgrades
              <>
                <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className={`text-xs sm:text-sm ${accentColorClassName}`}>
                    Advanced upgrades unlock powerful multipliers. Each requires certain basic upgrades.
                  </p>
                </div>

                {advancedUpgrades.map((upgrade) => {
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
                      onClick={() => isUnlocked && mainStat >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-700/30 transition-all ${
                        isUnlocked
                          ? mainStat >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                          : "bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${accentColorClassName} flex items-center text-sm`}>
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
                          isUnlocked && mainStat >= cost && !isMaxLevel ? buttonGradientClassName : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>

        {/* Offline Progress Message */}
        {offlineMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
            <div className={`relative ${buttonGradientClassName} p-1 rounded-xl animate-pulse max-w-md w-full`}>
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
                  Welcome Back!
                </h3>
                <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
                  {formatNumber(offlineMessage.amount)} {mainStatName}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className={`px-4 py-2 ${buttonGradientClassName} text-white rounded-lg hover:opacity-90 transition-all`}
                  >
                    Collect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
