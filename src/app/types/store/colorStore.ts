import { Color } from "../props/color";

export interface ColorStore {
    colors: Color[] | null;
    setColors: (colors: Color[] | null) => void;
}