import City from "../props/city";

export interface CityStore {
    cities: City[] | null;
    setCities: (cities: City[] | null) => void
}