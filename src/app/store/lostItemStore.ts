import { create } from "zustand";
import { LostItemStore } from "../types/store/lostItemStore";
import { createJSONStorage, persist } from "zustand/middleware";

const lostItemStore = create<LostItemStore>()(
    persist((set, get) => ({
        currentLostItem: null,
        setCurrentLostItem: (lostItem) => set(() => ({ currentLostItem: lostItem })),
        filteredLostItems: null,
        setFilteredLostItems: (lostItems) => {
            set({ filteredLostItems: lostItems });
        },
        getFilteredLostItemById: (id) => {
            const lostItem = get().filteredLostItems?.find(
                (item) => item._id.toString() === id
            );
            return lostItem || null;
        },
    }),
        {
            name: "lost-item-store",
            storage: createJSONStorage(() => sessionStorage),
        }))

export default lostItemStore;