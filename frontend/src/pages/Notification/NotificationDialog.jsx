// components/notifications/NotificationDialog.jsx

import React from "react";

export default function NotificationDialog({
  notifications,
  onClose,
  onClearAll,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
      <div className="mt-16 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#FDFD96] px-4 py-3 flex items-center gap-3">
          <div className="p-2 bg-white/30 rounded-xl">
            <span className="material-icons text-gray-900 text-[20px]">
              notifications_active
            </span>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            <p className="text-xs text-gray-700">
              {notifications.length}{" "}
              {notifications.length === 1 ? "notification" : "notifications"}
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              className="text-xs font-semibold bg.white/40 px-2 py-1 rounded-lg mr-1"
              onClick={onClearAll}
            >
              Clear All
            </button>
          )}

          <button className="p-2 bg-white/40 rounded-xl" onClick={onClose}>
            <span className="material-icons text-gray-900 text-[18px]">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto py-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 text-sm">
              <div className="p-4 rounded-full bg-gray-100 mb-3">
                <span className="material-icons text-[32px] text-gray-400">
                  notifications_off
                </span>
              </div>
              <p className="font-semibold text-gray-700 mb-1">
                No notifications yet
              </p>
              <p className="text-xs leading-relaxed text-gray-500">
                You're all caught up! New notifications will appear here when available.
              </p>
            </div>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={idx}
                className="mx-4 mb-2 p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-[#FDFD96]">
                  <span className="material-icons text-gray-900 text-[20px]">
                    notifications
                  </span>
                </div>

                <div className="flex-1">
                  {n.title && (
                    <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  )}
                  {n.body && (
                    <p className="mt-1 text-xs text-gray-700">{n.body}</p>
                  )}
                  <p className="mt-1 text-[10px] text-gray-500">Just now</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
