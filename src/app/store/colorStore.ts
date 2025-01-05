import { create } from "zustand";
import { ColorStore } from "../types/store/colorStore";

const colorStore = create<ColorStore>((set) => ({
    colors: null,
    setColors: (colors) => set(() => ({ colors })),
}))

export default colorStore