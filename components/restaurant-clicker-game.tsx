"use client"

import { useState, useEffect, useRef } from "react"
import "../app/games/restaurant-clicker/restaurant-clicker.css"
import { GameBackButton } from "./game-back-button"
import { formatNumber } from "../utils/format-number"

export function RestaurantClickerGame() {
  const [money, setMoney] = useState(0)
  const [moneyPerClick, setMoneyPerClick] = useState(1)
  const [moneyPerSecond, setMoneyPerSecond] = useState(0)
  const [rank, setRank] = useState("Food Cart")
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Placeholder for upgrades - will be expanded in the full implementation
  const upgrades = [
    {
      id: 1,
      name: "Food Cart",
      description: "Simple but effective street food",
      baseCost: 10,
      owned: 0,
      moneyPerSecond: 0.1,
    },
    {
      id: 2,
      name: "Small Café",
      description: "Cozy place with loyal customers",
      baseCost: 50,
      owned: 0,
      moneyPerSecond: 0.5,
    },
    { id: 3, name: "Bistro", description: "Casual dining experience", baseCost: 200, owned: 0, moneyPerSecond: 2 },
    {
      id: 4,
      name: "Family Restaurant",
      description: "Great for gatherings",
      baseCost: 1000,
      owned: 0,
      moneyPerSecond: 10,
    },
    {
      id: 5,
      name: "Fine Dining",
      description: "Upscale cuisine for discerning tastes",
      baseCost: 5000,
      owned: 0,
      moneyPerSecond: 50,
    },
    {
      id: 6,
      name: "Restaurant Chain",
      description: "Multiple locations, one brand",
      baseCost: 25000,
      owned: 0,
      moneyPerSecond: 250,
    },
  ]

  // Save/load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("restaurant-clicker-progress")
    if (savedProgress) {
      const {
        money: savedMoney,
        moneyPerClick: savedMoneyPerClick,
        moneyPerSecond: savedMoneyPerSecond,
        rank: savedRank,
      } = JSON.parse(savedProgress)
      setMoney(savedMoney)
      setMoneyPerClick(savedMoneyPerClick)
      setMoneyPerSecond(savedMoneyPerSecond)
      setRank(savedRank)
    }
  }, [])

  // Update rank based on money
  useEffect(() => {
    // This will be expanded in the full implementation
    if (money >= 1000000) {
      setRank("Global Restaurant Empire")
    } else if (money >= 100000) {
      setRank("Celebrity Chef")
    } else if (money >= 10000) {
      setRank("Five-Star Restaurant")
    } else if (money >= 1000) {
      setRank("Popular Restaurant")
    } else if (money >= 100) {
      setRank("Small Restaurant")
    } else {
      setRank("Food Cart")
    }

    // Save progress
    localStorage.setItem(
      "restaurant-clicker-progress",
      JSON.stringify({
        money,
        moneyPerClick,
        moneyPerSecond,
        rank,
      }),
    )
  }, [money, moneyPerClick, moneyPerSecond, rank])

  // Generate money each second
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((prevMoney) => prevMoney + moneyPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [moneyPerSecond])

  // Add plate shine effect
  useEffect(() => {
    const plateElement = document.querySelector(".restaurant-plate")
    if (plateElement) {
      plateElement.classList.add("restaurant-plate-shine")
    }
  }, [])

  // Click handler with visual effect
  const handleClick = () => {
    setMoney((prevMoney) => prevMoney + moneyPerClick)

    if (gameAreaRef.current) {
      const clickEffect = document.createElement("div")
      clickEffect.className = "restaurant-click-effect"
      clickEffect.textContent = `+$${moneyPerClick}`

      const plateElement = document.querySelector(".restaurant-plate")
      if (plateElement) {
        const rect = plateElement.getBoundingClientRect()
        clickEffect.style.left = `${rect.left + rect.width / 2}px`
        clickEffect.style.top = `${rect.top + rect.height / 2}px`
        document.body.appendChild(clickEffect)

        setTimeout(() => {
          document.body.removeChild(clickEffect)
        }, 1500)
      }
    }
  }

  return (
    <div className="restaurant-clicker-container min-h-screen">
      <div className="restaurant-clicker-header">
        <GameBackButton />
        <h1 className="restaurant-clicker-title text-center">Restaurant Empire</h1>
        <p className="restaurant-clicker-subtitle text-center">Cook delicious meals and build your culinary empire</p>
      </div>

      <div className="restaurant-game-area" ref={gameAreaRef}>
        <div className="restaurant-click-area">
          <div className="restaurant-rank">{rank}</div>
          <div className="restaurant-plate" onClick={handleClick}>
            🍽️
          </div>
          <div className="restaurant-stats">
            <div className="restaurant-money">${formatNumber(money)}</div>
            <div className="restaurant-per-second">${formatNumber(moneyPerSecond)} per second</div>
          </div>
        </div>

        <div className="restaurant-upgrades">
          <h2 className="restaurant-upgrade-title">Upgrades</h2>
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className={`restaurant-upgrade-item ${money < upgrade.baseCost ? "disabled" : ""}`}
              onClick={() => {
                // Placeholder for upgrade purchase logic
                console.log(`Purchased ${upgrade.name}`)
              }}
            >
              <div className="restaurant-upgrade-info">
                <div className="restaurant-upgrade-name">{upgrade.name}</div>
                <div className="restaurant-upgrade-description">{upgrade.description}</div>
                <div className="restaurant-upgrade-owned">Owned: {upgrade.owned}</div>
              </div>
              <div className="restaurant-upgrade-cost">${formatNumber(upgrade.baseCost)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RestaurantClickerGame
