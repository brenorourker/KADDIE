import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultPersonaId, getPersonaById, personas } from "./registry";
import type { BagPersonaData, ClubDetails, Persona } from "./types";
import {
  buildBagDataFromSelection,
  countSelectedClubs,
  createInitialClubSelection,
  getClubDetails,
  resolveClubId,
} from "./utils";

type ClubSelection = Record<string, boolean>;
type ClubDetailsOverrides = Record<string, ClubDetails>;

type PersonaContextValue = {
  personas: Persona[];
  activePersona: Persona;
  activePersonaId: string;
  setActivePersonaId: (personaId: string) => void;
  clubSelection: ClubSelection;
  setClubSelection: (selection: ClubSelection) => void;
  clubDetails: Record<string, ClubDetails>;
  updateClubDetails: (
    clubId: string,
    updates: Pick<ClubDetails, "make" | "name" | "distance">,
  ) => void;
  removeClubFromBag: (clubId: string) => void;
  bagClubCount: number;
  bagData: BagPersonaData;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

type PersonaProviderProps = {
  children: ReactNode;
};

function createSelectionForPersona(persona: Persona) {
  return createInitialClubSelection(
    persona.data.addClub.categories,
    persona.data.addClub.defaultSelectedClubIds,
  );
}

export function PersonaProvider({ children }: PersonaProviderProps) {
  const [activePersonaId, setActivePersonaId] = useState(defaultPersonaId);
  const activePersona = getPersonaById(activePersonaId);
  const [clubSelection, setClubSelection] = useState<ClubSelection>(() =>
    createSelectionForPersona(activePersona),
  );
  const [clubDetailsOverrides, setClubDetailsOverrides] =
    useState<ClubDetailsOverrides>({});

  useEffect(() => {
    const persona = getPersonaById(activePersonaId);
    setClubSelection(createSelectionForPersona(persona));
    setClubDetailsOverrides({});
  }, [activePersonaId]);

  const clubDetails = useMemo(
    () => ({
      ...activePersona.data.clubDetails,
      ...clubDetailsOverrides,
    }),
    [activePersona.data.clubDetails, clubDetailsOverrides],
  );

  const updateClubDetails = useCallback(
    (
      clubId: string,
      updates: Pick<ClubDetails, "make" | "name" | "distance">,
    ) => {
      setClubDetailsOverrides((current) => {
        const mergedDetails = {
          ...activePersona.data.clubDetails,
          ...current,
        };
        const existing = getClubDetails(mergedDetails, clubId);

        return {
          ...current,
          [clubId]: {
            ...existing,
            ...updates,
            id: clubId,
          },
        };
      });
    },
    [activePersona.data.clubDetails],
  );

  const removeClubFromBag = useCallback((clubId: string) => {
    const clubIds = [clubId, resolveClubId(clubId)];

    setClubSelection((current) => {
      const next = { ...current };

      for (const id of clubIds) {
        if (id in next) {
          next[id] = false;
        }
      }

      return next;
    });

    setClubDetailsOverrides((current) => {
      const next = { ...current };

      for (const id of clubIds) {
        delete next[id];
      }

      return next;
    });
  }, []);

  const bagData = useMemo(
    () =>
      buildBagDataFromSelection(
        activePersona.data.bag,
        activePersona.data.addClub.categories,
        clubDetails,
        clubSelection,
      ),
    [activePersona, clubDetails, clubSelection],
  );

  const bagClubCount = useMemo(
    () => countSelectedClubs(clubSelection),
    [clubSelection],
  );

  const value = useMemo<PersonaContextValue>(
    () => ({
      personas,
      activePersona,
      activePersonaId,
      setActivePersonaId,
      clubSelection,
      setClubSelection,
      clubDetails,
      updateClubDetails,
      removeClubFromBag,
      bagClubCount,
      bagData,
    }),
    [
      activePersona,
      activePersonaId,
      bagClubCount,
      bagData,
      clubDetails,
      clubSelection,
      updateClubDetails,
      removeClubFromBag,
    ],
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);

  if (!context) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }

  return context;
}
