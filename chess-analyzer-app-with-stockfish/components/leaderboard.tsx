"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Trophy, Star } from "lucide-react"

const LEADERBOARD_DATA = [
  { rank: 1, name: "ChessMaster", level: 12, coins: 25420, wins: 156, avatar: "👑" },
  { rank: 2, name: "KingSlayer", level: 11, coins: 22100, wins: 142, avatar: "⚔️" },
  { rank: 3, name: "QueenHunter", level: 10, coins: 19800, wins: 128, avatar: "🏹" },
  { rank: 4, name: "RookMaster", level: 9, coins: 17500, wins: 115, avatar: "🏰" },
  { rank: 5, name: "You", level: 5, coins: 15420, wins: 32, avatar: "🎯" },
  { rank: 6, name: "PawnPusher", level: 8, coins: 14200, wins: 98, avatar: "♟️" },
  { rank: 7, name: "KnightRider", level: 7, coins: 12800, wins: 87, avatar: "🐎" },
  { rank: 8, name: "BishopBlitz", level: 6, coins: 11500, wins: 76, avatar: "⛪" },
]

export default function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Trophy className="h-6 w-6 text-orange-400" />
      default:
        return <span className="text-lg font-bold text-white">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500 to-orange-600"
      case 2:
        return "from-gray-400 to-gray-600"
      case 3:
        return "from-orange-500 to-red-600"
      default:
        return "from-blue-500 to-purple-600"
    }
  }

  return (
    <div className="p-4 space-y-4">
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-700 border-0 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {LEADERBOARD_DATA.map((player) => (
          <Card
            key={player.rank}
            className={`bg-gradient-to-r ${getRankColor(player.rank)} border-0 text-white ${
              player.name === "You" ? "ring-2 ring-yellow-400" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  {player.rank <= 3 ? getRankIcon(player.rank) : <span className="text-2xl">{player.avatar}</span>}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{player.name}</h3>
                    {player.name === "You" && <Badge className="bg-yellow-500 text-black text-xs">YOU</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <span>Level {player.level}</span>
                    <span>{player.wins} wins</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold">
                    <Star className="h-4 w-4" />
                    {player.coins.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">coins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
