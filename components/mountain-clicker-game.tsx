"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { createClickEffect } from "@/utils/click-effect"
import ResetButton from "@/components/reset-button"
import type React from "react"

interface UpgradeData {
  id: string
  name: string
  description: string
  cost: number
  value: number
  count: number
  unlockAt: number
  multiplier: number
  iconType: string
  isSpecial?: boolean
}

interface AchievementData {
  id: string
  name: string
  description: string
  requirement: number
  unlocked: boolean
  iconType: string
}

export default function MountainClicker() {
  const [altitude, setAltitude] = useState(0)
  const [clickValue, setClickValue] = useState(1)
  const [passiveValue, setPassiveValue] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [upgradesData, setUpgradesData] = useState<UpgradeData[]>([
    {
      id: "hiking-boots",
      name: "Hiking Boots",
      description: "Better traction means faster climbing.",
      cost: 10,
      value: 1,
      count: 0,
      unlockAt: 0,
      multiplier: 1.15,
      iconType: "boot",
    },
    {
      id: "trekking-poles",
      name: "Trekking Poles",
      description: "Stabilizes movement for faster climbing.",
      cost: 50,
      value: 2,
      count: 0,
      unlockAt: 30,
      multiplier: 1.15,
      iconType: "move",
    },
    {
      id: "mountain-map",
      name: "Mountain Map",
      description: "Find optimal routes up the mountains.",
      cost: 200,
      value: 4,
      count: 0,
      unlockAt: 100,
      multiplier: 1.2,
      iconType: "map",
    },
    {
      id: "weather-gear",
      name: "Weather Gear",
      description: "Protection from harsh mountain conditions.",
      cost: 500,
      value: 8,
      count: 0,
      unlockAt: 300,
      multiplier: 1.2,
      iconType: "cloud",
    },
    {
      id: "energy-snacks",
      name: "Energy Snacks",
      description: "High-energy food for climbers.",
      cost: 1000,
      value: 15,
      count: 0,
      unlockAt: 500,
      multiplier: 1.25,
      iconType: "apple",
    },
    {
      id: "camping-equipment",
      name: "Camping Equipment",
      description: "Set up camps to rest during long climbs.",
      cost: 3000,
      value: 25,
      count: 0,
      unlockAt: 1000,
      multiplier: 1.25,
      iconType: "tent",
      isSpecial: true,
    },
    {
      id: "climbing-supplies",
      name: "Climbing Supplies",
      description: "Professional climbing gear.",
      cost: 7500,
      value: 40,
      count: 0,
      unlockAt: 2000,
      multiplier: 1.3,
      iconType: "compass",
    },
    {
      id: "mountain-guide",
      name: "Mountain Guide",
      description: "Experienced guides help you navigate difficult terrain.",
      cost: 15000,
      value: 80,
      count: 0,
      unlockAt: 4000,
      multiplier: 1.3,
      iconType: "user",
    },
    {
      id: "oxygen-tank",
      name: "Oxygen Tank",
      description: "Breathe easier at high altitudes.",
      cost: 50000,
      value: 150,
      count: 0,
      unlockAt: 6000,
      multiplier: 1.35,
      iconType: "wind",
    },
    {
      id: "expedition-team",
      name: "Expedition Team",
      description: "A full team of professional climbers.",
      cost: 150000,
      value: 300,
      count: 0,
      unlockAt: 8000,
      multiplier: 1.4,
      iconType: "users",
    },
    {
      id: "helicopter",
      name: "Helicopter Service",
      description: "Airlift supplies to higher camps.",
      cost: 500000,
      value: 600,
      count: 0,
      unlockAt: 15000,
      multiplier: 1.4,
      iconType: "helicopter",
    },
    {
      id: "advanced-weather-station",
      name: "Advanced Weather Station",
      description: "Predict weather patterns for safer climbing.",
      cost: 1000000,
      value: 1200,
      count: 0,
      unlockAt: 25000,
      multiplier: 1.45,
      iconType: "cloud-lightning",
    },
    {
      id: "satellite-navigation",
      name: "Satellite Navigation",
      description: "Cutting-edge GPS technology for precise route planning.",
      cost: 5000000,
      value: 3000,
      count: 0,
      unlockAt: 50000,
      multiplier: 1.5,
      iconType: "satellite",
    },
    {
      id: "research-outpost",
      name: "Research Outpost",
      description: "Scientific base that studies mountain environments.",
      cost: 20000000,
      value: 7500,
      count: 0,
      unlockAt: 100000,
      multiplier: 1.55,
      iconType: "home",
      isSpecial: true,
    },
    {
      id: "mountain-tunnel",
      name: "Mountain Tunnel System",
      description: "A network of tunnels through the mountains.",
      cost: 100000000,
      value: 20000,
      count: 0,
      unlockAt: 500000,
      multiplier: 1.6,
      iconType: "drill",
    },
  ])

  const [achievementsData, setAchievementsData] = useState<AchievementData[]>([
    {
      id: "mount-fuji",
      name: "Mount Fuji",
      description: "Reach 3,776m altitude",
      requirement: 3776,
      unlocked: false,
      iconType: "mountain",
    },
    {
      id: "mont-blanc",
      name: "Mont Blanc",
      description: "Reach 4,809m altitude",
      requirement: 4809,
      unlocked: false,
      iconType: "mountain-snow",
    },
    {
      id: "kilimanjaro",
      name: "Mount Kilimanjaro",
      description: "Reach 5,895m altitude",
      requirement: 5895,
      unlocked: false,
      iconType: "mountain",
    },
    {
      id: "denali",
      name: "Denali",
      description: "Reach 6,190m altitude",
      requirement: 6190,
      unlocked: false,
      iconType: "mountain-snow",
    },
    {
      id: "everest",
      name: "Mount Everest",
      description: "Reach 8,848m altitude",
      requirement: 8848,
      unlocked: false,
      iconType: "flag",
    },
    {
      id: "k2",
      name: "K2",
      description: "Reach 8,611m altitude",
      requirement: 8611,
      unlocked: false,
      iconType: "mountain-snow",
    },
    {
      id: "super-mountain",
      name: "Super Mountain",
      description: "Reach 10,000m altitude",
      requirement: 10000,
      unlocked: false,
      iconType: "mountain",
    },
    {
      id: "stratosphere",
      name: "Stratosphere",
      description: "Reach 50,000m altitude",
      requirement: 50000,
      unlocked: false,
      iconType: "cloud",
    },
    {
      id: "space-mountain",
      name: "Space Mountain",
      description: "Reach 100,000m altitude",
      requirement: 100000,
      unlocked: false,
      iconType: "star",
    },
  ])

  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get icon by type
  const getIconByType = (type: string) => {
    switch (type) {
      case "mountain":
        return "🏔️"
      case "mountain-snow":
        return "❄️"
      case "boot":
        return "👟"
      case "move":
        return "🥾"
      case "map":
        return "🗺️"
      case "cloud":
        return "🌧️"
      case "apple":
        return "🍎"
      case "tent":
        return "⛺"
      case "compass":
        return "🧭"
      case "user":
        return "🧗"
      case "wind":
        return "💨"
      case "users":
        return "👥"
      case "flag":
        return "🚩"
      case "helicopter":
        return "🚁"
      case "cloud-lightning":
        return "⚡"
      case "satellite":
        return "🛰️"
      case "home":
        return "🏠"
      case "drill":
        return "🔨"
      case "star":
        return "⭐"
      default:
        return "🏔️"
    }
  }

  // Convert data to UI objects
  const upgrades = upgradesData.map((upgrade) => ({
    ...upgrade,
    icon: getIconByType(upgrade.iconType),
  }))

  const achievements = achievementsData.map((achievement) => ({
    ...achievement,
    icon: getIconByType(achievement.iconType),
  }))

  // Load game state from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("mountainClicker")
    if (savedData) {
      const { altitude, upgradesData, achievementsData } = JSON.parse(savedData)
      setAltitude(altitude)
      setUpgradesData(upgradesData)
      setAchievementsData(achievementsData)
    }
  }, [])

  // Save game state to localStorage
  useEffect(() => {
    if (altitude > 0) {
      localStorage.setItem(
        "mountainClicker",
        JSON.stringify({
          altitude,
          upgradesData,
          achievementsData,
        }),
      )
    }
  }, [altitude, upgradesData, achievementsData])

  // Calculate passive value
  useEffect(() => {
    let passiveValue = 0
    let multiplier = 1

    // Calculate camping equipment multiplier (10% per level)
    const campingEquipment = upgradesData.find((u) => u.id === "camping-equipment")
    if (campingEquipment && campingEquipment.count > 0) {
      multiplier += campingEquipment.count * 0.1
    }

    // Calculate research outpost multiplier (15% per level)
    const researchOutpost = upgradesData.find((u) => u.id === "research-outpost")
    if (researchOutpost && researchOutpost.count > 0) {
      multiplier += researchOutpost.count * 0.15
    }

    // Calculate passive value from all upgrades
    upgradesData.forEach((upgrade) => {
      if (upgrade.id !== "hiking-boots") {
        passiveValue += upgrade.value * upgrade.count
      }
    })

    // Apply multiplier
    passiveValue = Math.floor(passiveValue * multiplier)
    setPassiveValue(passiveValue)

    // Calculate click value
    const hikingBoots = upgradesData.find((u) => u.id === "hiking-boots")
    let clickVal = 1
    if (hikingBoots) {
      clickVal += hikingBoots.value * hikingBoots.count
    }
    clickVal = Math.floor(clickVal * multiplier)
    setClickValue(clickVal)
  }, [upgradesData])

  // Passive income
  useEffect(() => {
    if (passiveValue > 0) {
      const interval = setInterval(() => {
        setAltitude((prev) => prev + passiveValue)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [passiveValue])

  // Check achievements
  useEffect(() => {
    achievementsData.forEach((achievement) => {
      if (!achievement.unlocked && altitude >= achievement.requirement) {
        const newAchievements = achievementsData.map((a) => (a.id === achievement.id ? { ...a, unlocked: true } : a))
        setAchievementsData(newAchievements)
        setNotificationMessage(`Achievement Unlocked: ${achievement.name}`)
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
      }
    })
  }, [altitude, achievementsData])

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAltitude((prev) => prev + clickValue)

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      createClickEffect({
        x,
        y,
        container: containerRef.current,
        content: `+${clickValue}`,
        colors: ["#3b82f6", "#0ea5e9", "#0284c7"],
      })
    }
  }

  // Buy upgrade
  const buyUpgrade = (id: string) => {
    const upgrade = upgradesData.find((u) => u.id === id)
    if (!upgrade) return

    if (altitude >= upgrade.cost) {
      setAltitude((prev) => prev - upgrade.cost)
      const newUpgrades = upgradesData.map((u) =>
        u.id === id
          ? {
              ...u,
              count: u.count + 1,
              cost: Math.floor(u.cost * u.multiplier),
            }
          : u,
      )
      setUpgradesData(newUpgrades)
    }
  }

  // Reset game
  const resetGame = () => {
    setAltitude(0)
    setUpgradesData(
      upgradesData.map((u) => ({
        ...u,
        count: 0,
        cost:
          u.id === "hiking-boots"
            ? 10
            : u.id === "trekking-poles"
              ? 50
              : u.id === "mountain-map"
                ? 200
                : u.id === "weather-gear"
                  ? 500
                  : u.id === "energy-snacks"
                    ? 1000
                    : u.id === "camping-equipment"
                      ? 3000
                      : u.id === "climbing-supplies"
                        ? 7500
                        : u.id === "mountain-guide"
                          ? 15000
                          : u.id === "oxygen-tank"
                            ? 50000
                            : u.id === "expedition-team"
                              ? 150000
                              : u.id === "helicopter"
                                ? 500000
                                : u.id === "advanced-weather-station"
                                  ? 1000000
                                  : u.id === "satellite-navigation"
                                    ? 5000000
                                    : u.id === "research-outpost"
                                      ? 20000000
                                      : 100000000,
      })),
    )
    setAchievementsData(achievementsData.map((a) => ({ ...a, unlocked: false })))
    localStorage.removeItem("mountainClicker")
  }

  const reset = useCallback(() => {
    // if (intervalRef.current) {
    //   clearInterval(intervalRef.current);
    // }
    // setTime(0);
    // setIsRunning(false);
  }, [])

  return (
    <div className="mountain-clicker-container" ref={containerRef}>
      <div className="mountain-clicker-header">
        <Link href="/" className="mountain-clicker-back-button">
          Back to Home
        </Link>
        <h1 className="mountain-clicker-title">Mountain Explorer</h1>
        <ResetButton onClick={resetGame} />
      </div>

      <div className="mountain-clicker-content">
        <div className="mountain-clicker-main">
          <div className="mountain-clicker-score">{Math.floor(altitude).toLocaleString()} m</div>
          <div className="mountain-clicker-label">Altitude</div>
          <button className="mountain-clicker-button" onClick={handleClick} ref={buttonRef}>
            🏔️
          </button>
          <div className="mountain-clicker-passive">
            {passiveValue > 0 ? `+${passiveValue.toLocaleString()} meters/sec` : ""}
          </div>
        </div>

        <div className="mountain-clicker-section">
          <h2 className="mountain-clicker-section-title">Upgrades</h2>
          <div className="mountain-clicker-scrollable">
            {upgrades.map((upgrade) => (
              <div
                key={upgrade.id}
                className={`mountain-clicker-upgrade ${
                  altitude < upgrade.cost ? "mountain-clicker-upgrade-disabled" : ""
                } ${upgrade.unlockAt > altitude && upgrade.count === 0 ? "mountain-clicker-upgrade-locked" : ""}`}
                onClick={() => altitude >= upgrade.cost && upgrade.unlockAt <= altitude && buyUpgrade(upgrade.id)}
              >
                <div className="mountain-clicker-upgrade-icon">{upgrade.icon}</div>
                <div className="mountain-clicker-upgrade-info">
                  <h3 className="mountain-clicker-upgrade-name">
                    {upgrade.name} {upgrade.count > 0 && `(${upgrade.count})`}
                  </h3>
                  <p className="mountain-clicker-upgrade-description">
                    {upgrade.description}
                    {upgrade.isSpecial &&
                      upgrade.id === "camping-equipment" &&
                      " Multiplies all gains by 10% per level."}
                    {upgrade.isSpecial &&
                      upgrade.id === "research-outpost" &&
                      " Multiplies all gains by 15% per level."}
                  </p>
                  {upgrade.unlockAt > altitude && upgrade.count === 0 ? (
                    <p className="mountain-clicker-upgrade-locked-text">
                      Unlocks at {upgrade.unlockAt.toLocaleString()}m
                    </p>
                  ) : (
                    <div className="mountain-clicker-upgrade-cost">{Math.floor(upgrade.cost).toLocaleString()} m</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mountain-clicker-section">
          <h2 className="mountain-clicker-section-title">Achievements</h2>
          <div className="mountain-clicker-scrollable">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`mountain-clicker-achievement ${
                  achievement.unlocked ? "mountain-clicker-achievement-unlocked" : "mountain-clicker-achievement-locked"
                }`}
              >
                <div className="mountain-clicker-achievement-icon">{achievement.icon}</div>
                <div className="mountain-clicker-achievement-info">
                  <h3 className="mountain-clicker-achievement-name">{achievement.name}</h3>
                  <p className="mountain-clicker-achievement-description">{achievement.description}</p>
                  <div className="mountain-clicker-progress-bar">
                    <div
                      className="mountain-clicker-progress"
                      style={{
                        width: `${Math.min(100, (altitude / achievement.requirement) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNotification && <div className="mountain-clicker-notification">{notificationMessage}</div>}
    </div>
  )
}
