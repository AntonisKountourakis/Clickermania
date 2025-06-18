"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { formatNumber } from "@/utils/format-number"
import { Home, Building, Ship, Book, Key, Map, TrendingUp, Trees } from "lucide-react"
import { GameBackButton } from "@/components/game-back-button"
import "../app/games/unified-original-style.css"
import "../app/games/1922-clicker/1922-clicker.css"

export default function NineteenTwentyTwoClickerGame() {
  // Game state
  const [resources, setResources] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickPower, setAutoClickPower] = useState(0)
  const [upgrades, setUpgrades] = useState({
    shelter: { level: 0, cost: 10, effect: 1, name: "Basic Shelter", description: "Improve click power" },
    transport: { level: 0, cost: 50, effect: 5, name: "Transport", description: "Improve click power" },
    community: { level: 0, cost: 200, effect: 1, name: "Community Center", description: "Auto-generate resources" },
    farmland: { level: 0, cost: 1000, effect: 5, name: "Farmland", description: "Auto-generate resources" },
    education: { level: 0, cost: 5000, effect: 25, name: "School", description: "Improve click power" },
    municipal: {
      level: 0,
      cost: 20000,
      effect: 30,
      name: "Municipal Building",
      description: "Auto-generate resources",
    },
    culture: { level: 0, cost: 100000, effect: 100, name: "Cultural Center", description: "Improve click power" },
    district: { level: 0, cost: 500000, effect: 200, name: "New District", description: "Auto-generate resources" },
  })

  // Visual effects
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; message: string; isCritical: boolean }>
  >([])
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  // Game prefix for localStorage
  const gamePrefix = "1922-clicker"

  // Ranks
  const RANKS = [
    { name: "Newcomer", threshold: 0 },
    { name: "Settler", threshold: 100 },
    { name: "Builder", threshold: 1000 },
    { name: "Coordinator", threshold: 10000 },
    { name: "Planner", threshold: 100000 },
    { name: "Developer", threshold: 1000000 },
    { name: "Administrator", threshold: 10000000 },
    { name: "Visionary", threshold: 100000000 },
    { name: "Founder", threshold: 1000000000 },
  ]

  // Messages for click effects
  const CLICK_MESSAGES = [
    "PROGRESS!",
    "BUILD!",
    "GROW!",
    "DEVELOP!",
    "THRIVE!",
    "RESTORE!",
    "HOPE!",
    "UNITY!",
    "RENEWAL!",
    "FUTURE!",
  ]

  const MAX_CLICK_EFFECTS = 5

  // Load saved game
  useEffect(() => {
    const savedResources = localStorage.getItem(`${gamePrefix}_resources`)
    const savedClickPower = localStorage.getItem(`${gamePrefix}_clickPower`)
    const savedAutoClickPower = localStorage.getItem(`${gamePrefix}_autoClickPower`)
    const savedUpgrades = localStorage.getItem(`${gamePrefix}_upgrades`)

    if (savedResources) setResources(Number.parseFloat(savedResources))
    if (savedClickPower) setClickPower(Number.parseFloat(savedClickPower))
    if (savedAutoClickPower) setAutoClickPower(Number.parseFloat(savedAutoClickPower))
    if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades))

    // Calculate offline progress
    const lastUpdate = localStorage.getItem(`${gamePrefix}_lastUpdate`)
    if (lastUpdate && savedAutoClickPower) {
      const timeDiff = (Date.now() - Number.parseInt(lastUpdate)) / 1000 // in seconds
      const offlineGain = Number.parseFloat(savedAutoClickPower) * Math.min(timeDiff, 3600) // Cap at 1 hour
      if (offlineGain > 0) {
        setResources((prev) => prev + offlineGain)
      }
    }
  }, [gamePrefix])

  // Save game
  useEffect(() => {
    if (resources > 0) {
      localStorage.setItem(`${gamePrefix}_resources`, resources.toString())
      localStorage.setItem(`${gamePrefix}_clickPower`, clickPower.toString())
      localStorage.setItem(`${gamePrefix}_autoClickPower`, autoClickPower.toString())
      localStorage.setItem(`${gamePrefix}_upgrades`, JSON.stringify(upgrades))
      localStorage.setItem(`${gamePrefix}_lastUpdate`, Date.now().toString())
    }
  }, [resources, clickPower, autoClickPower, upgrades, gamePrefix])

  // Auto-click effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickPower > 0) {
        setResources((prev) => prev + autoClickPower)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [autoClickPower])

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Update combo
    const now = Date.now()
    if (now - lastClickTime < 1000) {
      setCombo((prev) => Math.min(prev + 1, 10))
    } else {
      setCombo(1)
    }
    setLastClickTime(now)

    // Calculate resource gain with combo
    const comboMultiplier = 1 + combo * 0.1
    const resourceGain = clickPower * comboMultiplier

    // Update resources
    setResources((prev) => prev + resourceGain)

    // Create click effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Select random message
    let message = CLICK_MESSAGES[Math.floor(Math.random() * CLICK_MESSAGES.length)]
    const isCritical = Math.random() < 0.05

    if (isCritical) {
      message = "BREAKTHROUGH!"
    } else if (combo > 1) {
      message = `${combo}x COMBO!`
    }

    const id = Date.now()
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
  const buyUpgrade = (key: keyof typeof upgrades) => {
    const upgrade = upgrades[key]
    const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level))

    if (resources >= cost) {
      setResources((prev) => prev - cost)

      setUpgrades((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          level: prev[key].level + 1,
        },
      }))

      // Apply upgrade effect
      if (key === "shelter" || key === "transport" || key === "education" || key === "culture") {
        setClickPower((prev) => prev + upgrade.effect)
      } else {
        setAutoClickPower((prev) => prev + upgrade.effect)
      }
    }
  }

  // Get current rank
  const getCurrentRank = () => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (resources >= RANKS[i].threshold) {
        return RANKS[i].name
      }
    }
    return RANKS[0].name
  }

  // Get next rank progress
  const getNextRankProgress = () => {
    const currentRank = getCurrentRank()
    const currentRankIndex = RANKS.findIndex((rank) => rank.name === currentRank)

    if (currentRankIndex === RANKS.length - 1) {
      return 100 // Already at max rank
    }

    const currentThreshold = RANKS[currentRankIndex].threshold
    const nextThreshold = RANKS[currentRankIndex + 1].threshold
    const progress = ((resources - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Reset game
  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setResources(0)
      setClickPower(1)
      setAutoClickPower(0)
      setCombo(0)
      setUpgrades({
        shelter: { level: 0, cost: 10, effect: 1, name: "Basic Shelter", description: "Improve click power" },
        transport: { level: 0, cost: 50, effect: 5, name: "Transport", description: "Improve click power" },
        community: { level: 0, cost: 200, effect: 1, name: "Community Center", description: "Auto-generate resources" },
        farmland: { level: 0, cost: 1000, effect: 5, name: "Farmland", description: "Auto-generate resources" },
        education: { level: 0, cost: 5000, effect: 25, name: "School", description: "Improve click power" },
        municipal: {
          level: 0,
          cost: 20000,
          effect: 30,
          name: "Municipal Building",
          description: "Auto-generate resources",
        },
        culture: { level: 0, cost: 100000, effect: 100, name: "Cultural Center", description: "Improve click power" },
        district: { level: 0, cost: 500000, effect: 200, name: "New District", description: "Auto-generate resources" },
      })

      // Clear localStorage
      localStorage.removeItem(`${gamePrefix}_resources`)
      localStorage.removeItem(`${gamePrefix}_clickPower`)
      localStorage.removeItem(`${gamePrefix}_autoClickPower`)
      localStorage.removeItem(`${gamePrefix}_upgrades`)
      localStorage.removeItem(`${gamePrefix}_lastUpdate`)
    }
  }

  return (
    <div className="game-bg">
      <GameBackButton />
      <div className="game-container">
        <div className="game-card" onClick={handleClick}>
          <div className="game-card-header">
            <h2 className="game-card-title">1922: New Beginnings</h2>
            <p className="game-card-description">Build communities and create a new future</p>
          </div>
          <div className="game-card-content">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className={`click-effect ${effect.isCritical ? "critical" : ""}`}
                style={{
                  left: `${effect.x}px`,
                  top: `${effect.y}px`,
                }}
              >
                {effect.message}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-purple-400" />
                <p className="text-lg font-bold text-white">Resources: {formatNumber(resources)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-purple-300">Rank: {getCurrentRank()}</p>
              </div>
            </div>

            {/* Rank progress bar */}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getNextRankProgress()}%` }}></div>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <p className="stat-label">Click Power</p>
                <p className="stat-value">{formatNumber(clickPower)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Auto Resources</p>
                <p className="stat-value">{formatNumber(autoClickPower)}/s</p>
              </div>
            </div>

            {/* Combo indicator */}
            <div className="combo-indicator">
              {combo > 1 ? (
                <div className="combo-badge">
                  {combo}x COMBO! <span className="combo-bonus">+{combo * 10}% bonus</span>
                </div>
              ) : null}
            </div>

            <button className="game-button">
              <Home className="h-6 w-6" /> BUILD COMMUNITY
            </button>

            {/* Reset button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetGame()
              }}
              className="reset-button"
            >
              Reset Progress
            </button>
          </div>
        </div>

        <div className="upgrades-container">
          <h3 className="game-subheading">Development Upgrades</h3>
          <div className="upgrades-list">
            {Object.entries(upgrades).map(([key, upgrade]) => {
              const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level))
              const canAfford = resources >= cost

              return (
                <div
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (canAfford) buyUpgrade(key as keyof typeof upgrades)
                  }}
                  className={`upgrade-button ${!canAfford ? "disabled" : ""}`}
                >
                  <div className="upgrade-info">
                    <h4 className="upgrade-name">
                      {key === "shelter" ? (
                        <Home className="h-4 w-4" />
                      ) : key === "transport" ? (
                        <Ship className="h-4 w-4" />
                      ) : key === "community" ? (
                        <Building className="h-4 w-4" />
                      ) : key === "farmland" ? (
                        <Trees className="h-4 w-4" />
                      ) : key === "education" ? (
                        <Book className="h-4 w-4" />
                      ) : key === "municipal" ? (
                        <Map className="h-4 w-4" />
                      ) : key === "culture" ? (
                        <Book className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                      {upgrade.name}
                    </h4>
                    <p className="upgrade-description">{upgrade.description}</p>
                    <p className="upgrade-level">Level: {upgrade.level}</p>
                  </div>
                  <div className="upgrade-cost">{formatNumber(cost)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
