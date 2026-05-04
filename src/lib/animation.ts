// Lightweight animation primitives. Replaces `remotion` (1.8MB dep) which
// was used only for these two helpers in homepage entrance animations.

type InterpolateOptions = {
  extrapolateLeft?: "clamp" | "extend";
  extrapolateRight?: "clamp" | "extend";
};

export function interpolate(
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options: InterpolateOptions = {}
): number {
  const { extrapolateLeft = "extend", extrapolateRight = "extend" } = options;

  if (input <= inputRange[0]) {
    if (extrapolateLeft === "clamp") return outputRange[0];
  }
  const last = inputRange.length - 1;
  if (input >= inputRange[last]) {
    if (extrapolateRight === "clamp") return outputRange[last];
  }

  // Find the segment input falls into
  let i = 0;
  while (i < last - 1 && input > inputRange[i + 1]) i++;

  const inMin = inputRange[i];
  const inMax = inputRange[i + 1];
  const outMin = outputRange[i];
  const outMax = outputRange[i + 1];

  if (inMax === inMin) return outMin;
  const t = (input - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

type SpringConfig = {
  damping?: number;
  mass?: number;
  stiffness?: number;
};

type SpringArgs = {
  frame: number;
  fps: number;
  config?: SpringConfig;
};

// Critically-damped-ish spring approximation. Matches the visual feel of
// `remotion`'s spring() with damping≈100, mass≈0.8, stiffness≈200 closely
// enough for entrance animations (we used it only there).
export function spring({ frame, fps, config = {} }: SpringArgs): number {
  const { damping = 100, mass = 0.8, stiffness = 200 } = config;
  const t = Math.max(0, frame) / fps;

  // Underdamped/overdamped detection based on damping ratio
  const omega0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  if (zeta < 1) {
    // Underdamped: oscillating decay
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega0 * t) * (Math.cos(omegaD * t) + (zeta * omega0 / omegaD) * Math.sin(omegaD * t));
  }
  // Overdamped/critically damped: smooth ease-out
  return 1 - Math.exp(-zeta * omega0 * t) * (1 + zeta * omega0 * t);
}
