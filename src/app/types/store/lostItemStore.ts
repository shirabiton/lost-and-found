import { LostItem } from "../props/lostItem";

export interface LostItemStore {
  currentLostItem: LostItem | null;
  setCurrentLostItem: (lostItem: LostItem | null) => void;
  filteredLostItems: LostItem[] | null;
  setFilteredLostItems: (lostItems: LostItem[] | null) => void;
  getFilteredLostItemById: (id: string) => LostItem | null;
}