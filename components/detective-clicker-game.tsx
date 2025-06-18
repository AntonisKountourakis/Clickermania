"use client"

import { useState, useEffect, useRef } from "react"
import "../app/games/detective-clicker/detective-clicker.css"
import { GameBackButton } from "./game-back-button"
import { formatNumber } from "../utils/format-number"

export function DetectiveClickerGame() {
  const [clues, setClues] = useState(0)
  const [cluesPerClick, setCluesPerClick] = useState(1)
  const [cluesPerSecond, setCluesPerSecond] = useState(0)
  const [rank, setRank] = useState("Amateur Detective")
  const [caseProgress, setCaseProgress] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Placeholder for upgrades - will be expanded in the full implementation
  const upgrades = [
    {
      id: 1,
      name: "Magnifying Glass",
      description: "See the smallest details",
      baseCost: 10,
      owned: 0,
      cluesPerSecond: 0.1,
    },
    { id: 2, name: "Fingerprint Kit", description: "Identify suspects", baseCost: 50, owned: 0, cluesPerSecond: 0.5 },
    {
      id: 3,
      name: "Forensics Lab",
      description: "Scientific analysis of evidence",
      baseCost: 200,
      owned: 0,
      cluesPerSecond: 2,
    },
    {
      id: 4,
      name: "Detective Agency",
      description: "Your own office with assistants",
      baseCost: 1000,
      owned: 0,
      cluesPerSecond: 10,
    },
    {
      id: 5,
      name: "Police Database",
      description: "Access to criminal records",
      baseCost: 5000,
      owned: 0,
      cluesPerSecond: 50,
    },
    {
      id: 6,
      name: "Detective Network",
      description: "Informants all over the city",
      baseCost: 25000,
      owned: 0,
      cluesPerSecond: 250,
    },
  ]

  // Save/load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("detective-clicker-progress")
    if (savedProgress) {
      const {
        clues: savedClues,
        cluesPerClick: savedCluesPerClick,
        cluesPerSecond: savedCluesPerSecond,
        rank: savedRank,
        caseProgress: savedCaseProgress,
      } = JSON.parse(savedProgress)
      setClues(savedClues)
      setCluesPerClick(savedCluesPerClick)
      setCluesPerSecond(savedCluesPerSecond)
      setRank(savedRank)
      setCaseProgress(savedCaseProgress)
    }
  }, [])

  // Update rank based on clues
  useEffect(() => {
    // This will be expanded in the full implementation
    if (clues >= 1000000) {
      setRank("Legendary Detective")
    } else if (clues >= 100000) {
      setRank("Famous Detective")
    } else if (clues >= 10000) {
      setRank("Master Detective")
    } else if (clues >= 1000) {
      setRank("Expert Detective")
    } else if (clues >= 100) {
      setRank("Professional Detective")
    } else {
      setRank("Amateur Detective")
    }

    // Update case progress (0-100%)
    setCaseProgress(Math.min(100, (clues % 1000) / 10))

    // Save progress
    localStorage.setItem(
      "detective-clicker-progress",
      JSON.stringify({
        clues,
        cluesPerClick,
        cluesPerSecond,
        rank,
        caseProgress,
      }),
    )
  }, [clues, cluesPerClick, cluesPerSecond, rank])

  // Generate clues each second
  useEffect(() => {
    const interval = setInterval(() => {
      setClues((prevClues) => prevClues + cluesPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [cluesPerSecond])

  // Click handler with visual effect
  const handleClick = () => {
    setClues((prevClues) => prevClues + cluesPerClick)

    if (gameAreaRef.current) {
      const clickEffect = document.createElement("div")
      clickEffect.className = "detective-click-effect"
      clickEffect.textContent = `+${cluesPerClick}`

      const magnifierElement = document.querySelector(".detective-magnifier")
      if (magnifierElement) {
        const rect = magnifierElement.getBoundingClientRect()
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
    <div className="detective-clicker-container min-h-screen">
      <div className="detective-clicker-header">
        <GameBackButton />
        <h1 className="detective-clicker-title text-center">Mystery Detective</h1>
        <p className="detective-clicker-subtitle text-center">
          Solve cases, find clues, and become the ultimate detective
        </p>
      </div>

      <div className="detective-game-area" ref={gameAreaRef}>
        <div className="detective-click-area">
          <div className="detective-rank">{rank}</div>
          <div className="detective-magnifier" onClick={handleClick}>
            <div className="detective-magnifier-glass"></div>
            <div className="detective-magnifier-handle"></div>
          </div>
          <div className="detective-stats">
            <div className="detective-clues">{formatNumber(clues)} Clues</div>
            <div className="detective-per-second">{formatNumber(cluesPerSecond)} per second</div>
          </div>

          <div className="detective-case-board">
            <div className="detective-case-title">Current Case Progress</div>
            <div className="detective-progress-container">
              <div className="detective-progress-bar" style={{ width: `${caseProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="detective-upgrades">
          <h2 className="detective-upgrade-title">Upgrades</h2>
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className={`detective-upgrade-item ${clues < upgrade.baseCost ? "disabled" : ""}`}
              onClick={() => {
                // Placeholder for upgrade purchase logic
                console.log(`Purchased ${upgrade.name}`)
              }}
            >
              <div className="detective-upgrade-info">
                <div className="detective-upgrade-name">{upgrade.name}</div>
                <div className="detective-upgrade-description">{upgrade.description}</div>
                <div className="detective-upgrade-owned">Owned: {upgrade.owned}</div>
              </div>
              <div className="detective-upgrade-cost">{formatNumber(upgrade.baseCost)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add default export
export default DetectiveClickerGame
