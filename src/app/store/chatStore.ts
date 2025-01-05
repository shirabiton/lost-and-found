import { create } from "zustand";
import { ChatStore } from "../types/store/chatStore";

const chatStore = create<ChatStore>((set) => ({
    currentChat: null,
    setCurrentChat: (currentChat) => set(() => ({ currentChat }))
}))

export default chatStore