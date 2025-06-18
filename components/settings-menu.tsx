"use client"

import { useState } from "react"
import { useSettings } from "@/contexts/settings-context"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings } = useSettings()
  const { isMobile, isLowPerformanceDevice } = useMobileOptimization()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleSetting = (setting: keyof typeof settings) => {
    updateSettings({ [setting]: !settings[setting] })
  }

  return (
    <div className="relative z-50">
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 right-1/2 transform translate-x-16 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-1/2 transform translate-x-32 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-64">
          <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Settings</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="soundEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                Sound Effects
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onChange={() => toggleSetting("soundEnabled")}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="soundEnabled"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.soundEnabled ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="musicEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                Background Music
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="musicEnabled"
                  checked={settings.musicEnabled}
                  onChange={() => toggleSetting("musicEnabled")}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="musicEnabled"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.musicEnabled ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="enableAnimations" className="text-sm text-gray-700 dark:text-gray-300">
                Background Animations
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="enableAnimations"
                  checked={settings.enableAnimations}
                  onChange={() => toggleSetting("enableAnimations")}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="enableAnimations"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.enableAnimations ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="highPerformanceMode" className="text-sm text-gray-700 dark:text-gray-300">
                High Performance Mode
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="highPerformanceMode"
                  checked={settings.highPerformanceMode}
                  onChange={() => toggleSetting("highPerformanceMode")}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="highPerformanceMode"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.highPerformanceMode ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></label>
              </div>
            </div>
          </div>

          {isLowPerformanceDevice && (
            <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-2 rounded">
              Low performance device detected. Some visual effects have been automatically reduced.
            </div>
          )}

          <button
            onClick={toggleMenu}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
