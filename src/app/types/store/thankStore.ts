import { Thank } from "../props/thank";

export interface ThankStore {
    thankList: Thank[] | null;
    setThankList: (foundItems: Thank[]) => void;
}