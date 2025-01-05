import Chat from "@/app/components/chat/Chat";
import React from "react";

const ChatPage = ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;

  if (!roomId) {
    return <p>טוען...</p>;
  }
  return <Chat roomId={roomId as string} />;
};

export default ChatPage;
