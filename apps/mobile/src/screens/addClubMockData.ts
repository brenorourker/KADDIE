import { addClubCategories, seasonedSelectedClubIds } from "../personas/data/shared";
import {
  countSelectedClubs,
  createInitialClubSelection,
  selectionSignature,
} from "../personas/utils";

export type { AddClubCategory, AddClubOption } from "../personas/types";

export const addClubMockData = {
  categories: addClubCategories,
  defaultSelectedClubIds: seasonedSelectedClubIds,
};

export {
  countSelectedClubs,
  createInitialClubSelection,
  selectionSignature,
};

export function createInitialClubSelectionFromMock() {
  return createInitialClubSelection(addClubCategories, seasonedSelectedClubIds);
}
