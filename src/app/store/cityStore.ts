import { create } from "zustand";
import { CityStore } from "../types/store/cityStore";

const cityStore = create<CityStore>((set) => ({
    cities: null,
    setCities: (cities) => set(() => ({ cities })),
}))

export default cityStore;