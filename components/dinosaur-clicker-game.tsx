"use client"

import { useState, useEffect, useRef } from "react"
import "../app/games/dinosaur-clicker/dinosaur-clicker.css"
import { formatNumber } from "../utils/format-number"

export function DinosaurClickerGame() {
  const [power, setPower] = useState(0)
  const [powerPerClick, setPowerPerClick] = useState(1)
  const [powerPerSecond, setPowerPerSecond] = useState(0)
  const [rank, setRank] = useState("Egg")
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Define upgrades with state to track ownership
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 1,
      name: "Tiny Fossil",
      description: "Small but valuable fossil",
      baseCost: 10,
      owned: 0,
      powerPerSecond: 0.1,
    },
    {
      id: 2,
      name: "Raptor Claw",
      description: "Sharp and deadly",
      baseCost: 50,
      owned: 0,
      powerPerSecond: 0.5,
    },
    {
      id: 3,
      name: "Dino Egg",
      description: "Life finds a way",
      baseCost: 200,
      owned: 0,
      powerPerSecond: 2,
    },
    {
      id: 4,
      name: "Excavation Site",
      description: "Dig up more fossils",
      baseCost: 1000,
      owned: 0,
      powerPerSecond: 10,
    },
    {
      id: 5,
      name: "Dinosaur DNA",
      description: "Ancient genetic material",
      baseCost: 5000,
      owned: 0,
      powerPerSecond: 50,
    },
    {
      id: 6,
      name: "Dinosaur Park",
      description: "Welcome to Jurassic Park",
      baseCost: 25000,
      owned: 0,
      powerPerSecond: 250,
    },
  ])

  // Calculate the current cost of an upgrade based on how many are owned
  const calculateUpgradeCost = (baseCost: number, owned: number) => {
    return Math.floor(baseCost * Math.pow(1.15, owned))
  }

  // Save/load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("dinosaur-clicker-progress")
    if (savedProgress) {
      try {
        const {
          power: savedPower,
          powerPerClick: savedPowerPerClick,
          powerPerSecond: savedPowerPerSecond,
          rank: savedRank,
          upgrades: savedUpgrades,
        } = JSON.parse(savedProgress)
        setPower(savedPower)
        setPowerPerClick(savedPowerPerClick)
        setPowerPerSecond(savedPowerPerSecond)
        setRank(savedRank)
        if (savedUpgrades) {
          setUpgrades(savedUpgrades)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Update rank based on power
  useEffect(() => {
    // This will be expanded in the full implementation
    if (power >= 1000000) {
      setRank("Apex Predator")
    } else if (power >= 100000) {
      setRank("Dinosaur King")
    } else if (power >= 10000) {
      setRank("T-Rex")
    } else if (power >= 1000) {
      setRank("Raptor")
    } else if (power >= 100) {
      setRank("Hatchling")
    } else {
      setRank("Egg")
    }

    // Save progress
    localStorage.setItem(
      "dinosaur-clicker-progress",
      JSON.stringify({
        power,
        powerPerClick,
        powerPerSecond,
        rank,
        upgrades,
      }),
    )
  }, [power, powerPerClick, powerPerSecond, rank, upgrades])

  // Calculate total power per second from upgrades
  useEffect(() => {
    let total = 0
    upgrades.forEach((upgrade) => {
      total += upgrade.powerPerSecond * upgrade.owned
    })
    setPowerPerSecond(total)
  }, [upgrades])

  // Generate power each second
  useEffect(() => {
    const interval = setInterval(() => {
      setPower((prevPower) => prevPower + powerPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [powerPerSecond])

  // Click handler with visual effect
  const handleClick = () => {
    setPower((prevPower) => prevPower + powerPerClick)

    if (gameAreaRef.current) {
      const clickEffect = document.createElement("div")
      clickEffect.className = "dinosaur-click-effect"
      clickEffect.textContent = `+${powerPerClick}`

      const fossilElement = document.querySelector(".dinosaur-fossil")
      if (fossilElement) {
        const rect = fossilElement.getBoundingClientRect()
        clickEffect.style.left = `${rect.left + rect.width / 2}px`
        clickEffect.style.top = `${rect.top + rect.height / 2}px`
        document.body.appendChild(clickEffect)

        setTimeout(() => {
          document.body.removeChild(clickEffect)
        }, 1500)
      }
    }
  }

  // Handle upgrade purchase
  const handleUpgradePurchase = (upgradeId: number) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId)
    if (upgradeIndex === -1) return

    const upgrade = upgrades[upgradeIndex]
    const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.owned)

    if (power >= cost) {
      // Deduct cost
      setPower((prevPower) => prevPower - cost)

      // Update upgrade
      const updatedUpgrades = [...upgrades]
      updatedUpgrades[upgradeIndex] = {
        ...upgrade,
        owned: upgrade.owned + 1,
      }

      setUpgrades(updatedUpgrades)
    }
  }

  return (
    <div className="dinosaur-clicker-container min-h-screen">
      <div className="dinosaur-clicker-header">
        <h1 className="dinosaur-clicker-title text-center">Dinosaur Park</h1>
        <p className="dinosaur-clicker-subtitle text-center">Build your prehistoric adventure park</p>
      </div>

      <div className="dinosaur-game-area" ref={gameAreaRef}>
        <div className="dinosaur-click-area">
          <div className="dinosaur-rank">{rank}</div>
          <div className="dinosaur-fossil" onClick={handleClick}>
            🦖
          </div>
          <div className="dinosaur-stats">
            <div className="dinosaur-power">{formatNumber(power)} Power</div>
            <div className="dinosaur-per-second">{formatNumber(powerPerSecond)} per second</div>
          </div>
        </div>

        <div className="dinosaur-upgrades">
          <h2 className="dinosaur-upgrade-title">Upgrades</h2>
          {upgrades.map((upgrade) => {
            const currentCost = calculateUpgradeCost(upgrade.baseCost, upgrade.owned)
            return (
              <div
                key={upgrade.id}
                className={`dinosaur-upgrade-item ${power < currentCost ? "disabled" : ""}`}
                onClick={() => power >= currentCost && handleUpgradePurchase(upgrade.id)}
              >
                <div className="dinosaur-upgrade-info">
                  <div className="dinosaur-upgrade-name">{upgrade.name}</div>
                  <div className="dinosaur-upgrade-description">{upgrade.description}</div>
                  <div className="dinosaur-upgrade-owned">Owned: {upgrade.owned}</div>
                </div>
                <div className="dinosaur-upgrade-cost">{formatNumber(currentCost)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Add interface for TypeScript
interface Upgrade {
  id: number
  name: string
  description: string
  baseCost: number
  owned: number
  powerPerSecond: number
}

// Add default export
export default DinosaurClickerGame
