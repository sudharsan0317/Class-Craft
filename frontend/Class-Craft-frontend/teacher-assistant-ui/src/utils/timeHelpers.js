/**
 * Calculates the sum of durations of all phases in a lesson plan.
 * @param {Array} phases - Array of lesson phase objects
 * @returns {number} Total duration in minutes
 */
export function calculateTotalPhaseDuration(phases) {
  if (!Array.isArray(phases)) return 0;
  return phases.reduce((total, phase) => {
    const duration = Number(phase.duration);
    return total + (isNaN(duration) ? 0 : duration);
  }, 0);
}

/**
 * Compares total calculated phase duration with target lesson duration.
 * @param {number{ totalPhasesDuration
 * @param {number{ targetDuration
 * @returns {{ isMatch: boolean, difference: number, status: 'match' | 'under' | 'over' }}
 */
export function checkDurationMatch(totalPhasesDuration, targetDuration) {
  const target = Number(targetDuration) || 0;
  const current = Number(totalPhasesDuration) || 0;
  const difference = current - target;

  if (difference === 0) {
    return { isMatch: true, difference: 0, status: 'match' };
  }


  return {
    isMatch: false,
    difference: Math.abs(difference),
    status: difference > 0 ? 'over' : 'under'
  };
}
