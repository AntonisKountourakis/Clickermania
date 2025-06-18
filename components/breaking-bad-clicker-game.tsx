"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AlertTriangle,
  Beaker,
  FlaskRound,
  Microscope,
  Truck,
  Users,
  DollarSign,
  Building,
  Briefcase,
  Map,
  Skull,
  Award,
  TrendingUp,
} from "lucide-react"

// Format numbers to be more readable
const formatNumber = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

// Basic upgrade objects
const UPGRADES = [
  {
    id: "beaker",
    name: "Basic Beaker",
    description: "Improve your basic equipment",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 10,
    icon: <Beaker className="h-4 w-4 mr-1" />,
  },
  {
    id: "flask",
    name: "Chemistry Flask",
    description: "Better chemistry equipment for purer product",
    basePrice: 50,
    priceMultiplier: 1.7,
    effect: 2,
    maxLevel: 10,
    icon: <FlaskRound className="h-4 w-4 mr-1" />,
  },
  {
    id: "microscope",
    name: "Precision Microscope",
    description: "Precision equipment for higher quality",
    basePrice: 250,
    priceMultiplier: 1.8,
    effect: 5,
    maxLevel: 10,
    icon: <Microscope className="h-4 w-4 mr-1" />,
  },
  {
    id: "rv",
    name: "Mobile RV Lab",
    description: "Mobile lab for cooking on the go",
    basePrice: 1000,
    priceMultiplier: 2.0,
    effect: 10,
    maxLevel: 5,
    icon: <Truck className="h-4 w-4 mr-1" />,
  },
]

// Advanced upgrades
const ADVANCED_UPGRADES = [
  {
    id: "lab",
    name: "Professional Lab",
    description: "Professional lab setup for maximum efficiency",
    basePrice: 5000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% increase in production
    maxLevel: 5,
    icon: <Building className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "microscope", level: 5 } as const,
  },
  {
    id: "dealer",
    name: "Street Dealer",
    description: "Hire dealers to sell your product",
    basePrice: 500,
    priceMultiplier: 1.6,
    effect: 1,
    maxLevel: 10,
    icon: <Users className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "beaker", level: 3 } as const,
  },
  {
    id: "distributor",
    name: "Local Distributor",
    description: "Expand distribution network",
    basePrice: 2500,
    priceMultiplier: 1.7,
    effect: 5,
    maxLevel: 10,
    icon: <Truck className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "dealer", level: 5 } as const,
  },
  {
    id: "lawyer",
    name: "Criminal Lawyer",
    description: "Better call a lawyer to reduce heat",
    basePrice: 10000,
    priceMultiplier: 2.0,
    effect: 0.1, // reduces DEA heat
    maxLevel: 5,
    icon: <Briefcase className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "rv", level: 2 } as const,
  },
  {
    id: "cartel",
    name: "Cartel Connection",
    description: "Partner with cartels for wider distribution",
    basePrice: 50000,
    priceMultiplier: 2.2,
    effect: 50,
    maxLevel: 5,
    icon: <Skull className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "distributor", level: 7 } as const,
  },
  {
    id: "laundry",
    name: "Money Laundering",
    description: "Launder your money through legitimate businesses",
    basePrice: 100000,
    priceMultiplier: 2.3,
    effect: 100,
    maxLevel: 5,
    icon: <DollarSign className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "lawyer", level: 3 } as const,
  },
  {
    id: "territory",
    name: "Territory Expansion",
    description: "Expand your territory for more control",
    basePrice: 250000,
    priceMultiplier: 2.5,
    effect: 250,
    maxLevel: 5,
    icon: <Map className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "cartel", level: 3 } as const,
  },
  {
    id: "empire",
    name: "Drug Empire",
    description: "Build your drug empire across the country",
    basePrice: 1000000,
    priceMultiplier: 3.0,
    effect: 1000,
    maxLevel: 3,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "territory", level: 3 } as const,
  },
]

// Empire milestones
const EMPIRE_MILESTONES = [
  { name: "Amateur Cook", threshold: 0, icon: "🧪" },
  { name: "Small-time Dealer", threshold: 1000, icon: "💊" },
  { name: "Local Supplier", threshold: 10000, icon: "🧫" },
  { name: "Regional Distributor", threshold: 50000, icon: "⚗️" },
  { name: "Drug Lord", threshold: 200000, icon: "💰" },
  { name: "Cartel Partner", threshold: 1000000, icon: "🔫" },
  { name: "Kingpin", threshold: 5000000, icon: "👑" },
  { name: "The Danger", threshold: 20000000, icon: "☣️" },
  { name: "Heisenberg", threshold: 100000000, icon: "🎩" },
]

// Product types for click effects
const PRODUCT_TYPES = [
  "Blue Crystal",
  "Pure Batch",
  "Premium Cook",
  "Crystal Blue",
  "99.1% Pure",
  "Blue Sky",
  "Blue Magic",
  "Blue Glass",
  "Crystal Meth",
  "Blue Rocks",
]

// Click effect emojis
const CLICK_EMOJIS = ["🧪", "⚗️", "🧫", "💊", "💎", "🔬", "🧠", "💰", "💵", "🔥"]

const BreakingBadClicker = () => {
  const [money, setMoney] = useState(0)
  const [moneyPerClick, setMoneyPerClick] = useState(1)
  const [moneyPerSecond, setMoneyPerSecond] = useState(0)
  const [dangerLevel, setDangerLevel] = useState(0)
  const [totalMoney, setTotalMoney] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; emoji: string; isSpecial: boolean }>
  >([])
  const [cookStreak, setCookStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [productCreated, setProductCreated] = useState<Record<string, number>>({})
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 for Basic, 2 for Advanced
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [showDEARaid, setShowDEARaid] = useState(false)
  const MAX_CLICK_EFFECTS = 10

  const clickerRef = useRef<HTMLButtonElement>(null)

  // Load progress from localStorage and calculate offline progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("breaking-bad-clicker-progress")
    if (savedProgress) {
      try {
        const {
          money: savedMoney,
          moneyPerClick: savedMoneyPerClick,
          moneyPerSecond: savedMoneyPerSecond,
          dangerLevel: savedDangerLevel,
          totalMoney: savedTotalMoney,
          totalClicks: savedTotalClicks,
          upgrades: savedUpgrades,
          productCreated: savedProductCreated,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setMoneyPerClick(savedMoneyPerClick || 1)
        setMoneyPerSecond(savedMoneyPerSecond || 0)
        setDangerLevel(savedDangerLevel || 0)
        setTotalMoney(savedTotalMoney || 0)
        setTotalClicks(savedTotalClicks || 0)
        setUpgrades(savedUpgrades || {})
        setProductCreated(savedProductCreated || {})
        setAchievements(savedAchievements || [])

        // Calculate offline progress
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedMoneyPerSecond > 0) {
          // Calculate money earned while offline (in seconds)
          const offlineMoney = (timeDiff / 1000) * savedMoneyPerSecond
          setMoney((savedMoney || 0) + offlineMoney)

          // Show welcome back message with offline earnings
          if (offlineMoney > 0) {
            setOfflineMessage({
              message: `While you were away, your operation continued to produce`,
              amount: offlineMoney,
            })
          }
        } else {
          setMoney(savedMoney || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Save progress to localStorage when relevant states change
  useEffect(() => {
    const progress = {
      money,
      moneyPerClick,
      moneyPerSecond,
      dangerLevel,
      totalMoney,
      totalClicks,
      upgrades,
      productCreated,
      achievements,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("breaking-bad-clicker-progress", JSON.stringify(progress))
  }, [
    money,
    moneyPerClick,
    moneyPerSecond,
    dangerLevel,
    totalMoney,
    totalClicks,
    upgrades,
    productCreated,
    achievements,
  ])

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = []

      if (totalClicks >= 1 && !achievements.includes("First Cook")) {
        newAchievements.push("First Cook")
      }
      if (totalClicks >= 100 && !achievements.includes("Amateur Chemist")) {
        newAchievements.push("Amateur Chemist")
      }
      if (totalClicks >= 1000 && !achievements.includes("Master Cook")) {
        newAchievements.push("Master Cook")
      }
      if (totalMoney >= 1000 && !achievements.includes("Professional Cook")) {
        newAchievements.push("Professional Cook")
      }
      if (totalMoney >= 1000000 && !achievements.includes("Kingpin")) {
        newAchievements.push("Kingpin")
      }
      if (Object.values(upgrades).reduce((a, b) => a + b, 0) >= 10 && !achievements.includes("Upgrade Specialist")) {
        newAchievements.push("Upgrade Specialist")
      }
      if (dangerLevel >= 100 && !achievements.includes("Danger Zone")) {
        newAchievements.push("Danger Zone")
      }
      if (
        upgrades["empire"] >= ADVANCED_UPGRADES.find((u) => u.id === "empire")?.maxLevel &&
        !achievements.includes("Empire Builder")
      ) {
        newAchievements.push("Empire Builder")
      }
      if (cookStreak >= 10 && !achievements.includes("Cook Streak")) {
        newAchievements.push("Cook Streak")
      }

      if (newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements])
        // Display the latest achievement
        alert(`Achievement Unlocked: ${newAchievements[newAchievements.length - 1]}`)
      }
    }

    checkAchievements()
  }, [totalClicks, totalMoney, upgrades, dangerLevel, cookStreak, achievements])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const now = Date.now()

      // Check for streak (clicks within 1 second)
      if (now - lastClickTime < 1000) {
        setCookStreak((prev) => Math.min(prev + 1, 10))
      } else {
        setCookStreak(1)
      }
      setLastClickTime(now)

      // Calculate money based on upgrades and streak
      const streakMultiplier = 1 + cookStreak * 0.1 // 10% bonus per streak level
      const totalValue = moneyPerClick * streakMultiplier

      // 5% chance for pure batch (triple money)
      const isSpecial = Math.random() < 0.05
      const finalValue = isSpecial ? totalValue * 3 : totalValue

      setMoney((prevMoney) => prevMoney + finalValue)
      setTotalMoney((prevTotal) => prevTotal + finalValue)
      setTotalClicks((prevClicks) => prevClicks + 1)

      // Animate like button on click
      setLikeAnimation(true)
      setTimeout(() => setLikeAnimation(false), 500)

      // Select random product type
      const productType = PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)]

      // Track created product
      setProductCreated((prev) => ({
        ...prev,
        [productType]: (prev[productType] || 0) + 1,
      }))

      // Get click position for more natural effect placement
      const buttonRect = clickerRef.current?.getBoundingClientRect()
      const clickX = buttonRect ? e.clientX - buttonRect.left : e.nativeEvent.offsetX
      const clickY = buttonRect ? e.clientY - buttonRect.top : e.nativeEvent.offsetY

      // Calculate relative position (0-100%)
      const relativeX = buttonRect ? (clickX / buttonRect.width) * 100 : 50
      const relativeY = buttonRect ? (clickY / buttonRect.height) * 100 : 50

      // Add multiple click effects in a spread pattern
      const effectCount = isSpecial ? 5 : 3

      for (let i = 0; i < effectCount; i++) {
        const id = Date.now() + i

        // Create a spread pattern around the click point
        const spreadX = relativeX + (Math.random() * 40 - 20) // +/- 20% from click point
        const spreadY = relativeY + (Math.random() * 40 - 20) // +/- 20% from click point

        // Ensure the effect stays within bounds (5-95%)
        const boundedX = Math.min(Math.max(spreadX, 5), 95)
        const boundedY = Math.min(Math.max(spreadY, 5), 95)

        // Select random emoji
        const emoji = CLICK_EMOJIS[Math.floor(Math.random() * CLICK_EMOJIS.length)]

        // Customize message based on type
        const message = isSpecial ? "PURE BATCH!" : cookStreak > 1 ? `${cookStreak}x` : `+$${formatNumber(finalValue)}`

        setClickEffects((prev) => {
          // If we already have too many effects, remove the oldest ones
          if (prev.length >= MAX_CLICK_EFFECTS) {
            return [
              ...prev.slice(prev.length - MAX_CLICK_EFFECTS + 1),
              { id, x: boundedX, y: boundedY, text: message, emoji, isSpecial },
            ]
          }
          return [...prev, { id, x: boundedX, y: boundedY, text: message, emoji, isSpecial }]
        })

        // Remove effect after animation completes
        setTimeout(
          () => {
            setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
          },
          1000 + i * 100,
        ) // Stagger removal slightly
      }
    },
    [moneyPerClick, cookStreak, lastClickTime],
  )

  const buyUpgrade = useCallback(
    (upgradeId: string, isAdvanced = false) => {
      const upgradesList = isAdvanced ? ADVANCED_UPGRADES : UPGRADES
      const upgrade = upgradesList.find((u) => u.id === upgradeId)
      if (!upgrade) return

      const currentLevel = upgrades[upgradeId] || 0
      const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

      // Check if the upgrade is unlocked (only for advanced)
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

      if (money >= cost) {
        setMoney((prevMoney) => prevMoney - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Apply effects of upgrades
        updateStats(upgradeId, (upgrades[upgradeId] || 0) + 1)
      }
    },
    [money, upgrades],
  )

  // Update money per click and per second based on all upgrades
  const updateStats = (changedUpgradeId: string, newLevel: number) => {
    // Create new upgrades object with the changed upgrade
    const newUpgrades = {
      ...upgrades,
      [changedUpgradeId]: newLevel,
    }

    // Basic equipment (affects money per click)
    let newMoneyPerClick = 1
    UPGRADES.forEach((upgrade) => {
      const level = newUpgrades[upgrade.id] || 0
      newMoneyPerClick += level * upgrade.effect
    })

    // Professional lab (multiplier to money per click)
    const labLevel = newUpgrades["lab"] || 0
    if (labLevel > 0) {
      const labUpgrade = ADVANCED_UPGRADES.find((u) => u.id === "lab")
      if (labUpgrade) {
        newMoneyPerClick *= 1 + labLevel * labUpgrade.effect
      }
    }

    // Distribution network (affects money per second)
    let newMoneyPerSecond = 0
    ADVANCED_UPGRADES.filter((u) =>
      ["dealer", "distributor", "cartel", "laundry", "territory", "empire"].includes(u.id),
    ).forEach((upgrade) => {
      const level = newUpgrades[upgrade.id] || 0
      newMoneyPerSecond += level * upgrade.effect
    })

    setMoneyPerClick(newMoneyPerClick)
    setMoneyPerSecond(newMoneyPerSecond)
  }

  // Auto-generate money and update danger level
  useEffect(() => {
    const interval = setInterval(() => {
      if (moneyPerSecond > 0) {
        setMoney((prevMoney) => prevMoney + moneyPerSecond)
        setTotalMoney((prevTotal) => prevTotal + moneyPerSecond)

        // Update danger level
        setDangerLevel((prevDanger) => {
          // Increase danger based on production
          let newDanger = prevDanger + moneyPerSecond * 0.00005

          // Decrease danger if you have lawyer upgrades
          const lawyerLevel = upgrades["lawyer"] || 0
          if (lawyerLevel > 0) {
            const lawyerUpgrade = ADVANCED_UPGRADES.find((u) => u.id === "lawyer")
            if (lawyerUpgrade) {
              newDanger -= lawyerLevel * lawyerUpgrade.effect
            }
          }

          // Clamp between 0 and 100
          newDanger = Math.max(0, Math.min(100, newDanger))

          // Trigger DEA raid if danger level reaches 100%
          if (newDanger >= 100 && !showDEARaid) {
            setShowDEARaid(true)
          }

          return newDanger
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [moneyPerSecond, upgrades, showDEARaid])

  // Handle DEA raid
  const handleDEARaid = () => {
    setShowDEARaid(false)
    setDangerLevel(0)

    // Lose half of your money
    setMoney((prevMoney) => Math.floor(prevMoney * 0.5))

    // Add achievement if not already earned
    if (!achievements.includes("Survivor")) {
      setAchievements((prev) => [...prev, "Survivor"])
    }
  }

  // Calculate current milestone based on total money
  const getCurrentMilestone = () => {
    for (let i = EMPIRE_MILESTONES.length - 1; i >= 0; i--) {
      if (totalMoney >= EMPIRE_MILESTONES[i].threshold) {
        return EMPIRE_MILESTONES[i]
      }
    }
    return EMPIRE_MILESTONES[0]
  }

  // Calculate progress to next milestone
  const getNextMilestoneProgress = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = EMPIRE_MILESTONES.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === EMPIRE_MILESTONES.length - 1) {
      return 100 // Already at max milestone
    }

    const currentThreshold = EMPIRE_MILESTONES[currentIndex].threshold
    const nextThreshold = EMPIRE_MILESTONES[currentIndex + 1].threshold
    const progress = ((totalMoney - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Get the next milestone
  const getNextMilestone = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = EMPIRE_MILESTONES.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === EMPIRE_MILESTONES.length - 1) {
      return null // Already at max milestone
    }

    return EMPIRE_MILESTONES[currentIndex + 1]
  }

  return (
    <div className="min-h-screen flex items-center justify-center breaking-bad-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="play-button-overlay"></div>

      <div className="notification-particles">
        {Array.from({ length: 10 }).map((_, index) => {
          const size = Math.random() * 30 + 10
          const left = Math.random() * 100
          const delay = Math.random() * 15
          const duration = Math.random() * 10 + 10

          return (
            <div
              key={index}
              className="notification-particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `-${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      <div className="fixed-height-container relative z-10" onClick={handleClick} style={{ cursor: "pointer" }}>
        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-green-900/50 hover:shadow-xl transition-all main-card mb-4 relative">
          <CardHeader className="bg-gradient-to-r from-green-900 to-green-600 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Beaker className="mr-2 h-6 w-6" /> Breaking Bad Clicker
            </CardTitle>
            <CardDescription className="text-center text-white/80">Cook, sell, and build your empire</CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {/* Click effects container with absolute positioning */}
            <div className="click-effects-container">
              {clickEffects.map((effect) => (
                <div
                  key={effect.id}
                  className="click-effect"
                  style={{
                    left: `${effect.x}%`,
                    top: `${effect.y}%`,
                    color: effect.isSpecial ? "#4cbb17" : "#ffffff",
                    textShadow: effect.isSpecial
                      ? "0 0 10px rgba(76, 187, 23, 0.7)"
                      : "0 0 5px rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <div className="click-effect-emoji">{effect.emoji}</div>
                  <div className="click-effect-text">{effect.text}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                <p className="text-lg font-bold text-white">Money: {formatNumber(money)}</p>
              </div>
              <div className="flex gap-2 items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-400" />
                <p className="text-sm text-gray-300">Heat: {Math.floor(dangerLevel)}%</p>
              </div>
            </div>

            {/* Empire milestone with icon */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">{getCurrentMilestone().icon}</span>
                <span className="text-sm text-gray-300">{getCurrentMilestone().name}</span>
              </div>
              {getNextMilestone() && (
                <span className="text-xs text-gray-400">
                  Next: {getNextMilestone()?.icon} {getNextMilestone()?.name}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="video-progress">
              <div className="video-progress-fill" style={{ width: `${getNextMilestoneProgress()}%` }}></div>
            </div>

            <div className="stats-grid">
              <div className="stats-item">
                <p className="text-xs text-gray-400">Product Quality</p>
                <p className="text-sm font-medium text-green-300">{moneyPerClick.toFixed(1)}</p>
              </div>
              <div className="stats-item">
                <p className="text-xs text-gray-400">Production Rate</p>
                <p className="text-sm font-medium text-green-300">+{formatNumber(moneyPerSecond)}/s</p>
              </div>
              <div className="stats-item">
                <p className="text-xs text-gray-400">Total Earned</p>
                <p className="text-sm font-medium text-green-300">${formatNumber(totalMoney)}</p>
              </div>
              <div className="stats-item">
                <p className="text-xs text-gray-400">Total Batches</p>
                <p className="text-sm font-medium text-green-300">{formatNumber(totalClicks)}</p>
              </div>
            </div>

            {/* Product grid */}
            <div className="content-grid mb-4">
              {Object.entries(productCreated)
                .slice(0, 8)
                .map(([type, count], index) => (
                  <div key={index} className="content-item">
                    <div className="content-icon">{count > 10 ? "🧪" : "⚗️"}</div>
                    <div className="text-xs truncate">{type}</div>
                    <div className="content-count">{count}</div>
                  </div>
                ))}
            </div>

            {/* Cook streak indicator */}
            <div className="streak-container">
              {cookStreak > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-green-800">
                  <p className="text-sm font-bold text-white flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {cookStreak}x Cook Streak! +{cookStreak * 10}%
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              ref={clickerRef}
              className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              <Beaker className="h-5 w-5 mr-2" /> Cook Batch
              <span className="ml-2">
                <FlaskRound className={`h-4 w-4 ${likeAnimation ? "like-animation" : ""}`} />
              </span>
            </Button>

            {/* Achievement section */}
            {achievements.length > 0 && (
              <div className="mt-4 p-2 rounded-lg bg-gray-800/50 achievements-container">
                <p className="text-sm font-medium text-white mb-1">Recent Achievements:</p>
                <div className="text-xs text-gray-300">
                  {achievements.slice(-3).map((achievement, index) => (
                    <div key={index} className="flex items-center py-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger warning */}
            {dangerLevel >= 80 && (
              <div className="subscriber-milestone mt-2 bg-red-900/20 text-red-400">
                "DEA surveillance intensifying! Reduce production or hire a lawyer!"
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-green-900/50 upgrades-card"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up to parent
        >
          <CardHeader className="bg-gradient-to-r from-green-900 to-green-600 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Operation Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-green-600 font-bold" : "bg-green-800 text-white"}`}
                >
                  Equipment
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-green-600 font-bold" : "bg-green-800 text-white"}`}
                >
                  Business
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your lab equipment" : "Expand your operation and distribution"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="upgrades-content">
              {upgradesPage === 1 ? (
                // Page 1: Basic upgrades (equipment)
                <>
                  {UPGRADES.map((upgrade) => {
                    const currentLevel = upgrades[upgrade.id] || 0
                    const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                    const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                    return (
                      <div
                        key={upgrade.id}
                        onClick={() => money >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-900/30 transition-all mb-2 ${
                          money >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-green-300 flex items-center text-sm">
                            {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                          </h3>
                          <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                          <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                        </div>
                        <div
                          className={`${
                            money >= cost && !isMaxLevel
                              ? "bg-gradient-to-r from-green-600 to-green-800"
                              : "bg-gray-700"
                          } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                        >
                          {isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                        </div>
                      </div>
                    )
                  })}

                  {ADVANCED_UPGRADES.filter((u) => u.id === "lab").map((upgrade) => {
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
                        onClick={() => isUnlocked && money >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-900/30 transition-all mb-2 ${
                          isUnlocked
                            ? money >= cost && !isMaxLevel
                              ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                              : "bg-gray-800/30 opacity-70"
                            : "bg-gray-700/30 opacity-50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-green-300 flex items-center text-sm">
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
                            isUnlocked && money >= cost && !isMaxLevel
                              ? "bg-gradient-to-r from-green-600 to-green-800"
                              : "bg-gray-700"
                          } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                        >
                          {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                // Page 2: Advanced upgrades (business & distribution)
                <>
                  {ADVANCED_UPGRADES.filter(
                    (u) =>
                      u.id !== "lab" &&
                      ["dealer", "distributor", "lawyer", "cartel", "laundry", "territory", "empire"].includes(u.id),
                  ).map((upgrade) => {
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
                        onClick={() => isUnlocked && money >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-900/30 transition-all mb-2 ${
                          isUnlocked
                            ? money >= cost && !isMaxLevel
                              ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                              : "bg-gray-800/30 opacity-70"
                            : "bg-gray-700/30 opacity-50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-green-300 flex items-center text-sm">
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
                            isUnlocked && money >= cost && !isMaxLevel
                              ? "bg-gradient-to-r from-green-600 to-green-800"
                              : "bg-gray-700"
                          } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                        >
                          {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offline Progress Message */}
        {offlineMessage && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-400">
                Operation Update!
              </h3>
              <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
              <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-400">
                ${formatNumber(offlineMessage.amount)}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setOfflineMessage(null)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg hover:from-green-700 hover:to-green-900 transition-all"
                >
                  Collect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEA Raid Modal */}
        {showDEARaid && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="text-3xl font-bold mb-4 text-red-500">DEA RAID!</h3>
              <p className="text-lg mb-6 text-gray-300">
                Your operation has attracted too much attention! The DEA has raided your lab and seized half of your
                money.
              </p>
              <button
                onClick={handleDEARaid}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold text-lg"
              >
                Lay Low
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .breaking-bad-bg {
          background-color: #0a0a0a;
          background-image: linear-gradient(to bottom, rgba(0, 40, 0, 0.2), rgba(0, 0, 0, 0.8));
        }
        
        .fixed-height-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .main-card {
          min-height: 500px;
        }
        
        .upgrades-card {
          min-height: 300px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
          margin-top: 16px;
        }
        
        .stats-item {
          background-color: rgba(31, 41, 55, 0.5);
          padding: 8px;
          border-radius: 8px;
          height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-bottom: 16px;
        }
        
        .content-item {
          background-color: rgba(31, 41, 55, 0.3);
          border-radius: 4px;
          padding: 4px;
          text-align: center;
          position: relative;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .content-icon {
          font-size: 20px;
          margin-bottom: 2px;
        }
        
        .content-count {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: rgba(16, 185, 129, 0.8);
          color: white;
          font-size: 10px;
          border-radius: 10px;
          padding: 1px 4px;
          min-width: 16px;
          text-align: center;
        }
        
        .streak-container {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        
        .achievements-container {
          height: 100px;
          overflow-y: auto;
        }
        
        .video-progress {
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .video-progress-fill {
          height: 100%;
          background-color: #10b981;
          transition: width 0.3s ease;
        }
        
        .subscriber-milestone {
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          text-align: center;
          margin-top: 8px;
        }
        
        .like-animation {
          animation: pulse 0.5s ease-in-out;
        }
        
        .upgrades-content {
          max-height: 300px;
          overflow-y: auto;
          padding-right: 4px;
        }
        
        .upgrades-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .upgrades-content::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 2px;
        }
        
        .upgrades-content::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 2px;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
        }
        
        .modal-content {
          background-color: #1f2937;
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        
        .notification-particles {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .notification-particle {
          position: absolute;
          background-color: rgba(16, 185, 129, 0.3);
          border-radius: 50%;
          animation: float-up 15s linear infinite;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }
        
        /* Click effects container */
        .click-effects-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        
        /* Individual click effect */
        .click-effect {
          position: absolute;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          animation: float-and-fade 1s forwards;
          white-space: nowrap;
          font-weight: bold;
          transform: translate(-50%, -50%);
        }
        
        .click-effect-emoji {
          font-size: 1.2rem;
          margin-right: 4px;
        }
        
        .click-effect-text {
          font-size: 0.9rem;
        }
        
        @keyframes float-and-fade {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          10% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          20% {
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default BreakingBadClicker
