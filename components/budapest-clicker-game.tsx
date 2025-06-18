"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/utils/format-number"
import { GameBackButton } from "./game-back-button"

export default function BudapestClickerGame() {
  // Game state
  const [points, setPoints] = useState(0)
  const [clickValue, setClickValue] = useState(1)
  const [autoClickValue, setAutoClickValue] = useState(0)

  // Upgrades
  const [upgrades, setUpgrades] = useState([
    {
      id: "lobby",
      name: "Lobby Renovation",
      cost: 10,
      value: 1,
      level: 0,
      description: "Upgrade the hotel lobby to attract more guests",
    },
    {
      id: "concierge",
      name: "Hire Concierge",
      cost: 50,
      value: 5,
      level: 0,
      description: "A good concierge increases prestige",
    },
    {
      id: "restaurant",
      name: "Gourmet Restaurant",
      cost: 200,
      value: 10,
      level: 0,
      description: "Offer fine dining to generate more income",
    },
    {
      id: "suite",
      name: "Luxury Suite",
      cost: 500,
      value: 25,
      level: 0,
      description: "Add luxury suites to increase hotel value",
    },
    { id: "spa", name: "Wellness Spa", cost: 1000, value: 50, level: 0, description: "Add a spa for passive income" },
  ])

  // Auto clickers
  const [autoClickers, setAutoClickers] = useState([
    {
      id: "staff",
      name: "Hotel Staff",
      cost: 100,
      value: 1,
      count: 0,
      description: "Staff members generate passive income",
    },
    {
      id: "manager",
      name: "Floor Manager",
      cost: 500,
      value: 5,
      count: 0,
      description: "Managers ensure efficiency and higher returns",
    },
    {
      id: "chef",
      name: "Celebrity Chef",
      cost: 2000,
      value: 20,
      count: 0,
      description: "Famous chefs attract wealthy customers",
    },
  ])

  // Initialize from localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem("budapest-clicker-progress")
    if (savedGame) {
      const gameState = JSON.parse(savedGame)
      setPoints(gameState.points || 0)
      setClickValue(gameState.clickValue || 1)
      setAutoClickValue(gameState.autoClickValue || 0)
      setUpgrades(gameState.upgrades || upgrades)
      setAutoClickers(gameState.autoClickers || autoClickers)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "budapest-clicker-progress",
      JSON.stringify({
        points,
        clickValue,
        autoClickValue,
        upgrades,
        autoClickers,
      }),
    )
  }, [points, clickValue, autoClickValue, upgrades, autoClickers])

  // Auto clicker effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (autoClickValue > 0) {
        setPoints((prevPoints) => prevPoints + autoClickValue)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [autoClickValue])

  // Click handler
  const handleClick = () => {
    setPoints((prevPoints) => prevPoints + clickValue)
  }

  // Upgrade handler
  const handleUpgrade = (upgradeId) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId)
    if (upgradeIndex === -1) return

    const upgrade = upgrades[upgradeIndex]
    const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level))

    if (points >= cost) {
      setPoints((prevPoints) => prevPoints - cost)

      const newUpgrades = [...upgrades]
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
      }
      setUpgrades(newUpgrades)

      // Increase click value
      setClickValue((prevValue) => prevValue + upgrade.value)
    }
  }

  // Buy auto clicker handler
  const handleBuyAutoClicker = (autoclickerId) => {
    const autoClickerIndex = autoClickers.findIndex((a) => a.id === autoclickerId)
    if (autoClickerIndex === -1) return

    const autoClicker = autoClickers[autoClickerIndex]
    const cost = Math.floor(autoClicker.cost * Math.pow(1.5, autoClicker.count))

    if (points >= cost) {
      setPoints((prevPoints) => prevPoints - cost)

      const newAutoClickers = [...autoClickers]
      newAutoClickers[autoClickerIndex] = {
        ...autoClicker,
        count: autoClicker.count + 1,
      }
      setAutoClickers(newAutoClickers)

      // Increase auto click value
      setAutoClickValue((prevValue) => prevValue + autoClicker.value)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <GameBackButton />
          <h1 className="text-3xl font-bold text-center text-pink-200">The Grand Budapest Hotel</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main game area */}
          <div className="md:col-span-2">
            <Card className="bg-gradient-to-b from-pink-800/80 to-purple-900/80 border-pink-500/30 backdrop-blur-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-center text-2xl text-pink-200">
                  Prestige Points: {formatNumber(points)}
                </CardTitle>
                <p className="text-center text-pink-300">
                  Per Click: {formatNumber(clickValue)} | Passive: {formatNumber(autoClickValue)}/sec
                </p>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center p-8">
                <button
                  onClick={handleClick}
                  className="w-48 h-48 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center shadow-lg transition-transform duration-100 active:scale-95 hover:shadow-pink-500/30 focus:outline-none"
                >
                  <div className="text-7xl">🏨</div>
                </button>
                <p className="mt-4 text-center text-pink-200">Click the hotel to earn prestige points!</p>
              </CardContent>
            </Card>
          </div>

          {/* Upgrades and auto clickers */}
          <div className="space-y-6">
            {/* Upgrades */}
            <Card className="bg-gradient-to-b from-purple-800/80 to-indigo-900/80 border-purple-500/30 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-200">Hotel Upgrades</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {upgrades.map((upgrade) => {
                  const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level))
                  const canAfford = points >= cost

                  return (
                    <div key={upgrade.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-pink-200">
                          {upgrade.name} (Lvl {upgrade.level})
                        </p>
                        <p className="text-xs text-pink-300">{upgrade.description}</p>
                      </div>
                      <Button
                        onClick={() => handleUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        variant={canAfford ? "default" : "outline"}
                        className={`${
                          canAfford
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            : "border-pink-500/30 text-pink-400"
                        } text-xs`}
                      >
                        {formatNumber(cost)} P
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Auto clickers */}
            <Card className="bg-gradient-to-b from-indigo-800/80 to-pink-900/80 border-indigo-500/30 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-200">Staff & Personnel</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {autoClickers.map((autoClicker) => {
                  const cost = Math.floor(autoClicker.cost * Math.pow(1.5, autoClicker.count))
                  const canAfford = points >= cost

                  return (
                    <div key={autoClicker.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-pink-200">
                          {autoClicker.name} ({autoClicker.count})
                        </p>
                        <p className="text-xs text-pink-300">{autoClicker.description}</p>
                      </div>
                      <Button
                        onClick={() => handleBuyAutoClicker(autoClicker.id)}
                        disabled={!canAfford}
                        variant={canAfford ? "default" : "outline"}
                        className={`${
                          canAfford
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            : "border-pink-500/30 text-pink-400"
                        } text-xs`}
                      >
                        {formatNumber(cost)} P
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
