export function formatNumber(num: number): string {
  if (num === 0) return "0"

  if (num < 1000) {
    return num.toFixed(0)
  }

  const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"]
  const exponent = Math.min(Math.floor(Math.log10(num) / 3), units.length - 1)
  const divisor = Math.pow(10, exponent * 3)
  const shortened = num / divisor

  // Format with 1 decimal place if less than 10, otherwise no decimals
  const formatted = shortened < 10 ? shortened.toFixed(1) : shortened.toFixed(0)

  return `${formatted}${units[exponent]}`
}
