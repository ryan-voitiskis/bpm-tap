import assert from "node:assert/strict"
import test from "node:test"
import {
  estimateBeatInterval,
  estimateSessionTempo,
  getResetDelay,
  inferBeatIncrement,
  type TempoTap,
} from "../src/tempo.ts"

const BPM_125_INTERVAL = 480

function bpm(taps: TempoTap[]) {
  return 60000 / estimateBeatInterval(taps)
}

test("a steady session becomes more stable as taps accumulate", () => {
  const taps: TempoTap[] = []
  const readings: number[] = []

  for (let beat = 0; beat <= 125; beat++) {
    const humanTimingJitter =
      18 * Math.sin(beat * 1.7) + 8 * Math.sin(beat * 0.37)

    taps.push({
      beat,
      time: beat * BPM_125_INTERVAL + humanTimingJitter,
    })
    if (taps.length > 1) readings.push(bpm(taps))
  }

  const finalReadings = readings.slice(-20)
  const finalRange = Math.max(...finalReadings) - Math.min(...finalReadings)

  assert.ok(Math.abs(readings.at(-1)! - 125) < 0.01)
  assert.ok(finalRange < 0.01)
  assert.ok(finalRange < Math.abs(readings[6]! - 125))
})

test("an isolated badly timed tap does not skew a settled reading", () => {
  const taps = Array.from({ length: 40 }, (_, beat) => ({
    beat,
    time: beat * BPM_125_INTERVAL,
  }))

  taps[20]!.time += 180

  assert.ok(Math.abs(bpm(taps) - 125) < 0.01)
})

test("an implausibly early accidental tap is ignored", () => {
  const taps = Array.from({ length: 8 }, (_, beat) => ({
    beat,
    time: beat * BPM_125_INTERVAL,
  }))

  assert.equal(inferBeatIncrement(taps, 7 * BPM_125_INTERVAL + 120), 0)
})

test("a missed tap advances the beat without halving the tempo", () => {
  const taps = Array.from({ length: 8 }, (_, beat) => ({
    beat,
    time: beat * BPM_125_INTERVAL,
  }))
  const nextTime = 9 * BPM_125_INTERVAL
  const beatIncrement = inferBeatIncrement(taps, nextTime)

  assert.equal(beatIncrement, 2)

  taps.push({ beat: taps.at(-1)!.beat + beatIncrement, time: nextTime })
  assert.equal(bpm(taps), 125)
})

test("a sustained tempo change replaces the historical estimate", () => {
  const taps: TempoTap[] = Array.from({ length: 40 }, (_, beat) => ({
    beat,
    time: beat * BPM_125_INTERVAL,
  }))
  let currentTime = taps.at(-1)!.time
  let tempoChangeEvidence = 0
  let reading = 125

  for (let tapNumber = 0; tapNumber < 20; tapNumber++) {
    currentTime += 60000 / 130
    const previous = taps.at(-1)!
    const beatIncrement = inferBeatIncrement(taps, currentTime)

    taps.push({
      beat: previous.beat + beatIncrement,
      time: currentTime,
    })

    const estimate = estimateSessionTempo(taps, tempoChangeEvidence)

    tempoChangeEvidence = estimate.tempoChangeEvidence
    if (estimate.discardTapCount) taps.splice(0, estimate.discardTapCount)
    reading = 60000 / estimate.beatInterval
  }

  assert.ok(Math.abs(reading - 130) < 0.1)
  assert.ok(taps.length < 40)
})

test("reset delay becomes shorter without breaking slow tempos", () => {
  assert.equal(getResetDelay(0), 2000)
  assert.equal(getResetDelay(60), 2000)
  assert.equal(getResetDelay(80), 1575)
  assert.equal(getResetDelay(125), 1008)
  assert.equal(getResetDelay(170), 1000)
})
