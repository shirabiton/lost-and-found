import userStore from "@/app/store/userStore";
import { closeChat } from "@/app/utils/chat";
import { useRouter } from "next/navigation";
import React from "react";

interface RoomListProps {
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoomList: React.FC<RoomListProps> = ({ setShowChat }) => {
  const currentUser = userStore((state) => state.user);
  const rooms = currentUser?.chatRooms;

  const router = useRouter();

  // Function to handle the action when the "Open Chat" button is clicked
  const handleOpenChatClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
    setShowChat(false);
  };

  // Function to handle the action when the "Close Chat" button is clicked
  const handleCloseChatClick = (roomId: string) => {
    closeChat(roomId);
  };

  return (
    <div className="no-scrollbar absolute top-full left-0 z-50 w-[40vw] sm:w-96 max-h-[400px] overflow-y-auto bg-white p-6 rounded-lg shadow-lg border-2 border-solid border-secondary">
      {" "}
      <h2 className="text-2xl font-semibold mb-2 text-center text-black">
        צ&apos;אטים
      </h2>
      <div className=" flex-col space-y-4  rounded-lg ">
        {rooms &&
          rooms.map((room) => (
            <div
              key={room.roomId}
              className={`border border-gray-200 p-4 rounded-md bg-gray-100 ${
                !room.available ? "" : "border-2 border-solid border-primary"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-black text-lg mb-2 ">
                  {room.userNameFound !== currentUser.fullName
                    ? room.userNameFound &&
                      room.userNameFound.charAt(0).toUpperCase() +
                        room.userNameFound.slice(1).toLowerCase()
                    : room.userNameLost &&
                      room.userNameLost.charAt(0).toUpperCase() +
                        room.userNameLost.slice(1).toLowerCase()}
                </span>
                {room.available ? (
                  <div className="flex gap-x-4">
                    <button
                      onClick={() => handleOpenChatClick(room.roomId)}
                      className="px-3 py-1 text-secondary border-2 border-solid bg-gray-100 border-primary rounded-lg hover:bg-primary"
                    >
                      פתח
                    </button>
                    <button
                      onClick={() => handleCloseChatClick(room.roomId)}
                      className="px-3 py-1 text-secondary border-2 border-solid bg-gray-100 border-primary rounded-lg hover:bg-primary"
                    >
                      סגור
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">לא זמין</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomList;
