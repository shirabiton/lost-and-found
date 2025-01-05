import { FoundItem } from "../props/foundItem";

export interface FoundItemStore {
  currentFoundItem: FoundItem | null;
  setCurrentFoundItem: (foundItem: FoundItem | null) => void;
  filteredFoundItems: FoundItem[] | null;
  setFilteredFoundItems: (foundItems: FoundItem[]) => void;
  getFilteredFoundItemById: (id: string) => FoundItem | null;
}