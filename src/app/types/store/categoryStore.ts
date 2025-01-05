import { Category } from "../props/category";

export interface CategoryStore {
    categories: Category[] | null;
    currentCategory: Category | null;
    setCategories: (categories: Category[] | null) => void;
    setCurrentCategory: (category: Category | null) => void;
}
