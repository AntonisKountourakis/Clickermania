"use client"

import { useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useCustomBack() {
  const router = useRouter()
  const pathname = usePathname()

  // Αποθηκεύουμε το τρέχον παιχνίδι όταν φορτώνει το hook
  useEffect(() => {
    if (pathname && pathname.includes("/games/")) {
      const gameId = pathname.split("/").pop() || ""
      if (gameId) {
        localStorage.setItem("last-played-game", gameId)
      }
    }
  }, [pathname])

  // Βελτιωμένη συνάρτηση για επιστροφή
  const handleCustomBack = useCallback(() => {
    // Αποθηκεύουμε το τρέχον παιχνίδι πριν την πλοήγηση
    if (pathname && pathname.includes("/games/")) {
      const gameId = pathname.split("/").pop() || ""
      if (gameId) {
        localStorage.setItem("last-played-game", gameId)
      }
    }

    // Έλεγχος αν υπάρχει προηγούμενη σελίδα στο ιστορικό
    if (window.history.length > 1) {
      window.history.back()
    } else {
      // Αν δεν υπάρχει ιστορικό, πάμε στην αρχική
      router.push("/")
    }
  }, [pathname, router])

  return { handleCustomBack }
}
