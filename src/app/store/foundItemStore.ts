import { create } from "zustand";
import { FoundItemStore } from "../types/store/foundItemStore";
import { createJSONStorage, persist } from "zustand/middleware";

const useFoundItemStore = create<FoundItemStore>()(
  persist((set, get) => ({
    currentFoundItem: null,
    setCurrentFoundItem: (foundItem) => {
      set({ currentFoundItem: foundItem });
    },
    filteredFoundItems: null,
    setFilteredFoundItems: (foundItems) => {
      set({ filteredFoundItems: foundItems });
    },
    getFilteredFoundItemById: (id) => {
      const foundItem = get().filteredFoundItems?.find(
        (item) => item._id.toString() === id
      );
      return foundItem || null;
    },
  }),
    {
      name: "found-item-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);


export default useFoundItemStore;