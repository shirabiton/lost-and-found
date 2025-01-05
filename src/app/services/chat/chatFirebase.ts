import { database, ref, set } from '@/app/lib/firebase/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';


//Generate a room ID based on user IDs
export const generateChatRoomId = (): string => {
  return uuidv4();
};

//Create a chat room always, without checking if it already exists
export const createChatRoom = async (user1Id: string, user2Id: string): Promise<string> => {
  const roomId = generateChatRoomId();

  const chatRef = ref(database, `chats/${roomId}`);

  // Always create the chat room (no check if it exists)
  await set(chatRef, {
    users: [user1Id, user2Id],
    createdAt: Date.now(),
    messages: []
  });

  return roomId;
};