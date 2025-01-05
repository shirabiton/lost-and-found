"use client";
import React, { useState } from "react";
import { z } from "zod";
import { sendEmailToAdmin } from "../services/api/sendEmailService";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { emailSchema } from "../schemas/emailSchema";

const ContactTheAdmin = () => {
  const [formData, setFormData] = useState<z.infer<typeof emailSchema>>({
    name: "",
    email: "",
    content: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      emailSchema.parse(formData);
      setErrors({});
      setFormData({ name: "", email: "", content: "" });
      sendEmailToAdmin(
        formData.email,
        `נשלח ע"י האתר מהלקוח: ${formData.name}`,
        formData.content
      );
      Swal.fire({
        title: "נשלח",
        text: "פנייתך נשלחה בהצלחה ותיענה בהקדם",
        icon: "success",
        confirmButtonText: "אוקי",
        customClass: {
          confirmButton: "secondary-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/home");
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach(
          (error: {
            path: { toString: () => string | number }[];
            message: string;
          }) => {
            if (error.path[0]) {
              fieldErrors[error.path[0].toString()] = error.message;
            }
          }
        );
        setErrors(fieldErrors);
      } else {
        console.log("Error in completing email data");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto bg-secondary p-6 shadow-md"
    >
      <div className="flex flex-col w-full gap-y-4">
        <input
          type="text"
          placeholder="שם מלא"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="contact-input"
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
        <input
          type="text"
          placeholder="אימייל"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="contact-input"
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <input
          type="text"
          placeholder="היי, רציתי לפנות בנושא..."
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="contact-input"
        />
        {errors.content && <p className="error-message">{errors.content}</p>}
      </div>
      <button
        type="submit"
        className="flex bg-primary rounded-full h-[50px] min-w-[50px] self-end justify-center items-center w-full sm:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 transform scale-x-[-1]"
        >
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </button>
    </form>
  );
};

export default ContactTheAdmin;
