import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ThankStore } from "../types/store/thankStore";

const useThankStore = create<ThankStore>()(
    persist((set) => ({
        thankList: null,
        setThankList: (thankList) => {
            set({ thankList: thankList });
        },
    }),
        {
            name: "thank-list",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);


export default useThankStore;