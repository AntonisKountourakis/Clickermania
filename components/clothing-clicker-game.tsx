"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { formatNumber } from "../utils/format-number"
import "../app/games/clothing-clicker/clothing-clicker.css"
import "../app/games/unified-original-style.css"

export default function ClothingClicker() {
  const [money, setMoney] = useState(0)
  const [clickValue, setClickValue] = useState(1)
  const [autoClickerCount, setAutoClickerCount] = useState(0)
  const [autoClickerCost, setAutoClickerCost] = useState(15)
  const [designerCount, setDesignerCount] = useState(0)
  const [designerCost, setDesignerCost] = useState(100)
  const [boutiqueCount, setBoutiqueCount] = useState(0)
  const [boutiqueCost, setBoutiqueCost] = useState(1100)
  const [fashionShowCount, setFashionShowCount] = useState(0)
  const [fashionShowCost, setFashionShowCost] = useState(12000)
  const [brandCount, setBrandCount] = useState(0)
  const [brandCost, setBrandCost] = useState(130000)

  // New upgrades
  const [academyCount, setAcademyCount] = useState(0)
  const [academyCost, setAcademyCost] = useState(1500000)
  const [celebrityCount, setCelebrityCount] = useState(0)
  const [celebrityCost, setCelebrityCost] = useState(20000000)
  const [sustainableCount, setSustainableCount] = useState(0)
  const [sustainableCost, setSustainableCost] = useState(250000000)
  const [techCount, setTechCount] = useState(0)
  const [techCost, setTechCost] = useState(3000000000)

  // Multiplier upgrades
  const [clickMultiplier, setClickMultiplier] = useState(1)
  const [productionMultiplier, setProductionMultiplier] = useState(1)
  const [hasSeasonalCollection, setHasSeasonalCollection] = useState(false)
  const [hasLuxuryLine, setHasLuxuryLine] = useState(false)
  const [hasGlobalExpansion, setHasGlobalExpansion] = useState(false)

  const [comboCount, setComboCount] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [comboTimer, setComboTimer] = useState(0)
  const [showComboMessage, setShowComboMessage] = useState(false)
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; value: number; isCritical: boolean }>
  >([])
  const nextClickEffectId = useRef(0)
  const clickAreaRef = useRef<HTMLDivElement>(null)

  // Load game state from localStorage (only once on mount)
  useEffect(() => {
    const savedState = localStorage.getItem("clothing-clicker-progress")
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setMoney(Math.floor(state.money || 0))
        setClickValue(Math.floor(state.clickValue || 1))
        setAutoClickerCount(Math.floor(state.autoClickerCount || 0))
        setAutoClickerCost(Math.floor(state.autoClickerCost || 15))
        setDesignerCount(Math.floor(state.designerCount || 0))
        setDesignerCost(Math.floor(state.designerCost || 100))
        setBoutiqueCount(Math.floor(state.boutiqueCount || 0))
        setBoutiqueCost(Math.floor(state.boutiqueCost || 1100))
        setFashionShowCount(Math.floor(state.fashionShowCount || 0))
        setFashionShowCost(Math.floor(state.fashionShowCost || 12000))
        setBrandCount(Math.floor(state.brandCount || 0))
        setBrandCost(Math.floor(state.brandCost || 130000))

        // Load new upgrades
        setAcademyCount(Math.floor(state.academyCount || 0))
        setAcademyCost(Math.floor(state.academyCost || 1500000))
        setCelebrityCount(Math.floor(state.celebrityCount || 0))
        setCelebrityCost(Math.floor(state.celebrityCost || 20000000))
        setSustainableCount(Math.floor(state.sustainableCount || 0))
        setSustainableCost(Math.floor(state.sustainableCost || 250000000))
        setTechCount(Math.floor(state.techCount || 0))
        setTechCost(Math.floor(state.techCost || 3000000000))

        // Load multipliers
        setClickMultiplier(Math.floor(state.clickMultiplier || 1))
        setProductionMultiplier(Math.floor(state.productionMultiplier || 1))
        setHasSeasonalCollection(state.hasSeasonalCollection || false)
        setHasLuxuryLine(state.hasLuxuryLine || false)
        setHasGlobalExpansion(state.hasGlobalExpansion || false)
      } catch (error) {
        console.error("Failed to load saved game:", error)
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  // Game loop for auto-production and combo timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate production values - all integers now
      const autoClickValue = autoClickerCount * 1
      const designerValue = designerCount * 10
      const boutiqueValue = boutiqueCount * 80
      const fashionShowValue = fashionShowCount * 470
      const brandValue = brandCount * 2600
      const academyValue = academyCount * 14000
      const celebrityValue = celebrityCount * 78000
      const sustainableValue = sustainableCount * 440000
      const techValue = techCount * 2600000

      const totalAutoValue = Math.floor(
        (autoClickValue +
          designerValue +
          boutiqueValue +
          fashionShowValue +
          brandValue +
          academyValue +
          celebrityValue +
          sustainableValue +
          techValue) *
          comboMultiplier *
          productionMultiplier,
      )

      // Update money if there's production
      if (totalAutoValue > 0) {
        setMoney((prev) => prev + totalAutoValue)
      }

      // Handle combo timer
      if (comboTimer > 0) {
        setComboTimer((prev) => prev - 1)
      } else if (comboMultiplier > 1) {
        setComboMultiplier(1)
        setComboCount(0)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [
    autoClickerCount,
    designerCount,
    boutiqueCount,
    fashionShowCount,
    brandCount,
    academyCount,
    celebrityCount,
    sustainableCount,
    techCount,
    comboMultiplier,
    comboTimer,
    productionMultiplier,
  ])

  // Save game state to localStorage whenever relevant state changes
  useEffect(() => {
    const gameState = {
      money,
      clickValue,
      autoClickerCount,
      autoClickerCost,
      designerCount,
      designerCost,
      boutiqueCount,
      boutiqueCost,
      fashionShowCount,
      fashionShowCost,
      brandCount,
      brandCost,
      // New upgrades
      academyCount,
      academyCost,
      celebrityCount,
      celebrityCost,
      sustainableCount,
      sustainableCost,
      techCount,
      techCost,
      // Multipliers
      clickMultiplier,
      productionMultiplier,
      hasSeasonalCollection,
      hasLuxuryLine,
      hasGlobalExpansion,
    }

    localStorage.setItem("clothing-clicker-progress", JSON.stringify(gameState))
  }, [
    money,
    clickValue,
    autoClickerCount,
    autoClickerCost,
    designerCount,
    designerCost,
    boutiqueCount,
    boutiqueCost,
    fashionShowCount,
    fashionShowCost,
    brandCount,
    brandCost,
    academyCount,
    academyCost,
    celebrityCount,
    celebrityCost,
    sustainableCount,
    sustainableCost,
    techCount,
    techCost,
    clickMultiplier,
    productionMultiplier,
    hasSeasonalCollection,
    hasLuxuryLine,
    hasGlobalExpansion,
  ])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickAreaRef.current) return

    const rect = clickAreaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Critical hit chance (10%)
    const isCritical = Math.random() < 0.1
    const clickAmount = Math.floor(
      isCritical ? clickValue * 2 * comboMultiplier * clickMultiplier : clickValue * comboMultiplier * clickMultiplier,
    )

    setMoney((prevMoney) => prevMoney + clickAmount)

    // Handle combo
    const newComboCount = comboCount + 1
    setComboCount(newComboCount)

    let newComboMultiplier = comboMultiplier
    if (newComboCount >= 5 && newComboCount < 15) {
      newComboMultiplier = 2 // Changed from 1.5 to 2 for integer multiplier
    } else if (newComboCount >= 15 && newComboCount < 50) {
      newComboMultiplier = 3 // Changed from 2 to 3 for integer multiplier
    } else if (newComboCount >= 50) {
      newComboMultiplier = 4 // Changed from 3 to 4 for integer multiplier
    }

    if (newComboMultiplier !== comboMultiplier) {
      setComboMultiplier(newComboMultiplier)
      setComboTimer(5)
      setShowComboMessage(true)
      setTimeout(() => setShowComboMessage(false), 1000)
    }

    // Add click effect
    const id = nextClickEffectId.current++
    setClickEffects((prev) => [...prev, { id, x, y, value: clickAmount, isCritical }])

    // Remove click effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }

  const buyAutoClicker = () => {
    if (money >= autoClickerCost) {
      setMoney(money - autoClickerCost)
      setAutoClickerCount(autoClickerCount + 1)
      setAutoClickerCost(Math.floor(autoClickerCost * 1.15))
    }
  }

  const buyDesigner = () => {
    if (money >= designerCost) {
      setMoney(money - designerCost)
      setDesignerCount(designerCount + 1)
      setDesignerCost(Math.floor(designerCost * 1.15))
    }
  }

  const buyBoutique = () => {
    if (money >= boutiqueCost) {
      setMoney(money - boutiqueCost)
      setBoutiqueCount(boutiqueCount + 1)
      setBoutiqueCost(Math.floor(boutiqueCost * 1.15))
    }
  }

  const buyFashionShow = () => {
    if (money >= fashionShowCost) {
      setMoney(money - fashionShowCost)
      setFashionShowCount(fashionShowCount + 1)
      setFashionShowCost(Math.floor(fashionShowCost * 1.15))
    }
  }

  const buyBrand = () => {
    if (money >= brandCost) {
      setMoney(money - brandCost)
      setBrandCount(brandCount + 1)
      setBrandCost(Math.floor(brandCost * 1.15))
    }
  }

  // New upgrade purchase functions
  const buyAcademy = () => {
    if (money >= academyCost) {
      setMoney(money - academyCost)
      setAcademyCount(academyCount + 1)
      setAcademyCost(Math.floor(academyCost * 1.15))
    }
  }

  const buyCelebrity = () => {
    if (money >= celebrityCost) {
      setMoney(money - celebrityCost)
      setCelebrityCount(celebrityCount + 1)
      setCelebrityCost(Math.floor(celebrityCost * 1.15))
    }
  }

  const buySustainable = () => {
    if (money >= sustainableCost) {
      setMoney(money - sustainableCost)
      setSustainableCount(sustainableCount + 1)
      setSustainableCost(Math.floor(sustainableCost * 1.15))
    }
  }

  const buyTech = () => {
    if (money >= techCost) {
      setMoney(money - techCost)
      setTechCount(techCount + 1)
      setTechCost(Math.floor(techCost * 1.15))
    }
  }

  // Special upgrades
  const buySeasonalCollection = () => {
    const cost = 5000000
    if (money >= cost && !hasSeasonalCollection) {
      setMoney(money - cost)
      setHasSeasonalCollection(true)
      setClickMultiplier(clickMultiplier * 2)
    }
  }

  const buyLuxuryLine = () => {
    const cost = 50000000
    if (money >= cost && !hasLuxuryLine) {
      setMoney(money - cost)
      setHasLuxuryLine(true)
      setClickMultiplier(clickMultiplier * 3)
    }
  }

  const buyGlobalExpansion = () => {
    const cost = 500000000
    if (money >= cost && !hasGlobalExpansion) {
      setMoney(money - cost)
      setHasGlobalExpansion(true)
      setProductionMultiplier(productionMultiplier * 2)
    }
  }

  const upgradeClickValue = () => {
    const upgradeCost = clickValue * 100
    if (money >= upgradeCost) {
      setMoney(money - upgradeCost)
      setClickValue(clickValue + 1)
    }
  }

  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setMoney(0)
      setClickValue(1)
      setAutoClickerCount(0)
      setAutoClickerCost(15)
      setDesignerCount(0)
      setDesignerCost(100)
      setBoutiqueCount(0)
      setBoutiqueCost(1100)
      setFashionShowCount(0)
      setFashionShowCost(12000)
      setBrandCount(0)
      setBrandCost(130000)

      // Reset new upgrades
      setAcademyCount(0)
      setAcademyCost(1500000)
      setCelebrityCount(0)
      setCelebrityCost(20000000)
      setSustainableCount(0)
      setSustainableCost(250000000)
      setTechCount(0)
      setTechCost(3000000000)

      // Reset multipliers
      setClickMultiplier(1)
      setProductionMultiplier(1)
      setHasSeasonalCollection(false)
      setHasLuxuryLine(false)
      setHasGlobalExpansion(false)

      setComboCount(0)
      setComboMultiplier(1)
      setComboTimer(0)
      localStorage.removeItem("clothing-clicker-progress")
    }
  }

  // Calculate total production per second
  const calculateTotalProduction = () => {
    return Math.floor(
      (autoClickerCount * 1 +
        designerCount * 10 +
        boutiqueCount * 80 +
        fashionShowCount * 470 +
        brandCount * 2600 +
        academyCount * 14000 +
        celebrityCount * 78000 +
        sustainableCount * 440000 +
        techCount * 2600000) *
        comboMultiplier *
        productionMultiplier,
    )
  }

  return (
    <div className="game-bg">
      <div className="game-container">
        {/* Header */}
        <div className="game-card">
          <div className="game-card-header">
            <h1 className="game-card-title">Fashion Empire Clicker</h1>
            <p className="game-card-description">Build your fashion empire one click at a time!</p>
          </div>

          <div className="game-card-content">
            {/* Stats */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-label">Money</div>
                <div className="stat-value">${formatNumber(money)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Click Value</div>
                <div className="stat-value">
                  ${formatNumber(Math.floor(clickValue * comboMultiplier * clickMultiplier))}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Money Per Second</div>
                <div className="stat-value">${formatNumber(calculateTotalProduction())}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Multipliers</div>
                <div className="stat-value">
                  Click: x{clickMultiplier} | Prod: x{productionMultiplier}
                </div>
              </div>
            </div>

            {/* Combo indicator */}
            {comboMultiplier > 1 && (
              <div className="combo-indicator">
                <div className="combo-badge">
                  COMBO x{comboMultiplier}
                  <span className="combo-bonus"> (+{(comboMultiplier - 1) * 100}%)</span>
                </div>
              </div>
            )}

            {/* Click area */}
            <div
              className="game-button animate-pulse"
              onClick={handleClick}
              ref={clickAreaRef}
              style={{ position: "relative", overflow: "hidden" }}
            >
              <span>👕 Click the Clothing!</span>
              {clickEffects.map((effect) => (
                <div
                  key={effect.id}
                  className={`click-effect ${effect.isCritical ? "critical" : ""}`}
                  style={{
                    left: `${effect.x}px`,
                    top: `${effect.y}px`,
                  }}
                >
                  ${formatNumber(effect.value)}
                </div>
              ))}
            </div>

            {/* Upgrades */}
            <div className="upgrades-container">
              <h2 className="game-subheading">Basic Upgrades</h2>

              <div
                className={`upgrade-button ${money < clickValue * 100 ? "disabled" : ""}`}
                onClick={upgradeClickValue}
              >
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Improve Fabric Quality
                  </div>
                  <div className="upgrade-description">Increase click value by $1</div>
                </div>
                <div className="upgrade-cost">${formatNumber(clickValue * 100)}</div>
              </div>

              <div className={`upgrade-button ${money < autoClickerCost ? "disabled" : ""}`} onClick={buyAutoClicker}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Sewing Machine
                  </div>
                  <div className="upgrade-description">Produces $1 per second</div>
                  <div className="upgrade-level">Level: {autoClickerCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(autoClickerCost)}</div>
              </div>

              <div className={`upgrade-button ${money < designerCost ? "disabled" : ""}`} onClick={buyDesigner}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Fashion Designer
                  </div>
                  <div className="upgrade-description">Produces $10 per second</div>
                  <div className="upgrade-level">Level: {designerCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(designerCost)}</div>
              </div>

              <div className={`upgrade-button ${money < boutiqueCost ? "disabled" : ""}`} onClick={buyBoutique}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Boutique
                  </div>
                  <div className="upgrade-description">Produces $80 per second</div>
                  <div className="upgrade-level">Level: {boutiqueCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(boutiqueCost)}</div>
              </div>

              <div className={`upgrade-button ${money < fashionShowCost ? "disabled" : ""}`} onClick={buyFashionShow}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Fashion Show
                  </div>
                  <div className="upgrade-description">Produces $470 per second</div>
                  <div className="upgrade-level">Level: {fashionShowCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(fashionShowCost)}</div>
              </div>

              <div className={`upgrade-button ${money < brandCost ? "disabled" : ""}`} onClick={buyBrand}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Fashion Brand
                  </div>
                  <div className="upgrade-description">Produces $2,600 per second</div>
                  <div className="upgrade-level">Level: {brandCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(brandCost)}</div>
              </div>

              {/* New upgrades */}
              <h2 className="game-subheading">Advanced Upgrades</h2>

              <div className={`upgrade-button ${money < academyCost ? "disabled" : ""}`} onClick={buyAcademy}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Fashion Academy
                  </div>
                  <div className="upgrade-description">Produces $14,000 per second</div>
                  <div className="upgrade-level">Level: {academyCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(academyCost)}</div>
              </div>

              <div className={`upgrade-button ${money < celebrityCost ? "disabled" : ""}`} onClick={buyCelebrity}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    Celebrity Endorsement
                  </div>
                  <div className="upgrade-description">Produces $78,000 per second</div>
                  <div className="upgrade-level">Level: {celebrityCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(celebrityCost)}</div>
              </div>

              <div className={`upgrade-button ${money < sustainableCost ? "disabled" : ""}`} onClick={buySustainable}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    Sustainable Fashion Line
                  </div>
                  <div className="upgrade-description">Produces $440,000 per second</div>
                  <div className="upgrade-level">Level: {sustainableCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(sustainableCost)}</div>
              </div>

              <div className={`upgrade-button ${money < techCost ? "disabled" : ""}`} onClick={buyTech}>
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Fashion Tech Integration
                  </div>
                  <div className="upgrade-description">Produces $2,600,000 per second</div>
                  <div className="upgrade-level">Level: {techCount}</div>
                </div>
                <div className="upgrade-cost">${formatNumber(techCost)}</div>
              </div>

              {/* Special one-time upgrades */}
              <h2 className="game-subheading">Special Upgrades</h2>

              <div
                className={`upgrade-button special-upgrade ${money < 5000000 || hasSeasonalCollection ? "disabled" : ""}`}
                onClick={buySeasonalCollection}
              >
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Seasonal Collection
                  </div>
                  <div className="upgrade-description">Doubles click value permanently</div>
                  {hasSeasonalCollection && <div className="upgrade-purchased">PURCHASED</div>}
                </div>
                {!hasSeasonalCollection && <div className="upgrade-cost">$5,000,000</div>}
              </div>

              <div
                className={`upgrade-button special-upgrade ${money < 50000000 || hasLuxuryLine ? "disabled" : ""}`}
                onClick={buyLuxuryLine}
              >
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Luxury Fashion Line
                  </div>
                  <div className="upgrade-description">Triples click value permanently</div>
                  {hasLuxuryLine && <div className="upgrade-purchased">PURCHASED</div>}
                </div>
                {!hasLuxuryLine && <div className="upgrade-cost">$50,000,000</div>}
              </div>

              <div
                className={`upgrade-button special-upgrade ${money < 500000000 || hasGlobalExpansion ? "disabled" : ""}`}
                onClick={buyGlobalExpansion}
              >
                <div className="upgrade-info">
                  <div className="upgrade-name">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Global Expansion
                  </div>
                  <div className="upgrade-description">Doubles all production permanently</div>
                  {hasGlobalExpansion && <div className="upgrade-purchased">PURCHASED</div>}
                </div>
                {!hasGlobalExpansion && <div className="upgrade-cost">$500,000,000</div>}
              </div>
            </div>

            {/* Reset button */}
            <button className="reset-button" onClick={resetGame}>
              Reset Game
            </button>

            {/* Back button */}
            <GameBackButton />
          </div>
        </div>
      </div>
    </div>
  )
}

function GameBackButton() {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="game-button"
      style={{ marginTop: "1rem", background: "linear-gradient(to right, #ff4757, #ff6b81)" }}
    >
      Back to Games
    </button>
  )
}
