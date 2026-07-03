import { seasonedUserPersona } from "../personas/seasonedUser";
import { getBagClubCount as getPersonaBagClubCount } from "../personas/utils";

export type { BagClub, BagSection } from "../personas/types";

export const myBagMockData = seasonedUserPersona.data.bag;

export function getBagClubCount() {
  return getPersonaBagClubCount(seasonedUserPersona.data.bag);
}
