import type { HoleData, HoleDistances } from "../types";

type VoiceResponseContext = {
  hole: HoleData;
  distances: HoleDistances;
  clubRecommendation: string;
};

export function getVoiceModeResponse(
  context: VoiceResponseContext,
  index: number,
): string {
  const { hole, distances, clubRecommendation } = context;
  const wind = hole.windKph;

  const responses = [
    `${distances.middle} yards to the pin with ${wind} kph wind — I'd go with a ${clubRecommendation}.`,
    `Take a breath. You've got ${distances.middle} yards on hole ${hole.number}. Trust your ${clubRecommendation} and swing smooth.`,
    `Wind is ${wind} kph today. Aim to allow for it and commit to the ${clubRecommendation}.`,
    `How are you feeling? At ${distances.middle} yards this is a ${clubRecommendation} for most players — play your game.`,
    `Front is ${distances.front}, back is ${distances.back}. Middle ${distances.middle} — ${clubRecommendation} should find the green.`,
  ];

  return responses[index % responses.length];
}
