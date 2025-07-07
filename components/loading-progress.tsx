"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface LoadingProgressProps {
  isAnalyzing: boolean
  onComplete?: () => void
}

export default function LoadingProgress({ isAnalyzing, onComplete }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isAnalyzing) {
      setProgress(0)

      // Fast progress animation - complete in 8 seconds max
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            onComplete?.()
            return 100
          }

          // Accelerated progress
          const increment = prev < 50 ? 15 : prev < 80 ? 10 : 5
          return Math.min(prev + increment, 100)
        })
      }, 400) // Update every 400ms for smooth animation

      return () => clearInterval(interval)
    }
  }, [isAnalyzing, onComplete])

  if (!isAnalyzing) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-amber-700">Detecting pieces...</span>
        <span className="text-amber-600">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="text-xs text-amber-600 text-center">
        {progress < 30 && "Analyzing image..."}
        {progress >= 30 && progress < 60 && "Detecting pieces..."}
        {progress >= 60 && progress < 90 && "Arranging board..."}
        {progress >= 90 && "Almost ready!"}
      </div>
    </div>
  )
}
