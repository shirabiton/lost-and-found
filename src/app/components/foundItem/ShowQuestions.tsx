"use client";
import React, { useEffect, useState } from "react";
import useFoundItemStore from "../../store/foundItemStore";
import NotMineButton from "../NotMineButton";
import _ from "lodash";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { answerSchema } from "@/app/schemas/answerSchemaZod";
import { checkAnswers } from "@/app/utils/checkAnswers";
import { getFoundItemById } from "@/app/services/api/foundItemsService";

const ShowQuestions = (props: { id: string }) => {
  const { id } = props;

  const [shuffledQuestions, setShuffledQuestions] = useState<
    { question: string; answers: string[] }[] | null
  >(null);
  const [formData, setFormData] = useState<z.infer<typeof answerSchema>>({
    answers: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentFoundItem = useFoundItemStore((state) => state.currentFoundItem);
  const setCurrentFoundItem = useFoundItemStore(
    (state) => state.setCurrentFoundItem
  );

  useEffect(() => {
    const fetchFoundItem = async () => {
      const response = await getFoundItemById(id);
      if (response) {
        setCurrentFoundItem(response.data[0]);
      }
    };
    if (!currentFoundItem) {
      fetchFoundItem();
    }
  }, [id, currentFoundItem, setCurrentFoundItem]);

  useEffect(() => {
    setFormData({
      answers: new Array(currentFoundItem?.questions?.length || 0).fill(""),
    });

    if (currentFoundItem) {
      const shuffled = currentFoundItem?.questions?.map((question) => ({
        question: question.question,
        answers: _.shuffle(question.answers),
      }));
      setShuffledQuestions(shuffled);
    }
  }, [currentFoundItem]);

  const router = useRouter();

  //change form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      answers: prevData.answers.map((answer, i) => {
        if (i === index) {
          return value;
        }
        return answer;
      }),
    }));
  };

  //submit the form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      answerSchema.parse(formData);
      setErrors({});
      const answers = formData.answers;
      checkAnswers(answers, router);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((error) => {
          const path = error.path[0]?.toString();
          if (path) {
            fieldErrors[path] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.log("error in submitting form:", error.message);
      }
    }
  };

  return (
    <div className="flex flex-col max-w-4xl w-full mx-auto px-4">
      <strong className="font-semibold pb-12 text-center">
        ענה על הסימנים הבאים:{" "}
      </strong>
      <form onSubmit={handleSubmit}>
        {shuffledQuestions &&
          shuffledQuestions.length > 0 &&
          shuffledQuestions.map((question, index) => (
            <div key={question.question} className="w-full pb-7">
              <span className="flex flex-col sm:flex-row">
                <p className="ml-2">{index + 1}. </p>
                <h2 className="font-fredoka">{question.question}</h2>
              </span>

              {/* Change the order in which answers are displayed */}
              {question.answers.map((answer: string) => (
                <div key={answer} className="w-full pb-2">
                  <span className="flex items-center">
                    <input
                      type="radio"
                      name={question.question}
                      id={answer}
                      value={answer}
                      className="state"
                      onChange={(e) => handleChange(e, index)}
                    />
                    <label htmlFor={answer} className="label">
                      <div className="indicator fill-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text">{answer}</span>
                    </label>
                  </span>
                  <hr className="hr" />
                </div>
              ))}
            </div>
          ))}
        {errors.answers && <p className="error-message">{errors.answers}</p>}
        <div className="flex flex-col sm:flex-row justify-between my-20 space-y-4 sm:space-y-0">
          <NotMineButton />
          <button
            type="submit"
            className="flex justify-between secondary-btn w-full sm:w-auto"
          >
            בדוק התאמה
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-6"
            >
              <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShowQuestions;
