import { User } from "../types/props/user";
import { createChatRoom } from "../services/chat/chatFirebase";
import userStore from "../store/userStore";
import { updateUserById } from "../services/api/userService";
import { Chat } from "../types/props/chat";

//Initiates a chat room between the current user and another user.
export const initiateChat = async (otherUser: User) => {
    const { user } = userStore.getState();
    const roomId = await createChatRoom(String(user && user._id), String(otherUser._id));
    return roomId;
}


// Adds a chat room to both the current user and another user's chatRooms array.
export const addChatRoom = async (chatRoom: Chat, otherUser: User) => {
    const { user, setUser } = userStore.getState();
    if (!user) {
        throw new Error("User not found in store");
    }
    const updatedUser: User = {
        ...user,
        chatRooms: [...user?.chatRooms || [], chatRoom]
    }
    const updatedOtherUser: User = {
        ...otherUser,
        chatRooms: [...otherUser?.chatRooms || [], chatRoom]
    }
    const response = await updateUserById(String(user._id), updatedUser)
    const responseTwo = await updateUserById(String(otherUser._id), updatedOtherUser)

    if (response && responseTwo) {
        setUser(updatedUser)
        return response;
    } else {
        throw new Error("Failed to update user");
    }
}


// Closes a chat room for the current user by marking it as unavailable
export const closeChat = async (roomId: string) => {
    const { user, setUser } = userStore.getState();
    if (!user) {
        throw new Error("User not found in store");
    }
    const updatedChatRooms = user.chatRooms?.map(chatRoom =>
        chatRoom.roomId === roomId ? { ...chatRoom, available: false } : chatRoom
    ) || [];

    const updatedUser: User = {
        ...user,
        chatRooms: updatedChatRooms,
    };

    const response = await updateUserById(String(user._id), updatedUser)

    if (response) {
        setUser(updatedUser)
        return response;
    } else {
        throw new Error("Failed to update user");
    }
}

