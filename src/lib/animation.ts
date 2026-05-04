// Lightweight animation primitive. Replaces `remotion` (1.8MB dep) which
// was used only for this helper in PopularRepairs3D's per-card 3D math.

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
