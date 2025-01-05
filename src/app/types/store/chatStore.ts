import { Chat } from "../props/chat";

export interface ChatStore {
    currentChat: Chat | null;
    setCurrentChat: (chat: Chat | null) => void;
}