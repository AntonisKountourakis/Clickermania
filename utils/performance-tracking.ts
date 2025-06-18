// Performance tracking utility functions

// Store performance marks and measures
const performanceMarks: Record<string, number> = {}

/**
 * Start tracking performance for a specific operation
 * @param operationName Name of the operation to track
 */
export function startPerformanceTracking(operationName: string): void {
  if (typeof performance === "undefined") return

  const markName = `${operationName}-start`
  performance.mark(markName)
  performanceMarks[operationName] = performance.now()
}

/**
 * End tracking performance for a specific operation and return the duration
 * @param operationName Name of the operation to track
 * @returns Duration in milliseconds
 */
export function endPerformanceTracking(operationName: string): number {
  if (typeof performance === "undefined" || !performanceMarks[operationName]) return 0

  const startMarkName = `${operationName}-start`
  const endMarkName = `${operationName}-end`

  performance.mark(endMarkName)

  try {
    performance.measure(operationName, startMarkName, endMarkName)
    const entries = performance.getEntriesByName(operationName, "measure")

    if (entries.length > 0) {
      const duration = entries[0].duration

      // Log slow operations (over 100ms)
      if (duration > 100) {
        console.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`)
      }

      // Clean up marks
      performance.clearMarks(startMarkName)
      performance.clearMarks(endMarkName)
      performance.clearMeasures(operationName)

      delete performanceMarks[operationName]

      return duration
    }
  } catch (e) {
    // Fallback to manual calculation if measure fails
    const duration = performance.now() - performanceMarks[operationName]
    delete performanceMarks[operationName]
    return duration
  }

  return 0
}

/**
 * Track the performance of a function
 * @param fn Function to track
 * @param operationName Name of the operation
 * @returns Result of the function
 */
export function trackPerformance<T>(fn: () => T, operationName: string): T {
  startPerformanceTracking(operationName)
  const result = fn()
  endPerformanceTracking(operationName)
  return result
}

/**
 * Create a debounced version of a function
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Create a throttled version of a function
 * @param fn Function to throttle
 * @param limit Limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastCall < limit) {
      // If we're within the limit, clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Schedule the function to run at the end of the throttle period
      timeoutId = setTimeout(
        () => {
          lastCall = now
          fn.apply(this, args)
          timeoutId = null
        },
        limit - (now - lastCall),
      )

      return
    }

    // If we're outside the limit, run the function immediately
    lastCall = now
    fn.apply(this, args)
  }
}

/**
 * Βελτιστοποιημένη συνάρτηση throttle για χειρισμό κύλισης
 * @param fn Συνάρτηση για throttle
 * @param delay Καθυστέρηση σε ms
 * @param options Επιλογές για το throttle
 * @returns Throttled συνάρτηση
 */
export function scrollThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay = 16,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true },
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0
  let result: any

  return function (this: any, ...args: Parameters<T>): void {
    const now = Date.now()
    const remaining = delay - (now - previous)

    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      previous = now
      if (options.leading !== false) {
        result = fn.apply(this, args)
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        previous = options.leading === false ? 0 : Date.now()
        timeout = null
        result = fn.apply(this, args)
      }, remaining)
    }

    return result
  }
}

/**
 * Βελτιστοποιημένη συνάρτηση για άμεση κύλιση
 * @param element Το στοιχείο για κύλιση
 * @param to Η θέση για κύλιση
 * @param duration Η διάρκεια της κύλισης (πλέον αγνοείται)
 * @param axis Ο άξονας κύλισης ('x' ή 'y')
 * @param easing Η συνάρτηση easing (πλέον αγνοείται)
 */
export function smoothScroll(
  element: HTMLElement,
  to: number,
  duration = 0, // Ignored
  axis: "x" | "y" = "x",
  easing: (t: number) => number = (t) => t, // Simple linear easing
): void {
  // Απλή άμεση κύλιση χωρίς animation
  if (axis === "x") {
    element.scrollLeft = to
  } else {
    element.scrollTop = to
  }
}

/**
 * Βελτιστοποιημένη συνάρτηση για προφόρτωση εικόνων
 * @param urls Πίνακας με URLs εικόνων για προφόρτωση
 * @returns Promise που επιλύεται όταν όλες οι εικόνες έχουν φορτωθεί
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`)
        resolve() // Επίλυση ακόμα και σε περίπτωση σφάλματος για να μην μπλοκάρει τις άλλες εικόνες
      }
      img.src = url
    })
  })

  return Promise.all(promises)
}

/**
 * Track localStorage performance
 */
export function setupStoragePerformanceTracking(): () => void {
  if (typeof localStorage === "undefined") return () => {}

  const originalGetItem = localStorage.getItem
  const originalSetItem = localStorage.setItem

  localStorage.getItem = (key: string) => {
    startPerformanceTracking(`localStorage.getItem(${key})`)
    const result = originalGetItem.call(localStorage, key)
    const duration = endPerformanceTracking(`localStorage.getItem(${key})`)

    // Log slow storage access
    if (duration > 5) {
      console.warn(`Slow localStorage.getItem(${key}): ${duration.toFixed(2)}ms`)
    }

    return result
  }

  localStorage.setItem = (key: string, value: string) => {
    startPerformanceTracking(`localStorage.setItem(${key})`)
    const result = originalSetItem.call(localStorage, key, value)
    const duration = endPerformanceTracking(`localStorage.setItem(${key})`)

    // Log slow storage access
    if (duration > 10) {
      console.warn(`Slow localStorage.setItem(${key}): ${duration.toFixed(2)}ms`)
    }

    return result
  }

  // Return cleanup function
  return () => {
    localStorage.getItem = originalGetItem
    localStorage.setItem = originalSetItem
  }
}

/**
 * Track component render performance
 * @param componentName Name of the component
 * @returns Cleanup function
 */
export function trackComponentRender(componentName: string): () => void {
  startPerformanceTracking(`render-${componentName}`)

  return () => {
    const duration = endPerformanceTracking(`render-${componentName}`)

    // Log slow renders
    if (duration > 16) {
      console.warn(`Slow render detected for ${componentName}: ${duration.toFixed(2)}ms`)
    }
  }
}
