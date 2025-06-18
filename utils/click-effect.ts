// utils/click-effect.ts

interface ClickEffectOptions {
  x: number
  y: number
  container: HTMLElement
  content: string
  colors?: string[]
}

export const createClickEffect = (options: ClickEffectOptions) => {
  const { x, y, container, content, colors } = options

  const particle = document.createElement("div")
  particle.className = "click-effect"
  particle.textContent = content
  particle.style.left = `${x}px`
  particle.style.top = `${y}px`

  const color = (colors && colors[Math.floor(Math.random() * colors.length)]) || "#fff"
  particle.style.color = color

  container.appendChild(particle)

  particle.addEventListener("animationend", () => {
    particle.remove()
  })
}

interface ParticleOptions {
  x: number
  y: number
  emoji: string
  container: HTMLElement
}

export const createParticle = (x: number, y: number, emoji: string, container: HTMLElement) => {
  const particle = document.createElement("div")
  particle.className = "particle"
  particle.textContent = emoji
  particle.style.left = `${x}px`
  particle.style.top = `${y}px`
  container.appendChild(particle)

  particle.addEventListener("animationend", () => {
    particle.remove()
  })
}
