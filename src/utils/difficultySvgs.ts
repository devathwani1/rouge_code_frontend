import easySvg from "../assets/easy.txt?raw";
import mediumSvg from "../assets/medium.txt?raw";
import hardSvg from "../assets/hard.txt?raw";

/**
 * Maps `Difficulty.name` from the API (e.g. low / standard / crushing)
 * or common labels (easy / medium / hard) to the same SVGs used on the difficulty page.
 */
export function getDifficultySvgHtml(
  difficultyName: string | null | undefined
): string | null {
  if (!difficultyName) return null;
  const k = difficultyName.trim().toLowerCase();
  if (k === "low" || k === "easy") return easySvg;
  if (k === "standard" || k === "medium") return mediumSvg;
  if (k === "crushing" || k === "hard") return hardSvg;
  return null;
}
