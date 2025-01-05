"use client";
import React, { useState, useEffect } from "react";
import {
  database,
  ref,
  onValue,
  push,
  set,
} from "../../lib/firebase/firebaseConfig";
import userStore from "@/app/store/userStore";
import lostItemStore from "@/app/store/lostItemStore";
import useFoundItemStore from "@/app/store/foundItemStore";
import { deleteLostItemById } from "@/app/services/api/lostItemService";
import { deleteFoundItemById } from "@/app/services/api/foundItemsService";
import { useRouter } from "next/navigation";
import NotMineButton from "../NotMineButton";
import { Message } from "@/app/types/massageChat";

const Chat: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userLost, setUserLost] = useState("");

  const currentLostItem = lostItemStore((state) => state.currentLostItem);
  const currentFoundItem = useFoundItemStore((state) => state.currentFoundItem);
  const currentUser = userStore((state) => state.user);

  // Effect to listen for changes in the chat and update messages based on the room ID
  useEffect(() => {
    const messagesRef = ref(database, `chats/${roomId}`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();

      if (data?.messages) {
        setMessages(Object.values(data.messages));
      } else {
        setMessages([]);
      }

      setUserLost(data?.users?.[0] || "");
    });
  }, [roomId]);

  const router = useRouter();

  // Function to send a new message to the chat
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messagesRef = ref(database, `chats/${roomId}/messages`);
    const newMessageRef = push(messagesRef);
    const timestamp = new Date().getTime();

    set(newMessageRef, {
      text: newMessage,
      timestamp,
      senderId: currentUser?._id,
    });

    setNewMessage("");
  };

  // Function to delete items from the database and mark the item as returned
  const returnItem = async () => {
    try {
      await deleteLostItemById(String(currentLostItem?._id));
      await deleteFoundItemById(String(currentFoundItem?._id));
      router.replace("/thanks");
    } catch {
      console.error("Error deleting items");
    }
  };

  return (
    <div className=" w-full  mb-0">
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderId === String(currentUser?._id)
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.senderId === String(currentUser?._id)
                  ? "bg-primary text-left"
                  : "bg-gray-300 text-right"
              }`}
            >
              <span className="text-sm text-gray-600 mb-1">
                {new Date(message.timestamp).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className=" bottom-0 left-0 w-full z-10">
        <div className="chat-container items-center gap-x-4 gap-y-4 px-4 py-2">
          {userLost === String(currentUser?._id) && (
            <>
              <NotMineButton />
              <button
                className="primary-btn text-white flex items-center gap-x-2"
                onClick={returnItem}
              >
                הפריט הוחזר
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="size-6"
                >
                  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                </svg>
              </button>
            </>
          )}
          <div className="flex items-center flex-grow gap-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="הקלד הודעה..."
              className="flex-grow p-3 border rounded-lg focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="flex rounded-full h-[50px] min-w-[50px] justify-center items-center bg-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#FFFF"
                className="size-6 transform scale-x-[-1]"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
