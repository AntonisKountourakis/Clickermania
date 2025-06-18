"use client"

import { useState, useEffect } from "react"

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Έλεγχος αν είναι mobile με βάση το User Agent
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
      )

      // Έλεγχος και με βάση το μέγεθος της οθόνης
      const isMobileScreen = window.innerWidth <= 768

      setIsMobile(isMobileDevice || isMobileScreen)
    }

    checkMobile()

    // Ενημερώνει την κατάσταση όταν αλλάζει το μέγεθος του παραθύρου
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
