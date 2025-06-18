"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  originalX: number
  originalY: number
}

export function FluidBorder() {
  const isMobile = useMobile()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const pointsRef = useRef<Point[]>([])
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Χρώματα για το περίγραμμα
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(80)
  const [lightness, setLightness] = useState(60)

  // Χρώματα για το περίγραμμα και το γέμισμα
  const borderColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const fillColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)` // 10% διαφάνεια

  // Διαφορετικό πάχος για κινητό και desktop
  const borderWidth = isMobile ? 25 : 50 // Μειωμένο πάχος στο κινητό (από 50 σε 25)
  const pointCount = 80 // Αριθμός σημείων για το ρευστό περίγραμμα

  // Διαφορετικές τιμές για κινητό και desktop
  const tension = isMobile ? 0.5 : 0.35 // Αυξημένο tension στο κινητό για γρηγορότερη επαναφορά
  const damping = isMobile ? 0.85 : 0.82 // Αυξημένο damping στο κινητό για λιγότερη ταλάντωση
  const interactionDistance = isMobile ? 200 : 280 // Μειωμένη απόσταση επιρροής στο κινητό
  const interactionStrength = isMobile ? 2 : 8 // Πολύ μειωμένη δύναμη στο κινητό (από 10 σε 2)
  const touchTimeout = 300 // Μειωμένος χρόνος αλληλεπίδρασης στο κινητό (από 500 σε 300)

  // Αρχικοποίηση των σημείων του περιγράμματος
  const initializePoints = () => {
    if (!canvasRef.current) return

    const { width, height } = canvasRef.current
    const points: Point[] = []
    const segmentLength = (2 * (width + height)) / pointCount

    // Δημιουργία σημείων γύρω από το περίγραμμα
    let currentLength = 0
    const perimeter = 2 * (width + height)

    for (let i = 0; i < pointCount; i++) {
      const ratio = currentLength / perimeter
      let x = 0,
        y = 0

      // Υπολογισμός θέσης σημείου στο περίγραμμα
      if (ratio < width / perimeter) {
        // Πάνω πλευρά
        x = ratio * perimeter
        y = 0
      } else if (ratio < (width + height) / perimeter) {
        // Δεξιά πλευρά
        x = width
        y = ratio * perimeter - width
      } else if (ratio < (2 * width + height) / perimeter) {
        // Κάτω πλευρά
        x = width - (ratio * perimeter - width - height)
        y = height
      } else {
        // Αριστερή πλευρά
        x = 0
        y = height - (ratio * perimeter - 2 * width - height)
      }

      points.push({
        x,
        y,
        vx: 0,
        vy: 0,
        originalX: x,
        originalY: y,
      })

      currentLength += segmentLength
    }

    pointsRef.current = points
  }

  // Χειρισμός αλλαγής μεγέθους παραθύρου
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { innerWidth, innerHeight } = window
        canvasRef.current.width = innerWidth
        canvasRef.current.height = innerHeight
        setDimensions({ width: innerWidth, height: innerHeight })
        initializePoints()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Χειρισμός κίνησης ποντικιού/αφής
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setCursorPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
        setIsInteracting(true)

        // Αφαιρεί την αλληλεπίδραση μετά από περισσότερο χρόνο στο κινητό
        clearTimeout(touchTimeoutRef.current)
        touchTimeoutRef.current = setTimeout(() => setIsInteracting(false), touchTimeout)
      }
    }

    const touchTimeoutRef = { current: 0 }

    if (isMobile) {
      window.addEventListener("touchstart", handleTouch)
      window.addEventListener("touchmove", handleTouch)
    } else {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mousedown", () => setIsInteracting(true))
      window.addEventListener("mouseup", () => setIsInteracting(false))
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouch)
        window.removeEventListener("touchmove", handleTouch)
        clearTimeout(touchTimeoutRef.current)
      } else {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mousedown", () => setIsInteracting(true))
        window.removeEventListener("mouseup", () => setIsInteracting(false))
      }
    }
  }, [isMobile, touchTimeout])

  // Ενημέρωση χρώματος για το εφέ αλλαγής χρωμάτων
  const updateColor = () => {
    // Αλλαγή της απόχρωσης (hue) για κυκλική εναλλαγή χρωμάτων
    setHue((prev) => (prev + 0.5) % 360)

    // Προσθήκη κυματιστής κίνησης στον κορεσμό και τη φωτεινότητα
    const time = performance.now() / 1000
    setSaturation(75 + Math.sin(time * 0.3) * 15)
    setLightness(60 + Math.cos(time * 0.2) * 10)
  }

  // Ενημέρωση χρώματος σε τακτά χρονικά διαστήματα
  useEffect(() => {
    const colorInterval = setInterval(() => {
      updateColor()
    }, 16) // ~60fps

    return () => {
      clearInterval(colorInterval)
    }
  }, [])

  // Καθαρισμός των animation frames κατά την αποσύνδεση
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Σχεδίαση του ρευστού περιγράμματος
  const drawFluidBorder = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const points = pointsRef.current
    if (points.length === 0) return

    // Καθαρισμός καμβά
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Ενημέρωση θέσης σημείων με βάση τη φυσική
    points.forEach((point, i) => {
      // Υπολογισμός απόστασης από τον κέρσορα
      const dx = cursorPosition.x - point.x
      const dy = cursorPosition.y - point.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Εφαρμογή δύναμης αν ο κέρσορας είναι κοντά
      if (distance < interactionDistance) {
        // Πιο έντονη μη γραμμική δύναμη για ισχυρότερο μαγνητισμό
        const force = Math.pow(1 - distance / interactionDistance, 2) * interactionStrength
        const angle = Math.atan2(dy, dx)
        const forceX = Math.cos(angle) * force * (isInteracting ? 3 : 1)
        const forceY = Math.sin(angle) * force * (isInteracting ? 3 : 1)

        point.vx += forceX
        point.vy += forceY
      }

      // Εφαρμογή δύναμης επαναφοράς (ελατήριο)
      const springForceX = (point.originalX - point.x) * tension
      const springForceY = (point.originalY - point.y) * tension

      point.vx += springForceX
      point.vy += springForceY

      // Εφαρμογή απόσβεσης
      point.vx *= damping
      point.vy *= damping

      // Ενημέρωση θέσης
      point.x += point.vx
      point.y += point.vy
    })

    // Σχεδίαση του ρευστού περιγράμματος με γέμισμα
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    // Σχεδίαση καμπύλης Bezier μεταξύ των σημείων
    for (let i = 0; i < points.length; i++) {
      const currentPoint = points[i]
      const nextPoint = points[(i + 1) % points.length]

      // Υπολογισμός σημείων ελέγχου για ομαλή καμπύλη
      const controlX1 = currentPoint.x + (nextPoint.x - points[(i - 1 + points.length) % points.length].x) * 0.2
      const controlY1 = currentPoint.y + (nextPoint.y - points[(i - 1 + points.length) % points.length].y) * 0.2
      const controlX2 = nextPoint.x - (points[(i + 2) % points.length].x - currentPoint.x) * 0.2
      const controlY2 = nextPoint.y - (points[(i + 2) % points.length].y - currentPoint.y) * 0.2

      ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, nextPoint.x, nextPoint.y)
    }

    // Πρώτα γεμίζουμε το εσωτερικό
    ctx.fillStyle = fillColor
    ctx.fill()

    // Μετά σχεδιάζουμε το περίγραμμα
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Σχεδίαση του εξωτερικού περιγράμματος της οθόνης
    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.rect(borderWidth, borderWidth, canvas.width - borderWidth * 2, canvas.height - borderWidth * 2)
    ctx.fillStyle = fillColor
    ctx.fill("evenodd") // Χρήση evenodd για να γεμίσει μόνο το περίγραμμα
  }

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawFluidBorder()
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [dimensions, cursorPosition, isInteracting])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        touchAction: "none",
        transition: "color 0.3s ease-in-out",
      }}
    />
  )
}
