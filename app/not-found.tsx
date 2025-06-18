// Δημιουργία ασφαλούς σελίδας not-found που δεν χρησιμοποιεί localStorage

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false)

  // Μόνο στον client θα εκτελεστεί αυτό
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-800 text-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Η σελίδα δεν βρέθηκε</h2>
      <p className="text-lg mb-8 text-center max-w-md">Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-purple-900 font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-all"
      >
        Επιστροφή στην αρχική
      </Link>
    </div>
  )
}
