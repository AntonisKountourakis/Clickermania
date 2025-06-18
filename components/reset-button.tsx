"use client"

import type React from "react"

interface ResetButtonProps {
  onClick: () => void
  gameTitle?: string
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onClick, gameTitle }) => {
  // Return null to hide the button from all games
  return null
}

export default ResetButton
