import React from "react";
import ShowQuestions from "@/app/components/foundItem/ShowQuestions";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <ShowQuestions id={id}></ShowQuestions>
    </div>
  );
};

export default Page;
