"use client"

import { useState, useEffect, useRef } from "react"
import { isMobileDevice } from "@/utils/mobile-optimization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, Activity, Cpu, MemoryStickIcon as Memory, Clock, X } from "lucide-react"

interface PerformanceMetric {
  timestamp: number
  value: number
}

interface PerformanceData {
  fps: PerformanceMetric[]
  memory: PerformanceMetric[]
  eventHandlingTime: PerformanceMetric[]
  renderTime: PerformanceMetric[]
  storageAccessTime: PerformanceMetric[]
  networkRequests: PerformanceMetric[]
}

export function PerformanceMonitor() {
  const [fps, setFps] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: [],
    memory: [],
    eventHandlingTime: [],
    renderTime: [],
    storageAccessTime: [],
    networkRequests: [],
  })
  const [bottlenecks, setBottlenecks] = useState<string[]>([])
  const [lastRenderTime, setLastRenderTime] = useState(0)
  const [avgRenderTime, setAvgRenderTime] = useState(0)
  const [peakMemory, setPeakMemory] = useState(0)
  const [longTasks, setLongTasks] = useState(0)

  // Refs for tracking
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const renderTimesRef = useRef<number[]>([])
  const animationFrameIdRef = useRef<number | null>(null)
  const observerRef = useRef<PerformanceObserver | null>(null)
  const longTaskObserverRef = useRef<PerformanceObserver | null>(null)
  const storageAccessTimesRef = useRef<number[]>([])
  const eventHandlingTimesRef = useRef<number[]>([])

  // Initialize performance monitoring
  useEffect(() => {
    setIsMobile(isMobileDevice())

    // Start tracking FPS
    const measureFps = () => {
      frameCountRef.current++
      const currentTime = performance.now()

      if (currentTime - lastTimeRef.current >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))
        setFps(currentFps)

        // Update performance data
        setPerformanceData((prev) => ({
          ...prev,
          fps: [...prev.fps.slice(-30), { timestamp: Date.now(), value: currentFps }],
        }))

        // Check for FPS bottlenecks
        if (currentFps < 30 && !bottlenecks.includes("Low FPS")) {
          setBottlenecks((prev) => [...prev, "Low FPS"])
        }

        frameCountRef.current = 0
        lastTimeRef.current = currentTime

        // Measure memory if available
        if ((performance as any).memory) {
          const memUsage = Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024))
          setMemoryUsage(memUsage)

          // Update memory data
          setPerformanceData((prev) => ({
            ...prev,
            memory: [...prev.memory.slice(-30), { timestamp: Date.now(), value: memUsage }],
          }))

          // Track peak memory
          if (memUsage > peakMemory) {
            setPeakMemory(memUsage)
          }

          // Check for memory bottlenecks
          if (memUsage > 100 && !bottlenecks.includes("High Memory Usage")) {
            setBottlenecks((prev) => [...prev, "High Memory Usage"])
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(measureFps)
    }

    // Start measuring FPS
    measureFps()

    // Set up performance observer for render times
    try {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        for (const entry of entries) {
          if (entry.entryType === "measure" && entry.name === "render") {
            const renderTime = entry.duration
            renderTimesRef.current.push(renderTime)

            // Keep only the last 50 render times
            if (renderTimesRef.current.length > 50) {
              renderTimesRef.current.shift()
            }

            // Calculate average render time
            const avgTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0) / renderTimesRef.current.length
            setAvgRenderTime(avgTime)
            setLastRenderTime(renderTime)

            // Update render time data
            setPerformanceData((prev) => ({
              ...prev,
              renderTime: [...prev.renderTime.slice(-30), { timestamp: Date.now(), value: renderTime }],
            }))

            // Check for render time bottlenecks
            if (renderTime > 16 && !bottlenecks.includes("Slow Renders")) {
              setBottlenecks((prev) => [...prev, "Slow Renders"])
            }
          }
        }
      })

      observerRef.current.observe({ entryTypes: ["measure"] })
    } catch (e) {
      console.error("Performance observer not supported", e)
    }

    // Set up long tasks observer
    try {
      longTaskObserverRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        setLongTasks((prev) => prev + entries.length)

        // Check for long tasks bottlenecks
        if (entries.length > 0 && !bottlenecks.includes("Long Tasks")) {
          setBottlenecks((prev) => [...prev, "Long Tasks"])
        }
      })

      longTaskObserverRef.current.observe({ entryTypes: ["longtask"] })
    } catch (e) {
      console.error("Long tasks observer not supported", e)
    }

    // Monkey patch localStorage to measure access times
    const originalGetItem = localStorage.getItem
    const originalSetItem = localStorage.setItem

    localStorage.getItem = (key) => {
      const start = performance.now()
      const result = originalGetItem.call(localStorage, key)
      const end = performance.now()
      const accessTime = end - start

      storageAccessTimesRef.current.push(accessTime)

      // Keep only the last 50 access times
      if (storageAccessTimesRef.current.length > 50) {
        storageAccessTimesRef.current.shift()
      }

      // Update storage access time data
      setPerformanceData((prev) => ({
        ...prev,
        storageAccessTime: [...prev.storageAccessTime.slice(-30), { timestamp: Date.now(), value: accessTime }],
      }))

      // Check for storage access bottlenecks
      if (accessTime > 5 && !bottlenecks.includes("Slow Storage Access")) {
        setBottlenecks((prev) => [...prev, "Slow Storage Access"])
      }

      return result
    }

    localStorage.setItem = (key, value) => {
      const start = performance.now()
      const result = originalSetItem.call(localStorage, key, value)
      const end = performance.now()
      const accessTime = end - start

      storageAccessTimesRef.current.push(accessTime)

      // Update storage access time data
      setPerformanceData((prev) => ({
        ...prev,
        storageAccessTime: [...prev.storageAccessTime.slice(-30), { timestamp: Date.now(), value: accessTime }],
      }))

      return result
    }

    // Cleanup function
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (longTaskObserverRef.current) {
        longTaskObserverRef.current.disconnect()
      }

      // Restore original localStorage methods
      localStorage.getItem = originalGetItem
      localStorage.setItem = originalSetItem
    }
  }, [bottlenecks, peakMemory])

  // Mark render start/end for components
  useEffect(() => {
    performance.mark("render-start")

    return () => {
      performance.mark("render-end")
      performance.measure("render", "render-start", "render-end")
    }
  })

  // Simple performance visualization component
  const PerformanceGraph = ({ data, label, color }: { data: PerformanceMetric[]; label: string; color: string }) => {
    if (data.length === 0) return null

    const maxValue = Math.max(...data.map((d) => d.value))
    const minValue = Math.min(...data.map((d) => d.value))

    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">{label}</span>
          <span className="text-xs">{data[data.length - 1]?.value.toFixed(2)}</span>
        </div>
        <div className="h-8 bg-gray-800/60 rounded-lg overflow-hidden flex border border-purple-500/20">
          {data.map((metric, i) => {
            const height = maxValue === minValue ? 100 : ((metric.value - minValue) / (maxValue - minValue)) * 100
            return (
              <div
                key={i}
                className="w-1 mx-[1px] rounded-sm"
                style={{
                  height: `${Math.max(10, height)}%`,
                  backgroundColor: color,
                  alignSelf: "flex-end",
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  if (!isVisible) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-br from-gray-900 via-purple-900/90 to-gray-900 text-white p-0 rounded-xl shadow-[0_0_25px_rgba(123,31,162,0.6)] border-2 border-purple-400 outline outline-1 outline-purple-300/30 backdrop-blur-sm w-auto max-w-[90vw]">
      <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 border-b-2 border-purple-400">
        <CardTitle className="text-sm font-medium flex items-center">
          <Activity className="h-4 w-4 mr-1" />
          Performance Monitor
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-purple-300 hover:text-white hover:bg-purple-800/50 transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <LineChart className="h-4 w-4" /> : <BarChart className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-purple-300 hover:text-white hover:bg-purple-800/50 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`p-3 ${expanded ? "w-80" : "w-auto"}`}>
        {expanded ? (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-2 bg-gray-800/60">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="bottlenecks">Issues</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/60 p-2 rounded-lg border border-purple-500/20 shadow-inner">
                  <div className="flex items-center text-xs mb-1">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>FPS</span>
                  </div>
                  <div
                    className={`text-lg font-bold ${fps < 30 ? "text-red-400" : fps < 50 ? "text-yellow-400" : "text-green-400"}`}
                  >
                    {fps}
                  </div>
                </div>
                <div className="bg-gray-800/60 p-2 rounded-lg border border-purple-500/20 shadow-inner">
                  <div className="flex items-center text-xs mb-1">
                    <Memory className="h-3 w-3 mr-1" />
                    <span>Memory</span>
                  </div>
                  <div className="text-lg font-bold">{memoryUsage !== null ? `${memoryUsage} MB` : "N/A"}</div>
                </div>
                <div className="bg-gray-800/60 p-2 rounded-lg border border-purple-500/20 shadow-inner">
                  <div className="flex items-center text-xs mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Render Time</span>
                  </div>
                  <div className={`text-lg font-bold ${lastRenderTime > 16 ? "text-red-400" : "text-green-400"}`}>
                    {lastRenderTime.toFixed(2)} ms
                  </div>
                </div>
                <div className="bg-gray-800/60 p-2 rounded-lg border border-purple-500/20 shadow-inner">
                  <div className="flex items-center text-xs mb-1">
                    <Cpu className="h-3 w-3 mr-1" />
                    <span>Long Tasks</span>
                  </div>
                  <div className={`text-lg font-bold ${longTasks > 0 ? "text-red-400" : "text-green-400"}`}>
                    {longTasks}
                  </div>
                </div>
              </div>
              <PerformanceGraph data={performanceData.fps} label="FPS (last 30s)" color="#4ade80" />
              <PerformanceGraph data={performanceData.memory} label="Memory (MB)" color="#60a5fa" />
            </TabsContent>
            <TabsContent value="metrics" className="space-y-2">
              <PerformanceGraph data={performanceData.renderTime} label="Render Time (ms)" color="#f87171" />
              <PerformanceGraph data={performanceData.storageAccessTime} label="Storage Access (ms)" color="#fbbf24" />
              <div className="text-xs mt-2">
                <div className="flex justify-between">
                  <span>Avg Render Time:</span>
                  <span>{avgRenderTime.toFixed(2)} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Memory:</span>
                  <span>{peakMemory} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Device:</span>
                  <span>{isMobile ? "Mobile" : "Desktop"}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bottlenecks" className="space-y-2">
              {bottlenecks.length > 0 ? (
                <div className="space-y-1">
                  {bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="bg-red-900/30 p-2 rounded text-xs">
                      {bottleneck}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-900/30 p-2 rounded text-xs">No performance issues detected</div>
              )}
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => setBottlenecks([])}>
                Clear Issues
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <span>FPS:</span>
              <span className={fps < 30 ? "text-red-400" : fps < 50 ? "text-yellow-400" : "text-green-400"}>{fps}</span>
            </div>
            {memoryUsage !== null && (
              <div className="flex justify-between items-center">
                <span>Memory:</span>
                <span>{memoryUsage} MB</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Render:</span>
              <span className={lastRenderTime > 16 ? "text-red-400" : "text-green-400"}>
                {lastRenderTime.toFixed(1)} ms
              </span>
            </div>
            {bottlenecks.length > 0 && (
              <div className="flex justify-between items-center">
                <span>Issues:</span>
                <span className="text-red-400">{bottlenecks.length}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
