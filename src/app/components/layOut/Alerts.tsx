"use client";
import React, { useEffect } from "react";
import userStore from "../../store/userStore";
import { updateAlertById } from "../../services/api/alertService";
import { Alert } from "../../types/props/alert";
import Link from "next/link";

export const Alerts = () => {
  const alerts = userStore((state) => state.alerts);
  const setAlerts = userStore((state) => state.setAlerts);
  const getAlerts = userStore((state) => state.getAlerts);

  useEffect(() => {
    getAlerts();
  }, []);

  const markAsRead = async (alert: Alert) => {
    try {
      await updateAlertById(alert._id.toString(), { ...alert, read: true });

      // Update global store alerts
      setAlerts(
        alerts!.map((alertItem) =>
          alertItem._id === alert._id ? { ...alertItem, read: true } : alertItem
        )
      );
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  if (!alerts) {
    return <p>טוען התראות...</p>;
  }

  return (
    <div className="no-scrollbar absolute top-full left-0 z-50 w-[60vw] sm:w-96 max-h-[400px] overflow-y-auto bg-white p-6 rounded-lg shadow-lg border-2 border-solid border-secondary">
      {" "}
      <h2 className="text-2xl font-semibold mb-2 text-center text-black">
        התראות
      </h2>
      {alerts.length > 0 ? (
        <div className="space-y-4 mt-2">
          {alerts.map((alert) => (
            <div
              key={alert._id?.toString()}
              className={`border border-gray-200 p-4 rounded-md bg-gray-100 ${
                alert.read ? "" : "border-2 border-solid border-primary"
              }`}
            >
              <p className="text-black">{alert.message}</p>
              {alert.link && (
                <Link
                  href={alert.link}
                  className="text-blue-700 underline"
                  onClick={() => !alert.read && markAsRead(alert)} // Mark as read when clicked
                >
                  {alert.link.includes("chat") ? "היכנס לצ'אט" : "מעבר לפריט"}{" "}
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">לא נמצאו התראות.</p>
      )}
    </div>
  );
};
