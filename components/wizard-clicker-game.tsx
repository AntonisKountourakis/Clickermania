"use client"

import { useState, useEffect, useRef } from "react"
import "../app/games/wizard-clicker/wizard-clicker.css"
import { GameBackButton } from "./game-back-button"
import { formatNumber } from "../utils/format-number"

export function WizardClickerGame() {
  const [mana, setMana] = useState(0)
  const [manaPerClick, setManaPerClick] = useState(1)
  const [manaPerSecond, setManaPerSecond] = useState(0)
  const [rank, setRank] = useState("Apprentice")
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const spellCirclesRef = useRef<HTMLDivElement>(null)

  // Placeholder for upgrades - will be expanded in the full implementation
  const upgrades = [
    { id: 1, name: "Spell Book", description: "Basic magical knowledge", baseCost: 10, owned: 0, manaPerSecond: 0.1 },
    {
      id: 2,
      name: "Magical Familiar",
      description: "A helpful magical creature",
      baseCost: 50,
      owned: 0,
      manaPerSecond: 0.5,
    },
    {
      id: 3,
      name: "Arcane Focus",
      description: "Channel your magical energy",
      baseCost: 200,
      owned: 0,
      manaPerSecond: 2,
    },
    {
      id: 4,
      name: "Wizard Tower",
      description: "Your own magical research facility",
      baseCost: 1000,
      owned: 0,
      manaPerSecond: 10,
    },
    {
      id: 5,
      name: "Ley Line Tap",
      description: "Access to natural magical energy",
      baseCost: 5000,
      owned: 0,
      manaPerSecond: 50,
    },
    {
      id: 6,
      name: "Academy of Magic",
      description: "Train other wizards",
      baseCost: 25000,
      owned: 0,
      manaPerSecond: 250,
    },
  ]

  // Save/load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("wizard-clicker-progress")
    if (savedProgress) {
      const {
        mana: savedMana,
        manaPerClick: savedManaPerClick,
        manaPerSecond: savedManaPerSecond,
        rank: savedRank,
      } = JSON.parse(savedProgress)
      setMana(savedMana)
      setManaPerClick(savedManaPerClick)
      setManaPerSecond(savedManaPerSecond)
      setRank(savedRank)
    }
  }, [])

  // Update rank based on mana
  useEffect(() => {
    // This will be expanded in the full implementation
    if (mana >= 1000000) {
      setRank("Archmage")
    } else if (mana >= 100000) {
      setRank("Grand Wizard")
    } else if (mana >= 10000) {
      setRank("Master Wizard")
    } else if (mana >= 1000) {
      setRank("Adept Wizard")
    } else if (mana >= 100) {
      setRank("Wizard")
    } else {
      setRank("Apprentice")
    }

    // Save progress
    localStorage.setItem(
      "wizard-clicker-progress",
      JSON.stringify({
        mana,
        manaPerClick,
        manaPerSecond,
        rank,
      }),
    )
  }, [mana, manaPerClick, manaPerSecond, rank])

  // Generate mana each second
  useEffect(() => {
    const interval = setInterval(() => {
      setMana((prevMana) => prevMana + manaPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [manaPerSecond])

  // Create spell circle visuals
  useEffect(() => {
    const createSpellCircle = () => {
      if (spellCirclesRef.current && manaPerSecond > 0) {
        const spellCirclesContainer = spellCirclesRef.current

        const circle = document.createElement("div")
        circle.className = "wizard-spell-circle"

        // Random position
        const posX = Math.random() * window.innerWidth
        const posY = Math.random() * window.innerHeight
        circle.style.left = `${posX}px`
        circle.style.top = `${posY}px`

        // Random size
        const size = 50 + Math.random() * 150
        circle.style.width = `${size}px`
        circle.style.height = `${size}px`

        spellCirclesContainer.appendChild(circle)

        setTimeout(() => {
          spellCirclesContainer.removeChild(circle)
        }, 3000)
      }
    }

    const interval = setInterval(createSpellCircle, 5000)
    return () => clearInterval(interval)
  }, [manaPerSecond])

  // Click handler with visual effect
  const handleClick = () => {
    setMana((prevMana) => prevMana + manaPerClick)

    if (gameAreaRef.current) {
      // Add click effect text
      const clickEffect = document.createElement("div")
      clickEffect.className = "wizard-click-effect"
      clickEffect.textContent = `+${manaPerClick}`

      const staffElement = document.querySelector(".wizard-staff")
      if (staffElement) {
        const rect = staffElement.getBoundingClientRect()
        clickEffect.style.left = `${rect.left + rect.width / 2}px`
        clickEffect.style.top = `${rect.top + rect.height / 2}px`
        document.body.appendChild(clickEffect)

        setTimeout(() => {
          document.body.removeChild(clickEffect)
        }, 1500)
      }

      // Add sparkle particles
      for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement("div")
        sparkle.className = "wizard-magic-sparkle"

        const staffElement = document.querySelector(".wizard-staff")
        if (staffElement) {
          const rect = staffElement.getBoundingClientRect()
          sparkle.style.left = `${rect.left + rect.width / 2}px`
          sparkle.style.top = `${rect.top + rect.height / 2}px`

          // Random direction
          const tx = (Math.random() - 0.5) * 200
          const ty = (Math.random() - 0.5) * 200
          sparkle.style.setProperty("--tx", `${tx}px`)
          sparkle.style.setProperty("--ty", `${ty}px`)

          document.body.appendChild(sparkle)

          setTimeout(() => {
            document.body.removeChild(sparkle)
          }, 1500)
        }
      }
    }
  }

  return (
    <div className="wizard-clicker-container min-h-screen">
      <div className="wizard-spell-circles" ref={spellCirclesRef}></div>

      <div className="wizard-clicker-header">
        <GameBackButton />
        <h1 className="wizard-clicker-title text-center">Wizard Academy</h1>
        <p className="wizard-clicker-subtitle text-center">Cast spells, brew potions, and become a legendary wizard</p>
      </div>

      <div className="wizard-game-area" ref={gameAreaRef}>
        <div className="wizard-click-area">
          <div className="wizard-rank">{rank}</div>
          <div className="wizard-staff" onClick={handleClick}></div>
          <div className="wizard-stats">
            <div className="wizard-mana">{formatNumber(mana)} Mana</div>
            <div className="wizard-per-second">{formatNumber(manaPerSecond)} per second</div>
          </div>
        </div>

        <div className="wizard-upgrades">
          <h2 className="wizard-upgrade-title">Upgrades</h2>
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className={`wizard-upgrade-item ${mana < upgrade.baseCost ? "disabled" : ""}`}
              onClick={() => {
                // Placeholder for upgrade purchase logic
                console.log(`Purchased ${upgrade.name}`)
              }}
            >
              <div className="wizard-upgrade-info">
                <div className="wizard-upgrade-name">{upgrade.name}</div>
                <div className="wizard-upgrade-description">{upgrade.description}</div>
                <div className="wizard-upgrade-owned">Owned: {upgrade.owned}</div>
              </div>
              <div className="wizard-upgrade-cost">{formatNumber(upgrade.baseCost)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add default export
export default WizardClickerGame
