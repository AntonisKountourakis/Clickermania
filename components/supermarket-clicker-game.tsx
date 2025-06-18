"use client"

import { useState, useEffect, useRef } from "react"
import { formatNumber } from "@/utils/format-number"
import { ResetButton } from "@/components/reset-button"
import { ClickEffectManager } from "@/utils/click-effect-manager"

interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  baseValue: number
  count: number
  unlocked: boolean
  unlocksAt?: number
}

export default function SupermarketClickerGame() {
  // Game state
  const [money, setMoney] = useState(0)
  const [moneyPerClick, setMoneyPerClick] = useState(1)
  const [moneyPerSecond, setMoneyPerSecond] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [level, setLevel] = useState(1)
  const [clickEffectManager, setClickEffectManager] = useState<ClickEffectManager | null>(null)
  const clickAreaRef = useRef<HTMLDivElement>(null)

  // Upgrades
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "cashier",
      name: "Cashier",
      description: "Hire a cashier to process transactions faster",
      baseCost: 10,
      baseValue: 1,
      count: 0,
      unlocked: true,
    },
    {
      id: "shelf",
      name: "Shelf",
      description: "Add a new shelf to display more products",
      baseCost: 50,
      baseValue: 5,
      count: 0,
      unlocked: true,
    },
    {
      id: "produce",
      name: "Produce Section",
      description: "Fresh fruits and vegetables attract more customers",
      baseCost: 200,
      baseValue: 20,
      count: 0,
      unlocked: true,
    },
    {
      id: "bakery",
      name: "Bakery",
      description: "Fresh bread and pastries increase sales",
      baseCost: 500,
      baseValue: 50,
      count: 0,
      unlocked: false,
      unlocksAt: 300,
    },
    {
      id: "butcher",
      name: "Butcher Counter",
      description: "Quality meats bring in premium customers",
      baseCost: 1500,
      baseValue: 100,
      count: 0,
      unlocked: false,
      unlocksAt: 1000,
    },
    {
      id: "deli",
      name: "Deli Counter",
      description: "Prepared foods increase your profit margin",
      baseCost: 5000,
      baseValue: 250,
      count: 0,
      unlocked: false,
      unlocksAt: 3000,
    },
    {
      id: "frozen",
      name: "Frozen Foods",
      description: "Expand your selection with frozen products",
      baseCost: 12000,
      baseValue: 500,
      count: 0,
      unlocked: false,
      unlocksAt: 8000,
    },
    {
      id: "organic",
      name: "Organic Section",
      description: "Premium organic products bring higher profits",
      baseCost: 25000,
      baseValue: 1000,
      count: 0,
      unlocked: false,
      unlocksAt: 15000,
    },
    {
      id: "loyalty",
      name: "Loyalty Program",
      description: "Keep customers coming back regularly",
      baseCost: 50000,
      baseValue: 2000,
      count: 0,
      unlocked: false,
      unlocksAt: 30000,
    },
    {
      id: "delivery",
      name: "Delivery Service",
      description: "Expand your reach with home deliveries",
      baseCost: 100000,
      baseValue: 5000,
      count: 0,
      unlocked: false,
      unlocksAt: 75000,
    },
    {
      id: "branch",
      name: "New Branch",
      description: "Open a new store location",
      baseCost: 500000,
      baseValue: 20000,
      count: 0,
      unlocked: false,
      unlocksAt: 200000,
    },
    {
      id: "chain",
      name: "Supermarket Chain",
      description: "Expand into a national supermarket chain",
      baseCost: 1000000,
      baseValue: 50000,
      count: 0,
      unlocked: false,
      unlocksAt: 750000,
    },
  ])

  // Click effect setup
  useEffect(() => {
    if (clickAreaRef.current) {
      const manager = new ClickEffectManager(clickAreaRef.current, {
        emoji: "💶",
        fontSize: "1.5rem",
        duration: 1000,
        spread: 100,
        count: 1,
      })
      setClickEffectManager(manager)
    }
  }, [])

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("supermarket-clicker-progress")
    if (savedState) {
      try {
        const { money, moneyPerClick, moneyPerSecond, totalClicks, level, upgrades } = JSON.parse(savedState)
        setMoney(money)
        setMoneyPerClick(moneyPerClick)
        setMoneyPerSecond(moneyPerSecond)
        setTotalClicks(totalClicks)
        setLevel(level)
        setUpgrades(upgrades)
      } catch (error) {
        console.error("Failed to load saved game:", error)
      }
    }
  }, [])

  // Save game state to localStorage
  useEffect(() => {
    if (money > 0) {
      const gameState = {
        money,
        moneyPerClick,
        moneyPerSecond,
        totalClicks,
        level,
        upgrades,
      }
      localStorage.setItem("supermarket-clicker-progress", JSON.stringify(gameState))
    }
  }, [money, moneyPerClick, moneyPerSecond, totalClicks, level, upgrades])

  // Passive income
  useEffect(() => {
    const interval = setInterval(() => {
      if (moneyPerSecond > 0) {
        setMoney((prev) => prev + moneyPerSecond)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [moneyPerSecond])

  // Check for unlockable upgrades
  useEffect(() => {
    let updated = false
    const newUpgrades = upgrades.map((upgrade) => {
      if (!upgrade.unlocked && upgrade.unlocksAt && money >= upgrade.unlocksAt) {
        updated = true
        return { ...upgrade, unlocked: true }
      }
      return upgrade
    })

    if (updated) {
      setUpgrades(newUpgrades)
    }
  }, [money, upgrades])

  // Level up based on money
  useEffect(() => {
    const newLevel = Math.floor(Math.log10(money + 1) / Math.log10(5)) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      setMoneyPerClick((prev) => Math.floor(prev * 1.1)) // 10% increase per level, rounded down
    }
  }, [money, level])

  // Handle click on the main click area
  const handleClick = () => {
    setMoney((prev) => prev + moneyPerClick)
    setTotalClicks((prev) => prev + 1)

    if (clickEffectManager && clickAreaRef.current) {
      const rect = clickAreaRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      clickEffectManager.createParticles(centerX, centerY)
    }
  }

  // Calculate upgrade cost with scaling
  const calculateUpgradeCost = (upgrade: Upgrade) => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count))
  }

  // Purchase an upgrade
  const purchaseUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId)
    if (upgradeIndex === -1) return

    const upgrade = upgrades[upgradeIndex]
    const cost = calculateUpgradeCost(upgrade)

    if (money >= cost) {
      // Deduct cost
      setMoney((prev) => prev - cost)

      // Update upgrades
      const newUpgrades = [...upgrades]
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1,
      }
      setUpgrades(newUpgrades)

      // Update money per second
      setMoneyPerSecond((prev) => prev + upgrade.baseValue)
    }
  }

  // Reset game
  const resetGame = () => {
    setMoney(0)
    setMoneyPerClick(1)
    setMoneyPerSecond(0)
    setTotalClicks(0)
    setLevel(1)
    setUpgrades(
      upgrades.map((upgrade) => ({
        ...upgrade,
        count: 0,
        unlocked: upgrade.unlocksAt ? false : true,
      })),
    )
    localStorage.removeItem("supermarket-clicker-progress")
  }

  // Get store title based on level
  const getStoreTitle = () => {
    if (level <= 2) return "Corner Shop"
    if (level <= 4) return "Mini Market"
    if (level <= 6) return "Grocery Store"
    if (level <= 8) return "Supermarket"
    if (level <= 10) return "Hypermarket"
    if (level <= 12) return "Supermarket Chain"
    return "Global Retail Empire"
  }

  return (
    <div className="game-bg supermarket-bg">
      <div className="supermarket-header">
        <h1>Supermarket Clicker</h1>
        <div className="supermarket-level">
          <span className="level-title">{getStoreTitle()}</span>
          <span className="level-number">Level {level}</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-value">{formatNumber(money)}</span>
          <span className="stat-label">€</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatNumber(moneyPerClick)}</span>
          <span className="stat-label">€ per click</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatNumber(moneyPerSecond)}</span>
          <span className="stat-label">€ per second</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatNumber(totalClicks)}</span>
          <span className="stat-label">Total clicks</span>
        </div>
      </div>

      <div className="supermarket-content">
        <div className="click-area-container">
          <div ref={clickAreaRef} className="click-area" onClick={handleClick}>
            <div className="click-icon">🛒</div>
            <div className="click-text">Click to earn money!</div>
          </div>
        </div>

        <div className="upgrades-container">
          <h2 className="game-subheading">Upgrades</h2>
          <div className="upgrades-list">
            {upgrades
              .filter((upgrade) => upgrade.unlocked)
              .map((upgrade) => {
                const cost = calculateUpgradeCost(upgrade)
                const canAfford = money >= cost
                return (
                  <div
                    key={upgrade.id}
                    className={`upgrade ${canAfford ? "can-afford" : ""}`}
                    onClick={() => canAfford && purchaseUpgrade(upgrade.id)}
                  >
                    <div className="upgrade-info">
                      <div className="upgrade-name">{upgrade.name}</div>
                      <div className="upgrade-description">{upgrade.description}</div>
                      <div className="upgrade-effect">+{upgrade.baseValue} € per second</div>
                    </div>
                    <div className="upgrade-purchase">
                      <div className="upgrade-count">{upgrade.count}</div>
                      <div className="upgrade-cost">{formatNumber(cost)} €</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <ResetButton onReset={resetGame} gameTitle="Supermarket Clicker" />
    </div>
  )
}
