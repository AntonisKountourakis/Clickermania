export class ClickEffectManager {
  private container: HTMLElement
  private options: {
    particleCount: number
    particleImages: string[]
    gravity: number
    particleLifetime: number
    spread: number
    initialVelocity: { min: number; max: number }
  }

  constructor(container: HTMLElement, options: any) {
    this.container = container
    this.options = {
      particleCount: options.particleCount || 10,
      particleImages: options.particleImages || ["✨"],
      gravity: options.gravity || 0.1,
      particleLifetime: options.particleLifetime || 1000,
      spread: options.spread || 80,
      initialVelocity: options.initialVelocity || { min: 5, max: 15 },
    }
  }

  createParticles(x: number, y: number) {
    for (let i = 0; i < this.options.particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "click-effect"
      particle.innerHTML = this.options.particleImages[Math.floor(Math.random() * this.options.particleImages.length)]
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`

      const angle = Math.random() * Math.PI * 2
      const speed =
        this.options.initialVelocity.min +
        Math.random() * (this.options.initialVelocity.max - this.options.initialVelocity.min)
      const distanceX = Math.cos(angle) * speed
      const distanceY = Math.sin(angle) * speed

      particle.style.setProperty("--dx", `${distanceX}px`)
      particle.style.setProperty("--dy", `${distanceY}px`)
      particle.style.setProperty("--gravity", `${this.options.gravity}`)

      this.container.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, this.options.particleLifetime)
    }
  }

  cleanup() {
    // Clean up any remaining particles
    this.container.querySelectorAll(".click-effect").forEach((particle) => particle.remove())
  }
}

export const formatNumber = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}
