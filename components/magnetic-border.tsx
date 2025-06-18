"use client"

import { useEffect, useState, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface Position {
  x: number
  y: number
}

export function MagneticBorder() {
  const isMobile = useMobile()
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const borderRef = useRef<HTMLDivElement>(null)
  const magnetStrength = 15 // Πόσο έντονο θα είναι το μαγνητικό εφέ

  // Ενημερώνει τη θέση του κέρσορα όταν κινείται
  const handleMouseMove = (e: MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY })
  }

  // Παρακολουθεί τα αγγίγματα στην οθόνη
  const handleTouch = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      setCursorPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      setIsInteracting(true)

      // Αφαιρεί την αλληλεπίδραση μετά από λίγο για να δημιουργήσει ένα παλλόμενο εφέ
      setTimeout(() => setIsInteracting(false), 300)
    }
  }

  useEffect(() => {
    if (isMobile) {
      // Mobile event listeners
      window.addEventListener("touchstart", handleTouch)
      window.addEventListener("touchmove", handleTouch)
    } else {
      // Desktop event listeners
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mousedown", () => setIsInteracting(true))
      window.addEventListener("mouseup", () => setIsInteracting(false))
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouch)
        window.removeEventListener("touchmove", handleTouch)
      } else {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mousedown", () => setIsInteracting(true))
        window.removeEventListener("mouseup", () => setIsInteracting(false))
      }
    }
  }, [isMobile])

  // Υπολογίζει τη μετατόπιση του περιγράμματος με βάση τη θέση του κέρσορα/αγγίγματος
  const calculateBorderTransform = () => {
    if (!borderRef.current) return {}

    const rect = borderRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Υπολογίζει την απόσταση από το κέντρο
    const distanceX = cursorPosition.x - centerX
    const distanceY = cursorPosition.y - centerY

    // Η μέγιστη απόσταση επιρροής
    const maxDistance = Math.max(rect.width, rect.height) / 2

    // Υπολογίζει τη δύναμη του μαγνήτη με βάση την απόσταση
    const magnetPower = isInteracting ? magnetStrength * 2 : magnetStrength

    // Υπολογίζει τη μετατόπιση
    const moveX = (distanceX / maxDistance) * magnetPower
    const moveY = (distanceY / maxDistance) * magnetPower

    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
      transition: isInteracting
        ? "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
        : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  }

  // Υπολογίζει τις θέσεις για τις γωνίες του περιγράμματος
  const calculateCornerStyle = (position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight") => {
    if (!borderRef.current) return {}

    const rect = borderRef.current.getBoundingClientRect()
    let cornerX = 0,
      cornerY = 0

    // Ορίζει τις συντεταγμένες για κάθε γωνία
    switch (position) {
      case "topLeft":
        cornerX = rect.left
        cornerY = rect.top
        break
      case "topRight":
        cornerX = rect.right
        cornerY = rect.top
        break
      case "bottomLeft":
        cornerX = rect.left
        cornerY = rect.bottom
        break
      case "bottomRight":
        cornerX = rect.right
        cornerY = rect.bottom
        break
    }

    // Υπολογίζει την απόσταση της γωνίας από τον κέρσορα
    const distanceX = cursorPosition.x - cornerX
    const distanceY = cursorPosition.y - cornerY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    // Μέγιστη απόσταση επιρροής
    const maxInfluenceDistance = 150

    // Αν ο κέρσορας είναι εντός της απόστασης επιρροής
    if (distance < maxInfluenceDistance) {
      // Υπολογίζει τη γωνία προς τον κέρσορα
      const angle = Math.atan2(distanceY, distanceX)

      // Υπολογίζει τη δύναμη με βάση την απόσταση (όσο πιο κοντά, τόσο πιο δυνατό)
      const power = isInteracting
        ? magnetStrength * 3 * (1 - distance / maxInfluenceDistance)
        : magnetStrength * (1 - distance / maxInfluenceDistance)

      // Υπολογίζει τη μετατόπιση
      const moveX = Math.cos(angle) * power
      const moveY = Math.sin(angle) * power

      return {
        transform: `translate(${moveX}px, ${moveY}px)`,
        transition: isInteracting
          ? "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }
    }

    return {
      transform: "translate(0, 0)",
      transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  }

  return (
    <>
      {/* Το κύριο περίγραμμα που ακολουθεί τον κέρσορα */}
      <div
        ref={borderRef}
        className="fixed inset-0 border-8 border-purple-500 pointer-events-none z-50"
        style={calculateBorderTransform()}
      >
        {/* Γωνίες που αντιδρούν ξεχωριστά */}
        <div
          className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-purple-500"
          style={calculateCornerStyle("topLeft")}
        />
        <div
          className="absolute top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-purple-500"
          style={calculateCornerStyle("topRight")}
        />
        <div
          className="absolute bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-purple-500"
          style={calculateCornerStyle("bottomLeft")}
        />
        <div
          className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-purple-500"
          style={calculateCornerStyle("bottomRight")}
        />
      </div>
    </>
  )
}
