import type {
  AddClubCategory,
  BagClub,
  BagPersonaData,
  BagSection,
  ClubDetails,
} from "./types";
import { clubImages, makeOptions } from "./data/shared";

const clubIdAliases: Record<string, string> = {
  "4-hybrid": "hybrid",
  hybrid: "4-hybrid",
};

export function resolveClubId(clubId: string) {
  return clubIdAliases[clubId] ?? clubId;
}

export function getBagClubCount(bag: BagPersonaData) {
  return bag.sections.reduce((count, section) => count + section.clubs.length, 0);
}

export function countSelectedClubs(selection: Record<string, boolean>) {
  return Object.values(selection).filter(Boolean).length;
}

export function getClubDetails(
  clubDetails: Record<string, ClubDetails>,
  clubId: string,
): ClubDetails {
  const resolvedId = resolveClubId(clubId);

  if (clubId in clubDetails) {
    return clubDetails[clubId];
  }

  if (resolvedId in clubDetails) {
    return { ...clubDetails[resolvedId], id: clubId };
  }

  return {
    id: clubId,
    intro: "Add as much club detail as you want",
    make: "callaway",
    name: "",
    distance: 150,
  };
}

export function formatClubModel(details: ClubDetails) {
  const makeLabel =
    makeOptions.find((option) => option.value === details.make)?.label ??
    details.make;
  const name = details.name.trim();

  if (makeLabel && name) {
    return `${makeLabel} ${name}`;
  }

  if (name) {
    return name;
  }

  if (makeLabel) {
    return makeLabel;
  }

  return "Add details";
}

export function formatClubModelWithDistance(details: ClubDetails) {
  const model = formatClubModel(details);

  if (details.distance > 0 && model !== "Add details") {
    return `${model} · ${details.distance}y`;
  }

  return model;
}

function buildBagClub(
  option: { id: string; label: string },
  templateClubs: Map<string, BagClub>,
  clubDetails: Record<string, ClubDetails>,
): BagClub {
  const details = getClubDetails(clubDetails, option.id);
  const templateClub =
    templateClubs.get(option.id) ?? templateClubs.get(resolveClubId(option.id));

  return {
    id: option.id,
    title: templateClub?.title ?? option.label,
    model: formatClubModelWithDistance(details),
    image: templateClub?.image ?? defaultClubImage(option.id),
  };
}

export function createInitialClubSelection(
  categories: AddClubCategory[],
  defaultSelectedClubIds: string[],
) {
  const selection: Record<string, boolean> = {};

  for (const category of categories) {
    for (const club of category.clubs) {
      selection[club.id] = defaultSelectedClubIds.includes(club.id);
    }
  }

  return selection;
}

export function selectionSignature(selection: Record<string, boolean>) {
  return Object.entries(selection)
    .filter(([, selected]) => selected)
    .map(([id]) => id)
    .sort()
    .join("|");
}

function indexBagClubs(bag: BagPersonaData) {
  const clubsById = new Map<string, BagClub>();

  for (const section of bag.sections) {
    for (const club of section.clubs) {
      clubsById.set(club.id, club);
      const alias = resolveClubId(club.id);
      if (alias !== club.id) {
        clubsById.set(alias, club);
      }
    }
  }

  return clubsById;
}

function defaultClubImage(clubId: string) {
  if (clubId.includes("putter")) {
    return clubImages.putter;
  }

  if (clubId.includes("hybrid")) {
    return clubImages.hybrid;
  }

  if (clubId.includes("iron") || clubId === "pw") {
    return clubImages.mizunoJpx923;
  }

  if (/^\d+$/.test(clubId)) {
    return clubImages.wedge;
  }

  return clubImages.driver;
}

export function buildBagDataFromSelection(
  bagTemplate: BagPersonaData,
  categories: AddClubCategory[],
  clubDetails: Record<string, ClubDetails>,
  selection: Record<string, boolean>,
): BagPersonaData {
  const templateClubs = indexBagClubs(bagTemplate);
  const sections: BagSection[] = [];

  for (const category of categories) {
    const selectedClubs = category.clubs.filter((club) => selection[club.id]);

    if (selectedClubs.length === 0) {
      continue;
    }

    const clubs = selectedClubs.map((option) =>
      buildBagClub(option, templateClubs, clubDetails),
    );

    sections.push({
      id: category.id,
      layout: clubs.length === 1 ? "single" : "group",
      clubs,
    });
  }

  return {
    intro: bagTemplate.intro,
    sections,
  };
}
