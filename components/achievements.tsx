"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Coins, Zap, Crown } from "lucide-react"

const ACHIEVEMENTS = [
  {
    id: "first_win",
    name: "First Victory",
    description: "Win your first game",
    icon: Trophy,
    color: "from-green-500 to-emerald-600",
    unlocked: true,
  },
  {
    id: "streak_5",
    name: "Hot Streak",
    description: "Win 5 games in a row",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    unlocked: true,
  },
  {
    id: "coin_collector",
    name: "Coin Collector",
    description: "Earn 10,000 coins",
    icon: Coins,
    color: "from-yellow-400 to-yellow-600",
    unlocked: true,
  },
  {
    id: "chess_master",
    name: "Chess Master",
    description: "Reach level 10",
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    unlocked: false,
  },
]

interface AchievementsProps {
  achievements: string[]
}

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <Card className="bg-gradient-to-r from-indigo-600 to-purple-700 border-0 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5" />
          Achievements
          <Badge className="bg-yellow-500 text-black text-xs">
            {achievements.length}/{ACHIEVEMENTS.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.slice(0, 4).map((achievement) => {
            const Icon = achievement.icon
            const isUnlocked = achievements.includes(achievement.id)

            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg text-center ${
                  isUnlocked ? `bg-gradient-to-br ${achievement.color}` : "bg-gray-600/50"
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isUnlocked ? "text-white" : "text-gray-400"}`} />
                <h4 className={`text-sm font-semibold mb-1 ${isUnlocked ? "text-white" : "text-gray-400"}`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs ${isUnlocked ? "text-white/90" : "text-gray-500"}`}>{achievement.description}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
