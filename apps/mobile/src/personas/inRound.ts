import type { Persona } from "./types";
import { seasonedUserPersona } from "./seasonedUser";

export const inRoundPersona: Persona = {
  ...seasonedUserPersona,
  id: "inRound",
  label: "In-round (map)",
  description: "Jumps straight into the in-round shell for map UI development.",
  entryRoute: "round",
};
