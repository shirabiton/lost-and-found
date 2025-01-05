'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import { maxNumOfChars, thankSchema } from '@/app/schemas/thankSchemaZod';
import { createThank } from '@/app/services/api/thankService';
import userStore from '@/app/store/userStore';
import { useRouter } from 'next/navigation';

const ThankForm = () => {
    const [formData, setFormData] = useState<z.infer<typeof thankSchema>>({ thank: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const currentUser = userStore((state) => state.user);
    const [numOfChars, setNumOfChars] = useState(0);
    const router = useRouter();

    function countCharacters(str: string) {
        return str.length;
    }

    const handleChange = (content: string) => {
        setFormData({ thank: content });
        setNumOfChars(countCharacters(content));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            thankSchema.parse(formData);
            setErrors({});
            await createThank({ userName: currentUser?.fullName || "", content: formData.thank });
            router.push('/home');
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach((error) => {
                    const path = error.path[0]?.toString();
                    if (path) {
                        fieldErrors[path] = error.message;
                    }
                });
                setErrors(fieldErrors);
            }
            else {
                console.log("Error in submitting form:", error.message);
            }
        }
    }

    return (
        <div className="flex flex-col text-center w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[28%] mx-auto min-h-[70vh] justify-center px-4">
        <div className="pb-[3vh]">
          <h1 className="text-lg md:text-xl lg:text-2xl">נהנית מהשירות שלנו? נמצאה אבידתך?</h1>
          <strong className="font-semibold text-sm md:text-base lg:text-lg">
            נשמח שתספר כאן, ונפרסם באתר :)
          </strong>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">
          <textarea
            rows={7}
            cols={50}
            maxLength={maxNumOfChars}
            name="thank"
            value={formData.thank}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md text-sm md:text-base"
          />
          <div className="flex flex-row w-full justify-between text-xs sm:text-sm lg:text-base" dir="ltr">
            <p>
              {numOfChars}/{maxNumOfChars}
            </p>
            {errors.thank && <p className="error-message text-red-500">{errors.thank}</p>}
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
            <button type="submit" className="primary-btn w-full sm:w-auto">
              שלח
            </button>
            <button
              type="button"
              className="secondary-btn w-full sm:w-auto"
              onClick={() => router.push('/home')}
            >
              מעדיף שלא
            </button>
          </div>
        </form>
      </div>
    )
}

export default ThankForm;