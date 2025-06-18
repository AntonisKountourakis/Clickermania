"use client"

import { useState } from "react"
import { GameCreator } from "@/components/game-creator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    // Απλός έλεγχος κωδικού πρόσβασης - σε πραγματική εφαρμογή θα χρησιμοποιούσαμε πιο ασφαλή μέθοδο
    if (password === "admin123") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Λανθασμένος κωδικός πρόσβασης.")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Σελίδα Διαχείρισης</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Κωδικός Πρόσβασης</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Εισάγετε τον κωδικό"
                  />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleLogin} className="w-full">
                Είσοδος
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Διαχείριση Παιχνιδιών</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Δημιουργία Νέου Παιχνιδιού</h2>
          <GameCreator />
        </div>
      </div>
    </div>
  )
}
