import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { blockItemForUser } from './blockItemForUser';
import userStore from '@/app/store/userStore';
import useFoundItemStore from '@/app/store/foundItemStore';

export const checkAnswers = (answers: string[], router: AppRouterInstance) => {

    const { user } = userStore.getState();
    const { currentFoundItem } = useFoundItemStore.getState();

    // The answer at position 0 in the answer array for each question in the database is the correct answer
    const correctAnswers = currentFoundItem && currentFoundItem.questions
        ? currentFoundItem.questions.map(q => q.answers[0])
        : [];

    if (answers.some(answer => answer.length === 0)) {
        throw new Error('Some of the provided answers are empty');
    }

    for (let i = 0; i < answers.length; i++) {
        if (answers[i] != correctAnswers[i] && user && currentFoundItem) {
            blockItemForUser();
            router.replace('/block-item-for-user');
            return;
        }
    }
    router.replace('/found-item-details');
}