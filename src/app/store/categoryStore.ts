import { create } from "zustand";
import { CategoryStore } from "../types/store/categoryStore";

const categoryStore = create<CategoryStore>((set) => ({
    categories: null,
    currentCategory: null,
    setCategories: (categories) => set(() => ({ categories })),
    setCurrentCategory: (currentCategory) => set(() => ({ currentCategory }))
}))

export const getCategoryStore = () => categoryStore.getState();

export default categoryStore