import { makeOptions, seasonedClubDetails } from "../personas/data/shared";
import { getClubDetails as getPersonaClubDetails } from "../personas/utils";

export type { ClubDetails } from "../personas/types";

export { makeOptions };

export function getClubDetails(clubId: string) {
  return getPersonaClubDetails(seasonedClubDetails, clubId);
}
