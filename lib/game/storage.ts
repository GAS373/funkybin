import { districtOrder } from "@/lib/game/data";
import type { DistrictId, GameProgress } from "@/lib/game/types";

const STORAGE_KEY = "funkybin.escape-from-hallucination-city";

export const defaultProgress: GameProgress = {
  currentDistrict: districtOrder[0],
  unlockedDistricts: [districtOrder[0]],
  completedDistricts: [],
  selectedOptionByDistrict: {},
};

export function loadProgress(): GameProgress {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProgress;
    }

    const parsed = JSON.parse(raw) as Partial<GameProgress>;
    const unlockedDistricts = Array.isArray(parsed.unlockedDistricts)
      ? uniqueDistricts(parsed.unlockedDistricts.filter(isDistrict))
      : defaultProgress.unlockedDistricts;
    const completedDistricts = Array.isArray(parsed.completedDistricts)
      ? uniqueDistricts(parsed.completedDistricts.filter(isDistrict))
      : defaultProgress.completedDistricts;
    const currentDistrict = isDistrict(parsed.currentDistrict) && unlockedDistricts.includes(parsed.currentDistrict)
      ? parsed.currentDistrict
      : unlockedDistricts[0] ?? defaultProgress.currentDistrict;

    return {
      currentDistrict,
      unlockedDistricts,
      completedDistricts,
      selectedOptionByDistrict: parsed.selectedOptionByDistrict ?? {},
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: GameProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

function isDistrict(value: unknown): value is DistrictId {
  return typeof value === "string" && districtOrder.includes(value as DistrictId);
}

function uniqueDistricts(districts: DistrictId[]) {
  if (districts.length === 0) {
    return defaultProgress.unlockedDistricts;
  }

  return districtOrder.filter((district) => districts.includes(district));
}