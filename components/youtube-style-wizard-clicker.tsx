"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  Wand2,
  Sparkles,
  FlaskRoundIcon as Flask,
  Book,
  Scroll,
  StarIcon as Staff,
  Zap,
  Flame,
  Droplets,
  Wind,
} from "lucide-react"
import { formatNumber } from "@/utils/format-number"
import { isMobileDevice, getReducedAnimations } from "@/utils/mobile-optimization"

interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  value: number
  owned: number
  iconType: string
  unlocked?: boolean
  requirement?: {
    type: "mana" | "upgrade"
    id?: string
    value: number
  }
}

interface Milestone {
  name: string
  requirement: number
  icon: string
  achieved: boolean
}

const clickMessages = [
  "Magic!",
  "Arcane!",
  "Spell!",
  "Power!",
  "Mystic!",
  "Enchant!",
  "Wizardry!",
  "Sorcery!",
  "Conjure!",
  "Mana!",
  "Fireball!",
  "Lightning!",
  "Frost!",
  "Arcana!",
  "Elemental!",
]

// Function to get icon based on iconType
const getIconByType = (iconType: string) => {
  switch (iconType) {
    case "wand":
      return <Wand2 className="h-5 w-5 text-purple-300" />
    case "book":
      return <Book className="h-5 w-5 text-purple-300" />
    case "flask":
      return <Flask className="h-5 w-5 text-purple-300" />
    case "scroll":
      return <Scroll className="h-5 w-5 text-purple-300" />
    case "staff":
      return <Staff className="h-5 w-5 text-purple-300" />
    case "sparkles":
      return <Sparkles className="h-5 w-5 text-purple-300" />
    case "flame":
      return <Flame className="h-5 w-5 text-orange-400" />
    case "zap":
      return <Zap className="h-5 w-5 text-yellow-300" />
    case "droplets":
      return <Droplets className="h-5 w-5 text-blue-400" />
    case "wind":
      return <Wind className="h-5 w-5 text-sky-300" />
    default:
      return <Wand2 className="h-5 w-5 text-purple-300" />
  }
}

export default function YouTubeStyleWizardClicker() {
  const [mana, setMana] = useState(0)
  const [manaPerSecond, setManaPerSecond] = useState(0)
  const [manaPerClick, setManaPerClick] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [reduceAnimations, setReduceAnimations] = useState(false)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "wand",
      name: "Magic Wand",
      description: "A basic wand to channel your magical energy",
      cost: 10,
      value: 0.1,
      owned: 0,
      iconType: "wand",
    },
    {
      id: "spellbook",
      name: "Spellbook",
      description: "Ancient tome containing magical knowledge",
      cost: 50,
      value: 0.5,
      owned: 0,
      iconType: "book",
    },
    {
      id: "potion",
      name: "Mana Potion",
      description: "Magical elixir that enhances your mana generation",
      cost: 200,
      value: 2,
      owned: 0,
      iconType: "flask",
    },
    {
      id: "scroll",
      name: "Arcane Scroll",
      description: "Powerful scroll with ancient spells",
      cost: 500,
      value: 5,
      owned: 0,
      iconType: "scroll",
    },
    {
      id: "staff",
      name: "Wizard Staff",
      description: "Powerful staff that amplifies your magical abilities",
      cost: 1000,
      value: 10,
      owned: 0,
      iconType: "staff",
    },
    {
      id: "familiar",
      name: "Magical Familiar",
      description: "A mystical creature that assists with your spellcasting",
      cost: 5000,
      value: 25,
      owned: 0,
      iconType: "sparkles",
      unlocked: false,
      requirement: {
        type: "mana",
        value: 1000,
      },
    },
    {
      id: "fireball",
      name: "Fireball Spell",
      description: "Powerful fire magic that generates mana from heat",
      cost: 10000,
      value: 50,
      owned: 0,
      iconType: "flame",
      unlocked: false,
      requirement: {
        type: "mana",
        value: 5000,
      },
    },
    {
      id: "lightning",
      name: "Lightning Spell",
      description: "Harness the power of storms to generate mana",
      cost: 50000,
      value: 100,
      owned: 0,
      iconType: "zap",
      unlocked: false,
      requirement: {
        type: "mana",
        value: 10000,
      },
    },
    {
      id: "watermagic",
      name: "Water Magic",
      description: "Flow like water to enhance your mana generation",
      cost: 100000,
      value: 250,
      owned: 0,
      iconType: "droplets",
      unlocked: false,
      requirement: {
        type: "mana",
        value: 50000,
      },
    },
    {
      id: "airmagic",
      name: "Air Magic",
      description: "Command the winds to boost your magical power",
      cost: 500000,
      value: 500,
      owned: 0,
      iconType: "wind",
      unlocked: false,
      requirement: {
        type: "mana",
        value: 100000,
      },
    },
  ])

  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "Apprentice Wizard", requirement: 100, icon: "🧙‍♂️", achieved: false },
    { name: "Adept Spellcaster", requirement: 1000, icon: "📚", achieved: false },
    { name: "Magical Scholar", requirement: 10000, icon: "🔮", achieved: false },
    { name: "Arcane Master", requirement: 100000, icon: "⚡", achieved: false },
    { name: "Elemental Sage", requirement: 500000, icon: "🌪️", achieved: false },
    { name: "Grand Sorcerer", requirement: 1000000, icon: "✨", achieved: false },
    { name: "Archmage", requirement: 10000000, icon: "🌟", achieved: false },
    { name: "Legendary Wizard", requirement: 100000000, icon: "🔥", achieved: false },
  ])

  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; value: string }[]>([])
  const [nextClickEffectId, setNextClickEffectId] = useState(0)
  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementText, setAchievementText] = useState("")
  const clickAreaRef = useRef<HTMLDivElement>(null)
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null)
  const [progressToNextMilestone, setProgressToNextMilestone] = useState(0)
  const [showUpgrades, setShowUpgrades] = useState(true)
  const [showMilestones, setShowMilestones] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    setIsMobile(isMobileDevice())
    setReduceAnimations(getReducedAnimations())
  }, [])

  // Initialize game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("wizard-clicker-state")
    if (savedState) {
      try {
        const { mana, upgrades: savedUpgrades, milestones: savedMilestones } = JSON.parse(savedState)
        setMana(mana)

        // Update upgrades with saved values
        setUpgrades((prevUpgrades) =>
          prevUpgrades.map((upgrade) => {
            const savedUpgrade = savedUpgrades.find((u: Upgrade) => u.id === upgrade.id)
            if (savedUpgrade) {
              return {
                ...upgrade,
                owned: savedUpgrade.owned,
                cost: savedUpgrade.cost,
                unlocked: savedUpgrade.unlocked ?? upgrade.unlocked,
              }
            }
            return upgrade
          }),
        )

        // Update milestones with saved values
        setMilestones((prevMilestones) =>
          prevMilestones.map((milestone, index) => {
            if (savedMilestones[index]) {
              return { ...milestone, achieved: savedMilestones[index].achieved }
            }
            return milestone
          }),
        )
      } catch (error) {
        console.error("Failed to load saved state:", error)
      }
    }
  }, [])

  // Save game state to localStorage - throttled for mobile
  useEffect(() => {
    // Throttle saves on mobile to reduce performance impact
    const saveInterval = isMobile ? 5000 : 2000

    const saveTimeout = setTimeout(() => {
      if (mana > 0) {
        // Create a simplified version of upgrades without React elements
        const simplifiedUpgrades = upgrades.map(
          ({ id, name, description, cost, value, owned, iconType, unlocked, requirement }) => ({
            id,
            name,
            description,
            cost,
            value,
            owned,
            iconType,
            unlocked,
            requirement,
          }),
        )

        const gameState = {
          mana,
          upgrades: simplifiedUpgrades,
          milestones,
        }
        localStorage.setItem("wizard-clicker-state", JSON.stringify(gameState))
      }
    }, saveInterval)

    return () => clearTimeout(saveTimeout)
  }, [mana, upgrades, milestones, isMobile])

  // Calculate mana per second based on owned upgrades - memoized for performance
  const calculatedManaPerSecond = useMemo(() => {
    let mps = 0
    upgrades.forEach((upgrade) => {
      mps += upgrade.value * upgrade.owned
    })
    return mps
  }, [upgrades])

  // Update manaPerSecond when calculatedManaPerSecond changes
  useEffect(() => {
    setManaPerSecond(calculatedManaPerSecond)
  }, [calculatedManaPerSecond])

  // Increment mana based on mana per second - optimized for mobile
  useEffect(() => {
    if (manaPerSecond <= 0) return

    // Use a longer interval on mobile for better performance
    const interval = isMobile ? 200 : 100
    const incrementAmount = manaPerSecond * (interval / 1000)

    const timer = setInterval(() => {
      setMana((prevMana) => prevMana + incrementAmount)
    }, interval)

    return () => clearInterval(timer)
  }, [manaPerSecond, isMobile])

  // Check for unlocked upgrades - optimized with useMemo
  const unlockedUpgradesCheck = useMemo(() => {
    return upgrades.map((upgrade) => {
      if (upgrade.requirement && !upgrade.unlocked) {
        if (upgrade.requirement.type === "mana" && mana >= upgrade.requirement.value) {
          return { ...upgrade, unlocked: true }
        }
        if (upgrade.requirement.type === "upgrade" && upgrade.requirement.id) {
          const requiredUpgrade = upgrades.find((u) => u.id === upgrade.requirement?.id)
          if (requiredUpgrade && requiredUpgrade.owned >= upgrade.requirement.value) {
            return { ...upgrade, unlocked: true }
          }
        }
      }
      return upgrade
    })
  }, [mana, upgrades])

  // Update upgrades when unlockedUpgradesCheck changes
  useEffect(() => {
    const hasChanges = unlockedUpgradesCheck.some(
      (newUpgrade, index) => newUpgrade.unlocked !== upgrades[index].unlocked,
    )

    if (hasChanges) {
      setUpgrades(unlockedUpgradesCheck)
    }
  }, [unlockedUpgradesCheck, upgrades])

  // Check for achieved milestones - optimized with batch updates
  useEffect(() => {
    let achievementUnlocked = false
    let achievementName = ""
    let needsUpdate = false

    const updatedMilestones = milestones.map((milestone) => {
      if (!milestone.achieved && mana >= milestone.requirement) {
        if (!achievementUnlocked) {
          achievementUnlocked = true
          achievementName = milestone.name
        }
        needsUpdate = true
        return { ...milestone, achieved: true }
      }
      return milestone
    })

    if (achievementUnlocked && !isMobile) {
      setAchievementText(`Achievement Unlocked: ${achievementName}!`)
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 3000)
    }

    if (needsUpdate) {
      setMilestones(updatedMilestones)
    }
  }, [mana, milestones, isMobile])

  // Update current and next milestone - optimized with useMemo
  const { currentMilestoneData, nextMilestoneData, progressData } = useMemo(() => {
    const achievedMilestones = milestones.filter((m) => m.achieved)
    const unachievedMilestones = milestones.filter((m) => !m.achieved)

    const current = achievedMilestones.length > 0 ? achievedMilestones[achievedMilestones.length - 1] : null
    const next = unachievedMilestones.length > 0 ? unachievedMilestones[0] : null

    let progress
    if (current && next) {
      progress = (mana - current.requirement) / (next.requirement - current.requirement)
      progress = Math.min(Math.max(0, progress), 1)
    } else if (!current && next) {
      progress = mana / next.requirement
      progress = Math.min(Math.max(0, progress), 1)
    } else {
      progress = 1
    }

    return {
      currentMilestoneData: current,
      nextMilestoneData: next,
      progressData: progress,
    }
  }, [mana, milestones])

  // Update state with memoized values
  useEffect(() => {
    if (currentMilestoneData !== currentMilestone) {
      setCurrentMilestone(currentMilestoneData)
    }

    if (nextMilestoneData !== nextMilestone) {
      setNextMilestone(nextMilestoneData)
    }

    // Only update if there's a significant change to reduce renders
    if (Math.abs(progressData - progressToNextMilestone) > 0.01) {
      setProgressToNextMilestone(progressData)
    }
  }, [currentMilestoneData, nextMilestoneData, progressData, currentMilestone, nextMilestone, progressToNextMilestone])

  // Handle click on the main click area - optimized for mobile
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      // Add mana
      setMana((prevMana) => prevMana + manaPerClick)

      // Skip click effects on mobile if reduce animations is enabled
      if (reduceAnimations) return

      // Limit number of click effects on mobile
      if (isMobile && clickEffects.length > 5) return

      // Create click effect
      if (clickAreaRef.current) {
        let x, y

        if ("touches" in e) {
          // Touch event
          const touch = e.touches[0]
          const rect = clickAreaRef.current.getBoundingClientRect()
          x = touch.clientX - rect.left
          y = touch.clientY - rect.top
        } else {
          // Mouse event
          const rect = clickAreaRef.current.getBoundingClientRect()
          x = e.clientX - rect.left
          y = e.clientY - rect.top
        }

        // Random message from the clickMessages array
        const message = clickMessages[Math.floor(Math.random() * clickMessages.length)]
        const effectId = nextClickEffectId

        setClickEffects((prev) => [
          ...prev,
          {
            id: effectId,
            x,
            y,
            value: `+${manaPerClick} ${message}`,
          },
        ])
        setNextClickEffectId((prev) => prev + 1)

        // Remove click effect after animation
        setTimeout(
          () => {
            setClickEffects((prev) => prev.filter((effect) => effect.id !== effectId))
          },
          isMobile ? 1000 : 1500,
        )
      }
    },
    [manaPerClick, nextClickEffectId, isMobile, reduceAnimations, clickEffects.length],
  )

  // Handle upgrade purchase
  const handleUpgrade = useCallback(
    (upgradeId: string) => {
      setUpgrades((prevUpgrades) =>
        prevUpgrades.map((upgrade) => {
          if (upgrade.id === upgradeId && mana >= upgrade.cost) {
            setMana((prevMana) => prevMana - upgrade.cost)
            const newOwned = upgrade.owned + 1
            const newCost = Math.floor(upgrade.cost * 1.15)
            return { ...upgrade, owned: newOwned, cost: newCost }
          }
          return upgrade
        }),
      )
    },
    [mana],
  )

  // Toggle between upgrades and milestones view on mobile
  const toggleView = useCallback(() => {
    setShowUpgrades((prev) => !prev)
    setShowMilestones((prev) => !prev)
  }, [])

  return (
    <div className="wizard-clicker-container min-h-screen flex flex-col">
      {/* Header */}
      <div className="wizard-clicker-header text-center py-2 md:py-4">
        <h1 className="wizard-clicker-title text-2xl md:text-3xl font-bold">Wizard Clicker</h1>
        <p className="wizard-clicker-subtitle text-sm md:text-base">Master the arcane arts!</p>
      </div>

      {/* Mobile Toggle Buttons */}
      {isMobile && (
        <div className="flex justify-center gap-2 p-2 bg-purple-900/30">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showUpgrades ? "bg-purple-700 text-white" : "bg-purple-900/50 text-purple-300"
            }`}
            onClick={() => {
              setShowUpgrades(true)
              setShowMilestones(false)
            }}
          >
            Upgrades
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showMilestones ? "bg-purple-700 text-white" : "bg-purple-900/50 text-purple-300"
            }`}
            onClick={() => {
              setShowUpgrades(false)
              setShowMilestones(true)
            }}
          >
            Ranks
          </button>
        </div>
      )}

      {/* Game Area */}
      <div className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4">
        {/* Left Column - Click Area and Stats */}
        <div className="flex-1 flex flex-col gap-2 md:gap-4">
          {/* Current Rank */}
          <div className="bg-purple-900/50 rounded-lg p-2 md:p-4 text-center">
            <div className="text-base md:text-lg font-semibold text-purple-200">
              {currentMilestone ? (
                <>
                  <span className="mr-2">{currentMilestone.icon}</span>
                  <span>{currentMilestone.name}</span>
                </>
              ) : (
                "Novice Wizard"
              )}
            </div>

            {/* Progress Bar */}
            {nextMilestone && (
              <div className="mt-1 md:mt-2">
                <div className="h-2 bg-purple-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    style={{ width: `${progressToNextMilestone * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-purple-300">
                  <span>{currentMilestone ? formatNumber(currentMilestone.requirement) : "0"}</span>
                  <span>{nextMilestone ? formatNumber(nextMilestone.requirement) : ""}</span>
                </div>
                <div className="text-xs md:text-sm mt-1 text-purple-300">
                  Next: {nextMilestone.name} {nextMilestone.icon}
                </div>
              </div>
            )}
          </div>

          {/* Click Area */}
          <div
            ref={clickAreaRef}
            className="wizard-click-area flex-1 flex flex-col items-center justify-center bg-purple-900/30 rounded-lg p-4 md:p-8 relative cursor-pointer"
            onClick={handleClick}
            onTouchStart={handleClick}
          >
            <div className="wizard-staff mb-4 md:mb-6">
              <Wand2 className="h-12 w-12 md:h-16 md:w-16 text-purple-300 hover:text-purple-200 transition-all" />
            </div>

            <div className="wizard-stats text-center">
              <div className="wizard-mana text-xl md:text-2xl font-bold">
                {formatNumber(Math.floor(mana))} <span className="text-purple-300">Mana</span>
              </div>
              <div className="wizard-per-second text-xs md:text-sm">per second: {formatNumber(manaPerSecond)}</div>
              <div className="wizard-per-click text-xs md:text-sm">per click: {formatNumber(manaPerClick)}</div>
            </div>

            {/* Click Effects - limited on mobile */}
            {!reduceAnimations &&
              clickEffects.map((effect) => (
                <div
                  key={effect.id}
                  className="wizard-click-effect absolute pointer-events-none"
                  style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
                >
                  {effect.value}
                </div>
              ))}
          </div>
        </div>

        {/* Right Column - Upgrades (conditionally shown on mobile) */}
        {(!isMobile || showUpgrades) && (
          <div className="wizard-upgrades flex-1 overflow-y-auto">
            <h2 className="wizard-upgrade-title mb-2 md:mb-4">Magical Upgrades</h2>

            {upgrades
              .filter((upgrade) => upgrade.unlocked !== false)
              .map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`wizard-upgrade-item ${mana < upgrade.cost ? "disabled" : ""}`}
                  onClick={() => mana >= upgrade.cost && handleUpgrade(upgrade.id)}
                >
                  <div className="wizard-upgrade-info flex items-center">
                    <div className="mr-2 md:mr-3">{getIconByType(upgrade.iconType)}</div>
                    <div>
                      <div className="wizard-upgrade-name text-sm md:text-base">{upgrade.name}</div>
                      <div className="wizard-upgrade-description text-xs">{upgrade.description}</div>
                      <div className="wizard-upgrade-owned mt-1 text-xs">Owned: {upgrade.owned}</div>
                    </div>
                  </div>
                  <div className="wizard-upgrade-cost text-xs md:text-sm">{formatNumber(Math.floor(upgrade.cost))}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Milestones Section - conditionally shown on mobile */}
      {(!isMobile || showMilestones) && (
        <div className="p-2 md:p-4 bg-purple-900/20">
          <h2 className="text-lg md:text-xl font-bold text-center mb-2 md:mb-4 text-purple-200">Wizard Ranks</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`p-2 md:p-3 rounded-lg text-center w-24 md:w-32 transition-all ${
                  milestone.achieved ? "bg-purple-700/50 text-purple-100" : "bg-purple-900/30 text-purple-400/50"
                }`}
              >
                <div className="text-xl md:text-2xl mb-1">{milestone.icon}</div>
                <div className="font-semibold text-xs md:text-sm">{milestone.name}</div>
                <div className="text-xs mt-1">{formatNumber(milestone.requirement)} Mana</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Notification - hidden on mobile */}
      {!isMobile && <div className={`wizard-achievement ${showAchievement ? "show" : ""}`}>{achievementText}</div>}
    </div>
  )
}
