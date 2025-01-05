import { ResetPassword } from "@/app/components/login/ResetPassword";
import React from "react";

const page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const email = searchParams.email;

  return (
    <div>
      <ResetPassword email={email}></ResetPassword>
    </div>
  );
};
export default page;
