/**
 * Simple function to play a click sound using Web Audio API
 * This avoids issues with audio file loading
 */
export function playClickSound(volume = 0.5) {
  try {
    // Check if sound is muted
    if (typeof localStorage !== "undefined" && localStorage.getItem("audio-muted") === "true") {
      return
    }

    // Use Web Audio API to generate a click sound
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) {
      console.warn("Web Audio API not supported")
      return
    }

    const context = new AudioContext()

    // Create oscillator for a simple click sound
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    // Configure oscillator
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(800, context.currentTime)

    // Configure gain (volume)
    gainNode.gain.setValueAtTime(volume * 0.3, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1)

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    // Play sound
    oscillator.start()
    oscillator.stop(context.currentTime + 0.1)

    console.log("Click sound played via Web Audio API")
  } catch (error) {
    console.error("Error playing click sound:", error)
  }
}

// Initialize audio system
export function initializeClickSounds() {
  // No initialization needed for Web Audio API approach
  console.log("Click sound system initialized (using Web Audio API)")
}
