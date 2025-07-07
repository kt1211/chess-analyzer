"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coins, Star } from "lucide-react"

interface GameMode {
  id: string
  name: string
  description: string
  coins: number
  xp: number
  icon: string
  color: string
}

interface GameModesProps {
  modes: GameMode[]
  onSelectMode: (modeId: string) => void
}

export default function GameModes({ modes, onSelectMode }: GameModesProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {modes.map((mode) => (
        <Card
          key={mode.id}
          className={`bg-gradient-to-br ${mode.color} border-0 text-white cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95`}
          onClick={() => onSelectMode(mode.id)}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">{mode.icon}</div>
            <h3 className="font-bold text-lg mb-1">{mode.name}</h3>
            <p className="text-xs opacity-90 mb-3">{mode.description}</p>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-sm">
                <Coins className="h-4 w-4" />
                <span>{mode.coins} coins</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm">
                <Star className="h-4 w-4" />
                <span>{mode.xp} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
