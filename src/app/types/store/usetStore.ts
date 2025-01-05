import { User } from "../props/user";

export interface UserStore {
    curentUser: User | null;
    addUser: (user: User) => void;
}