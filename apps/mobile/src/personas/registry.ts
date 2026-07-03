import { onboardingPersona } from "./newUser";
import { seasonedUserPersona } from "./seasonedUser";
import type { Persona } from "./types";

export const personas: Persona[] = [
  seasonedUserPersona,
  onboardingPersona,
];

export const defaultPersonaId = seasonedUserPersona.id;

export function getPersonaById(personaId: string): Persona {
  return personas.find((persona) => persona.id === personaId) ?? seasonedUserPersona;
}
