"use client"

import { Coins, Star, Zap, Crown, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WinzoHeaderProps {
  coins: number
  level: number
  xp: number
  streak: number
}

export default function WinzoHeader({ coins, level, xp, streak }: WinzoHeaderProps) {
  const xpForNextLevel = level * 500
  const currentLevelXP = xp % 500
  const xpProgress = (currentLevelXP / 500) * 100

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Chess Master</h1>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span>Level {level}</span>
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-3 text-center">
          <Coins className="h-6 w-6 mx-auto mb-1" />
          <div className="text-lg font-bold">{coins.toLocaleString()}</div>
          <div className="text-xs opacity-90">Coins</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-center">
          <Star className="h-6 w-6 mx-auto mb-1" />
          <div className="text-lg font-bold">{xp.toLocaleString()}</div>
          <div className="text-xs opacity-90">XP</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-3 text-center">
          <Zap className="h-6 w-6 mx-auto mb-1" />
          <div className="text-lg font-bold">{streak}</div>
          <div className="text-xs opacity-90">Streak</div>
        </div>
      </div>
    </div>
  )
}
