"use client"

import { useState, useEffect, useRef } from "react"
import "../app/games/zombie-clicker/zombie-clicker.css"
import { GameBackButton } from "./game-back-button"
import { formatNumber } from "../utils/format-number"

interface Upgrade {
  id: number
  name: string
  description: string
  baseCost: number
  owned: number
  brainsPerSecond: number
}

export function ZombieClickerGame() {
  const [brains, setBrains] = useState(0)
  const [brainsPerClick, setBrainsPerClick] = useState(1)
  const [brainsPerSecond, setBrainsPerSecond] = useState(0)
  const [rank, setRank] = useState("Fresh Zombie")
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Define upgrades with state to track ownership
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 1,
      name: "Shambling Gait",
      description: "Move faster to catch victims",
      baseCost: 10,
      owned: 0,
      brainsPerSecond: 0.1,
    },
    {
      id: 2,
      name: "Rotten Teeth",
      description: "Bite harder, get more brains",
      baseCost: 50,
      owned: 0,
      brainsPerSecond: 0.5,
    },
    {
      id: 3,
      name: "Zombie Friend",
      description: "Convert humans to join your cause",
      baseCost: 200,
      owned: 0,
      brainsPerSecond: 2,
    },
    {
      id: 4,
      name: "Zombie Horde",
      description: "Strength in numbers",
      baseCost: 1000,
      owned: 0,
      brainsPerSecond: 10,
    },
    {
      id: 5,
      name: "Toxic Waste",
      description: "Create more zombies faster",
      baseCost: 5000,
      owned: 0,
      brainsPerSecond: 50,
    },
    {
      id: 6,
      name: "Zombie Virus",
      description: "Airborne infection",
      baseCost: 25000,
      owned: 0,
      brainsPerSecond: 250,
    },
  ])

  // Calculate the current cost of an upgrade based on how many are owned
  const calculateUpgradeCost = (baseCost: number, owned: number) => {
    return Math.floor(baseCost * Math.pow(1.15, owned))
  }

  // Save/load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("zombie-clicker-progress")
    if (savedProgress) {
      try {
        const {
          brains: savedBrains,
          brainsPerClick: savedBrainsPerClick,
          brainsPerSecond: savedBrainsPerSecond,
          rank: savedRank,
          upgrades: savedUpgrades,
        } = JSON.parse(savedProgress)
        setBrains(savedBrains)
        setBrainsPerClick(savedBrainsPerClick)
        setBrainsPerSecond(savedBrainsPerSecond)
        setRank(savedRank)
        if (savedUpgrades) {
          setUpgrades(savedUpgrades)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Update rank based on brains
  useEffect(() => {
    // This will be expanded in the full implementation
    if (brains >= 1000000) {
      setRank("Zombie Overlord")
    } else if (brains >= 100000) {
      setRank("Zombie King")
    } else if (brains >= 10000) {
      setRank("Zombie Master")
    } else if (brains >= 1000) {
      setRank("Zombie Leader")
    } else if (brains >= 100) {
      setRank("Evolved Zombie")
    } else {
      setRank("Fresh Zombie")
    }

    // Save progress
    localStorage.setItem(
      "zombie-clicker-progress",
      JSON.stringify({
        brains,
        brainsPerClick,
        brainsPerSecond,
        rank,
        upgrades,
      }),
    )
  }, [brains, brainsPerClick, brainsPerSecond, rank, upgrades])

  // Calculate total brains per second from upgrades
  useEffect(() => {
    let total = 0
    upgrades.forEach((upgrade) => {
      total += upgrade.brainsPerSecond * upgrade.owned
    })
    setBrainsPerSecond(total)
  }, [upgrades])

  // Generate brains each second
  useEffect(() => {
    const interval = setInterval(() => {
      setBrains((prevBrains) => prevBrains + brainsPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [brainsPerSecond])

  // Add blood drips animation
  useEffect(() => {
    const createBloodDrip = () => {
      if (gameAreaRef.current) {
        const brainElement = document.querySelector(".zombie-brain")
        if (brainElement) {
          const rect = brainElement.getBoundingClientRect()

          const drip = document.createElement("div")
          drip.className = "zombie-blood-drip"

          // Random position along the bottom of the brain
          const posX = rect.left + Math.random() * rect.width
          drip.style.left = `${posX}px`
          drip.style.top = `${rect.bottom - 5}px`

          document.body.appendChild(drip)

          setTimeout(() => {
            document.body.removeChild(drip)
          }, 1500)
        }
      }
    }

    const interval = setInterval(createBloodDrip, 2000)
    return () => clearInterval(interval)
  }, [])

  // Click handler with visual effect
  const handleClick = () => {
    setBrains((prevBrains) => prevBrains + brainsPerClick)

    if (gameAreaRef.current) {
      const clickEffect = document.createElement("div")
      clickEffect.className = "zombie-click-effect"
      clickEffect.textContent = `+${brainsPerClick}`

      const brainElement = document.querySelector(".zombie-brain")
      if (brainElement) {
        const rect = brainElement.getBoundingClientRect()
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

    if (brains >= cost) {
      // Deduct cost
      setBrains((prevBrains) => prevBrains - cost)

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
    <div className="zombie-clicker-container min-h-screen">
      <div className="zombie-clicker-header">
        <GameBackButton />
        <h1 className="zombie-clicker-title text-center">Zombie Outbreak</h1>
        <p className="zombie-clicker-subtitle text-center">Survive the apocalypse and build your zombie-proof base</p>
      </div>

      <div className="zombie-game-area" ref={gameAreaRef}>
        <div className="zombie-click-area">
          <div className="zombie-rank">{rank}</div>
          <div className="zombie-brain" onClick={handleClick}>
            🧠
          </div>
          <div className="zombie-stats">
            <div className="zombie-brains">{formatNumber(brains)} Brains</div>
            <div className="zombie-per-second">{formatNumber(brainsPerSecond)} per second</div>
          </div>
        </div>

        <div className="zombie-upgrades">
          <h2 className="zombie-upgrade-title">Upgrades</h2>
          {upgrades.map((upgrade) => {
            const currentCost = calculateUpgradeCost(upgrade.baseCost, upgrade.owned)
            return (
              <div
                key={upgrade.id}
                className={`zombie-upgrade-item ${brains < currentCost ? "disabled" : ""}`}
                onClick={() => brains >= currentCost && handleUpgradePurchase(upgrade.id)}
              >
                <div className="zombie-upgrade-info">
                  <div className="zombie-upgrade-name">{upgrade.name}</div>
                  <div className="zombie-upgrade-description">{upgrade.description}</div>
                  <div className="zombie-upgrade-owned">Owned: {upgrade.owned}</div>
                </div>
                <div className="zombie-upgrade-cost">{formatNumber(currentCost)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ZombieClickerGame
