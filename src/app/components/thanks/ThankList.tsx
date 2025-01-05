'use client';
import { getThanks } from '@/app/services/api/thankService';
import useThankStore from '@/app/store/thankStore';
import React, { useEffect, useState } from 'react';
import ThankCard from './ThankCard';

const ThankList = () => {
    const thankList = useThankStore((state) => state.thankList);
    const setThankList = useThankStore((state) => state.setThankList);

    const numOfDisplayedCards = 3;
    const [currentIndex, setCurrentIndex] = useState(0);

    // Effect hook to fetch the list of 'thank' data on component mount
    useEffect(() => {
        const fetchThanks = async () => {
            if (!thankList || thankList.length === 0) {
                const response = await getThanks();
                if (response)
                    setThankList(response);
            }
        }
        fetchThanks();
    }, [thankList, setThankList]);

    // Handle clicking the right button to move to the next card(s)
    const handleRightClick = () => {
        if (thankList) {
            setCurrentIndex((currentIndex + 1) % thankList.length);
        }
    };

    // Handle clicking the left button to move to the previous card(s)
    const handleLeftClick = () => {
        if (thankList) {
            setCurrentIndex((currentIndex - 1 + thankList.length) % thankList.length);
        }
    };

    return (
        <div className="flex justify-between items-center w-full">
            <button
                onClick={handleLeftClick}
                className="flex justify-center items-center p-2 md:p-4 bg-transparent hover:bg-gray-200 rounded-full transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-primary">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>
            </button>

            <div className="flex gap-6 md:gap-10 justify-center items-center w-full flex-wrap">
                {thankList && thankList.slice(currentIndex, currentIndex + numOfDisplayedCards)
                    // for circular display
                    .concat(thankList.slice(0, Math.max(0, (currentIndex + numOfDisplayedCards) - thankList.length)))
                    .map((thank) => (
                        <ThankCard key={String(thank._id)} thank={thank} />
                    ))
                }
            </div>

            <button
                onClick={handleRightClick}
                className="flex justify-center items-center p-2 md:p-4 bg-transparent hover:bg-gray-200 rounded-full transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-primary">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                </svg>
                
            </button>
        </div>
    )
}

export default ThankList;
