"use client"

import Link from "next/link"
import RockstarClickerGame from "@/components/rockstar-clicker-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import "./rockstar-clicker.css"
import ResetButton from "@/components/reset-button"

export default function RockstarClickerPageClient() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-none hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 hover:text-white shadow-lg"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <RockstarClickerGame />
      <ResetButton />
    </>
  )
}
