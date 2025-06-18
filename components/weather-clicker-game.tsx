"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Zap } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

// Define the upgrade type without JSX elements for storage
interface UpgradeData {
  id: string
  name: string
  description: string
  cost: number
  multiplier: number
  count: number
  iconType: string // Store icon type as string instead of JSX element
}

// Interface for the UI with JSX elements
interface Upgrade extends Omit<UpgradeData, "iconType"> {
  icon: JSX.Element
}

// Game state interface for localStorage
interface GameState {
  points: number
  clickValue: number
  autoClickerValue: number
  upgrades: UpgradeData[] // Store without JSX elements
}

export default function WeatherClickerGame() {
  // Game state
  const [points, setPoints] = useState(0)
  const [clickValue, setClickValue] = useState(1)
  const [autoClickerValue, setAutoClickerValue] = useState(0)
  const [currentWeather, setCurrentWeather] = useState<"sunny" | "rainy" | "snowy" | "stormy" | "windy">("sunny")
  const [weatherChangeProgress, setWeatherChangeProgress] = useState(0)

  // References
  const clickAreaRef = useRef<HTMLDivElement>(null)
  const weatherChangeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get icon element based on type
  const getIconElement = (iconType: string): JSX.Element => {
    switch (iconType) {
      case "sun":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "wind":
        return <Wind className="h-5 w-5 text-blue-400" />
      case "cloud":
        return <Cloud className="h-5 w-5 text-gray-400" />
      case "zap":
        return <Zap className="h-5 w-5 text-purple-500" />
      case "cloud-rain":
        return <CloudRain className="h-5 w-5 text-blue-600" />
      case "cloud-snow":
        return <CloudSnow className="h-5 w-5 text-cyan-300" />
      default:
        return <Sun className="h-5 w-5" />
    }
  }

  // Initial upgrades data
  const initialUpgrades: UpgradeData[] = [
    {
      id: "thermometer",
      name: "Thermometer",
      description: "Increase click value by 1",
      cost: 10,
      multiplier: 1.5,
      count: 0,
      iconType: "sun",
    },
    {
      id: "barometer",
      name: "Barometer",
      description: "Increase click value by 5",
      cost: 50,
      multiplier: 1.7,
      count: 0,
      iconType: "wind",
    },
    {
      id: "weather-station",
      name: "Weather Station",
      description: "Automatically generates 1 point per second",
      cost: 100,
      multiplier: 1.9,
      count: 0,
      iconType: "cloud",
    },
    {
      id: "satellite",
      name: "Weather Satellite",
      description: "Automatically generates 5 points per second",
      cost: 500,
      multiplier: 2.1,
      count: 0,
      iconType: "zap",
    },
    {
      id: "supercomputer",
      name: "Forecasting Supercomputer",
      description: "Automatically generates 25 points per second",
      cost: 2500,
      multiplier: 2.3,
      count: 0,
      iconType: "cloud-rain",
    },
    {
      id: "weather-control",
      name: "Weather Control Device",
      description: "Automatically generates 100 points per second",
      cost: 10000,
      multiplier: 2.5,
      count: 0,
      iconType: "cloud-snow",
    },
  ]

  // Convert UpgradeData to Upgrade (add JSX elements)
  const upgradeDataToUpgrade = (data: UpgradeData): Upgrade => ({
    id: data.id,
    name: data.name,
    description: data.description,
    cost: data.cost,
    multiplier: data.multiplier,
    count: data.count,
    icon: getIconElement(data.iconType),
  })

  // Upgrades state with JSX elements for UI
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades.map(upgradeDataToUpgrade))

  // Load saved game
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem("weather-clicker-progress")
      if (savedGame) {
        const gameState: GameState = JSON.parse(savedGame)
        setPoints(gameState.points)
        setClickValue(gameState.clickValue)
        setAutoClickerValue(gameState.autoClickerValue)

        // Convert saved upgrade data to upgrades with JSX elements
        setUpgrades(gameState.upgrades.map(upgradeDataToUpgrade))
      }
    } catch (error) {
      console.error("Error loading game:", error)
      // If there's an error loading, reset to initial state
      localStorage.removeItem("weather-clicker-progress")
    }
  }, [])

  // Save game - convert upgrades to data without JSX elements
  useEffect(() => {
    try {
      // Convert upgrades to data without JSX for storage
      const upgradeData: UpgradeData[] = upgrades.map((upgrade) => ({
        id: upgrade.id,
        name: upgrade.name,
        description: upgrade.description,
        cost: upgrade.cost,
        multiplier: upgrade.multiplier,
        count: upgrade.count,
        iconType:
          upgrade.id === "thermometer"
            ? "sun"
            : upgrade.id === "barometer"
              ? "wind"
              : upgrade.id === "weather-station"
                ? "cloud"
                : upgrade.id === "satellite"
                  ? "zap"
                  : upgrade.id === "supercomputer"
                    ? "cloud-rain"
                    : "cloud-snow",
      }))

      const gameState: GameState = {
        points,
        clickValue,
        autoClickerValue,
        upgrades: upgradeData,
      }

      localStorage.setItem("weather-clicker-progress", JSON.stringify(gameState))
    } catch (error) {
      console.error("Error saving game:", error)
    }
  }, [points, clickValue, autoClickerValue, upgrades])

  // Auto clicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerValue > 0) {
        setPoints((prev) => prev + autoClickerValue)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoClickerValue])

  // Weather change system
  useEffect(() => {
    weatherChangeIntervalRef.current = setInterval(() => {
      setWeatherChangeProgress((prev) => {
        if (prev >= 100) {
          const weathers: Array<"sunny" | "rainy" | "snowy" | "stormy" | "windy"> = [
            "sunny",
            "rainy",
            "snowy",
            "stormy",
            "windy",
          ]
          const newWeather = weathers[Math.floor(Math.random() * weathers.length)]
          setCurrentWeather(newWeather)
          return 0
        }
        return prev + 2
      })
    }, 500)

    return () => {
      if (weatherChangeIntervalRef.current) {
        clearInterval(weatherChangeIntervalRef.current)
      }
    }
  }, [])

  // Click handler
  const handleClick = () => {
    setPoints((prev) => prev + clickValue)

    // Create click effect
    if (clickAreaRef.current) {
      const clickEffect = document.createElement("div")
      clickEffect.className = "weather-click-effect"

      // Different effects based on current weather
      switch (currentWeather) {
        case "sunny":
          clickEffect.innerHTML = "☀️"
          break
        case "rainy":
          clickEffect.innerHTML = "🌧️"
          break
        case "snowy":
          clickEffect.innerHTML = "❄️"
          break
        case "stormy":
          clickEffect.innerHTML = "⚡"
          break
        case "windy":
          clickEffect.innerHTML = "💨"
          break
      }

      // Position the effect
      const rect = clickAreaRef.current.getBoundingClientRect()
      const x = Math.random() * rect.width
      const y = Math.random() * rect.height
      clickEffect.style.left = `${x}px`
      clickEffect.style.top = `${y}px`

      // Add to DOM and remove after animation
      clickAreaRef.current.appendChild(clickEffect)
      setTimeout(() => {
        clickEffect.remove()
      }, 1000)
    }
  }

  // Purchase upgrade
  const purchaseUpgrade = (id: string) => {
    setUpgrades((prevUpgrades) => {
      const newUpgrades = [...prevUpgrades]
      const upgradeIndex = newUpgrades.findIndex((u) => u.id === id)

      if (upgradeIndex === -1) return prevUpgrades

      const upgrade = newUpgrades[upgradeIndex]

      // Check if player has enough points
      if (points < upgrade.cost) return prevUpgrades

      // Update points
      setPoints((prev) => prev - upgrade.cost)

      // Update upgrade
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1,
        cost: Math.floor(upgrade.cost * upgrade.multiplier),
      }

      // Update click value or auto clicker value
      if (id === "thermometer") {
        setClickValue((prev) => prev + 1)
      } else if (id === "barometer") {
        setClickValue((prev) => prev + 5)
      } else if (id === "weather-station") {
        setAutoClickerValue((prev) => prev + 1)
      } else if (id === "satellite") {
        setAutoClickerValue((prev) => prev + 5)
      } else if (id === "supercomputer") {
        setAutoClickerValue((prev) => prev + 25)
      } else if (id === "weather-control") {
        setAutoClickerValue((prev) => prev + 100)
      }

      return newUpgrades
    })
  }

  // Reset game
  const resetGame = () => {
    setPoints(0)
    setClickValue(1)
    setAutoClickerValue(0)
    setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
    localStorage.removeItem("weather-clicker-progress")
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Weather icon based on current weather
  const getWeatherIcon = () => {
    switch (currentWeather) {
      case "sunny":
        return <Sun className="h-16 w-16 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-16 w-16 text-blue-500" />
      case "snowy":
        return <CloudSnow className="h-16 w-16 text-cyan-200" />
      case "stormy":
        return <Zap className="h-16 w-16 text-purple-500" />
      case "windy":
        return <Wind className="h-16 w-16 text-blue-400" />
    }
  }

  return (
    <div className="weather-clicker-container">
      <div className="weather-background"></div>

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          className="shadow-md bg-sky-900/80 backdrop-blur-lg border border-sky-700/50 hover:shadow-xl transition-all cursor-pointer"
          onClick={handleClick}
        >
          <CardHeader className="bg-gradient-to-r from-sky-900 to-sky-700 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-sky-100">Weather Master</CardTitle>
            <CardDescription className="text-center text-sky-200/80">Control the elements!</CardDescription>
          </CardHeader>

          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-4xl font-bold mb-4 text-sky-100">{formatNumber(points)} Points</div>

            <div
              ref={clickAreaRef}
              className="weather-click-area relative w-48 h-48 rounded-full bg-gradient-to-br from-sky-700 to-sky-900 flex items-center justify-center mb-4 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">{getWeatherIcon()}</div>

              <div className="weather-particles">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="weather-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm text-sky-200 mb-2">
              Current Weather: {currentWeather.charAt(0).toUpperCase() + currentWeather.slice(1)}
            </div>
            <Progress value={weatherChangeProgress} className="w-full h-2 mb-4" />

            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="bg-sky-800/50 p-2 rounded-lg text-center">
                <div className="text-xs text-sky-300">Click Value</div>
                <div className="text-lg font-semibold text-sky-100">{clickValue}</div>
              </div>
              <div className="bg-sky-800/50 p-2 rounded-lg text-center">
                <div className="text-xs text-sky-300">Auto Points/sec</div>
                <div className="text-lg font-semibold text-sky-100">{autoClickerValue}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-sky-900/80 backdrop-blur-lg border border-sky-700/50">
          <CardHeader className="bg-gradient-to-r from-sky-900 to-sky-700 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-center text-sky-100">Weather Upgrades</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {upgrades.map((upgrade) => (
                <Button
                  key={upgrade.id}
                  onClick={() => purchaseUpgrade(upgrade.id)}
                  disabled={points < upgrade.cost}
                  className="flex items-center justify-between w-full bg-sky-800 hover:bg-sky-700 text-left h-auto py-2 px-3"
                >
                  <div className="flex items-center">
                    <div className="mr-2">{upgrade.icon}</div>
                    <div>
                      <div className="font-medium">
                        {upgrade.name} ({upgrade.count})
                      </div>
                      <div className="text-xs opacity-80">{upgrade.description}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{formatNumber(upgrade.cost)}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
