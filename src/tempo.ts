export interface TempoTap {
  beat: number
  time: number
}

const MIN_RESET_DELAY_MS = 1000
const MAX_RESET_DELAY_MS = 2000
const RESET_BEAT_MULTIPLIER = 2.1
const MIN_INTERVAL_RATIO = 0.45
const HUBER_ITERATIONS = 4
const MIN_RESIDUAL_SCALE_MS = 4
const RECENT_TEMPO_TAPS = 10
const TEMPO_CHANGE_THRESHOLD = 0.02
const TEMPO_CHANGE_CONFIRMATIONS = 3

export interface SessionTempoEstimate {
  beatInterval: number
  discardTapCount: number
  tempoChangeEvidence: number
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  return sorted.length % 2
    ? sorted[middle]!
    : (sorted[middle - 1]! + sorted[middle]!) / 2
}

function fitLine(taps: TempoTap[], weights: number[]) {
  const totalWeight = weights.reduce((total, weight) => total + weight, 0)
  const meanBeat =
    taps.reduce((total, tap, index) => total + tap.beat * weights[index]!, 0) /
    totalWeight
  const meanTime =
    taps.reduce((total, tap, index) => total + tap.time * weights[index]!, 0) /
    totalWeight
  let covariance = 0
  let variance = 0

  taps.forEach((tap, index) => {
    const beatOffset = tap.beat - meanBeat
    const weight = weights[index]!

    covariance += weight * beatOffset * (tap.time - meanTime)
    variance += weight * beatOffset * beatOffset
  })

  const interval = covariance / variance

  return {
    intercept: meanTime - interval * meanBeat,
    interval,
  }
}

/**
 * Fits one stable beat interval across the session. Iteratively reducing the
 * influence of poorly timed taps keeps isolated mistakes from moving the
 * reading, while every ordinary tap continues to improve the estimate.
 */
export function estimateBeatInterval(taps: TempoTap[]) {
  if (taps.length < 2) return 0

  const adjacentIntervals = taps.slice(1).map((tap, index) => {
    const previous = taps[index]!

    return (tap.time - previous.time) / (tap.beat - previous.beat)
  })
  let interval = median(adjacentIntervals)
  let intercept = median(taps.map((tap) => tap.time - interval * tap.beat))

  for (let iteration = 0; iteration < HUBER_ITERATIONS; iteration++) {
    const residuals = taps.map(
      (tap) => tap.time - (intercept + interval * tap.beat),
    )
    const residualCentre = median(residuals)
    const scale = Math.max(
      median(residuals.map((residual) => Math.abs(residual - residualCentre))) *
        1.4826,
      MIN_RESIDUAL_SCALE_MS,
    )
    const threshold = scale * 1.5
    const weights = residuals.map((residual) => {
      const distance = Math.abs(residual - residualCentre)

      return distance <= threshold ? 1 : threshold / distance
    })
    const fit = fitLine(taps, weights)

    interval = fit.interval
    intercept = fit.intercept
  }

  return interval
}

/**
 * Uses the full session by default, but identifies a genuine new tempo when
 * the recent robust estimate differs for several consecutive taps.
 */
export function estimateSessionTempo(
  taps: TempoTap[],
  previousTempoChangeEvidence: number,
): SessionTempoEstimate {
  const beatInterval = estimateBeatInterval(taps)

  if (taps.length < RECENT_TEMPO_TAPS + TEMPO_CHANGE_CONFIRMATIONS) {
    return {
      beatInterval,
      discardTapCount: 0,
      tempoChangeEvidence: 0,
    }
  }

  const recentTaps = taps.slice(-RECENT_TEMPO_TAPS)
  const recentInterval = estimateBeatInterval(recentTaps)
  const tempoDifference = Math.abs(recentInterval - beatInterval) / beatInterval
  const tempoChangeEvidence =
    tempoDifference >= TEMPO_CHANGE_THRESHOLD
      ? previousTempoChangeEvidence + 1
      : 0

  if (tempoChangeEvidence < TEMPO_CHANGE_CONFIRMATIONS) {
    return {
      beatInterval,
      discardTapCount: 0,
      tempoChangeEvidence,
    }
  }

  return {
    beatInterval: recentInterval,
    discardTapCount: taps.length - RECENT_TEMPO_TAPS,
    tempoChangeEvidence: 0,
  }
}

/**
 * Returns zero for an implausibly early accidental tap, and accounts for a
 * single skipped beat without treating it as a slower tempo.
 */
export function inferBeatIncrement(taps: TempoTap[], time: number) {
  const previous = taps[taps.length - 1]
  const interval = estimateBeatInterval(taps)

  if (!previous || !interval) return 1

  const intervalRatio = (time - previous.time) / interval

  if (intervalRatio < MIN_INTERVAL_RATIO) return 0

  return Math.max(1, Math.round(intervalRatio))
}

/**
 * Two beats of headroom allow one missed tap. Faster music reaches the one
 * second floor, while slow music retains enough time between ordinary taps.
 */
export function getResetDelay(bpm: number) {
  if (!bpm) return MAX_RESET_DELAY_MS

  const beatInterval = 60000 / bpm

  return Math.min(
    MAX_RESET_DELAY_MS,
    Math.max(MIN_RESET_DELAY_MS, beatInterval * RESET_BEAT_MULTIPLIER),
  )
}
