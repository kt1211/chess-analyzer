"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Gift, Clock } from "lucide-react"

const DAILY_CHALLENGES = [
  {
    id: 1,
    title: "Win 3 Games",
    description: "Win 3 games in any mode",
    progress: 2,
    target: 3,
    reward: 100,
    type: "coins",
    completed: false,
  },
  {
    id: 2,
    title: "Capture Queen",
    description: "Capture opponent's queen",
    progress: 0,
    target: 1,
    reward: 50,
    type: "xp",
    completed: false,
  },
  {
    id: 3,
    title: "5-Win Streak",
    description: "Achieve a 5-game win streak",
    progress: 3,
    target: 5,
    reward: 200,
    type: "coins",
    completed: false,
  },
]

export default function DailyChallenges() {
  return (
    <Card className="bg-gradient-to-r from-pink-600 to-purple-700 border-0 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Daily Challenges
          <Badge className="bg-yellow-500 text-black text-xs">
            <Clock className="h-3 w-3 mr-1" />
            12h left
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {DAILY_CHALLENGES.map((challenge) => (
          <div key={challenge.id} className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-sm">{challenge.title}</h4>
                <p className="text-xs opacity-90">{challenge.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold">
                  {challenge.type === "coins" ? (
                    <>
                      <Gift className="h-4 w-4 text-yellow-400" />
                      {challenge.reward}
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 text-blue-400" />
                      {challenge.reward}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Progress value={(challenge.progress / challenge.target) * 100} className="flex-1 h-2" />
              <span className="text-xs font-medium">
                {challenge.progress}/{challenge.target}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
