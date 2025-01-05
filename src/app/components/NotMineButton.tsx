"use client";
import React from "react";
import userStore from "../store/userStore";
import useFoundItemStore from "../store/foundItemStore";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { blockItemForUser } from "../utils/blockItemForUser";

const NotMineButton = () => {
  const currentUser = userStore((state) => state.user);
  const foundItemToBlock = useFoundItemStore((state) => state.currentFoundItem);

  const router = useRouter();

  // Function to handle the "Not Mine" button click
  const handleNotMine = async () => {
    if (currentUser && foundItemToBlock) {
      try {
        const response = await blockItemForUser();
        if (response) {
          console.log("Block action succeeded:", response);
        }
        router.push("/foundItems-list");
      } catch (error) {
        console.error("Error blocking item:", error);
      }
    } else {
      console.error("User or found item missing");
    }
  };

  // Function to show confirmation alert before proceeding with the "Not Mine" action
  const confirmActionAlert = () => {
    Swal.fire({
      title: "האם אתה בטוח?",
      text: "פריט זה לא יוצג לך יותר בשום שלב",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "כן, זה לא הפריט שלי",
      cancelButtonText: "ביטול",
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "delete-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "בוצע",
          text: "הפריט סומן כלא שלך ולא יופיע עבורך יותר",
          confirmButtonText: "אוקי",
          icon: "success",
          customClass: {
            confirmButton: "secondary-btn",
          },
        }).then(() => {
          handleNotMine();
        });
      }
    });
  };

  return (
    <div>
      <button
        type="button"
        className="flex justify-between delete-btn w-full sm:w-[90%] md:w-[80%] lg:w-[13vw] mx-auto"
        onClick={confirmActionAlert}
      >
        זה לא הפריט שלי
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm-4.34 7.964a.75.75 0 0 1-1.061-1.06 5.236 5.236 0 0 1 3.73-1.538 5.236 5.236 0 0 1 3.695 1.538.75.75 0 1 1-1.061 1.06 3.736 3.736 0 0 0-2.639-1.098 3.736 3.736 0 0 0-2.664 1.098Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotMineButton;
