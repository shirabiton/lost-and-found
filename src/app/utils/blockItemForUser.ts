import { updateUserById } from "../services/api/userService"
import useFoundItemStore from "../store/foundItemStore";
import userStore from "../store/userStore";
import { User } from "../types/props/user";

export const blockItemForUser = async () => {

    const { user } = userStore.getState();
    const { setUser } = userStore.getState();
    const { currentFoundItem } = useFoundItemStore.getState();
    const { setCurrentFoundItem } = useFoundItemStore.getState();

    const isItemBlocked = user && currentFoundItem && user.blockedItems && user.blockedItems.some(
        (item) => {
            return String(item) === String(currentFoundItem._id);
        }
    );

    if (isItemBlocked) {
        return { message: "Item is already blocked" };
    }

    if (user && currentFoundItem) {
        // Update store current user
        const updatedUserForStore: User = {
            ...user,
            blockedItems: [...user.blockedItems || [], String(currentFoundItem._id)]
        }
        setUser(updatedUserForStore);

        // Update db
        const updatedUserForDb: User = {
            ...user,
            blockedItems: [...user.blockedItems || [], String(currentFoundItem._id)]
        }
        const response = await updateUserById(String(user._id), updatedUserForDb);
        if (response) {
            return response;
        } else {
            throw new Error("Failed to update user");
        }
    }
    setCurrentFoundItem(null);
}