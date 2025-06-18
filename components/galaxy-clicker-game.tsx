"use client"

import { useState, useEffect, useRef } from "react"
import "../app/games/galaxy-clicker/galaxy-clicker.css"
import { formatNumber } from "../utils/format-number"

export function GalaxyClickerGame() {
  const [resources, setResources] = useState(0)
  const [resourcesPerClick, setResourcesPerClick] = useState(1)
  const [resourcesPerSecond, setResourcesPerSecond] = useState(0)
  const [rank, setRank] = useState("Space Traveler")
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  // Define upgrades with state to track ownership
  const [upgrades, setUpgrades] = useState([
    {
      id: 1,
      name: "Mining Drone",
      description: "Automated resource collector",
      baseCost: 10,
      owned: 0,
      resourcesPerSecond: 0.1,
    },
    {
      id: 2,
      name: "Space Station",
      description: "Orbital resource processing",
      baseCost: 50,
      owned: 0,
      resourcesPerSecond: 0.5,
    },
    {
      id: 3,
      name: "Colony Ship",
      description: "Settle new worlds",
      baseCost: 200,
      owned: 0,
      resourcesPerSecond: 2,
    },
    {
      id: 4,
      name: "Terraforming Unit",
      description: "Make planets habitable",
      baseCost: 1000,
      owned: 0,
      resourcesPerSecond: 10,
    },
    {
      id: 5,
      name: "Wormhole Generator",
      description: "Access distant galaxies",
      baseCost: 5000,
      owned: 0,
      resourcesPerSecond: 50,
    },
    {
      id: 6,
      name: "Dyson Sphere",
      description: "Harness the power of stars",
      baseCost: 25000,
      owned: 0,
      resourcesPerSecond: 250,
    },
  ])

  // Calculate the current cost of an upgrade based on how many are owned
  const calculateUpgradeCost = (baseCost: number, owned: number) => {
    return Math.floor(baseCost * Math.pow(1.15, owned))
  }

  // Save/load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("galaxy-clicker-progress")
    if (savedProgress) {
      try {
        const {
          resources: savedResources,
          resourcesPerClick: savedResourcesPerClick,
          resourcesPerSecond: savedResourcesPerSecond,
          rank: savedRank,
          upgrades: savedUpgrades,
        } = JSON.parse(savedProgress)
        setResources(savedResources)
        setResourcesPerClick(savedResourcesPerClick)
        setResourcesPerSecond(savedResourcesPerSecond)
        setRank(savedRank)
        if (savedUpgrades) {
          setUpgrades(savedUpgrades)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Update rank based on resources
  useEffect(() => {
    if (resources >= 1000000) {
      setRank("Universal Emperor")
    } else if (resources >= 100000) {
      setRank("Galactic Overlord")
    } else if (resources >= 10000) {
      setRank("Interstellar Commander")
    } else if (resources >= 1000) {
      setRank("Planetary Governor")
    } else if (resources >= 100) {
      setRank("Space Captain")
    } else {
      setRank("Space Traveler")
    }

    // Save progress
    localStorage.setItem(
      "galaxy-clicker-progress",
      JSON.stringify({
        resources,
        resourcesPerClick,
        resourcesPerSecond,
        rank,
        upgrades,
      }),
    )
  }, [resources, resourcesPerClick, resourcesPerSecond, rank, upgrades])

  // Calculate total resources per second from upgrades
  useEffect(() => {
    let total = 0
    upgrades.forEach((upgrade) => {
      total += upgrade.resourcesPerSecond * upgrade.owned
    })
    setResourcesPerSecond(total)
  }, [upgrades])

  // Generate resources each second
  useEffect(() => {
    const interval = setInterval(() => {
      setResources((prevResources) => prevResources + resourcesPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [resourcesPerSecond])

  // Create stars in the background
  useEffect(() => {
    if (starsRef.current) {
      const starsContainer = starsRef.current
      starsContainer.innerHTML = ""

      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div")
        star.className = "star"
        star.style.top = `${Math.random() * 100}%`
        star.style.left = `${Math.random() * 100}%`
        star.style.animationDelay = `${Math.random() * 2}s`
        starsContainer.appendChild(star)
      }
    }
  }, [])

  // Click handler with visual effect
  const handleClick = () => {
    setResources((prevResources) => prevResources + resourcesPerClick)

    if (gameAreaRef.current) {
      // Add click effect text
      const clickEffect = document.createElement("div")
      clickEffect.className = "galaxy-click-effect"
      clickEffect.textContent = `+${resourcesPerClick}`

      const planetElement = document.querySelector(".galaxy-planet")
      if (planetElement) {
        const rect = planetElement.getBoundingClientRect()
        clickEffect.style.left = `${rect.left + rect.width / 2}px`
        clickEffect.style.top = `${rect.top + rect.height / 2}px`
        document.body.appendChild(clickEffect)

        setTimeout(() => {
          document.body.removeChild(clickEffect)
        }, 1500)
      }

      // Add space dust particles
      for (let i = 0; i < 5; i++) {
        const dust = document.createElement("div")
        dust.className = "galaxy-dust"

        const planetElement = document.querySelector(".galaxy-planet")
        if (planetElement) {
          const rect = planetElement.getBoundingClientRect()
          dust.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`
          dust.style.top = `${rect.top + rect.height / 2 + (Math.random() * 40 - 20)}px`
          dust.style.animationDuration = `${2 + Math.random() * 3}s`
          document.body.appendChild(dust)

          setTimeout(() => {
            document.body.removeChild(dust)
          }, 5000)
        }
      }
    }
  }

  // Handle upgrade purchase
  const handleUpgradePurchase = (upgradeId: number) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId)
    if (upgradeIndex === -1) return

    const upgrade = upgrades[upgradeIndex]
    const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.owned)

    if (resources >= cost) {
      // Deduct cost
      setResources((prevResources) => prevResources - cost)

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
    <div className="galaxy-clicker-container min-h-screen">
      <div className="stars-background" ref={starsRef}></div>

      <div className="galaxy-clicker-header">
        <h1 className="galaxy-clicker-title text-center">Galaxy Conquest</h1>
        <p className="galaxy-clicker-subtitle text-center">
          Explore distant planets and build an intergalactic civilization
        </p>
      </div>

      <div className="galaxy-game-area" ref={gameAreaRef}>
        <div className="galaxy-click-area">
          <div className="galaxy-rank">{rank}</div>
          <div className="galaxy-planet" onClick={handleClick}>
            🌌
          </div>
          <div className="galaxy-stats">
            <div className="galaxy-resources">{formatNumber(resources)} Resources</div>
            <div className="galaxy-per-second">{formatNumber(resourcesPerSecond)} per second</div>
          </div>
        </div>

        <div className="galaxy-upgrades">
          <h2 className="galaxy-upgrade-title">Upgrades</h2>
          {upgrades.map((upgrade) => {
            const currentCost = calculateUpgradeCost(upgrade.baseCost, upgrade.owned)
            return (
              <div
                key={upgrade.id}
                className={`galaxy-upgrade-item ${resources < currentCost ? "disabled" : ""}`}
                onClick={() => resources >= currentCost && handleUpgradePurchase(upgrade.id)}
              >
                <div className="galaxy-upgrade-info">
                  <div className="galaxy-upgrade-name">{upgrade.name}</div>
                  <div className="galaxy-upgrade-description">{upgrade.description}</div>
                  <div className="galaxy-upgrade-owned">Owned: {upgrade.owned}</div>
                </div>
                <div className="galaxy-upgrade-cost">{formatNumber(currentCost)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GalaxyClickerGame
