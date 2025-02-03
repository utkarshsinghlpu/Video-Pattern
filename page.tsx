"use client"

import { useState, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RefreshCw } from "lucide-react"

const COLORS = [
  { r: 0, g: 255, b: 0 }, // Green
  { r: 0, g: 255, b: 255 }, // Cyan
  { r: 0, g: 0, b: 255 }, // Blue
  { r: 255, g: 0, b: 255 }, // Magenta
  { r: 255, g: 0, b: 0 }, // Red
  { r: 255, g: 255, b: 0 }, // Yellow
]

const ROWS = 15
const COLS = 20

export default function WaveGrid() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [wave, setWave] = useState<number[]>(Array(ROWS * COLS).fill(0))
  const [speed, setSpeed] = useState(100)
  const [colorIndex, setColorIndex] = useState(0)

  const resetWave = useCallback(() => {
    setWave(Array(ROWS * COLS).fill(0))
    setIsPlaying(true)
  }, [])

  // Animate wave
  useEffect(() => {
    if (!isPlaying) return

    let position = 0
    let direction = 1
    let colorChangeCounter = 0

    const interval = setInterval(() => {
      setWave((prev) => {
        const newWave = prev.map((v) => Math.max(0, v - 0.1))

        // Create new wave front
        for (let i = 0; i < ROWS; i++) {
          const index = i * COLS + position
          newWave[index] = 1
        }

        return newWave
      })

      // Update position with bounce
      position += direction
      if (position >= COLS - 1 || position <= 0) {
        direction *= -1
      }

      // Change color every 20 moves
      colorChangeCounter++
      if (colorChangeCounter >= 20) {
        setColorIndex((prevIndex) => (prevIndex + 1) % COLORS.length)
        colorChangeCounter = 0
      }
    }, speed)

    return () => clearInterval(interval)
  }, [isPlaying, speed])

  const currentColor = COLORS[colorIndex]

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <Card className="w-full max-w-lg bg-black/50 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-500 text-center">Wave Grid Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grid Container */}
          <div
            className="grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {wave.map((value, index) => (
              <div
                key={index}
                className="aspect-square rounded-sm transition-colors duration-200"
                style={{
                  backgroundColor: `rgb(${Math.floor(currentColor.r * value)}, ${Math.floor(currentColor.g * value)}, ${Math.floor(currentColor.b * value)})`,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-green-500/50 text-green-500 hover:bg-green-500/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                className="border-green-500/50 text-green-500 hover:bg-green-500/20"
                onClick={resetWave}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-green-500 text-center">Animation Speed</p>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                min={50}
                max={200}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

