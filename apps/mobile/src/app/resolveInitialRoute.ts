import { defaultPersonaId, getPersonaById } from "../personas/registry";
import type { Persona } from "../personas/types";
import type { AppRoute } from "./routes";

type ResolveInitialRouteOptions = {
  devLauncher?: boolean;
};

export function resolveInitialRoute(
  persona: Persona = getPersonaById(defaultPersonaId),
  options?: ResolveInitialRouteOptions,
): AppRoute {
  if (options?.devLauncher) {
    return "home";
  }

  const flags = persona.flags ?? {};

  if (flags.isLoggedIn) {
    return persona.entryRoute === "login" ? "main" : persona.entryRoute;
  }

  if (flags.hasVerifiedEmail) {
    return persona.entryRoute;
  }

  return "login";
}
