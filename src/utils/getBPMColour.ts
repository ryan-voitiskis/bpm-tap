import * as d3 from "d3-interpolate"
const min = 80 // low end of bpm range clamp
const max = 170 // high end of bpm range clamp

export function getBPMColour(bpm: number): string {
  const lowColour = "hsl(155, 60%, 50%)"
  const highColour = "hsl(342, 70%, 62%)"
  const clampedBpm = Math.min(Math.max(bpm, min), max)
  return d3.interpolateCubehelixLong(
    lowColour,
    highColour,
  )((clampedBpm - min) / (max - min))
}
