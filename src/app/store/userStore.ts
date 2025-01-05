import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/props/user";
import { Alert } from "../types/props/alert";
import { getAlertById } from "../services/api/alertService";

interface CurrentUserState {
  setAlerts: (alerts: Alert[]) => void;
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  alerts: Alert[] | null;
  getAlerts: () => Promise<void>;
}

const userStore = create(
  persist<CurrentUserState>(
    (set, get) => ({
      user: null,
      alerts: null,

      setUser: (user: User) => {
        set({ user });
        get().getAlerts();
      },

      clearUser: () => {
        set({ user: null, alerts: null });
      },

      setAlerts: (alerts: Alert[]) => set({ alerts }),

      getAlerts: async () => {
        const currentUser = get().user;

        if (currentUser?.alerts && currentUser.alerts.length > 0) {
          try {
            const alertPromises = currentUser.alerts.map(async (alertId) => {
              if (alertId) {
                const newAlert = await getAlertById(alertId.toString());
                return newAlert;
              }
            });

            const fetchedAlerts = await Promise.all(alertPromises);

            // Filter out undefined values and sort alerts (unread first)
            const sortedAlerts = fetchedAlerts
              .filter((alert) => alert !== undefined)
              .sort((a, b) => {
                if (a?.read === b?.read) return 0;
                return a?.read ? 1 : -1; // Unread alerts first
              });

            set({
              alerts: sortedAlerts,
            });
          } catch (error) {
            console.error("Error fetching alerts:", error);
          }
        } else {
          set({ alerts: [] });
        }
      },
    }),
    {
      name: "userData", // Name for localStorage key
    }
  )
);

export const getUserStore = () => userStore.getState();

export default userStore;